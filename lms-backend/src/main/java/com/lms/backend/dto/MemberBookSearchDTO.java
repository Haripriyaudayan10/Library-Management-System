package com.lms.backend.dto;

import lombok.Data;

@Data
public class MemberBookSearchDTO {

    private Long bookId;
    private String title;
    private String author;
    private String category;
    private long availableCopies;
}