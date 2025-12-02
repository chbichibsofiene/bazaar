package com.bazar.controller;

import com.bazar.domain.PlanType;
import com.bazar.model.Seller;
import com.bazar.model.SellerSubscription;
import com.bazar.model.SubscriptionPlan;
import com.bazar.service.SellerService;
import com.bazar.service.StripeService;
import com.bazar.service.SubscriptionService;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/seller/subscription")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;
    private final StripeService stripeService;
    private final SellerService sellerService;

    @GetMapping("/plans")
    public ResponseEntity<List<SubscriptionPlan>> getAllPlans() {
        return ResponseEntity.ok(subscriptionService.getAllPlans());
    }

    @GetMapping("/current")
    public ResponseEntity<SellerSubscription> getCurrentSubscription(@RequestHeader("Authorization") String jwt)
            throws Exception {
        Seller seller = sellerService.getSellerProfile(jwt);
        return ResponseEntity.ok(subscriptionService.getSellerSubscription(seller));
    }

    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribe(@RequestHeader("Authorization") String jwt,
            @RequestBody Map<String, String> request) throws Exception {
        Seller seller = sellerService.getSellerProfile(jwt);
        String planName = request.get("planName");
        PlanType planType = PlanType.valueOf(request.get("planType"));
        long price = Long.parseLong(request.get("price"));

        if (planType == PlanType.FREE) {
            return ResponseEntity.ok(subscriptionService.upgradeSubscription(seller, PlanType.FREE));
        }

        try {
            Session session = stripeService.createSubscriptionSession(seller, planName, price);
            return ResponseEntity.ok(Map.of("url", session.getUrl()));
        } catch (StripeException e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/verify-payment")
    public ResponseEntity<?> verifyPayment(@RequestHeader("Authorization") String jwt,
            @RequestBody Map<String, String> request) throws Exception {
        Seller seller = sellerService.getSellerProfile(jwt);
        String sessionId = request.get("sessionId");

        try {
            // Retrieve session from Stripe
            Session session = stripeService.retrieveSession(sessionId);

            // Check if payment was successful
            if ("complete".equals(session.getStatus()) || "paid".equals(session.getPaymentStatus())) {
                // Get metadata
                String planName = session.getMetadata().get("planName");

                if (planName != null) {
                    // Determine plan type
                    PlanType planType = determinePlanType(planName);

                    // Upgrade subscription
                    SellerSubscription subscription = subscriptionService.upgradeSubscription(seller, planType);

                    return ResponseEntity.ok(Map.of(
                            "success", true,
                            "message", "Subscription upgraded successfully",
                            "subscription", subscription));
                }
            }

            return ResponseEntity.status(400).body(Map.of("error", "Payment not completed"));
        } catch (StripeException e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    private PlanType determinePlanType(String planName) {
        if (planName.toUpperCase().contains("BEGINNER") || planName.toUpperCase().contains("BASIC")) {
            return PlanType.BEGINNER;
        } else if (planName.toUpperCase().contains("INTERMEDIATE")) {
            return PlanType.INTERMEDIATE;
        } else if (planName.toUpperCase().contains("PRO") || planName.toUpperCase().contains("PROFESSIONAL")) {
            return PlanType.PRO;
        }
        return PlanType.FREE;
    }
}
