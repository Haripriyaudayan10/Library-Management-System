package com.lms.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminDashboardResponse {

    private long totalBooks;
    private long totalCopies;
    private long availableCopies;
    private long totalMembers;
    private long activeLoans;
    private long waitingReservations;
}