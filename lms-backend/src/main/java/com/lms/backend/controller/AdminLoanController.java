package com.lms.backend.controller;

import com.lms.backend.entity.*;
import com.lms.backend.enums.LoanStatus;
import com.lms.backend.enums.ReservationStatus;
import com.lms.backend.service.NotificationService;
import com.lms.backend.service.ReservationQueueService;
import com.lms.backend.repository.*;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/loans")
@RequiredArgsConstructor
@PreAuthorize("hasAnyAuthority('ADMIN','ROLE_ADMIN')")
public class AdminLoanController {

    private final LoanRepository loanRepository;
    private final CopyRepository copyRepository;
    private final UserRepository userRepository;
    private final FineRepository fineRepository;
    private final ReservationRepository reservationRepository;
    private final NotificationService notificationService;
    private final ReservationQueueService reservationQueueService;

    // =====================================================
    // CREATE LOAN (ISSUE BOOK)
    // POST /api/admin/loans
    // =====================================================
    @PostMapping
    public Loan createLoan(@RequestParam Long copyId,
                           @RequestParam UUID userId) {

        Copy copy = copyRepository.findById(copyId)
                .orElseThrow(() -> new RuntimeException("Copy not found"));

        String copyStatus = copy.getStatus() == null ? "" : copy.getStatus().toUpperCase();
        if (!"AVAILABLE".equals(copyStatus) && !"RESERVED".equals(copyStatus)) {
            throw new RuntimeException("Copy not available");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Reservation reservedFor = reservationRepository
                .findFirstByBook_BookIdAndStatusOrderByQueuePositionAsc(
                        copy.getBook().getBookId(),
                        ReservationStatus.READY_FOR_PICKUP)
                .orElse(null);

        if (reservedFor != null) {
            if (!reservedFor.getUser().getUserId().equals(userId)) {
                throw new RuntimeException("This copy is reserved for another member pickup.");
            }

            boolean hasReservedCopy = copyRepository
                    .findFirstByBook_BookIdAndStatusOrderByCopyidAsc(
                            copy.getBook().getBookId(),
                            "RESERVED"
                    )
                    .isPresent();

            if (hasReservedCopy && !"RESERVED".equals(copyStatus)) {
                throw new RuntimeException("Please issue the reserved copy for this ready pickup.");
            }
        } else if ("RESERVED".equals(copyStatus)) {
            throw new RuntimeException("This copy is currently reserved and cannot be issued.");
        }

        long activeLoans =
                loanRepository.countByUser_UserIdAndStatus(userId, LoanStatus.ACTIVE);

        if (activeLoans >= 3) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User already has 3 active books.");
        }

        boolean hasUnpaidFine = fineRepository.findByLoan_User_UserId(userId)
                .stream()
                .anyMatch(fine -> !fine.isPaid());

        if (hasUnpaidFine) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Member has unpaid fines. Clear all due fines before issuing a new book."
            );
        }

        copy.setStatus("ISSUED");
        copyRepository.save(copy);

        Loan loan = new Loan();
        loan.setCopy(copy);
        loan.setUser(user);
        loan.setIssueDate(LocalDate.now());
        loan.setDueDate(LocalDate.now().plusDays(14));
        loan.setStatus(LoanStatus.ACTIVE);

        if (reservedFor != null) {
            reservedFor.setStatus(ReservationStatus.COMPLETED);
            reservedFor.setExpiryDate(null);
            reservationRepository.save(reservedFor);
            reservationQueueService.recomputeQueuePositions(copy.getBook().getBookId());
        }

        return loanRepository.save(loan);
    }

    @GetMapping("/eligible-copies")
    public List<Map<String, Object>> getEligibleCopies(
            @RequestParam Long bookId,
            @RequestParam(required = false) UUID userId) {

        List<Copy> availableCopies = copyRepository.findByBook_BookIdAndStatus(bookId, "AVAILABLE");
        List<Copy> reservedCopies = copyRepository.findByBook_BookIdAndStatus(bookId, "RESERVED");

        Reservation readyReservation = reservationRepository
                .findFirstByBook_BookIdAndStatusOrderByQueuePositionAsc(
                        bookId,
                        ReservationStatus.READY_FOR_PICKUP)
                .orElse(null);

        List<Copy> eligible;
        if (readyReservation == null) {
            eligible = availableCopies;
        } else if (userId != null && readyReservation.getUser().getUserId().equals(userId)) {
            eligible = reservedCopies.isEmpty() ? availableCopies : reservedCopies;
        } else {
            eligible = new ArrayList<>();
        }

        return eligible.stream()
                .map(copy -> Map.<String, Object>of(
                        "copyid", copy.getCopyid(),
                        "status", copy.getStatus()))
                .collect(Collectors.toList());
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

            notificationService.notifyUser(
                    loan.getUser(),
                    "Library Fine Issued",
                    "A fine of ₹" + fineAmount + " was issued for late return of \"" +
                            loan.getCopy().getBook().getTitle() + "\"."
            );
        }

        Copy copy = loan.getCopy();
        copy.setStatus("AVAILABLE");
        copyRepository.save(copy);

        // If any member is waiting for this book, promote the first in queue.
        List<Reservation> waitingReservations =
                reservationRepository.findByBook_BookIdAndStatusOrderByQueuePositionAsc(
                        copy.getBook().getBookId(),
                        ReservationStatus.WAITING
                );
        if (!waitingReservations.isEmpty()) {
            Reservation nextReservation = waitingReservations.get(0);
            nextReservation.setStatus(ReservationStatus.READY_FOR_PICKUP);
            nextReservation.setExpiryDate(LocalDate.now().plusDays(3));
            reservationRepository.save(nextReservation);

            copy.setStatus("RESERVED");
            copyRepository.save(copy);

            notificationService.notifyUser(
                    nextReservation.getUser(),
                    "Book Ready for Pickup",
                    "\"" + nextReservation.getBook().getTitle() +
                            "\" is now available. Please pick it up within 3 days."
            );
        }

        reservationQueueService.recomputeQueuePositions(copy.getBook().getBookId());

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
