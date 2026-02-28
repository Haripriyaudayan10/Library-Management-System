package com.lms.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class MemberDashboardResponse {

    private long booksBorrowed;
    private long booksReturned;
    private double pendingFine;

    private List<ActiveLoanResponse> activeLoans;
    private List<FineResponse> fines;
}