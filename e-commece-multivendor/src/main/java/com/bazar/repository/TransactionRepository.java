package com.bazar.repository;

import com.bazar.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findBySellerId(Long sellerId);

    List<Transaction> findByOrderId(Long orderId);
}
