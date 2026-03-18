package com.lms.backend.service;

import com.lms.backend.entity.Loan;
import com.lms.backend.entity.Reservation;
import com.lms.backend.entity.Copy;
import com.lms.backend.enums.LoanStatus;
import com.lms.backend.enums.ReservationStatus;
import com.lms.backend.repository.CopyRepository;
import com.lms.backend.repository.LoanRepository;
import com.lms.backend.repository.NotificationRepository;
import com.lms.backend.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationSchedulerService {

    private final LoanRepository loanRepository;
    private final CopyRepository copyRepository;
    private final ReservationRepository reservationRepository;
    private final NotificationRepository notificationRepository;
    private final NotificationService notificationService;
    private final ReservationQueueService reservationQueueService;

    // Runs daily at 08:00 to process reminder/overdue/expiry workflows.
    @Scheduled(cron = "0 0 8 * * *")
    public void runDailyNotificationJobs() {
        sendApproachingDueDateNotifications();
        sendOverdueNotifications();
        processExpiredReadyReservations();
    }

    private void sendApproachingDueDateNotifications() {
        LocalDate targetDueDate = LocalDate.now().plusDays(1);
        List<Loan> loans = loanRepository.findByStatusInAndDueDate(
                List.of(LoanStatus.ACTIVE, LoanStatus.REISSUED),
                targetDueDate
        );

        for (Loan loan : loans) {
            String title = "Approaching Due Date";
            String message = "Loan #" + loan.getLoanId() + " for \"" +
                    loan.getCopy().getBook().getTitle() +
                    "\" is due on " + loan.getDueDate() + ".";

            boolean alreadySentToday = notificationRepository
                    .existsByUser_UserIdAndTitleAndMessageAndCreatedAtAfter(
                            loan.getUser().getUserId(),
                            title,
                            message,
                            LocalDate.now().atStartOfDay()
                    );
            if (!alreadySentToday) {
                notificationService.notifyUser(loan.getUser(), title, message);
            }
        }
    }

    private void sendOverdueNotifications() {
        LocalDate overdueSince = LocalDate.now().minusDays(1);
        List<Loan> loans = loanRepository.findByStatusInAndDueDate(
                List.of(LoanStatus.ACTIVE, LoanStatus.REISSUED),
                overdueSince
        );

        for (Loan loan : loans) {
            String title = "Overdue Notice";
            String message = "Loan #" + loan.getLoanId() + " for \"" +
                    loan.getCopy().getBook().getTitle() +
                    "\" is overdue from " + loan.getDueDate() + ".";

            boolean alreadySent = notificationRepository
                    .existsByUser_UserIdAndTitleAndMessageAndCreatedAtAfter(
                            loan.getUser().getUserId(),
                            title,
                            message,
                            LocalDateTime.now().minusDays(30)
                    );
            if (!alreadySent) {
                notificationService.notifyUser(loan.getUser(), title, message);
            }
        }
    }

    private void processExpiredReadyReservations() {
        List<Reservation> expiredReadyReservations = reservationRepository
                .findByStatusAndExpiryDateBefore(
                        ReservationStatus.READY_FOR_PICKUP,
                        LocalDate.now()
                );

        for (Reservation expiredReservation : expiredReadyReservations) {
            expiredReservation.setStatus(ReservationStatus.CANCELLED);
            reservationRepository.save(expiredReservation);

            Copy reservedCopy = copyRepository
                    .findFirstByBook_BookIdAndStatusOrderByCopyidAsc(
                            expiredReservation.getBook().getBookId(),
                            "RESERVED")
                    .orElse(null);
            if (reservedCopy != null) {
                reservedCopy.setStatus("AVAILABLE");
                copyRepository.save(reservedCopy);
            }

            notificationService.notifyUser(
                    expiredReservation.getUser(),
                    "Reservation Cancelled",
                    "Your reservation for \"" + expiredReservation.getBook().getTitle() +
                            "\" expired because pickup was not completed within 3 days."
            );

            List<Reservation> waitingReservations = reservationRepository
                    .findByBook_BookIdAndStatusOrderByQueuePositionAsc(
                            expiredReservation.getBook().getBookId(),
                            ReservationStatus.WAITING
                    );

            if (!waitingReservations.isEmpty()) {
                Reservation nextReservation = waitingReservations.get(0);
                nextReservation.setStatus(ReservationStatus.READY_FOR_PICKUP);
                nextReservation.setExpiryDate(LocalDate.now().plusDays(3));
                reservationRepository.save(nextReservation);

                Copy nextCopy = copyRepository
                        .findFirstByBook_BookIdAndStatusOrderByCopyidAsc(
                                expiredReservation.getBook().getBookId(),
                                "AVAILABLE")
                        .orElse(null);
                if (nextCopy != null) {
                    nextCopy.setStatus("RESERVED");
                    copyRepository.save(nextCopy);
                }

                notificationService.notifyUser(
                        nextReservation.getUser(),
                        "Book Ready for Pickup",
                        "\"" + nextReservation.getBook().getTitle() +
                                "\" is now available. Please pick it up within 3 days."
                );
            }

            reservationQueueService.recomputeQueuePositions(expiredReservation.getBook().getBookId());
        }
    }
}
