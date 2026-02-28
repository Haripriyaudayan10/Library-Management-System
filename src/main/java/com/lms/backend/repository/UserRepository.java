package com.lms.backend.repository;

import com.lms.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    List<User> findByRole(String role);   // REQUIRED

    long countByRole(String role);        // REQUIRED
}