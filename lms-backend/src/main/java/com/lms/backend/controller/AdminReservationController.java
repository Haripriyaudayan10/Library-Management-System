package com.lms.backend.controller;

import com.lms.backend.dto.ReservationDetailsDTO;
import com.lms.backend.entity.Copy;
import com.lms.backend.entity.Reservation;
import com.lms.backend.enums.ReservationStatus;
import com.lms.backend.repository.CopyRepository;
import com.lms.backend.repository.ReservationRepository;
import com.lms.backend.service.NotificationService;
import com.lms.backend.service.ReservationQueueService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/reservations")
@RequiredArgsConstructor
public class AdminReservationController {

    private final ReservationRepository reservationRepository;
    private final CopyRepository copyRepository;
    private final NotificationService notificationService;
    private final ReservationQueueService reservationQueueService;

    // ======================================================
    // GET RESERVATIONS (WITH FILTERS)
    // ======================================================
    @GetMapping
    public List<ReservationDetailsDTO> getReservations(

            @RequestParam(required = false) Long reservationId,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String bookTitle,
            @RequestParam(required = false) String status) {

        return reservationRepository.findAll()
                .stream()

                // filter by reservation id
                .filter(res ->
                        reservationId == null ||
                        res.getReservationId().equals(reservationId))

                // filter by username
                .filter(res ->
                        username == null ||
                        res.getUser().getName().equalsIgnoreCase(username))

                // filter by book
                .filter(res ->
                        bookTitle == null ||
                        res.getBook().getTitle().equalsIgnoreCase(bookTitle))

                // filter by status
                .filter(res ->
                        status == null ||
                        res.getStatus().name().equalsIgnoreCase(status))

                .map(res -> {

                    ReservationDetailsDTO dto = new ReservationDetailsDTO();

                    dto.setReservationId(res.getReservationId());
                    dto.setUserId(res.getUser().getUserId());
                    dto.setUserName(res.getUser().getName());
                    dto.setUserProfileImageUrl(res.getUser().getProfileImageUrl());
                    dto.setBookId(res.getBook().getBookId());
                    dto.setBookTitle(res.getBook().getTitle());
                    dto.setReservationDate(res.getReservationDate());
                    dto.setStatus(res.getStatus().name());

                    return dto;
                })

                .toList();
    }

    // ======================================================
    // UPDATE RESERVATION STATUS (FILTERS)
    // ======================================================
    @PutMapping
    public String updateReservationStatus(

            @RequestParam(required = false) Long reservationId,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String bookTitle) {

        Reservation reservation = reservationRepository.findAll()
                .stream()

                .filter(res ->
                        reservationId == null ||
                        res.getReservationId().equals(reservationId))

                .filter(res ->
                        username == null ||
                        res.getUser().getName().equalsIgnoreCase(username))

                .filter(res ->
                        bookTitle == null ||
                        res.getBook().getTitle().equalsIgnoreCase(bookTitle))

                .findFirst()

                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        if (reservation.getStatus() != ReservationStatus.WAITING) {
            throw new RuntimeException("Only WAITING reservations can be marked READY");
        }

        Copy reservableCopy = copyRepository
                .findFirstByBook_BookIdAndStatusOrderByCopyidAsc(
                        reservation.getBook().getBookId(),
                        "AVAILABLE"
                )
                .orElseThrow(() -> new RuntimeException("No available copy to reserve"));

        reservation.setStatus(ReservationStatus.READY_FOR_PICKUP);
        reservation.setExpiryDate(java.time.LocalDate.now().plusDays(3));

        reservationRepository.save(reservation);
        reservableCopy.setStatus("RESERVED");
        copyRepository.save(reservableCopy);
        reservationQueueService.recomputeQueuePositions(reservation.getBook().getBookId());

        return "Reservation marked as READY_FOR_PICKUP";
    }

    // ======================================================
    // DELETE / CANCEL RESERVATION (FILTERS)
    // ======================================================
    @DeleteMapping
    public String cancelReservation(

            @RequestParam(required = false) Long reservationId,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String bookTitle) {

        Reservation reservation = reservationRepository.findAll()
                .stream()

                .filter(res ->
                        reservationId == null ||
                        res.getReservationId().equals(reservationId))

                .filter(res ->
                        username == null ||
                        res.getUser().getName().equalsIgnoreCase(username))

                .filter(res ->
                        bookTitle == null ||
                        res.getBook().getTitle().equalsIgnoreCase(bookTitle))

                .findFirst()

                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        if (reservation.getStatus() == ReservationStatus.COMPLETED) {
            throw new RuntimeException("Cannot cancel completed reservation");
        }

        if (reservation.getStatus() == ReservationStatus.READY_FOR_PICKUP) {
            Copy reservedCopy = copyRepository
                    .findFirstByBook_BookIdAndStatusOrderByCopyidAsc(
                            reservation.getBook().getBookId(),
                            "RESERVED"
                    )
                    .orElse(null);
            if (reservedCopy != null) {
                reservedCopy.setStatus("AVAILABLE");
                copyRepository.save(reservedCopy);
            }
        }

        reservation.setStatus(ReservationStatus.CANCELLED);

        reservationRepository.save(reservation);

        if (reservation.getStatus() != ReservationStatus.COMPLETED) {
            List<Reservation> waitingReservations = reservationRepository
                    .findByBook_BookIdAndStatusOrderByQueuePositionAsc(
                            reservation.getBook().getBookId(),
                            ReservationStatus.WAITING
                    );

            if (!waitingReservations.isEmpty()) {
                Reservation nextReservation = waitingReservations.get(0);
                nextReservation.setStatus(ReservationStatus.READY_FOR_PICKUP);
                nextReservation.setExpiryDate(java.time.LocalDate.now().plusDays(3));
                reservationRepository.save(nextReservation);

                Copy nextCopy = copyRepository
                        .findFirstByBook_BookIdAndStatusOrderByCopyidAsc(
                                reservation.getBook().getBookId(),
                                "AVAILABLE"
                        )
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
        }

        reservationQueueService.recomputeQueuePositions(reservation.getBook().getBookId());

        return "Reservation cancelled successfully";
    }
}
