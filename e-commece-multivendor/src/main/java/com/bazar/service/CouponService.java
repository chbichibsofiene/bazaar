package com.bazar.service;

import com.bazar.model.Cart;
import com.bazar.model.Coupon;
import com.bazar.model.User;

import java.util.List;

public interface CouponService {
    Cart applyCoupon(String code, double orderValue, User user) throws Exception;
    Cart removeCoupon(User user,String code) throws Exception;
    Coupon findCouponById(Long couponId) throws Exception;
    Coupon createCoupon(Coupon coupon);
    List<Coupon> findAllCoupons();
    void deleteCoupon(Long couponId) throws Exception;
}
