package com.bazar.service.impl;

import com.bazar.model.Seller;
import com.bazar.service.StripeService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.checkout.Session;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class StripeServiceImpl implements StripeService {

        @Value("${stripe.secret.key}")
        private String stripeApiKey;

        @Value("${frontend.url:http://localhost:5173}")
        private String frontendUrl;

        @PostConstruct
        public void init() {
                Stripe.apiKey = stripeApiKey;
        }

        @Override
        public String createStripeCustomer(Seller seller) throws StripeException {
                CustomerCreateParams params = CustomerCreateParams.builder()
                                .setEmail(seller.getEmail())
                                .setName(seller.getSellerName())
                                .build();
                Customer customer = Customer.create(params);
                return customer.getId();
        }

        @Override
        public Session createSubscriptionSession(Seller seller, String planName, long price) throws StripeException {
                SessionCreateParams params = SessionCreateParams.builder()
                                .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
                                .setSuccessUrl(frontendUrl
                                                + "/seller/subscription/success?session_id={CHECKOUT_SESSION_ID}")
                                .setCancelUrl(frontendUrl + "/seller/subscription/cancel")
                                .setCustomerEmail(seller.getEmail())
                                .putMetadata("sellerId", seller.getId().toString())
                                .putMetadata("planName", planName)
                                .addLineItem(SessionCreateParams.LineItem.builder()
                                                .setQuantity(1L)
                                                .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                                                                .setCurrency("usd")
                                                                .setUnitAmount(price)
                                                                .setProductData(SessionCreateParams.LineItem.PriceData.ProductData
                                                                                .builder()
                                                                                .setName(planName)
                                                                                .build())
                                                                .setRecurring(SessionCreateParams.LineItem.PriceData.Recurring
                                                                                .builder()
                                                                                .setInterval(SessionCreateParams.LineItem.PriceData.Recurring.Interval.MONTH)
                                                                                .build())
                                                                .build())
                                                .build())
                                .build();

                return Session.create(params);
        }

        @Override
        public Session retrieveSession(String sessionId) throws StripeException {
                return Session.retrieve(sessionId);
        }
}
