package com.lms.backend.controller;

import com.lms.backend.entity.Book;
import com.lms.backend.entity.Reservation;
import com.lms.backend.entity.User;
import com.lms.backend.enums.ReservationStatus;
import com.lms.backend.repository.BookRepository;
import com.lms.backend.repository.CopyRepository;
import com.lms.backend.repository.ReservationRepository;
import com.lms.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/member/reservations")
@RequiredArgsConstructor
public class MemberReservationController {

    private final ReservationRepository reservationRepository;
    private final BookRepository bookRepository;
    private final CopyRepository copyRepository;
    private final UserRepository userRepository;

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
        long userActiveReservation =
                reservationRepository.countByUser_UserIdAndStatus(
                        user.getUserId(),
                        ReservationStatus.WAITING
                );

        if (userActiveReservation > 0) {
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

        return "Reservation successful. Queue position: " + reservation.getQueuePosition();
    }
}