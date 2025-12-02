package com.bazar.service;

import com.bazar.domain.AccountStatus;
import com.bazar.model.Order;
import com.bazar.model.Seller;
import com.bazar.response.TopSellingProductDTO;

import java.util.List;

public interface SellerService {
    Seller getSellerProfile(String jwt) throws Exception;

    Seller createSeller(Seller seller) throws Exception;

    Seller getSellerById(Long id) throws Exception;

    Seller getSellerByEmail(String email) throws Exception;

    List<Seller> getAllSellers(AccountStatus status);

    Seller updateSeller(Long id, Seller seller) throws Exception;

    void deleteSeller(Long id) throws Exception;

    Seller verifyEmail(String email, String otp) throws Exception;

    Seller updateSellerAccountStatus(Long id, AccountStatus status) throws Exception;

    // Analytics methods
    List<TopSellingProductDTO> getTopSellingProducts(Long sellerId, int limit);

    List<Order> getRecentOrders(Long sellerId, int limit);

}
