import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import cartService from '../services/cartService';

const CartContext = createContext(null);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);

    // Load cart when user is authenticated
    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        } else {
            setCart(null);
        }
    }, [isAuthenticated]);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const cartData = await cartService.getCart();
            setCart(cartData);
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productId, size, quantity = 1) => {
        try {
            const updatedItem = await cartService.addToCart(productId, size, quantity);
            // Refresh cart
            await fetchCart();
            return updatedItem;
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    };

    const updateCartItem = async (cartItemId, data) => {
        try {
            const updatedItem = await cartService.updateCartItem(cartItemId, data);
            // Refresh cart
            await fetchCart();
            return updatedItem;
        } catch (error) {
            console.error('Error updating cart item:', error);
            throw error;
        }
    };

    const removeFromCart = async (cartItemId) => {
        try {
            await cartService.deleteCartItem(cartItemId);
            // Refresh cart
            await fetchCart();
        } catch (error) {
            console.error('Error removing from cart:', error);
            throw error;
        }
    };

    const getCartItemCount = () => {
        return cart?.totalItems || 0;
    };

    const getCartTotal = () => {
        return cart?.totalAmount || 0;
    };

    const value = {
        cart,
        loading,
        fetchCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        getCartItemCount,
        getCartTotal,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
