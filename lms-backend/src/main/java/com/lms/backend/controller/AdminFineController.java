package com.lms.backend.controller;

import com.lms.backend.entity.Fine;
import com.lms.backend.repository.FineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/fines")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminFineController {

    private final FineRepository fineRepository;

    // ========================================
    // GET FINES (WITH FILTERS)
    // ========================================
    @GetMapping
    public List<Fine> getFines(
            @RequestParam(required = false) Boolean paid,
            @RequestParam(required = false) UUID userId) {

        List<Fine> fines = fineRepository.findAll();

        // 🔎 Filter by paid status
        if (paid != null) {
            fines = fines.stream()
                    .filter(f -> f.isPaid() == paid)
                    .collect(Collectors.toList());
        }

        // 🔎 Filter by user
        if (userId != null) {
            fines = fines.stream()
                    .filter(f ->
                            f.getLoan() != null &&
                            f.getLoan().getUser() != null &&
                            f.getLoan().getUser().getUserId().equals(userId))
                    .collect(Collectors.toList());
        }

        return fines;
    }

    // ========================================
    // MARK FINE AS PAID (UPDATE RESOURCE)
    // ========================================
    @PutMapping("/{fineId}")
    public String markFineAsPaid(@PathVariable Long fineId) {

        Fine fine = fineRepository.findById(fineId)
                .orElseThrow(() -> new RuntimeException("Fine not found"));

        if (fine.isPaid()) {
            throw new RuntimeException("Fine already paid");
        }

        fine.setPaid(true);
        fine.setPaidDate(LocalDate.now());

        fineRepository.save(fine);

        return "Fine marked as paid successfully";
    }
}