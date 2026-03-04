package com.lms.backend.repository;

import com.lms.backend.entity.Loan;
import com.lms.backend.enums.LoanStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface LoanRepository extends JpaRepository<Loan, Long> {

    /* ==============================
       MEMBER DASHBOARD SUPPORT
       ============================== */

    // Total loans by member
    long countByUser_UserId(UUID userId);

    // Loans by member + status
    long countByUser_UserIdAndStatus(UUID userId, LoanStatus status);

    // Loans by member + status list
    List<Loan> findByUser_UserIdAndStatus(UUID userId, LoanStatus status);



    /* ==============================
       ADMIN DASHBOARD SUPPORT
       ============================== */

    // All loans by status
    List<Loan> findByStatus(LoanStatus status);

    // Count by status
    long countByStatus(LoanStatus status);

    // Count loans issued today
    long countByIssueDate(LocalDate date);

    // Count returned after specific date
    long countByReturnDateAfterAndReturnDateIsNotNull(LocalDate date);



    /* ==============================
       OVERDUE LOGIC
       ============================== */

    // Overdue loans (ACTIVE and due date before today)
    List<Loan> findByStatusAndDueDateBefore(LoanStatus status, LocalDate date);

    long countByStatusAndDueDateBefore(LoanStatus status, LocalDate date);



    /* ==============================
       COPY SAFETY CHECK
       ============================== */

    // Check if a specific copy already has active loan
    List<Loan> findByCopy_CopyidAndStatus(Long copyid, LoanStatus status);
}