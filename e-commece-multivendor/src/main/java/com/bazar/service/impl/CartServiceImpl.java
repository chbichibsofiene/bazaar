package com.bazar.service.impl;

import com.bazar.model.Cart;
import com.bazar.model.CartItem;
import com.bazar.model.Product;
import com.bazar.model.User;
import com.bazar.repository.CartItemRepository;
import com.bazar.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements com.bazar.service.CartService {
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;

    @Override
    public CartItem addCartItem(User user, Product product, String size, int quantity) {
        // Validate product prices (using primitive float, so check for zero instead of
        // null)
        if (product.getSellingPrice() <= 0 || product.getMrpPrice() <= 0) {
            throw new IllegalArgumentException(
                    "Product prices must be greater than zero. Product ID: " + product.getId());
        }

        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than zero");
        }

        Cart cart = findUserCart(user);
        CartItem isPresent = cartItemRepository.findByCartAndProductAndSize(cart, product, size);
        if (isPresent == null) {
            CartItem cartItem = new CartItem();
            cartItem.setUserId(user.getId());
            cartItem.setProduct(product);
            cartItem.setSize(size);
            cartItem.setQuantity(quantity);
            float totalPrice = quantity * product.getSellingPrice();
            cartItem.setSellingPrice((int) totalPrice);
            cartItem.setMrpPrice((int) (quantity * product.getMrpPrice()));
            cart.getCartItems().add(cartItem);
            cartItem.setCart(cart);
            return cartItemRepository.save(cartItem);
        }
        return isPresent;
    }

    @Override
    public Cart findUserCart(User user) {
        Cart cart = cartRepository.findByUserId(user.getId());

        if (cart == null) {
            cart = new Cart();
            cart.setUser(user);
            return cartRepository.save(cart);
        }

        int totalMrpPrice = 0;
        int totalSellingPrice = 0;
        int totalItems = 0;

        for (CartItem cartItem : cart.getCartItems()) {
            totalMrpPrice += cartItem.getMrpPrice();
            totalSellingPrice += cartItem.getSellingPrice();
            totalItems += cartItem.getQuantity();
        }

        cart.setTotalMrPrice(totalMrpPrice);
        cart.setTotalItems(totalItems);
        cart.setTotalAmount(totalSellingPrice);

        // Only calculate discount if there are items and totalMrpPrice > 0
        if (totalItems > 0 && totalMrpPrice > 0) {
            cart.setDiscount(calculateDiscountPercentage(totalMrpPrice, totalSellingPrice));
        } else {
            cart.setDiscount(0);
        }

        return cart;
    }

    private int calculateDiscountPercentage(int mrpPrice, int sellingPrice) {
        if (mrpPrice <= 0) {
            return 0; // Return 0 instead of throwing exception
        }
        double discount = mrpPrice - sellingPrice;
        double discountPercentage = (discount / mrpPrice) * 100;
        return (int) discountPercentage;
    }
}
