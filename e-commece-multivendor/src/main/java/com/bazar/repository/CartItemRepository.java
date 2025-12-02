package com.bazar.repository;

import com.bazar.model.Cart;
import com.bazar.model.CartItem;
import com.bazar.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    CartItem findByCartAndProductAndSize(Cart cart, Product product, String size);
}
