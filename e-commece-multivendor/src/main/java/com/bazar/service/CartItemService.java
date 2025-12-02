package com.bazar.service;

import com.bazar.model.CartItem;

public interface CartItemService {
    CartItem updateCartItem(CartItem cartItem,Long id,Long userId) throws Exception;
    void removeCartItem(Long cartItemId,Long userId) throws Exception;
    CartItem findCartItemById(Long id) throws Exception;
}
