package com.lms.backend.controller;

import com.lms.backend.dto.MemberBookSearchDTO;
import com.lms.backend.entity.Book;
import com.lms.backend.repository.BookRepository;
import com.lms.backend.repository.CopyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/member/books")
@RequiredArgsConstructor
public class MemberBookController {

    private final BookRepository bookRepository;
    private final CopyRepository copyRepository;

    // 🔎 Search Books (by ID, Title, or Author)
    @GetMapping("/search")
    public List<MemberBookSearchDTO> searchBooks(
            @RequestParam String keyword
    ) {

        List<Book> books;

        // ✅ If keyword is numeric → search by Book ID
        if (keyword.matches("\\d+")) {

            books = bookRepository.findById(Long.parseLong(keyword))
                    .map(List::of)
                    .orElse(List.of());

        } else {

            // ✅ Search by Title OR Author
            books = bookRepository
                    .findByTitleContainingIgnoreCaseOrAuthorNameContainingIgnoreCase(
                            keyword,
                            keyword
                    );
        }

        // ✅ Convert to DTO with availability count
        return books.stream().map(book -> {

            long availableCount =
                    copyRepository.countByBook_BookIdAndStatus(
                            book.getBookId(),
                            "AVAILABLE"
                    );

            MemberBookSearchDTO dto = new MemberBookSearchDTO();
            dto.setBookId(book.getBookId());
            dto.setTitle(book.getTitle());
            dto.setAuthor(book.getAuthorName());
            dto.setCategory(book.getCategory().getName());
            dto.setAvailableCopies(availableCount);

            return dto;

        }).toList();
    }
}