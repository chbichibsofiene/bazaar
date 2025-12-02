package com.bazar.controller;

import com.bazar.model.*;
import com.bazar.response.ApiResponse;
import com.bazar.response.PaymentLinkResponse;
import com.bazar.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/payment")
public class PaymentController {
    private final PaymentService paymentService;
    private final UserService userService;
    private final SellerService sellerService;
    private final SellerReportService sellerReportService;
    private final TransactionService transactionService;

    @GetMapping("/{paymentId}")
    public ResponseEntity<ApiResponse> paymentSuccessHandle(@PathVariable String paymentId, @RequestParam String paymentLinkId,@RequestHeader ("Authorizaion") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        PaymentLinkResponse paymentLinkResponse;
        PayementOrder payementOrder = paymentService.getPaymentOderByPaymentId(paymentId);
        boolean paymentSuccess= paymentService.ProceedPaymentOrder(payementOrder,paymentId,paymentLinkId);
        if (paymentSuccess){
            for (Order order:payementOrder.getOrders()) {
                transactionService.createTransaction(order);
                Seller seller = sellerService.getSellerById(order.getSellerId());
                SellerReport report=sellerReportService.getSellerReport(seller);
                report.setTotalOrders(report.getTotalOrders()+1);
                report.setTotalEarnings(report.getTotalEarnings()+order.getTotalSellingPrice());
                report.setTotalSales(report.getTotalSales()+order.getOrderItems().size());
                sellerReportService.updateSellerReport(report);

            }
        }
        ApiResponse res= new ApiResponse();
        res.setMessage("Payment processed successfully");

        return new ResponseEntity<>(res, HttpStatus.CREATED);
    }
}
