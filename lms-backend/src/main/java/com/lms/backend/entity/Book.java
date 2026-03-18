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
    @Column(name = "bookid")
    private Long bookId;

    @Column(nullable = false)
    private String title;

    @Column(name = "authorname", nullable = false)
    private String authorName;

    @Column(name = "cover_image_url")
private String coverImageUrl;

    @ManyToOne
    @JoinColumn(name = "categoryid", nullable = false)
    private Category category;
}