package com.lms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "loan")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Loan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "loanid")   // keep DB column same
    private Long loanId;       // ✅ camelCase fixed

    @ManyToOne
    @JoinColumn(name = "copyid", nullable = false)
    private Copy copy;

    @ManyToOne
    @JoinColumn(name = "userid", nullable = false)
    private User user;

    private LocalDate issueDate;

    private LocalDate dueDate;

    private LocalDate returnDate;

    private String status; // ACTIVE, RETURNED
}