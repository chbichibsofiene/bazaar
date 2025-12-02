package com.bazar.service;

import com.bazar.model.Order;
import com.bazar.model.PayementOrder;
import com.bazar.model.User;

import java.util.Set;

public interface PaymentService {
    PayementOrder createOrder(User user, Set<Order> orders);

    PayementOrder getPaymentOrderById(Long orderId);

    PayementOrder getPaymentOderByPaymentId(String paymentId) throws Exception;

    Boolean ProceedPaymentOrder(PayementOrder payementOrder, String paymentId, String paymentLinkId);

    String createStripePaymentLink(User user, Long amount, Long orderId);
}
