package com.lms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "fine")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Fine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fineid")
    private Long fineId;   // ✅ FIXED camelCase

    @ManyToOne
    @JoinColumn(name = "loanid", nullable = false)
    private Loan loan;

    private double amount;

    private boolean paid;

    private LocalDate paidDate;
}