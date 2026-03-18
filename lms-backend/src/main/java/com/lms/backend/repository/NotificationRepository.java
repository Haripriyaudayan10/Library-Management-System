package com.lms.backend.repository;

import com.lms.backend.entity.Notification;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    List<Notification> findByUser_UserIdOrderByCreatedAtDesc(UUID userId);

    boolean existsByUser_UserIdAndTitleAndMessageAndCreatedAtAfter(
            UUID userId,
            String title,
            String message,
            LocalDateTime createdAt
    );

    List<Notification> findByUser_UserIdAndIsReadFalse(UUID userId);

    @Modifying
    @Query("update Notification n set n.isRead = true where n.user.userId = :userId and n.isRead = false")
    int markAllAsReadByUserId(@Param("userId") UUID userId);
}
