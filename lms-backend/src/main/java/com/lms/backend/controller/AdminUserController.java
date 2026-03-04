package com.lms.backend.controller;

import com.lms.backend.dto.*;
import com.lms.backend.entity.User;
import com.lms.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminUserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // ============================================
    // CREATE USER
    // ============================================
    @PostMapping
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
                .userid(user.getUserId())
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }

    // ============================================
    // GET USERS (SEARCH + FILTER + PAGINATION)
    // ============================================
    @GetMapping
    public Page<MemberResponse> getUsers(

            @RequestParam(required = false) UUID userId,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String role,

            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);

        Page<User> userPage = userRepository.findAll(pageable);

        List<MemberResponse> filtered = userPage.getContent()
                .stream()

                // Filter by userId
                .filter(user ->
                        userId == null ||
                        user.getUserId().equals(userId))

                // Search by username (partial match)
                .filter(user ->
                        name == null ||
                        user.getName().toLowerCase().contains(name.toLowerCase()))

                // Search by email
                .filter(user ->
                        email == null ||
                        user.getEmail().toLowerCase().contains(email.toLowerCase()))

                // Filter by role
                .filter(user ->
                        role == null ||
                        user.getRole().equalsIgnoreCase(role))

                .map(user -> MemberResponse.builder()
                        .userid(user.getUserId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .build())

                .toList();

        return new PageImpl<>(filtered, pageable, userPage.getTotalElements());
    }

    // ============================================
    // UPDATE USER
    // ============================================
    @PutMapping
public MemberResponse updateMember(

        @RequestParam(required = false) UUID userId,
        @RequestParam(required = false) String username,
        @RequestBody UpdateMemberRequest request) {

    User user;

    if (userId != null) {

        user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

    } else if (username != null) {

        user = userRepository.findByNameIgnoreCase(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

    } else {
        throw new RuntimeException("Provide userId or username");
    }

    if (request.getName() != null) {
        user.setName(request.getName());
    }

    userRepository.save(user);

    return MemberResponse.builder()
            .userid(user.getUserId())
            .name(user.getName())
            .email(user.getEmail())
            .build();
}

    // ============================================
    // DELETE USER
    // ============================================
    @DeleteMapping
public String deleteMember(

        @RequestParam(required = false) UUID userId,
        @RequestParam(required = false) String username) {

    User user;

    if (userId != null) {

        user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

    } else if (username != null) {

        user = userRepository.findByNameIgnoreCase(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

    } else {
        throw new RuntimeException("Provide userId or username");
    }

    if (!"MEMBER".equalsIgnoreCase(user.getRole())) {
        throw new RuntimeException("Only members can be deleted");
    }

    userRepository.delete(user);

    return "Member deleted successfully";
}
}