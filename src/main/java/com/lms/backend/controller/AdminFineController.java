package com.lms.backend.controller;

import com.lms.backend.entity.Fine;
import com.lms.backend.repository.FineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/admin/fines")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminFineController {

    private final FineRepository fineRepository;

    // ========================================
    // GET ALL FINES
    // ========================================
    @GetMapping
    public List<Fine> getAllFines() {
        return fineRepository.findAll();
    }

    // ========================================
    // GET UNPAID FINES
    // ========================================
    @GetMapping("/unpaid")
    public List<Fine> getUnpaidFines() {
        return fineRepository.findByPaid(false);
    }

    // ========================================
    // MARK FINE AS PAID
    // ========================================
    @PutMapping("/pay/{fineId}")
    public String markFineAsPaid(@PathVariable Long fineId) {

        Fine fine = fineRepository.findById(fineId)
                .orElseThrow(() -> new RuntimeException("Fine not found"));

        fine.setPaid(true);
        fine.setPaidDate(LocalDate.now());

        fineRepository.save(fine);

        return "Fine marked as paid successfully";
    }
}