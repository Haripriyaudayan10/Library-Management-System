package com.lms.backend.controller;

import com.lms.backend.entity.Book;
import com.lms.backend.entity.Copy;
import com.lms.backend.entity.Reservation;
import com.lms.backend.enums.ReservationStatus;
import com.lms.backend.repository.BookRepository;
import com.lms.backend.repository.CopyRepository;
import com.lms.backend.repository.ReservationRepository;
import com.lms.backend.service.NotificationService;
import com.lms.backend.service.ReservationQueueService;
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
    private final ReservationQueueService reservationQueueService;

    // ===============================
    // ADD NEW COPY
    // ===============================
    @PostMapping
    public Copy addCopy(@RequestParam Long bookId) {

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        Copy copy = new Copy();
        copy.setBook(book);
        copy.setStatus("AVAILABLE");

        Copy savedCopy = copyRepository.save(copy);

        // handle reservation queue
        handleWaitingReservations(book.getBookId(), book.getTitle());

        return savedCopy;
    }

    // ===============================
    // UPDATE COPY STATUS
    // ===============================
    @PutMapping("/{copyId}")
    public Copy updateCopyStatus(
            @PathVariable Long copyId,
            @RequestParam String status
    ) {

        Copy copy = copyRepository.findById(copyId)
                .orElseThrow(() -> new RuntimeException("Copy not found"));

        String previousStatus = copy.getStatus();

        copy.setStatus(status);

        Copy updatedCopy = copyRepository.save(copy);

        // trigger reservation queue if book becomes available
        if (!"AVAILABLE".equalsIgnoreCase(previousStatus)
                && "AVAILABLE".equalsIgnoreCase(status)) {

            Long bookId = copy.getBook().getBookId();
            String bookTitle = copy.getBook().getTitle();

            handleWaitingReservations(bookId, bookTitle);
        }

        return updatedCopy;
    }

    // ===============================
    // DELETE COPY
    // ===============================
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

    // ===============================
    // GET COPIES BY BOOK
    // ===============================
    @GetMapping("/book/{bookId}")
    public List<Copy> getCopiesByBook(@PathVariable Long bookId) {
        return copyRepository.findByBook_BookId(bookId);
    }

    // ===============================
    // HANDLE RESERVATION QUEUE
    // ===============================
    private void handleWaitingReservations(Long bookId, String bookTitle) {

        boolean hasReadyReservation = reservationRepository
                .findFirstByBook_BookIdAndStatusOrderByQueuePositionAsc(
                        bookId,
                        ReservationStatus.READY_FOR_PICKUP
                )
                .isPresent();
        if (hasReadyReservation) {
            return;
        }

        Copy reservableCopy = copyRepository
                .findFirstByBook_BookIdAndStatusOrderByCopyidAsc(bookId, "AVAILABLE")
                .orElse(null);
        if (reservableCopy == null) {
            return;
        }

        List<Reservation> waitingReservations =
                reservationRepository
                        .findByBook_BookIdAndStatusOrderByQueuePositionAsc(
                                bookId,
                                ReservationStatus.WAITING
                        );

        if (!waitingReservations.isEmpty()) {

            Reservation firstReservation = waitingReservations.get(0);

            firstReservation.setStatus(ReservationStatus.READY_FOR_PICKUP);
            firstReservation.setExpiryDate(LocalDate.now().plusDays(3));

            reservationRepository.save(firstReservation);

            reservableCopy.setStatus("RESERVED");
            copyRepository.save(reservableCopy);

            notificationService.notifyUser(
                    firstReservation.getUser(),
                    "Book Available",
                    "Your reserved book '" + bookTitle +
                            "' is now available for pickup. Please collect within 3 days."
            );
        }

        reservationQueueService.recomputeQueuePositions(bookId);
    }
}
