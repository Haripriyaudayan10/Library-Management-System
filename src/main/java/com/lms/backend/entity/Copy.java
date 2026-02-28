package com.lms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "copy")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Copy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long copyid;

    @Column(nullable = false)
    private String status;  // AVAILABLE, ISSUED, RESERVED

    @ManyToOne
    @JoinColumn(name = "bookid", nullable = false)
    private Book book;
}
