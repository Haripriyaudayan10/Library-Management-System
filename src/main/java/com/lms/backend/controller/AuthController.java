package com.lms.backend.controller;

import com.lms.backend.dto.LoginRequest;
import com.lms.backend.dto.LoginResponse;
import com.lms.backend.entity.User;
import com.lms.backend.repository.UserRepository;
import com.lms.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    // 🔐 LOGIN
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(user);

        return new LoginResponse(
                token,
                user.getUserId(),   // ✅ FIXED
                user.getName(),
                user.getRole()
        );
    }
}