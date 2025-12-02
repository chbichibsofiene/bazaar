package com.bazar.service.impl;

import com.bazar.model.Cart;
import com.bazar.model.Coupon;
import com.bazar.model.User;
import com.bazar.repository.CartRepository;
import com.bazar.repository.CouponRepository;
import com.bazar.repository.UserRepository;
import com.bazar.service.CouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
@Service
@RequiredArgsConstructor
public class CouponServiceImpl implements CouponService {
    private final CouponRepository couponRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;

    @Override
    public Cart applyCoupon(String code, double orderValue, User user) throws Exception {
        Coupon coupon = couponRepository.findByCode(code);
        Cart cart= cartRepository.findByUserId(user.getId());
        if(coupon==null){
            throw new Exception("Invalid coupon code");
        }
        if (user.getUsedCoupons().contains(coupon)){
            throw new Exception("Coupon already used by the user");
        }
        if(orderValue< coupon.getMinimumOrderValue()){
            throw new Exception("Order value does not meet the minimum requirement for this coupon"+
                    " Minimum order value: "+coupon.getMinimumOrderValue());
        }
        if (coupon.isActive()&& LocalDate.now().isAfter(coupon.getValidityStartDate())&& LocalDate.now().isBefore(coupon.getValidityEndDate()))
        {
            user.getUsedCoupons().add(coupon);
            userRepository.save(user);
            double discountedPrice=cart.getTotalAmount()*coupon.getDiscountPercentage()/100;
            cart.setTotalAmount(cart.getTotalAmount()-discountedPrice);
            cart.setCouponCode(code);
            cartRepository.save(cart);
            return cart;
        }
        throw new Exception("Coupon is not active or expired");
    }

    @Override
    public Cart removeCoupon(User user, String code) throws Exception {
        Coupon coupon = couponRepository.findByCode(code);
        if (coupon == null) {
            throw new Exception("Invalid coupon code");
        }
        Cart  cart= cartRepository.findByUserId(user.getId());
        double discountedPrice=cart.getTotalAmount()*coupon.getDiscountPercentage()/100;
        cart.setTotalAmount(cart.getTotalAmount()+discountedPrice);
        cart.setCouponCode(null);

        return cartRepository.save(cart);
    }

    @Override
    public Coupon findCouponById(Long couponId) throws Exception {
        return couponRepository.findById(couponId).orElseThrow(()->new Exception("Coupon not found"));
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public Coupon createCoupon(Coupon coupon) {
        return couponRepository.save(coupon);
    }

    @Override
    public List<Coupon> findAllCoupons() {
        return couponRepository.findAll();
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteCoupon(Long couponId) throws Exception {
        Coupon coupon = couponRepository.findById(couponId).orElseThrow(() -> new Exception("Coupon not found"));
        couponRepository.delete(coupon);
    }
}
