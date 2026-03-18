package com.lms.backend.service;

import com.lms.backend.entity.Reservation;
import com.lms.backend.enums.ReservationStatus;
import com.lms.backend.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationQueueService {

    private final ReservationRepository reservationRepository;

    public void recomputeQueuePositions(Long bookId) {
        List<Reservation> queueReservations = reservationRepository.findByBook_BookId(bookId)
                .stream()
                .filter(reservation ->
                        reservation.getStatus() == ReservationStatus.READY_FOR_PICKUP
                                || reservation.getStatus() == ReservationStatus.WAITING
                )
                .sorted(Comparator
                        .comparingInt((Reservation reservation) ->
                                reservation.getStatus() == ReservationStatus.READY_FOR_PICKUP ? 0 : 1)
                        .thenComparingInt(Reservation::getQueuePosition)
                        .thenComparing(Reservation::getReservationDate)
                        .thenComparing(Reservation::getReservationId))
                .toList();

        int nextPosition = 1;
        for (Reservation reservation : queueReservations) {
            if (reservation.getQueuePosition() != nextPosition) {
                reservation.setQueuePosition(nextPosition);
                reservationRepository.save(reservation);
            }
            nextPosition += 1;
        }
    }
}
