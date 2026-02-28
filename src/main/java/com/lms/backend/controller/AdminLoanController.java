package com.lms.backend.controller;

import com.lms.backend.entity.*;
import com.lms.backend.enums.ReservationStatus;
import com.lms.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/loans")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminLoanController {

    private final LoanRepository loanRepository;
    private final CopyRepository copyRepository;
    private final UserRepository userRepository;
    private final FineRepository fineRepository;
    private final ReservationRepository reservationRepository;

    // ========================================
    // ISSUE BOOK
    // ========================================
    @PostMapping("/issue")
    public Loan issueBook(@RequestParam Long copyId,
                          @RequestParam UUID userId) {

        Copy copy = copyRepository.findById(copyId)
                .orElseThrow(() -> new RuntimeException("Copy not found"));

        if (!"AVAILABLE".equals(copy.getStatus())) {
            throw new RuntimeException("Copy not available");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        copy.setStatus("ISSUED");
        copyRepository.save(copy);

        Loan loan = new Loan();
        loan.setCopy(copy);
        loan.setUser(user);
        loan.setIssueDate(LocalDate.now());
        loan.setDueDate(LocalDate.now().plusDays(14));
        loan.setStatus("ACTIVE");

        return loanRepository.save(loan);
    }

    // ========================================
    // RETURN BOOK
    // ========================================
    @PostMapping("/return/{loanId}")
    public Loan returnBook(@PathVariable Long loanId) {

        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        if ("RETURNED".equals(loan.getStatus())) {
            throw new RuntimeException("Book already returned");
        }

        LocalDate returnDate = LocalDate.now();
        loan.setReturnDate(returnDate);
        loan.setStatus("RETURNED");

        // ===============================
        // FINE CALCULATION
        // ===============================
        if (returnDate.isAfter(loan.getDueDate())) {

            long daysLate = ChronoUnit.DAYS.between(
                    loan.getDueDate(),
                    returnDate
            );

            double fineAmount = daysLate * 5.0;

            boolean fineExists = fineRepository
                    .findAll()
                    .stream()
                    .anyMatch(f -> f.getLoan().getLoanId().equals(loanId));

            if (!fineExists) {
                Fine fine = new Fine();
                fine.setLoan(loan);
                fine.setAmount(fineAmount);
                fine.setPaid(false);
                fineRepository.save(fine);
            }
        }

        // ===============================
        // UPDATE COPY STATUS
        // ===============================
        Copy copy = loan.getCopy();
        copy.setStatus("AVAILABLE");
        copyRepository.save(copy);

        // ===============================
        // RESERVATION QUEUE LOGIC
        // ===============================
        List<Reservation> queue =
                reservationRepository
                        .findByBook_BookIdAndStatusOrderByQueuePositionAsc(
                                copy.getBook().getBookId(),
                                ReservationStatus.WAITING
                        );

        if (!queue.isEmpty()) {

            Reservation nextReservation = queue.get(0);

            nextReservation.setStatus(ReservationStatus.READY_FOR_PICKUP);
            nextReservation.setExpiryDate(LocalDate.now().plusDays(7));

            reservationRepository.save(nextReservation);

            System.out.println("Notify user: "
                    + nextReservation.getUser().getEmail());
        }

        return loanRepository.save(loan);
    }

    // ========================================
    // GET ALL LOANS
    // ========================================
    @GetMapping
    public List<Loan> getAllLoans() {
        return loanRepository.findAll();
    }

    @GetMapping("/active")
    public List<Loan> getActiveLoans() {
        return loanRepository.findByStatus("ACTIVE");
    }

    @GetMapping("/returned")
    public List<Loan> getReturnedLoans() {
        return loanRepository.findByStatus("RETURNED");
    }

    @GetMapping("/overdue")
    public List<Loan> getOverdueLoans() {
        return loanRepository.findByStatusAndDueDateBefore(
                "ACTIVE",
                LocalDate.now()
        );
    }
}