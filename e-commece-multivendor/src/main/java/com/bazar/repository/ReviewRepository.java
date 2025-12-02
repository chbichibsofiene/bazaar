package com.bazar.repository;

import com.bazar.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProductId(Long productId);

    Optional<Review> findByProduct_IdAndUser_Id(Long productId, Long userId);
}
