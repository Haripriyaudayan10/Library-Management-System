package com.lms.backend.dto;

import lombok.Data;

@Data
public class CreateMemberRequest {
    private String name;
    private String email;
    private String password;
}