package com.lms.backend.controller;

import com.lms.backend.dto.AdminDashboardResponse;
import com.lms.backend.enums.ReservationStatus;
import com.lms.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final LoanRepository loanRepository;
    private final CopyRepository copyRepository;
    private final ReservationRepository reservationRepository;

    @GetMapping("/dashboard")
    public AdminDashboardResponse getDashboard() {

        long totalBooks = bookRepository.count();

        long totalCopies = copyRepository.count();

        long availableCopies = copyRepository.countByStatus("AVAILABLE");

        long totalMembers = userRepository.countByRole("MEMBER");

        long activeLoans = loanRepository.countByStatus("ACTIVE");

        long waitingReservations =
                reservationRepository.countByStatus(ReservationStatus.WAITING);

        return new AdminDashboardResponse(
                totalBooks,
                totalCopies,
                availableCopies,
                totalMembers,
                activeLoans,
                waitingReservations
        );
    }
}