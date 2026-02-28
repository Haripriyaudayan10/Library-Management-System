package com.lms.backend.repository;

import com.lms.backend.entity.Loan;
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

    // Loans by member + status (ACTIVE / RETURNED)
    long countByUser_UserIdAndStatus(UUID userId, String status);

    // Active loans for member
    List<Loan> findByUser_UserIdAndStatus(UUID userId, String status);



    /* ==============================
       ADMIN DASHBOARD SUPPORT
       ============================== */

    // All loans by status
    List<Loan> findByStatus(String status);

    // Count by status
    long countByStatus(String status);

    // Count loans issued today
    long countByIssueDate(LocalDate date);

    // Count returned after specific date
    long countByReturnDateAfterAndReturnDateIsNotNull(LocalDate date);



    /* ==============================
       OVERDUE LOGIC
       ============================== */

    // Overdue loans (ACTIVE and due date before today)
    List<Loan> findByStatusAndDueDateBefore(String status, LocalDate date);

    long countByStatusAndDueDateBefore(String status, LocalDate date);



    /* ==============================
       COPY SAFETY CHECK
       ============================== */

    // Check if a specific copy already has active loan
    List<Loan> findByCopy_CopyidAndStatus(Long copyid, String status);
}