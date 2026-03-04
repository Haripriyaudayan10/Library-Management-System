package com.lms.backend.controller;

import com.lms.backend.dto.ReservationDetailsDTO;
import com.lms.backend.entity.Reservation;
import com.lms.backend.enums.ReservationStatus;
import com.lms.backend.repository.ReservationRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/reservations")
@RequiredArgsConstructor
public class AdminReservationController {

    private final ReservationRepository reservationRepository;

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

        reservation.setStatus(ReservationStatus.READY_FOR_PICKUP);

        reservationRepository.save(reservation);

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

        reservation.setStatus(ReservationStatus.CANCELLED);

        reservationRepository.save(reservation);

        return "Reservation cancelled successfully";
    }
}