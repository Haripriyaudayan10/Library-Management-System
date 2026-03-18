package com.lms.backend.controller;

import com.lms.backend.entity.Book;
import com.lms.backend.entity.Reservation;
import com.lms.backend.entity.User;
import com.lms.backend.enums.ReservationStatus;
import com.lms.backend.repository.BookRepository;
import com.lms.backend.repository.CopyRepository;
import com.lms.backend.repository.ReservationRepository;
import com.lms.backend.repository.UserRepository;
import com.lms.backend.service.ReservationQueueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/member/reservations")
@RequiredArgsConstructor
public class MemberReservationController {

    private final ReservationRepository reservationRepository;
    private final BookRepository bookRepository;
    private final CopyRepository copyRepository;
    private final UserRepository userRepository;
    private final ReservationQueueService reservationQueueService;

    @PostMapping("/{bookId}")
    public String reserveBook(@PathVariable Long bookId) {

        // 🔐 Get authentication safely
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 1️⃣ Check book exists
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        // 2️⃣ Check available copies
        long availableCopies =
                copyRepository.countByBook_BookIdAndStatus(bookId, "AVAILABLE");

        if (availableCopies > 0) {
            return "Book is available. No need to reserve.";
        }

        // 3️⃣ Check queue limit (max 2 WAITING users)
        long queueCount =
                reservationRepository.countByBook_BookIdAndStatus(
                        bookId,
                        ReservationStatus.WAITING
                );

        if (queueCount >= 2) {
            return "Reservation queue is full (maximum 2 users).";
        }

        // 4️⃣ Check if member already has active reservation
        long userWaitingReservation =
                reservationRepository.countByUser_UserIdAndStatus(
                        user.getUserId(),
                        ReservationStatus.WAITING
                );
        long userReadyReservation =
                reservationRepository.countByUser_UserIdAndStatus(
                        user.getUserId(),
                        ReservationStatus.READY_FOR_PICKUP
                );

        if ((userWaitingReservation + userReadyReservation) > 0) {
            return "You can reserve only one book at a time.";
        }

        // 5️⃣ Create reservation
        Reservation reservation = new Reservation();
        reservation.setBook(book);
        reservation.setUser(user);
        reservation.setStatus(ReservationStatus.WAITING);
        reservation.setReservationDate(LocalDate.now());
        reservation.setQueuePosition((int) queueCount + 1);

        reservationRepository.save(reservation);
        reservationQueueService.recomputeQueuePositions(bookId);

        return "Reservation successful. Queue position: " + reservation.getQueuePosition();
    }

    @DeleteMapping("/{reservationId}")
    public String cancelOwnReservation(@PathVariable Long reservationId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
        }

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reservation not found"));

        if (!reservation.getUser().getUserId().equals(user.getUserId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only cancel your own reservation");
        }

        if (reservation.getStatus() != ReservationStatus.WAITING) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Cancellation is allowed only while reservation is in WAITING status"
            );
        }

        reservation.setStatus(ReservationStatus.CANCELLED);
        reservation.setExpiryDate(null);
        reservationRepository.save(reservation);

        reservationQueueService.recomputeQueuePositions(reservation.getBook().getBookId());

        return "Reservation cancelled successfully";
    }
}
