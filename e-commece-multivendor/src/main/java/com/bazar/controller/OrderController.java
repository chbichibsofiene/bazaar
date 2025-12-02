package com.bazar.controller;

import com.bazar.domain.PaymentMethod;
import com.bazar.domain.PaymentOrderStatus;
import com.bazar.model.*;
import com.bazar.repository.PaymentOrderRepository;
import com.bazar.response.PaymentLinkResponse;
import com.bazar.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;
    private final UserService userService;
    private final CartService cartService;
    private final SellerService sellerService;
    private final SellerReportService sellerReportService;
    private final PaymentService paymentService;
    private final PaymentOrderRepository paymentOrderRepository;

    @PostMapping
    public ResponseEntity<PaymentLinkResponse> createOrderHandler(
            @RequestHeader("Authorization") String jwt,
            @RequestBody Address shippingAddress,
            @RequestParam PaymentMethod paymentMethod) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        Cart cart = cartService.findUserCart(user);
        Set<Order> orders = orderService.createOrder(user, shippingAddress, cart);
        PayementOrder paymentOrder = paymentService.createOrder(user, orders);
        paymentOrder.setPaymentMethod(paymentMethod);
        paymentOrderRepository.save(paymentOrder);
        PaymentLinkResponse response = new PaymentLinkResponse();
        if (paymentMethod == PaymentMethod.STRIPE) {
            String checkoutUrl = paymentService.createStripePaymentLink(
                    user,
                    paymentOrder.getAmount(),
                    paymentOrder.getId());
            response.setPayment_link_url(checkoutUrl);
            response.setPayment_link_id(paymentOrder.getPaymentLinkId());

        } else if (paymentMethod == PaymentMethod.CASH_ON_DELIVERY) {
            paymentOrder.setStatus(PaymentOrderStatus.PENDING); // payment pending until delivery
            paymentOrder.setPaymentStatus(false); // not paid yet
            paymentOrderRepository.save(paymentOrder);

            // Update individual orders with payment method
            for (Order order : orders) {
                order.getPaymentDetails().setPaymentMethod(paymentMethod.toString());
                orderService.updateOrderStatus(order.getId(), order.getOrderStatus());
            }

            response.setPayment_link_url("COD");
            response.setPayment_link_id("COD-" + paymentOrder.getId());
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user")
    public ResponseEntity<List<Order>> userOrderHistoryHandler(@RequestHeader("Authorization") String jwt)
            throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        List<Order> orders = orderService.userOderHistory(user.getId());
        return new ResponseEntity<>(orders, HttpStatus.ACCEPTED);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<Order> findOrderByIdHandler(@PathVariable Long orderId,
            @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        Order order = orderService.findOrderById(orderId);
        return new ResponseEntity<>(order, HttpStatus.ACCEPTED);
    }

    @GetMapping("/item/{orderItemId} ")
    public ResponseEntity<OrderItem> findOrderItemByIdHandler(@PathVariable Long orderItemId,
            @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        OrderItem orderItem = orderService.getOrderItemById(orderItemId);
        return new ResponseEntity<>(orderItem, HttpStatus.ACCEPTED);
    }

    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<String> cancelOrderHandler(@PathVariable Long orderId,
            @RequestHeader("Authorization") String jwt) throws Exception {
        System.out.println("Received cancel request for order: " + orderId);
        User user = userService.findUserByJwtToken(jwt);
        Order order = orderService.cancelOrder(orderId, user);

        try {
            Seller seller = sellerService.getSellerById(order.getSellerId());
            SellerReport report = sellerReportService.getSellerReport(seller);
            report.setCancelledOrders(report.getCancelledOrders() + 1);
            report.setTotalRefunds(report.getTotalRefunds() + order.getTotalSellingPrice());
            sellerReportService.updateSellerReport(report);
        } catch (Exception e) {
            System.err.println("Error updating seller report: " + e.getMessage());
        }

        return ResponseEntity.ok("Order cancelled successfully");
    }
}
