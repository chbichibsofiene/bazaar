package com.bazar.repository;

import com.bazar.domain.AccountStatus;
import com.bazar.model.Seller;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SellerRepository extends JpaRepository<Seller, Long> {
    Seller findByEmail(String actualUsername);

    List<Seller> findByAccountStatus(AccountStatus status);

    // Search sellers by name or email
    Page<Seller> findBySellerNameContainingOrEmailContaining(String sellerName, String email, Pageable pageable);

    // Filter by status with pagination
    Page<Seller> findByAccountStatus(AccountStatus status, Pageable pageable);
}
