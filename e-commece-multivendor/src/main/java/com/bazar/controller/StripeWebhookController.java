package com.bazar.controller;

import com.bazar.domain.PaymentOrderStatus;
import com.bazar.domain.PlanType;
import com.bazar.model.PayementOrder;
import com.bazar.model.Seller;
import com.bazar.repository.PaymentOrderRepository;
import com.bazar.repository.SellerRepository;
import com.bazar.service.SubscriptionService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/webhook")
@RequiredArgsConstructor
public class StripeWebhookController {

    @Value("${stripe.webhook.secret}")
    private String endpointSecret;

    private final PaymentOrderRepository paymentOrderRepository;
    private final com.bazar.repository.OrderRepository orderRepository;
    private final SubscriptionService subscriptionService;
    private final SellerRepository sellerRepository;

    @PostMapping
    public String handle(@RequestHeader("Stripe-Signature") String sigHeader,
            @RequestBody String payload) {

        Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
        } catch (SignatureVerificationException e) {
            // invalid signature
            return "Invalid signature";
        }

        String type = event.getType();

        if ("checkout.session.completed".equals(type)) {
            // Safe deserializer approach: use dataObjectDeserializer
            Session session = (Session) event.getDataObjectDeserializer()
                    .getObject()
                    .orElse(null);

            if (session != null) {
                // Check if this is a subscription payment or product order
                String sellerId = (session.getMetadata() != null) ? session.getMetadata().get("sellerId") : null;
                String planName = (session.getMetadata() != null) ? session.getMetadata().get("planName") : null;

                // Handle subscription payment
                if (sellerId != null && planName != null) {
                    try {
                        Long sellerIdLong = Long.valueOf(sellerId);
                        Seller seller = sellerRepository.findById(sellerIdLong).orElse(null);

                        if (seller != null) {
                            // Determine plan type from plan name
                            PlanType planType = determinePlanType(planName);

                            // Upgrade subscription
                            subscriptionService.upgradeSubscription(seller, planType);

                            System.out.println(
                                    "Subscription upgraded for seller: " + seller.getEmail() + " to plan: " + planType);
                        }
                    } catch (NumberFormatException e) {
                        System.err.println("Invalid sellerId in subscription metadata: " + sellerId);
                    }
                } else {
                    // Handle product order payment
                    String paymentIntentId = session.getPaymentIntent();
                    String sessionId = session.getId();

                    // metadata contains our orderId
                    String orderIdStr = (session.getMetadata() != null) ? session.getMetadata().get("orderId") : null;

                    if (orderIdStr != null) {
                        try {
                            Long orderId = Long.valueOf(orderIdStr);
                            PayementOrder order = paymentOrderRepository.findById(orderId).orElse(null);
                            if (order != null) {
                                order.setPaymentId(paymentIntentId);
                                order.setPaymentLinkId(sessionId); // store session id too
                                order.setPaymentStatus(true);
                                order.setStatus(PaymentOrderStatus.PAID);
                                paymentOrderRepository.save(order);

                                // Update individual orders
                                for (com.bazar.model.Order o : order.getOrders()) {
                                    o.setPaymentStatus(com.bazar.domain.PaymentStatus.COMPLETED);
                                    o.setOrderStatus(com.bazar.domain.OrderStatus.CONFIRMED);
                                    o.getPaymentDetails().setPaymentMethod(order.getPaymentMethod().toString());
                                    orderRepository.save(o);
                                }
                            }
                        } catch (NumberFormatException ignored) {
                        }
                    } else {
                        // Optional: try to find by paymentIntentId if you stored it earlier
                        PayementOrder order = paymentOrderRepository.findByPaymentId(paymentIntentId);
                        if (order != null) {
                            order.setPaymentStatus(true);
                            order.setStatus(PaymentOrderStatus.PAID);
                            paymentOrderRepository.save(order);

                            // Update individual orders
                            for (com.bazar.model.Order o : order.getOrders()) {
                                o.setPaymentStatus(com.bazar.domain.PaymentStatus.COMPLETED);
                                o.setOrderStatus(com.bazar.domain.OrderStatus.CONFIRMED);
                                o.getPaymentDetails().setPaymentMethod(order.getPaymentMethod().toString());
                                orderRepository.save(o);
                            }
                        }
                    }
                }
            }
        }

        // Return 2xx to Stripe
        return "OK";
    }

    private PlanType determinePlanType(String planName) {
        // Map plan names to PlanType enum
        if (planName.toUpperCase().contains("BEGINNER") || planName.toUpperCase().contains("BASIC")) {
            return PlanType.BEGINNER;
        } else if (planName.toUpperCase().contains("INTERMEDIATE")) {
            return PlanType.INTERMEDIATE;
        } else if (planName.toUpperCase().contains("PRO") || planName.toUpperCase().contains("PROFESSIONAL")) {
            return PlanType.PRO;
        }
        // Default to FREE if unknown
        return PlanType.FREE;
    }
}
