package com.lms.backend.repository;

import com.lms.backend.entity.Reservation;
import com.lms.backend.enums.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByBook_BookIdAndStatusOrderByQueuePositionAsc(
            Long bookId,
            ReservationStatus status
    );

    Optional<Reservation> findFirstByBook_BookIdAndStatusOrderByQueuePositionAsc(
            Long bookId,
            ReservationStatus status
    );

    List<Reservation> findByUser_UserId(UUID userId);

    boolean existsByUser_UserIdAndBook_BookIdAndStatus(
            UUID userId,
            Long bookId,
            ReservationStatus status
    );

    // 🔥 ADD THESE

    long countByBook_BookIdAndStatus(Long bookId, ReservationStatus status);

    long countByUser_UserIdAndStatus(UUID userId, ReservationStatus status);
    long countByStatus(ReservationStatus status);

    List<Reservation> findByStatusAndExpiryDateBefore(ReservationStatus status, java.time.LocalDate date);

    List<Reservation> findByUser_UserIdAndStatus(UUID userId, ReservationStatus status);

    List<Reservation> findByBook_BookId(Long bookId);
}
