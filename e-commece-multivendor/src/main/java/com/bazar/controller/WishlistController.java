package com.bazar.controller;

import com.bazar.model.Product;
import com.bazar.model.User;
import com.bazar.model.Wishlist;
import com.bazar.service.ProductService;
import com.bazar.service.UserService;
import com.bazar.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/wishlist")
public class WishlistController {
    private final WishlistService wishlistService;
    private final UserService   userService;
    private final ProductService productService;

    @GetMapping
    public ResponseEntity<Wishlist> getWishlistByUserId(@RequestHeader("Authorization")String jwt) throws Exception {
        User user=userService.findUserByJwtToken(jwt);
        Wishlist wishlist = wishlistService.getWishlistByUserId(user);
        return ResponseEntity.ok(wishlist);
    }
    @PostMapping("add-product/{productId}")
    public ResponseEntity<Wishlist> addProductToWishlist(@RequestHeader("Authorization")String jwt,@PathVariable Long productId) throws Exception {
        Product product=productService.findProductById(productId);
        User user=userService.findUserByJwtToken(jwt);
        Wishlist wishlist = wishlistService.addProductToWishlist(user,product);
        return ResponseEntity.ok(wishlist);
    }
    }
