package com.bazar.repository;

import com.bazar.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // Retourne le premier utilisateur trouvé pour un email donné (prévenir
    // NonUniqueResultException)
    User findByEmail(String email);

    // Search users by email or full name
    Page<User> findByEmailContainingOrFullNameContaining(String email, String fullName, Pageable pageable);
}
