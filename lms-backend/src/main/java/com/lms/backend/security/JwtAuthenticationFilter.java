package com.lms.backend.security;

import com.lms.backend.entity.User;
import com.lms.backend.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String ACCESS_COOKIE = "access_token";

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String token = readCookie(request, ACCESS_COOKIE);
        if (token != null && !token.isBlank()) {

            if (jwtUtil.validateToken(token)) {

                String username = jwtUtil.extractUsername(token);
                User user = userRepository.findByEmail(username).orElse(null);
                String roleFromDb = user == null ? jwtUtil.extractRole(token) : user.getRole();
                String normalizedRole = roleFromDb == null ? "" : roleFromDb.trim().toUpperCase();

                Set<String> authorityNames = new LinkedHashSet<>();
                if (!normalizedRole.isBlank()) {
                    authorityNames.add(normalizedRole);
                    if (normalizedRole.startsWith("ROLE_")) {
                        authorityNames.add(normalizedRole.substring(5));
                    } else {
                        authorityNames.add("ROLE_" + normalizedRole);
                    }
                }
                List<GrantedAuthority> authorities = new ArrayList<>();
                for (String authorityName : authorityNames) {
                    authorities.add(new SimpleGrantedAuthority(authorityName));
                }

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                username,
                                null,
                                authorities
                        );

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
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
