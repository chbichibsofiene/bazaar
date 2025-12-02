package com.bazar.service.impl;

import com.bazar.config.JwtProvider;
import com.bazar.domain.AccountStatus;
import com.bazar.domain.User_Role;
import com.bazar.exceptions.SellerException;
import com.bazar.model.Address;
import com.bazar.model.Order;
import com.bazar.model.OrderItem;
import com.bazar.model.Seller;
import com.bazar.repository.AddressRepository;
import com.bazar.repository.OrderItemRepository;
import com.bazar.repository.OrderRepository;
import com.bazar.repository.SellerRepository;
import com.bazar.response.TopSellingProductDTO;
import com.bazar.service.SellerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SellerServiceImpl implements SellerService {

    private final SellerRepository sellerRepository;
    private final JwtProvider jwtProvider;
    private final PasswordEncoder passwordEncoder;
    private final AddressRepository addressRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    @Override
    public Seller getSellerProfile(String jwt) throws Exception {
        String email = jwtProvider.getEmailFromToken(jwt);
        return this.getSellerByEmail(email);
    }

    @Override
    public Seller createSeller(Seller seller) throws Exception {
        Seller sellerExist = sellerRepository.findByEmail(seller.getEmail());
        if (sellerExist != null) {
            throw new Exception("Seller already exists with email: " + seller.getEmail());
        }
        Address savedAddress = addressRepository.save(seller.getPickupaddress());
        Seller newSeller = new Seller();
        newSeller.setEmail(seller.getEmail());
        newSeller.setPassword(passwordEncoder.encode(seller.getPassword()));
        newSeller.setSellerName(seller.getSellerName());
        newSeller.setGSTIN(seller.getGSTIN());
        newSeller.setRole(User_Role.ROLE_SELLER);
        newSeller.setMobile(seller.getMobile());
        newSeller.setBankDetails(seller.getBankDetails());
        newSeller.setBusinessDetails(seller.getBusinessDetails());
        newSeller.setPickupaddress(savedAddress);

        return sellerRepository.save(newSeller);
    }

    @Override
    public Seller getSellerById(Long id) throws SellerException {
        return sellerRepository.findById(id).orElseThrow(() -> new SellerException("Seller not found with id: " + id));
    }

    @Override
    public Seller getSellerByEmail(String email) throws SellerException {
        Seller seller = sellerRepository.findByEmail(email);
        if (seller == null) {
            throw new SellerException("Seller not found with email: " + email);
        }
        return seller;
    }

    @Override
    public List<Seller> getAllSellers(AccountStatus status) {
        return sellerRepository.findByAccountStatus(status);
    }

    @Override
    public Seller updateSeller(Long id, Seller seller) throws Exception {
        Seller existingSeller = this.getSellerById(id);
        if (seller.getSellerName() != null) {
            existingSeller.setSellerName(seller.getSellerName());
        }
        if (seller.getMobile() != null) {
            existingSeller.setMobile(seller.getMobile());
        }
        if (seller.getEmail() != null) {
            existingSeller.setEmail(seller.getEmail());
        }
        if (seller.getBusinessDetails() != null && seller.getBusinessDetails().getBusinessName() != null) {
            existingSeller.getBusinessDetails().setBusinessName(seller.getBusinessDetails().getBusinessName());

        }
        if (seller.getBankDetails() != null && seller.getBankDetails().getAccountNumber() != null
                && seller.getBankDetails().getIfscCode() != null
                && seller.getBankDetails().getAccountHolderName() != null) {
            existingSeller.getBankDetails().setAccountNumber(seller.getBankDetails().getAccountNumber());
            existingSeller.getBankDetails().setIfscCode(seller.getBankDetails().getIfscCode());
            existingSeller.getBankDetails().setAccountHolderName(seller.getBankDetails().getAccountHolderName());

        }
        if (seller.getPickupaddress() != null && seller.getPickupaddress().getAdderss() != null
                && seller.getPickupaddress().getMobile() != null &&
                seller.getPickupaddress().getCity() != null && seller.getPickupaddress().getState() != null) {
            existingSeller.getPickupaddress().setAdderss(seller.getPickupaddress().getAdderss());
            existingSeller.getPickupaddress().setCity(seller.getPickupaddress().getCity());
            existingSeller.getPickupaddress().setState(seller.getPickupaddress().getState());
            existingSeller.getPickupaddress().setMobile(seller.getPickupaddress().getMobile());
            existingSeller.getPickupaddress().setPincode(seller.getPickupaddress().getPincode());
        }
        if (seller.getGSTIN() != null) {
            existingSeller.setGSTIN(seller.getGSTIN());
        }
        return sellerRepository.save(existingSeller);
    }

    @Override
    public void deleteSeller(Long id) throws Exception {
        Seller seller = getSellerById(id);
        sellerRepository.delete(seller);

    }

    @Override
    public Seller verifyEmail(String email, String otp) throws Exception {

        Seller seller = getSellerByEmail(email);
        seller.setEmailVerified(true);
        return sellerRepository.save(seller);
    }

    @Override
    public Seller updateSellerAccountStatus(Long id, AccountStatus status) throws Exception {
        Seller seller = getSellerById(id);
        seller.setAccountStatus(status);
        return sellerRepository.save(seller);

    }

    @Override
    public List<TopSellingProductDTO> getTopSellingProducts(Long sellerId, int limit) {
        // Get all orders for this seller
        List<Order> orders = orderRepository.findBySellerId(sellerId);

        // Map to track product statistics
        Map<Long, TopSellingProductDTO> productStatsMap = new HashMap<>();

        for (Order order : orders) {
            for (OrderItem item : order.getOrderItems()) {
                Long productId = item.getProduct().getId();

                if (!productStatsMap.containsKey(productId)) {
                    TopSellingProductDTO dto = new TopSellingProductDTO();
                    dto.setProductId(productId);
                    dto.setProductName(item.getProduct().getTitle());
                    dto.setProductImage(
                            item.getProduct().getImages().isEmpty() ? null : item.getProduct().getImages().get(0));
                    dto.setTotalSales(0L);
                    dto.setRevenue(0L);
                    dto.setOrderCount(0);
                    productStatsMap.put(productId, dto);
                }

                TopSellingProductDTO dto = productStatsMap.get(productId);
                dto.setTotalSales(dto.getTotalSales() + item.getQuantity());
                dto.setRevenue(dto.getRevenue() + (item.getSellingPrice() * item.getQuantity()));
                dto.setOrderCount(dto.getOrderCount() + 1);
            }
        }

        // Sort by revenue and return top N
        return productStatsMap.values().stream()
                .sorted((a, b) -> Long.compare(b.getRevenue(), a.getRevenue()))
                .limit(limit)
                .collect(Collectors.toList());
    }

    @Override
    public List<Order> getRecentOrders(Long sellerId, int limit) {
        List<Order> allOrders = orderRepository.findBySellerId(sellerId);

        // Sort by order date descending and limit
        return allOrders.stream()
                .sorted((a, b) -> b.getOrderDate().compareTo(a.getOrderDate()))
                .limit(limit)
                .collect(Collectors.toList());
    }
}
