package com.lms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "book")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bookid")   // keep DB column same
    private Long bookId;

    @Column(nullable = false)
    private String title;

    @Column(name = "authorname", nullable = false)   // map DB column
    private String authorName;   // ✅ camelCase field

    @ManyToOne
    @JoinColumn(name = "categoryid", nullable = false)
    private Category category;
}