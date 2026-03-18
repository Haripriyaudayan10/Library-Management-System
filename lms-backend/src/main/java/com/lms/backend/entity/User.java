package com.lms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue
    @Column(name = "userid")   // 🔥 VERY IMPORTANT
    private UUID userId;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "profile_image_url")
    private String profileImageUrl;

    @Column(name = "about", length = 1000)
    private String about;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private Boolean suspended = false;

    @Column(nullable = false)
    private String role; // ADMIN or MEMBER
}
