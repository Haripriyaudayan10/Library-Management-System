package com.lms.backend.controller;

import com.lms.backend.entity.Book;
import com.lms.backend.entity.Copy;
import com.lms.backend.entity.Reservation;
import com.lms.backend.enums.ReservationStatus;
import com.lms.backend.repository.BookRepository;
import com.lms.backend.repository.CopyRepository;
import com.lms.backend.repository.ReservationRepository;
import com.lms.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/admin/copies")
@RequiredArgsConstructor
public class AdminCopyController {

    private final CopyRepository copyRepository;
    private final BookRepository bookRepository;
    private final ReservationRepository reservationRepository;
    private final NotificationService notificationService;

    // ✅ ADD COPY
    @PostMapping
    public Copy addCopy(@RequestParam Long bookId) {

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        Copy copy = new Copy();
        copy.setBook(book);
        copy.setStatus("AVAILABLE");

        Copy savedCopy = copyRepository.save(copy);

        // 🔔 Trigger reservation handling
        handleWaitingReservations(bookId, book.getTitle());

        return savedCopy;
    }

    // ✅ UPDATE COPY STATUS
    @PutMapping("/{copyId}")
    public Copy updateCopyStatus(@PathVariable Long copyId,
                                 @RequestParam String status) {

        Copy copy = copyRepository.findById(copyId)
                .orElseThrow(() -> new RuntimeException("Copy not found"));

        String previousStatus = copy.getStatus();
        copy.setStatus(status);

        Copy updatedCopy = copyRepository.save(copy);

        // 🔔 Only trigger if status changed to AVAILABLE
        if (!"AVAILABLE".equalsIgnoreCase(previousStatus)
                && "AVAILABLE".equalsIgnoreCase(status)) {

            Long bookId = copy.getBook().getBookId();
            String bookTitle = copy.getBook().getTitle();

            handleWaitingReservations(bookId, bookTitle);
        }

        return updatedCopy;
    }

    // ✅ DELETE COPY
    @DeleteMapping("/{copyId}")
    public String deleteCopy(@PathVariable Long copyId) {

        Copy copy = copyRepository.findById(copyId)
                .orElseThrow(() -> new RuntimeException("Copy not found"));

        if ("ISSUED".equalsIgnoreCase(copy.getStatus())) {
            throw new RuntimeException("Cannot delete issued copy.");
        }

        copyRepository.delete(copy);
        return "Copy deleted successfully.";
    }

    // ✅ GET COPIES BY BOOK
    @GetMapping("/book/{bookId}")
    public List<Copy> getCopiesByBook(@PathVariable Long bookId) {
        return copyRepository.findByBook_BookId(bookId);
    }

    // =========================================
    // 🔔 COMMON METHOD TO HANDLE RESERVATION QUEUE
    // =========================================
    private void handleWaitingReservations(Long bookId, String bookTitle) {

        List<Reservation> waitingReservations =
                reservationRepository
                        .findByBook_BookIdAndStatusOrderByQueuePositionAsc(
                                bookId,
                                ReservationStatus.WAITING
                        );

        if (!waitingReservations.isEmpty()) {

            Reservation first = waitingReservations.get(0);

            first.setStatus(ReservationStatus.READY_FOR_PICKUP);
            first.setExpiryDate(LocalDate.now().plusDays(7));
            reservationRepository.save(first);

            notificationService.notifyUser(
                    first.getUser(),
                    "Book Available",
                    "Your reserved book '" + bookTitle +
                            "' is now available for pickup. Please collect within 7 days."
            );
        }
    }
}