package com.bazar.service;

import com.bazar.model.Product;
import com.bazar.model.User;
import com.bazar.model.Wishlist;

public interface WishlistService {
    Wishlist createWishlist(User user);
    Wishlist getWishlistByUserId(User user);
    Wishlist addProductToWishlist(User user, Product product);
    Wishlist removeProductFromWishlist(User user, Product product);
}
