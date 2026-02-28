package com.lms.backend.repository;

import com.lms.backend.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {

    // 📊 Count books by category name (used in dashboard)
    long countByCategory_Name(String name);

    // 🔎 Search by Title OR Author (case-insensitive)
    List<Book> findByTitleContainingIgnoreCaseOrAuthorNameContainingIgnoreCase(
            String title,
            String author
    );
}