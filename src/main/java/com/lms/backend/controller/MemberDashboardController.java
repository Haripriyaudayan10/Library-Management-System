package com.lms.backend.controller;

import com.lms.backend.dto.*;
import com.lms.backend.entity.User;
import com.lms.backend.repository.FineRepository;
import com.lms.backend.repository.LoanRepository;
import com.lms.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('MEMBER')")
public class MemberDashboardController {

    private final LoanRepository loanRepository;
    private final FineRepository fineRepository;
    private final UserRepository userRepository;

    @GetMapping("/dashboard")
    public MemberDashboardResponse getDashboard(Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UUID userId = user.getUserId();

        // ==============================
        // 📚 Total Borrowed
        // ==============================
        long borrowed = loanRepository.countByUser_UserId(userId);

        // ==============================
        // 📖 Returned Books
        // ==============================
        long returned = loanRepository
                .countByUser_UserIdAndStatus(userId, "RETURNED");

        // ==============================
        // 💰 Fine Details
        // ==============================
        List<FineResponse> fineResponses = fineRepository
                .findByLoan_User_UserId(userId)
                .stream()
                .map(fine -> FineResponse.builder()
                        .fineId(fine.getFineId())
                        .bookTitle(fine.getLoan().getCopy().getBook().getTitle())
                        .amount(fine.getAmount())
                        .paid(fine.isPaid())
                        .paidDate(fine.getPaidDate())
                        .build())
                .collect(Collectors.toList());

        double pendingFine = fineResponses.stream()
                .filter(f -> !f.isPaid())
                .mapToDouble(FineResponse::getAmount)
                .sum();

        // ==============================
        // 📕 Active Loans
        // ==============================
        List<ActiveLoanResponse> activeLoans = loanRepository
        .findByUser_UserIdAndStatus(userId, "ACTIVE")
        .stream()
        .map(loan -> ActiveLoanResponse.builder()
                .loanId(loan.getLoanId())
                .bookTitle(loan.getCopy().getBook().getTitle())
                .author(loan.getCopy().getBook().getAuthorName())
                .dueDate(loan.getDueDate())
                .build())
        .collect(Collectors.toList());

        // ==============================
        // 🧾 Final Dashboard Response
        // ==============================
        return MemberDashboardResponse.builder()
                .booksBorrowed(borrowed)
                .booksReturned(returned)
                .pendingFine(pendingFine)
                .activeLoans(activeLoans)
                .fines(fineResponses)
                .build();
    }
}