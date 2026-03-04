package com.lms.backend.controller;

import com.lms.backend.entity.*;
import com.lms.backend.enums.LoanStatus;
import com.lms.backend.enums.ReservationStatus;
import com.lms.backend.repository.*;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

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

    // =====================================================
    // CREATE LOAN (ISSUE BOOK)
    // POST /api/admin/loans
    // =====================================================
    @PostMapping
    public Loan createLoan(@RequestParam Long copyId,
                           @RequestParam UUID userId) {

        Copy copy = copyRepository.findById(copyId)
                .orElseThrow(() -> new RuntimeException("Copy not found"));

        if (!"AVAILABLE".equalsIgnoreCase(copy.getStatus())) {
            throw new RuntimeException("Copy not available");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        long activeLoans =
                loanRepository.countByUser_UserIdAndStatus(userId, LoanStatus.ACTIVE);

        if (activeLoans >= 3) {
            throw new RuntimeException("User already has 3 active books.");
        }

        copy.setStatus("ISSUED");
        copyRepository.save(copy);

        Loan loan = new Loan();
        loan.setCopy(copy);
        loan.setUser(user);
        loan.setIssueDate(LocalDate.now());
        loan.setDueDate(LocalDate.now().plusDays(14));
        loan.setStatus(LoanStatus.ACTIVE);

        return loanRepository.save(loan);
    }

    // =====================================================
    // RETURN LOAN (UPDATE RESOURCE)
    // PUT /api/admin/loans/{loanId}/return
    // =====================================================
    @PutMapping("/{loanId}/return")
    public Loan returnLoan(@PathVariable Long loanId) {

        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        if (loan.getStatus() == LoanStatus.RETURNED) {
            throw new RuntimeException("Already returned");
        }

        LocalDate returnDate = LocalDate.now();
        loan.setReturnDate(returnDate);
        loan.setStatus(LoanStatus.RETURNED);

        if (returnDate.isAfter(loan.getDueDate())) {

            long daysLate = ChronoUnit.DAYS.between(
                    loan.getDueDate(), returnDate);

            double fineAmount = daysLate * 5.0;

            Fine fine = new Fine();
            fine.setLoan(loan);
            fine.setAmount(fineAmount);
            fine.setPaid(false);
            fineRepository.save(fine);
        }

        Copy copy = loan.getCopy();
        copy.setStatus("AVAILABLE");
        copyRepository.save(copy);

        return loanRepository.save(loan);
    }

    // =====================================================
    // EXTEND LOAN
    // PATCH /api/admin/loans/{loanId}
    // =====================================================
    @PatchMapping("/{loanId}")
    public ResponseEntity<Loan> extendLoan(
            @PathVariable Long loanId,
            @RequestParam String newDueDate) {

        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        if (loan.getStatus() == LoanStatus.RETURNED) {
            throw new RuntimeException("Cannot extend returned loan");
        }

        LocalDate parsed = LocalDate.parse(newDueDate);

        if (parsed.isBefore(LocalDate.now())) {
            throw new RuntimeException("New due date must be future date");
        }

        loan.setDueDate(parsed);
        loan.setStatus(LoanStatus.REISSUED);

        return ResponseEntity.ok(loanRepository.save(loan));
    }

    // =====================================================
    // GET LOANS (FILTERED)
    // =====================================================
    @GetMapping
    public List<Loan> getLoans(
            @RequestParam(required = false) LoanStatus status,
            @RequestParam(required = false) Boolean overdue,
            @RequestParam(required = false) UUID userId) {

        List<Loan> loans = loanRepository.findAll();

        if (status != null) {
            loans = loans.stream()
                    .filter(l -> l.getStatus() == status)
                    .collect(Collectors.toList());
        }

        if (Boolean.TRUE.equals(overdue)) {
            loans = loans.stream()
                    .filter(l ->
                            l.getStatus() == LoanStatus.ACTIVE &&
                            l.getDueDate().isBefore(LocalDate.now()))
                    .collect(Collectors.toList());
        }

        if (userId != null) {
            loans = loans.stream()
                    .filter(l ->
                            l.getUser().getUserId().equals(userId))
                    .collect(Collectors.toList());
        }

        return loans;
    }

    // =====================================================
    // DELETE LOAN
    // =====================================================
    @DeleteMapping("/{loanId}")
    public ResponseEntity<String> deleteLoan(@PathVariable Long loanId) {

        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        loanRepository.delete(loan);

        return ResponseEntity.ok("Loan deleted successfully");
    }
}