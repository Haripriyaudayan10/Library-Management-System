package com.lms.backend.dto;

import lombok.Data;

@Data
public class UpdateMemberProfileRequest {
    private String name;
    private String email;
    private String phoneNumber;
    private String about;
}
