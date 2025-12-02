package com.bazar.repository;

import com.bazar.model.Seller;
import com.bazar.model.SellerSubscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SellerSubscriptionRepository extends JpaRepository<SellerSubscription, Long> {
    Optional<SellerSubscription> findBySeller(Seller seller);

    Optional<SellerSubscription> findByStripeSubscriptionId(String stripeSubscriptionId);
}
