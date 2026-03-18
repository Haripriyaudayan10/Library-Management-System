package com.lms.backend.service;

import com.lms.backend.entity.Book;
import com.lms.backend.repository.BookRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public Book saveBook(Book book) {

        String coverUrl = fetchBookCover(book.getTitle());

        book.setCoverImageUrl(coverUrl);

        return bookRepository.save(book);
    }

    public String fetchBookCover(String title) {

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
}