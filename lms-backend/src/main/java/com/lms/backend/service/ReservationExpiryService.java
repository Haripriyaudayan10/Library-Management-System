package com.lms.backend.service;

import com.lms.backend.entity.Reservation;
import com.lms.backend.entity.Copy;
import com.lms.backend.enums.ReservationStatus;
import com.lms.backend.repository.CopyRepository;
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
    private final CopyRepository copyRepository;
    private final NotificationService notificationService;
    private final ReservationQueueService reservationQueueService;

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

                reservation.setStatus(ReservationStatus.CANCELLED);
                reservationRepository.save(reservation);

                Copy reservedCopy = copyRepository
                        .findFirstByBook_BookIdAndStatusOrderByCopyidAsc(
                                reservation.getBook().getBookId(),
                                "RESERVED")
                        .orElse(null);
                if (reservedCopy != null) {
                    reservedCopy.setStatus("AVAILABLE");
                    copyRepository.save(reservedCopy);
                }

                notificationService.notifyUser(
                        reservation.getUser(),
                        "Reservation Cancelled",
                        "Your reservation for \"" + reservation.getBook().getTitle()
                                + "\" expired because pickup was not completed within 3 days."
                );

                List<Reservation> waitingReservations = reservationRepository
                        .findByBook_BookIdAndStatusOrderByQueuePositionAsc(
                                reservation.getBook().getBookId(),
                                ReservationStatus.WAITING
                        );

                if (!waitingReservations.isEmpty()) {
                    Reservation nextReservation = waitingReservations.get(0);
                    nextReservation.setStatus(ReservationStatus.READY_FOR_PICKUP);
                    nextReservation.setExpiryDate(LocalDate.now().plusDays(3));
                    reservationRepository.save(nextReservation);

                    Copy nextCopy = copyRepository
                            .findFirstByBook_BookIdAndStatusOrderByCopyidAsc(
                                    reservation.getBook().getBookId(),
                                    "AVAILABLE")
                            .orElse(null);
                    if (nextCopy != null) {
                        nextCopy.setStatus("RESERVED");
                        copyRepository.save(nextCopy);
                    }

                    notificationService.notifyUser(
                            nextReservation.getUser(),
                            "Book Ready for Pickup",
                            "\"" + nextReservation.getBook().getTitle()
                                    + "\" is now available. Please pick it up within 3 days."
                    );
                }

                reservationQueueService.recomputeQueuePositions(reservation.getBook().getBookId());
            }
        }
    }
}
