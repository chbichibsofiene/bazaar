package com.bazar.service.impl;

import com.bazar.domain.PaymentOrderStatus;
import com.bazar.model.Order;
import com.bazar.model.PayementOrder;
import com.bazar.model.User;
import com.bazar.repository.PaymentOrderRepository;
import com.bazar.service.PaymentService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentOrderRepository paymentOrderRepository;

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @Value("${frontend.success.url}")
    private String successUrl;

    @Value("${frontend.cancel.url}")
    private String cancelUrl;

    /**
     * createOrder remains the same: saves a PayementOrder (status=PENDING)
     */
    @Override
    public PayementOrder createOrder(User user, Set<Order> orders) {
        Long amount = orders.stream().mapToLong(Order::getTotalSellingPrice).sum();
        PayementOrder payOrder = new PayementOrder();
        payOrder.setAmount(amount);
        payOrder.setUser(user);
        payOrder.setOrders(orders);
        payOrder.setPaymentStatus(false);
        payOrder.setStatus(PaymentOrderStatus.PENDING);
        return paymentOrderRepository.save(payOrder);
    }

    @Override
    public PayementOrder getPaymentOrderById(Long orderId) {
        return paymentOrderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    @Override
    public PayementOrder getPaymentOderByPaymentId(String paymentId) throws Exception {
        PayementOrder order = paymentOrderRepository.findByPaymentLinkId(paymentId);
        if (order == null)
            throw new Exception("Payment order not found");
        return order;
    }

    @Override
    public Boolean ProceedPaymentOrder(PayementOrder payOrder, String paymentId, String paymentLinkId) {
        payOrder.setPaymentId(paymentId);
        payOrder.setPaymentLinkId(paymentLinkId);
        payOrder.setPaymentStatus(true);
        payOrder.setStatus(PaymentOrderStatus.PAID);
        paymentOrderRepository.save(payOrder);
        return true;
    }

    /**
     * Create a Stripe Checkout Session and return the redirect URL
     */
    @Override
    public String createStripePaymentLink(User user, Long amount, Long orderId) {
        // set key
        Stripe.apiKey = stripeSecretKey;

        try {
            // Stripe needs amount in cents
            Long unitAmount = amount * 100;

            SessionCreateParams.LineItem.PriceData.ProductData productData = SessionCreateParams.LineItem.PriceData.ProductData
                    .builder()
                    .setName("Order #" + orderId)
                    .build();

            SessionCreateParams.LineItem.PriceData priceData = SessionCreateParams.LineItem.PriceData.builder()
                    .setCurrency("usd")
                    .setUnitAmount(unitAmount)
                    .setProductData(productData)
                    .build();

            SessionCreateParams.LineItem lineItem = SessionCreateParams.LineItem.builder()
                    .setQuantity(1L)
                    .setPriceData(priceData)
                    .build();

            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl(successUrl + "?orderId=" + orderId + "&session_id={CHECKOUT_SESSION_ID}")
                    .setCancelUrl(cancelUrl + "?orderId=" + orderId)
                    .addLineItem(lineItem)
                    // attach orderId to metadata so webhook can find the DB order
                    .putMetadata("orderId", String.valueOf(orderId))
                    .build();

            Session session = Session.create(params);

            // Save session id or keep paymentLinkId in DB for tracing if you want
            PayementOrder order = paymentOrderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found"));
            order.setPaymentLinkId(session.getId()); // store Checkout Session id
            paymentOrderRepository.save(order);

            // return the URL to redirect the user to
            return session.getUrl();

        } catch (StripeException e) {
            System.err.println("Stripe API Error: " + e.getMessage());
            System.err.println("Stripe Error Code: " + e.getCode());
            System.err.println("Stripe Request ID: " + e.getRequestId());
            e.printStackTrace();
            throw new RuntimeException("Stripe error: " + e.getMessage() + " (Code: " + e.getCode() + ")", e);
        } catch (Exception e) {
            System.err.println("Unexpected error creating Stripe payment: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to create Stripe payment link: " + e.getMessage(), e);
        }
    }
}
