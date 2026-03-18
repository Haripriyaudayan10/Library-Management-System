package com.lms.backend.service;

import com.lms.backend.entity.RefreshToken;
import com.lms.backend.entity.User;
import com.lms.backend.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private static final SecureRandom RANDOM = new SecureRandom();

    @Value("${app.auth.refresh-token-days:14}")
    private long refreshTokenDays;

    @Transactional
    public RefreshToken createForUser(User user) {
        // Single active refresh token per user to simplify rotation and prevent reuse.
        refreshTokenRepository.deleteByUser_UserId(user.getUserId());

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setToken(generateOpaqueToken());
        refreshToken.setExpiryDate(Instant.now().plus(refreshTokenDays, ChronoUnit.DAYS));
        return refreshTokenRepository.save(refreshToken);
    }

    @Transactional
    public RefreshToken rotate(String oldToken) {
        RefreshToken existing = refreshTokenRepository.findByToken(oldToken)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));

        if (existing.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(existing);
            throw new RuntimeException("Refresh token expired");
        }

        User user = existing.getUser();
        // Ensure required user fields are initialized before transaction closes.
        user.getEmail();
        user.getName();
        user.getRole();
        user.getProfileImageUrl();
        user.getUserId();
        refreshTokenRepository.delete(existing);
        return createForUser(user);
    }

    @Transactional
    public void revokeByToken(String token) {
        if (token != null && !token.isBlank()) {
            refreshTokenRepository.deleteByToken(token);
        }
    }

    private String generateOpaqueToken() {
        byte[] randomBytes = new byte[64];
        RANDOM.nextBytes(randomBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }
}
