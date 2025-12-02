package com.bazar.controller;

import com.bazar.domain.AccountStatus;
import com.bazar.domain.User_Role;
import com.bazar.model.Seller;
import com.bazar.model.User;
import com.bazar.repository.SellerRepository;
import com.bazar.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/sellers")
@RequiredArgsConstructor
public class AdminSellerController {

    private final SellerRepository sellerRepository;
    private final UserService userService;

    private void verifyAdminRole(String jwt) throws Exception {
        User currentUser = userService.findUserByJwtToken(jwt);
        if (currentUser.getRole() != User_Role.ROLE_ADMIN) {
            throw new RuntimeException("Access denied. Admin role required.");
        }
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllSellers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) AccountStatus status,
            @RequestHeader("Authorization") String jwt) throws Exception {
        verifyAdminRole(jwt);

        Pageable pageable = PageRequest.of(page, size);
        Page<Seller> sellerPage;

        if (search != null && !search.isEmpty()) {
            sellerPage = sellerRepository.findBySellerNameContainingOrEmailContaining(search, search, pageable);
        } else if (status != null) {
            sellerPage = sellerRepository.findByAccountStatus(status, pageable);
        } else {
            sellerPage = sellerRepository.findAll(pageable);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("sellers", sellerPage.getContent());
        response.put("currentPage", sellerPage.getNumber());
        response.put("totalItems", sellerPage.getTotalElements());
        response.put("totalPages", sellerPage.getTotalPages());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Seller> getSellerById(
            @PathVariable Long id,
            @RequestHeader("Authorization") String jwt) throws Exception {
        verifyAdminRole(jwt);

        Seller seller = sellerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seller not found with id: " + id));
        return ResponseEntity.ok(seller);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Seller> updateSellerStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request,
            @RequestHeader("Authorization") String jwt) throws Exception {
        verifyAdminRole(jwt);

        Seller seller = sellerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seller not found with id: " + id));

        String statusStr = request.get("status");
        if (statusStr != null) {
            AccountStatus newStatus = AccountStatus.valueOf(statusStr);
            seller.setAccountStatus(newStatus);
        }

        Seller updatedSeller = sellerRepository.save(seller);
        return ResponseEntity.ok(updatedSeller);
    }

    @PatchMapping("/{id}/verify-email")
    public ResponseEntity<Seller> verifySellerEmail(
            @PathVariable Long id,
            @RequestHeader("Authorization") String jwt) throws Exception {
        verifyAdminRole(jwt);

        Seller seller = sellerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seller not found with id: " + id));

        seller.setEmailVerified(true);
        Seller updatedSeller = sellerRepository.save(seller);
        return ResponseEntity.ok(updatedSeller);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteSeller(
            @PathVariable Long id,
            @RequestHeader("Authorization") String jwt) throws Exception {
        verifyAdminRole(jwt);

        Seller seller = sellerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seller not found with id: " + id));

        sellerRepository.delete(seller);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Seller deleted successfully");
        return ResponseEntity.ok(response);
    }
}
