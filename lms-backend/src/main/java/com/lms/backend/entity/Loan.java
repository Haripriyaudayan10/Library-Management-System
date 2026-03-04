package com.lms.backend.entity;

import com.lms.backend.enums.LoanStatus;
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
    @Column(name = "loanid")
    private Long loanId;

    @ManyToOne
    @JoinColumn(name = "copyid", nullable = false)
    private Copy copy;

    @ManyToOne
    @JoinColumn(name = "userid", nullable = false)
    private User user;

    private LocalDate issueDate;

    private LocalDate dueDate;

    private LocalDate returnDate;

    // ✅ Changed from String → Enum
    @Enumerated(EnumType.STRING)
    private LoanStatus status;
}