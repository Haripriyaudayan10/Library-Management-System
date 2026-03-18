package com.lms.backend.controller;

import com.lms.backend.dto.MemberProfileResponse;
import com.lms.backend.dto.UpdateMemberProfileRequest;
import com.lms.backend.entity.User;
import com.lms.backend.repository.UserRepository;
import com.lms.backend.service.ProfileImageStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/member/profile")
@RequiredArgsConstructor
public class MemberProfileController {

    private final UserRepository userRepository;
    private final ProfileImageStorageService profileImageStorageService;

    @GetMapping
    public MemberProfileResponse getOwnProfile() {
        User user = getAuthenticatedUser();
        return MemberProfileResponse.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .about(user.getAbout())
                .profileImageUrl(user.getProfileImageUrl())
                .build();
    }

    @PutMapping
    public MemberProfileResponse updateOwnProfile(@RequestBody UpdateMemberProfileRequest request) {
        User user = getAuthenticatedUser();
        if (request.getName() != null) {
            user.setName(request.getName().trim());
        }
        if (request.getEmail() != null) {
            String nextEmail = request.getEmail().trim();
            userRepository.findByEmail(nextEmail).ifPresent(existing -> {
                if (!existing.getUserId().equals(user.getUserId())) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
                }
            });
            user.setEmail(nextEmail);
        }
        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getAbout() != null) {
            user.setAbout(request.getAbout());
        }
        userRepository.save(user);

        return MemberProfileResponse.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .about(user.getAbout())
                .profileImageUrl(user.getProfileImageUrl())
                .build();
    }

    @PostMapping("/image")
    public MemberProfileResponse uploadOwnProfileImage(@RequestParam("file") MultipartFile file) {
        User user = getAuthenticatedUser();
        String fileUrl = profileImageStorageService.storeProfileImage(file);
        user.setProfileImageUrl(fileUrl);
        userRepository.save(user);

        return MemberProfileResponse.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .about(user.getAbout())
                .profileImageUrl(user.getProfileImageUrl())
                .build();
    }

    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
