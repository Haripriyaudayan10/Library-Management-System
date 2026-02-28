package com.lms.backend.controller;

import com.lms.backend.dto.ReservationDetailsDTO;
import com.lms.backend.entity.Copy;
import com.lms.backend.entity.Loan;
import com.lms.backend.entity.Reservation;
import com.lms.backend.enums.ReservationStatus;
import com.lms.backend.repository.CopyRepository;
import com.lms.backend.repository.LoanRepository;
import com.lms.backend.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/reservations")
@RequiredArgsConstructor
public class AdminReservationController {

    private final ReservationRepository reservationRepository;
    private final CopyRepository copyRepository;
    private final LoanRepository loanRepository;

    // ======================================================
    // 1️⃣ GET ALL RESERVATIONS
    // ======================================================
    @GetMapping
    public List<ReservationDetailsDTO> getAllReservations() {

        return reservationRepository.findAll()
                .stream()
                .map(res -> {
                    ReservationDetailsDTO dto = new ReservationDetailsDTO();

                    dto.setReservationId(res.getReservationId());
                    dto.setUserId(res.getUser().getUserId());      // FIXED
                    dto.setUserName(res.getUser().getName());
                    dto.setBookId(res.getBook().getBookId());      // FIXED
                    dto.setBookTitle(res.getBook().getTitle());
                    dto.setReservationDate(res.getReservationDate());
                    dto.setStatus(res.getStatus().name());

                    return dto;
                })
                .collect(Collectors.toList());
    }

    // ======================================================
    // 2️⃣ MARK READY
    // ======================================================
    @PutMapping("/ready/{reservationId}")
    public String markAsReady(@PathVariable Long reservationId) {

        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        if (reservation.getStatus() != ReservationStatus.WAITING) {
            throw new RuntimeException("Only WAITING reservations can be marked READY");
        }

        reservation.setStatus(ReservationStatus.READY_FOR_PICKUP);
        reservationRepository.save(reservation);

        return "Reservation marked as READY_FOR_PICKUP";
    }

    // ======================================================
    // 3️⃣ PICKUP BOOK
    // ======================================================
    @PostMapping("/pickup/{reservationId}")
    public String pickupReservedBook(@PathVariable Long reservationId) {

        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        if (reservation.getStatus() != ReservationStatus.READY_FOR_PICKUP) {
            throw new RuntimeException("Reservation not ready for pickup");
        }

        List<Copy> availableCopies =
                copyRepository.findByBook_BookIdAndStatus(
                        reservation.getBook().getBookId(),   // FIXED
                        "AVAILABLE"
                );

        if (availableCopies.isEmpty()) {
            throw new RuntimeException("No available copy");
        }

        Copy copy = availableCopies.get(0);

        copy.setStatus("ISSUED");
        copyRepository.save(copy);

        Loan loan = new Loan();
        loan.setUser(reservation.getUser());
        loan.setCopy(copy);
        loan.setIssueDate(LocalDate.now());
        loan.setDueDate(LocalDate.now().plusDays(14));
        loan.setStatus("ACTIVE");

        loanRepository.save(loan);

        reservation.setStatus(ReservationStatus.COMPLETED);
        reservationRepository.save(reservation);

        return "Book issued successfully to reserved member";
    }

    // ======================================================
    // 4️⃣ CANCEL
    // ======================================================
    @DeleteMapping("/{reservationId}")
    public String cancelReservation(@PathVariable Long reservationId) {

        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        if (reservation.getStatus() == ReservationStatus.COMPLETED) {
            throw new RuntimeException("Cannot cancel completed reservation");
        }

        reservation.setStatus(ReservationStatus.CANCELLED);
        reservationRepository.save(reservation);

        return "Reservation cancelled successfully";
    }
}