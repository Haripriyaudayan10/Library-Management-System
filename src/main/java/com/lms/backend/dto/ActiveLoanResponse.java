package com.lms.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class ActiveLoanResponse {

    private Long loanId;
    private String bookTitle;
    private String author;
    private LocalDate dueDate;
}