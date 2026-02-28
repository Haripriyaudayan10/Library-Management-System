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

        // 🔔 Check reservation queue
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
                    "Your reserved book '" + book.getTitle() +
                            "' is now available for pickup."
            );
        }

        return savedCopy;
    }

    // ✅ UPDATE COPY STATUS
    @PutMapping("/{copyId}")
    public Copy updateCopyStatus(@PathVariable Long copyId,
                                 @RequestParam String status) {

        Copy copy = copyRepository.findById(copyId)
                .orElseThrow(() -> new RuntimeException("Copy not found"));

        copy.setStatus(status);
        return copyRepository.save(copy);
    }

    // ✅ DELETE COPY
    @DeleteMapping("/{copyId}")
    public String deleteCopy(@PathVariable Long copyId) {

        Copy copy = copyRepository.findById(copyId)
                .orElseThrow(() -> new RuntimeException("Copy not found"));

        // ❗ Prevent deleting issued copy
        if ("ISSUED".equals(copy.getStatus())) {
            throw new RuntimeException("Cannot delete issued copy.");
        }

        copyRepository.delete(copy);

        return "Copy deleted successfully.";
    }

    // ✅ GET ALL COPIES WITH STATUS BY BOOK
@GetMapping("/book/{bookId}")
public List<Copy> getCopiesByBook(@PathVariable Long bookId) {

    return copyRepository.findByBook_BookId(bookId);
}
}