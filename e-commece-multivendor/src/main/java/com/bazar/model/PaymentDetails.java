package com.bazar.model;

import com.bazar.domain.PaymentStatus;
import lombok.Data;

@Data

public class PaymentDetails {
    private String paymentId;
    private String paymeePaymentLinkId;
    private String paymeePaymentLinkReferenceId;
    private String paymeePaymentLinkStatus;
    private String paymeePaymentId;
    private PaymentStatus status;
    private String paymentMethod;
}
