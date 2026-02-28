package com.lms.backend.repository;

import com.lms.backend.entity.Fine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface FineRepository extends JpaRepository<Fine, Long> {

    // Find fines by user
    List<Fine> findByLoan_User_UserId(UUID userId);

    // Find fines by paid status
    List<Fine> findByPaid(boolean paid);
}