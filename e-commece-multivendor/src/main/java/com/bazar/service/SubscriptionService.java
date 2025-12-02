package com.bazar.service;

import com.bazar.domain.PlanType;
import com.bazar.model.Seller;
import com.bazar.model.SellerSubscription;
import com.bazar.model.SubscriptionPlan;

import java.util.List;

public interface SubscriptionService {
    List<SubscriptionPlan> getAllPlans();

    SellerSubscription getSellerSubscription(Seller seller);

    SellerSubscription upgradeSubscription(Seller seller, PlanType planType);

    boolean canAddProduct(Seller seller);

    void createDefaultPlans();
}
