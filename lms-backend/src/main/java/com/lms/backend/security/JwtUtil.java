package com.lms.backend.security;

import com.lms.backend.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private final Key key;
    private final long accessTokenExpiryMs;

    public JwtUtil(
            @Value("${app.auth.jwt-secret:mySecretKeyForLmsApplication123456789123456}") String secret,
            @Value("${app.auth.access-token-minutes:15}") long accessTokenMinutes
    ) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
        this.accessTokenExpiryMs = accessTokenMinutes * 60_000L;
    }

    // 🔐 Generate Access Token
    public String generateAccessToken(User user) {
        String normalizedRole = user.getRole() == null ? "" : user.getRole().trim().toUpperCase();
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("role", normalizedRole)
                .claim("userId", user.getUserId().toString())   // ✅ FIXED
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + accessTokenExpiryMs))
                .signWith(key)
                .compact();
    }

    // 📌 Extract Username (email)
    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // 📌 Extract Role
    public String extractRole(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        String role = claims.get("role", String.class);
        return role == null ? "" : role.trim().toUpperCase();
    }

    // 📌 Extract UserId (NEW - Recommended)
    public String extractUserId(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.get("userId", String.class);
    }

    // ✅ Validate Token
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
