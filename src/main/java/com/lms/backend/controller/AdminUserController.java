package com.lms.backend.controller;

import com.lms.backend.dto.*;
import com.lms.backend.entity.User;
import com.lms.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // 🔹 Add Member
    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public MemberResponse addMember(@RequestBody CreateMemberRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("MEMBER");

        userRepository.save(user);

        return MemberResponse.builder()
                .userid(user.getUserId())   // ✅ FIXED
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }

    // 🔹 View All Members
    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<MemberResponse> getAllMembers() {

        return userRepository.findByRole("MEMBER")
                .stream()
                .map(user -> MemberResponse.builder()
                        .userid(user.getUserId())   // ✅ FIXED
                        .name(user.getName())
                        .email(user.getEmail())
                        .build())
                .collect(Collectors.toList());   // safer than .toList()
    }

    // 🔹 Edit Member
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public MemberResponse updateMember(
            @PathVariable UUID id,
            @RequestBody UpdateMemberRequest request) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(request.getName());
        userRepository.save(user);

        return MemberResponse.builder()
                .userid(user.getUserId())   // ✅ FIXED
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }
}