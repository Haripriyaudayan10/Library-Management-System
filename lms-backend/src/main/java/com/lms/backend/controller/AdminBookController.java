package com.lms.backend.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.lms.backend.entity.Book;
import com.lms.backend.entity.Category;
import com.lms.backend.enums.LoanStatus;
import com.lms.backend.repository.BookRepository;
import com.lms.backend.repository.CategoryRepository;
import com.lms.backend.repository.CopyRepository;
import com.lms.backend.repository.LoanRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/admin/books")
@RequiredArgsConstructor
public class AdminBookController {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;
    private final CopyRepository copyRepository;
    private final LoanRepository loanRepository;

    // ======================================================
    // FETCH BOOK COVER FROM OPENLIBRARY
    // ======================================================
    private String fetchBookCover(String title) {

        try {

            String url = "https://openlibrary.org/search.json?title=" + title;

            RestTemplate restTemplate = new RestTemplate();

            Map response = restTemplate.getForObject(url, Map.class);

            List docs = (List) response.get("docs");

            if (docs != null && !docs.isEmpty()) {

                Map firstBook = (Map) docs.get(0);

                if (firstBook.get("cover_i") != null) {

                    Integer coverId = (Integer) firstBook.get("cover_i");

                    return "https://covers.openlibrary.org/b/id/" + coverId + "-L.jpg";
                }
            }

        } catch (Exception e) {
            System.out.println("Cover fetch failed");
        }

        return null;
    }

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

        // FETCH COVER IMAGE AUTOMATICALLY
        String coverUrl = fetchBookCover(book.getTitle());
        book.setCoverImageUrl(coverUrl);

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

        // UPDATE COVER WHEN TITLE CHANGES
        String coverUrl = fetchBookCover(updatedBook.getTitle());
        book.setCoverImageUrl(coverUrl);

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

        boolean hasNonReturnedLoans = loanRepository.existsNonReturnedLoansForBook(
                bookId,
                LoanStatus.RETURNED
        );

        if (hasNonReturnedLoans) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Cannot delete book. Delete is allowed only after all loans for this book are returned."
            );
        }

        bookRepository.deleteById(bookId);

        return "Book deleted";
    }
}
