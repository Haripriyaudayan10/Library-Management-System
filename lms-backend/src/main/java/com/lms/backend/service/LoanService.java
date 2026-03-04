package com.lms.backend.service;

import com.lms.backend.entity.Loan;
import com.lms.backend.repository.LoanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LoanService {

    private final LoanRepository loanRepository;

    public List<Loan> getAllLoans() {
        return loanRepository.findAll();
    }

    public Loan getLoanById(Long loanId) {
        return loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));
    }

    public Loan saveLoan(Loan loan) {
        return loanRepository.save(loan);
    }

    public void deleteLoan(Long loanId) {
        Loan loan = getLoanById(loanId);
        loanRepository.delete(loan);
    }

    public Loan updateLoan(Long loanId, Loan updatedLoan) {
        Loan existingLoan = getLoanById(loanId);

        existingLoan.setDueDate(updatedLoan.getDueDate());
        // add more fields if needed

        return loanRepository.save(existingLoan);
    }
}