package com.lms.backend.controller;

import com.lms.backend.dto.LoginRequest;
import com.lms.backend.dto.LoginResponse;
import com.lms.backend.entity.RefreshToken;
import com.lms.backend.entity.User;
import com.lms.backend.repository.UserRepository;
import com.lms.backend.security.JwtUtil;
import com.lms.backend.service.RefreshTokenService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;

    @Value("${app.auth.access-token-minutes:15}")
    private long accessTokenMinutes;

    @Value("${app.auth.refresh-token-days:14}")
    private long refreshTokenDays;

    @Value("${app.auth.cookie.secure:false}")
    private boolean cookieSecure;

    @Value("${app.auth.cookie.same-site:Lax}")
    private String sameSite;

    private static final String ACCESS_COOKIE = "access_token";
    private static final String REFRESH_COOKIE = "refresh_token";

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request,
            HttpServletResponse response
    ) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String accessToken = jwtUtil.generateAccessToken(user);
        RefreshToken refreshToken = refreshTokenService.createForUser(user);

        addCookie(response, ACCESS_COOKIE, accessToken, Duration.ofMinutes(accessTokenMinutes));
        addCookie(response, REFRESH_COOKIE, refreshToken.getToken(), Duration.ofDays(refreshTokenDays));

        return ResponseEntity.ok(new LoginResponse(
                user.getUserId(),   // ✅ FIXED
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getProfileImageUrl()
        ));
    }

    @GetMapping("/me")
    public ResponseEntity<LoginResponse> me(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(new LoginResponse(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getProfileImageUrl()
        ));
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refresh(
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        String refreshTokenCookie = readCookie(request, REFRESH_COOKIE);
        if (refreshTokenCookie == null || refreshTokenCookie.isBlank()) {
            clearAuthCookies(response);
            return ResponseEntity.status(401).build();
        }

        try {
            RefreshToken rotated = refreshTokenService.rotate(refreshTokenCookie);
            User user = rotated.getUser();
            String newAccessToken = jwtUtil.generateAccessToken(user);

            addCookie(response, ACCESS_COOKIE, newAccessToken, Duration.ofMinutes(accessTokenMinutes));
            addCookie(response, REFRESH_COOKIE, rotated.getToken(), Duration.ofDays(refreshTokenDays));

            return ResponseEntity.ok(new LoginResponse(
                    user.getUserId(),
                    user.getName(),
                    user.getEmail(),
                    user.getRole(),
                    user.getProfileImageUrl()
            ));
        } catch (Exception ex) {
            clearAuthCookies(response);
            return ResponseEntity.status(401).build();
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        String refreshTokenCookie = readCookie(request, REFRESH_COOKIE);
        refreshTokenService.revokeByToken(refreshTokenCookie);
        clearAuthCookies(response);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/csrf")
    public ResponseEntity<Void> csrf(
            HttpServletRequest request,
            HttpServletResponse response,
            CsrfToken token
    ) {
        // Explicitly issue a CSRF cookie for SPA clients before first mutating call.
        CsrfTokenRepository repo = CookieCsrfTokenRepository.withHttpOnlyFalse();
        CsrfToken csrfToken = token != null ? token : repo.generateToken(request);
        repo.saveToken(csrfToken, request, response);
        return ResponseEntity.noContent().build();
    }

    private void addCookie(HttpServletResponse response, String name, String value, Duration maxAge) {
        ResponseCookie cookie = ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite(sameSite)
                .path("/")
                .maxAge(maxAge)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private void clearCookie(HttpServletResponse response, String name) {
        ResponseCookie cookie = ResponseCookie.from(name, "")
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite(sameSite)
                .path("/")
                .maxAge(0)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private void clearAuthCookies(HttpServletResponse response) {
        clearCookie(response, ACCESS_COOKIE);
        clearCookie(response, REFRESH_COOKIE);
    }

    private String readCookie(HttpServletRequest request, String name) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) return null;
        for (Cookie cookie : cookies) {
            if (name.equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }
}
