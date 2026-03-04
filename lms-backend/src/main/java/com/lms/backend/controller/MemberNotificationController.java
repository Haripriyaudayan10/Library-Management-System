package com.lms.backend.controller;

import com.lms.backend.dto.NotificationDTO;
import com.lms.backend.entity.Notification;
import com.lms.backend.entity.User;
import com.lms.backend.repository.NotificationRepository;
import com.lms.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/member/notifications")
@RequiredArgsConstructor
public class MemberNotificationController {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @GetMapping
    public List<NotificationDTO> getAllNotifications() {

        // Get logged-in user's email from JWT
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return notificationRepository
                .findByUser_UserIdOrderByCreatedAtDesc(user.getUserId())
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    private NotificationDTO convertToDTO(Notification notification) {

        NotificationDTO dto = new NotificationDTO();
        dto.setId(notification.getId());
        dto.setTitle(notification.getTitle());
        dto.setMessage(notification.getMessage());
        dto.setRead(notification.isRead());
        dto.setCreatedAt(notification.getCreatedAt());

        return dto;
    }
}