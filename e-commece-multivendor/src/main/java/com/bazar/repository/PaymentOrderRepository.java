package com.bazar.repository;

import com.bazar.model.PayementOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentOrderRepository extends JpaRepository<PayementOrder, Long> {
    PayementOrder findByPaymentLinkId(String paymentLinkId);

    PayementOrder findByPaymentId(String paymentId);

    PayementOrder findByOrdersId(Long orderId);
}
