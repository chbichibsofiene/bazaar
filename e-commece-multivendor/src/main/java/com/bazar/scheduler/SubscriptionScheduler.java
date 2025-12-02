package com.bazar.scheduler;

import com.bazar.domain.PlanType;
import com.bazar.model.SellerSubscription;
import com.bazar.model.SubscriptionPlan;
import com.bazar.repository.SellerSubscriptionRepository;
import com.bazar.repository.SubscriptionPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class SubscriptionScheduler {

    private final SellerSubscriptionRepository subscriptionRepository;
    private final SubscriptionPlanRepository planRepository;

    // Run every day at midnight
    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void checkSubscriptionExpiry() {
        List<SellerSubscription> subscriptions = subscriptionRepository.findAll();
        LocalDate today = LocalDate.now();

        SubscriptionPlan freePlan = planRepository.findByPlanType(PlanType.FREE)
                .orElseThrow(() -> new RuntimeException("Free plan not found"));

        for (SellerSubscription sub : subscriptions) {
            if (sub.getEndDate() != null && sub.getEndDate().isBefore(today) && sub.getPlanType() != PlanType.FREE) {
                // Downgrade to Free plan
                sub.setPlan(freePlan);
                sub.setPlanType(PlanType.FREE);
                sub.setStartDate(today);
                sub.setEndDate(today.plusYears(100)); // Free plan indefinite
                subscriptionRepository.save(sub);
                System.out.println("Downgraded subscription for seller: " + sub.getSeller().getId());
            }
        }
    }
}
