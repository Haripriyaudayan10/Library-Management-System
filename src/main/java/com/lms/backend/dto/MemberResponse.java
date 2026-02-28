package com.lms.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class MemberResponse {

    private UUID userid;
    private String name;
    private String email;
}