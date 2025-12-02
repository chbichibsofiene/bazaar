package com.bazar.service;

import com.bazar.model.Seller;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;

public interface StripeService {
    String createStripeCustomer(Seller seller) throws StripeException;

    Session createSubscriptionSession(Seller seller, String planId, long price) throws StripeException;

    Session retrieveSession(String sessionId) throws StripeException;
}
