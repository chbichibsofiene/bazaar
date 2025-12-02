package com.bazar.service;

import com.bazar.model.Cart;
import com.bazar.model.CartItem;
import com.bazar.model.Product;
import com.bazar.model.User;

public interface CartService {
    public CartItem addCartItem(User user, Product product, String size, int quantity);
    public Cart findUserCart(User user);
}
