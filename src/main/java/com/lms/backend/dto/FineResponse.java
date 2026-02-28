package com.lms.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class FineResponse {

    private Long fineId;
    private String bookTitle;
    private double amount;
    private boolean paid;
    private LocalDate paidDate;
}