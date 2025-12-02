package com.bazar.service.impl;

import com.bazar.domain.OrderStatus;
import com.bazar.domain.PaymentStatus;
import com.bazar.model.*;
import com.bazar.repository.AddressRepository;
import com.bazar.repository.OrderItemRepository;
import com.bazar.repository.OrderRepository;
import com.bazar.repository.PaymentOrderRepository;
import com.bazar.repository.TransactionRepository;
import com.bazar.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final AddressRepository addressRepository;
    private final OrderItemRepository orderItemRepository;
    private final TransactionRepository transactionRepository;
    private final PaymentOrderRepository paymentOrderRepository;

    @Override
    public Set<Order> createOrder(User user, Address ShippingAddress, Cart cart) {
        if (!user.getAddresses().add(ShippingAddress)) {
            user.getAddresses().add(ShippingAddress);
        }
        Address address = addressRepository.save(ShippingAddress);
        Map<Long, List<CartItem>> itemsBySeller = cart.getCartItems().stream()
                .collect(Collectors.groupingBy(item -> item.getProduct().getSeller().getId()));
        Set<Order> orders = new HashSet<>();
        for (Map.Entry<Long, List<CartItem>> entry : itemsBySeller.entrySet()) {
            Long sellerId = entry.getKey();
            List<CartItem> items = entry.getValue();
            int totalOrderPrice = items.stream().mapToInt(CartItem::getSellingPrice).sum();
            int totalItem = items.stream().mapToInt(CartItem::getQuantity).sum();
            Order order = new Order();
            order.setUser(user);
            order.setSellerId(sellerId);
            order.setTotalMrpPrice(totalOrderPrice);
            order.setShippingAddress(address);
            order.setTotalSellingPrice(totalOrderPrice);
            order.setTotalItem(totalItem);
            order.setOrderStatus(OrderStatus.PENDING);
            order.getPaymentDetails().setStatus(PaymentStatus.PENDING);
            Order savedOrder = orderRepository.save(order);
            orders.add(savedOrder);
            List<OrderItem> orderItems = new ArrayList<>();
            for (CartItem item : items) {
                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(savedOrder);
                orderItem.setProduct(item.getProduct());
                orderItem.setQuantity(item.getQuantity());
                orderItem.setMrpPrice(item.getMrpPrice());
                orderItem.setSellingPrice(item.getSellingPrice());
                orderItem.setUserId(item.getUserId());
                savedOrder.getOrderItems().add(orderItem);

                OrderItem savedOrderItem = orderItemRepository.save(orderItem);
                orderItems.add(savedOrderItem);

            }
        }

        return orders;
    }

    @Override
    public Order findOrderById(Long id) throws Exception {
        return orderRepository.findById(id).orElseThrow(() -> new Exception("Order not found with id: " + id));
    }

    @Override
    public List<Order> userOderHistory(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @Override
    public List<Order> sellerOderHistory(Long sellerId) {
        return orderRepository.findBySellerId(sellerId);
    }

    @Override
    public Order updateOrderStatus(Long orderId, OrderStatus status) throws Exception {
        Order order = findOrderById(orderId);
        order.setOrderStatus(status);

        return orderRepository.save(order);
    }

    @Override
    @Transactional
    public Order cancelOrder(Long orderId, User user) throws Exception {
        Order order = findOrderById(orderId);
        if (!user.getId().equals(order.getUser().getId())) {
            throw new Exception("You are not authorized to cancel this order");

        }
        order.setOrderStatus(OrderStatus.CANCELLED);
        order.getPaymentDetails().setStatus(PaymentStatus.CANCELLED);

        return orderRepository.save(order);
    }

    @Override
    public OrderItem getOrderItemById(Long id) throws Exception {
        return orderItemRepository.findById(id).orElseThrow(() -> new Exception("Order item not found with id: " + id));
    }

    @Override
    @Transactional
    public void deleteOrder(Long orderId) throws Exception {
        Order order = findOrderById(orderId);

        // Delete associated transactions first to avoid foreign key constraint
        // violation
        List<Transaction> transactions = transactionRepository.findByOrderId(orderId);
        if (transactions != null && !transactions.isEmpty()) {
            transactionRepository.deleteAll(transactions);
        }

        // Remove from PaymentOrder to avoid foreign key constraint violation
        PayementOrder paymentOrder = paymentOrderRepository.findByOrdersId(orderId);
        if (paymentOrder != null) {
            paymentOrder.getOrders().remove(order);
            paymentOrderRepository.save(paymentOrder);
        }

        orderRepository.delete(order);
    }
}
