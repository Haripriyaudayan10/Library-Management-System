package com.lms.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class MemberProfileResponse {
    private UUID userId;
    private String name;
    private String email;
    private String phoneNumber;
    private String about;
    private String profileImageUrl;
}
