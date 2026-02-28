package com.lms.backend.controller;

import com.lms.backend.dto.AdminBookDetailsDTO;
import com.lms.backend.entity.Book;
import com.lms.backend.entity.Category;
import com.lms.backend.repository.BookRepository;
import com.lms.backend.repository.CategoryRepository;
import com.lms.backend.repository.CopyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/books")
@RequiredArgsConstructor
public class AdminBookController {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;
    private final CopyRepository copyRepository;

    // ✅ GET BOOK BY ID (Professional Version)
    @GetMapping("/{id}")
    public AdminBookDetailsDTO getBookById(@PathVariable Long id) {

        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        long totalCopies = copyRepository.countByBook_BookId(id);
        long availableCopies =
                copyRepository.countByBook_BookIdAndStatus(id, "AVAILABLE");

        AdminBookDetailsDTO dto = new AdminBookDetailsDTO();
        dto.setBookId(book.getBookId());
        dto.setTitle(book.getTitle());
        dto.setAuthor(book.getAuthorName());
        dto.setCategory(book.getCategory().getName());
        dto.setTotalCopies(totalCopies);
        dto.setAvailableCopies(availableCopies);

        return dto;
    }

    // ✅ ADD BOOK
    @PostMapping
    public Book addBook(@RequestBody Book book) {

        Long categoryId = book.getCategory().getCategoryid();

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        book.setCategory(category);

        return bookRepository.save(book);
    }

    // ✅ UPDATE BOOK
    @PutMapping("/{id}")
    public Book updateBook(@PathVariable Long id,
                           @RequestBody Book updatedBook) {

        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        book.setTitle(updatedBook.getTitle());
        book.setAuthorName(updatedBook.getAuthorName());

        Long categoryId = updatedBook.getCategory().getCategoryid();

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        book.setCategory(category);

        return bookRepository.save(book);
    }

    // ✅ DELETE BOOK
    @DeleteMapping("/{id}")
    public String deleteBook(@PathVariable Long id) {

        bookRepository.deleteById(id);

        return "Book deleted successfully.";
    }
}