package com.bazar.repository;

import com.bazar.domain.PlanType;
import com.bazar.model.SubscriptionPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SubscriptionPlanRepository extends JpaRepository<SubscriptionPlan, Long> {
    Optional<SubscriptionPlan> findByPlanType(PlanType planType);
}
