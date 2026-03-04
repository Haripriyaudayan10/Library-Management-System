package com.lms.backend.repository;

import com.lms.backend.entity.Copy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CopyRepository extends JpaRepository<Copy, Long> {

    List<Copy> findByBook_BookId(Long bookId);

    List<Copy> findByBook_BookIdAndStatus(Long bookId, String status);

    long countByBook_BookId(Long bookId);  // ✅ total copies

    long countByBook_BookIdAndStatus(Long bookId, String status);

    long countByStatus(String status);
    long count();
}