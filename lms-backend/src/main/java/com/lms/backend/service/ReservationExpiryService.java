package com.lms.backend.service;

import com.lms.backend.entity.Reservation;
import com.lms.backend.enums.ReservationStatus;
import com.lms.backend.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationExpiryService {

    private final ReservationRepository reservationRepository;

    @Scheduled(cron = "0 0 0 * * ?") // Every day at midnight
    public void checkExpiredReservations() {

        List<Reservation> readyReservations =
                reservationRepository.findAll()
                        .stream()
                        .filter(r -> r.getStatus() == ReservationStatus.READY_FOR_PICKUP)
                        .collect(Collectors.toList());

        for (Reservation reservation : readyReservations) {

            if (reservation.getExpiryDate() != null &&
                reservation.getExpiryDate().isBefore(LocalDate.now())) {

                reservation.setStatus(ReservationStatus.EXPIRED);
                reservationRepository.save(reservation);

                System.out.println("Reservation expired for user: "
                        + reservation.getUser().getEmail());
            }
        }
    }
}