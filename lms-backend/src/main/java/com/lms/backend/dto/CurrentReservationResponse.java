package com.lms.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class CurrentReservationResponse {
    private Long reservationId;
    private String bookTitle;
    private String author;
    private String status;
    private Integer queuePosition;
    private LocalDate reservationDate;
}
