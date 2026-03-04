package com.lms.backend.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class ReservationDetailsDTO {

    private Long reservationId;
    private UUID userId;
    private String userName;
    private Long bookId;
    private String bookTitle;
    private LocalDate reservationDate;
    private String status;
}