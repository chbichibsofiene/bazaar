package com.bazar.controller;

import com.bazar.domain.User_Role;
import com.bazar.model.Product;
import com.bazar.model.User;
import com.bazar.repository.ProductRepository;
import com.bazar.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/admin/products")
@RequiredArgsConstructor
public class AdminProductController {

    private final ProductRepository productRepository;
    private final UserService userService;

    private void verifyAdminRole(String jwt) throws Exception {
        User currentUser = userService.findUserByJwtToken(jwt);
        if (currentUser.getRole() != User_Role.ROLE_ADMIN) {
            throw new RuntimeException("Access denied. Admin role required.");
        }
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestHeader("Authorization") String jwt) throws Exception {
        verifyAdminRole(jwt);

        Pageable pageable = PageRequest.of(page, size);
        Page<Product> productPage;

        if (search != null && !search.isEmpty()) {
            productPage = productRepository.findByTitleContaining(search, pageable);
        } else {
            productPage = productRepository.findAll(pageable);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("products", productPage.getContent());
        response.put("currentPage", productPage.getNumber());
        response.put("totalItems", productPage.getTotalElements());
        response.put("totalPages", productPage.getTotalPages());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(
            @PathVariable Long id,
            @RequestHeader("Authorization") String jwt) throws Exception {
        verifyAdminRole(jwt);

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        return ResponseEntity.ok(product);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @RequestBody Product productUpdate,
            @RequestHeader("Authorization") String jwt) throws Exception {
        verifyAdminRole(jwt);

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        if (productUpdate.getTitle() != null) {
            product.setTitle(productUpdate.getTitle());
        }
        if (productUpdate.getDescription() != null) {
            product.setDescription(productUpdate.getDescription());
        }
        if (productUpdate.getMrpPrice() > 0) {
            product.setMrpPrice(productUpdate.getMrpPrice());
        }
        if (productUpdate.getSellingPrice() > 0) {
            product.setSellingPrice(productUpdate.getSellingPrice());
        }
        if (productUpdate.getQuantity() >= 0) {
            product.setQuantity(productUpdate.getQuantity());
        }
        if (productUpdate.getColor() != null) {
            product.setColor(productUpdate.getColor());
        }
        if (productUpdate.getSizes() != null) {
            product.setSizes(productUpdate.getSizes());
        }

        Product updatedProduct = productRepository.save(product);
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteProduct(
            @PathVariable Long id,
            @RequestHeader("Authorization") String jwt) throws Exception {
        verifyAdminRole(jwt);

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        productRepository.delete(product);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Product deleted successfully");
        return ResponseEntity.ok(response);
    }
}
