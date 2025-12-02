package com.bazar.utils;

import com.bazar.model.Seller;
import com.bazar.service.SellerService;
import com.bazar.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Aspect
@Component
@RequiredArgsConstructor
public class SubscriptionAspect {

    private final SubscriptionService subscriptionService;
    private final SellerService sellerService;

    @Before("execution(* com.bazar.controller.ProductController.createProduct(..))")
    public void checkProductLimit() {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            String jwt = attributes.getRequest().getHeader("Authorization");
            if (jwt != null) {
                try {
                    Seller seller = sellerService.getSellerProfile(jwt);
                    if (!subscriptionService.canAddProduct(seller)) {
                        throw new RuntimeException("Product limit reached for your subscription plan. Please upgrade.");
                    }
                } catch (Exception e) {
                    throw new RuntimeException("Error checking subscription limit", e);
                }
            }
        }
    }
}
