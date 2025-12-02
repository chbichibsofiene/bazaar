package com.bazar.service;

import com.bazar.domain.OrderStatus;
import com.bazar.model.*;

import java.util.List;
import java.util.Set;

public interface OrderService {
    Set<Order> createOrder(User user, Address ShippingAddress, Cart cart);

    Order findOrderById(Long id) throws Exception;

    List<Order> userOderHistory(Long userId);

    List<Order> sellerOderHistory(Long sellerId);

    Order updateOrderStatus(Long orderId, OrderStatus status) throws Exception;

    Order cancelOrder(Long orderId, User user) throws Exception;

    OrderItem getOrderItemById(Long id) throws Exception;

    void deleteOrder(Long orderId) throws Exception;
}
