package com.lms.backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import com.lms.backend.entity.Book;
import com.lms.backend.entity.Category;
import com.lms.backend.repository.BookRepository;
import com.lms.backend.repository.CategoryRepository;
import com.lms.backend.repository.CopyRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/books")
@RequiredArgsConstructor
public class AdminBookController {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;
    private final CopyRepository copyRepository;

    // ======================================================
    // GET (FILTER + PAGINATION)
    // ======================================================
    @GetMapping
    public Page<Book> getBooks(

            @RequestParam(required = false) Long bookId,
            @RequestParam(required = false) String author,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean available,

            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Book> bookPage = bookRepository.findAll(pageable);

        List<Book> filtered = bookPage.getContent()
                .stream()

                .filter(book ->
                        bookId == null || book.getBookId().equals(bookId))

                .filter(book ->
                        author == null ||
                        book.getAuthorName().equalsIgnoreCase(author))

                .filter(book ->
                        category == null ||
                        book.getCategory().getName().equalsIgnoreCase(category))

                .filter(book ->
                        available == null ||
                        copyRepository.countByBook_BookIdAndStatus(
                                book.getBookId(), "AVAILABLE") > 0)

                .collect(Collectors.toList());

        return new PageImpl<>(filtered, pageable, bookPage.getTotalElements());
    }

    // ======================================================
    // POST (ADD BOOK OR CATEGORY)
    // ======================================================
    @PostMapping
    public Object create(

            @RequestParam(required = false) String categoryName,
            @RequestBody(required = false) Book book
    ) {

        // CREATE CATEGORY
        if (categoryName != null) {

            Category category = new Category();
            category.setName(categoryName);

            return categoryRepository.save(category);
        }

        // CREATE BOOK
        Long categoryId = book.getCategory().getCategoryid();

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        book.setCategory(category);

        return bookRepository.save(book);
    }

    // ======================================================
    // PUT (UPDATE BOOK OR CATEGORY)
    // ======================================================
    @PutMapping
    public Object update(

            @RequestParam(required = false) Long bookId,
            @RequestParam(required = false) Long categoryId,

            @RequestBody(required = false) Book updatedBook,
            @RequestParam(required = false) String categoryName
    ) {

        // UPDATE CATEGORY
        if (categoryId != null) {

            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Category not found"));

            category.setName(categoryName);

            return categoryRepository.save(category);
        }

        // UPDATE BOOK
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        book.setTitle(updatedBook.getTitle());
        book.setAuthorName(updatedBook.getAuthorName());

        Long catId = updatedBook.getCategory().getCategoryid();

        Category category = categoryRepository.findById(catId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        book.setCategory(category);

        return bookRepository.save(book);
    }

    // ======================================================
    // DELETE (BOOK OR CATEGORY)
    // ======================================================
    @DeleteMapping
    public String delete(

            @RequestParam(required = false) Long bookId,
            @RequestParam(required = false) Long categoryId
    ) {

        if (categoryId != null) {

            if (!categoryRepository.existsById(categoryId)) {
                throw new RuntimeException("Category not found");
            }

            categoryRepository.deleteById(categoryId);
            return "Category deleted";
        }

        if (!bookRepository.existsById(bookId)) {
            throw new RuntimeException("Book not found");
        }

        bookRepository.deleteById(bookId);

        return "Book deleted";
    }
}