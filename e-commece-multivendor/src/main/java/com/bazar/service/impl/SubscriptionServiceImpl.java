package com.bazar.service.impl;

import com.bazar.domain.PlanType;
import com.bazar.model.Product;
import com.bazar.model.Seller;
import com.bazar.model.SellerSubscription;
import com.bazar.model.SubscriptionPlan;
import com.bazar.repository.ProductRepository;
import com.bazar.repository.SellerSubscriptionRepository;
import com.bazar.repository.SubscriptionPlanRepository;
import com.bazar.service.SubscriptionService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SubscriptionServiceImpl implements SubscriptionService {

    private final SubscriptionPlanRepository planRepository;
    private final SellerSubscriptionRepository subscriptionRepository;
    private final ProductRepository productRepository;

    @PostConstruct
    public void createDefaultPlans() {
        if (planRepository.count() == 0) {
            planRepository.save(SubscriptionPlan.builder()
                    .planType(PlanType.FREE)
                    .name("Free Plan")
                    .price(0)
                    .maxProducts(2)
                    .build());
            planRepository.save(SubscriptionPlan.builder()
                    .planType(PlanType.BEGINNER)
                    .name("Beginner Plan")
                    .price(1000) // $10.00
                    .maxProducts(10)
                    .build());
            planRepository.save(SubscriptionPlan.builder()
                    .planType(PlanType.INTERMEDIATE)
                    .name("Intermediate Plan")
                    .price(5000) // $50.00
                    .maxProducts(100)
                    .build());
            planRepository.save(SubscriptionPlan.builder()
                    .planType(PlanType.PRO)
                    .name("Pro Plan")
                    .price(10000) // $100.00
                    .maxProducts(null) // Unlimited
                    .build());
        }
    }

    @Override
    public List<SubscriptionPlan> getAllPlans() {
        return planRepository.findAll();
    }

    @Override
    public SellerSubscription getSellerSubscription(Seller seller) {
        return subscriptionRepository.findBySeller(seller)
                .orElseGet(() -> {
                    // Default to Free plan if no subscription exists
                    SubscriptionPlan freePlan = planRepository.findByPlanType(PlanType.FREE)
                            .orElseThrow(() -> new RuntimeException("Free plan not found"));

                    SellerSubscription newSubscription = SellerSubscription.builder()
                            .seller(seller)
                            .plan(freePlan)
                            .planType(PlanType.FREE)
                            .startDate(LocalDate.now())
                            .endDate(LocalDate.now().plusYears(100)) // Free plan effectively never expires
                            .build();
                    return subscriptionRepository.save(newSubscription);
                });
    }

    @Override
    public SellerSubscription upgradeSubscription(Seller seller, PlanType planType) {
        SellerSubscription subscription = getSellerSubscription(seller);
        SubscriptionPlan newPlan = planRepository.findByPlanType(planType)
                .orElseThrow(() -> new RuntimeException("Plan not found"));

        subscription.setPlan(newPlan);
        subscription.setPlanType(planType);
        subscription.setStartDate(LocalDate.now());
        subscription.setEndDate(LocalDate.now().plusMonths(1)); // Assuming monthly
        return subscriptionRepository.save(subscription);
    }

    @Override
    public boolean canAddProduct(Seller seller) {
        SellerSubscription subscription = getSellerSubscription(seller);
        if (subscription.getPlan().isUnlimited()) {
            return true;
        }

        // Count existing products
        // Assuming ProductRepository has a countBySeller method, if not we need to add
        // it or use findAll
        // For efficiency, countBySeller is better. Let's assume we might need to add
        // it.
        // Checking ProductRepository...
        long productCount = productRepository.countBySellerId(seller.getId());

        return productCount < subscription.getPlan().getMaxProducts();
    }
}
