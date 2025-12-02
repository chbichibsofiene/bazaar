import api from './api';

export const cartService = {
    // Get user's cart
    getCart: async () => {
        try {
            const response = await api.get('/api/cart');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Add item to cart
    addToCart: async (productId, size, quantity = 1) => {
        try {
            const response = await api.put('/api/cart/add', {
                productId,
                size,
                quantity,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update cart item
    updateCartItem: async (cartItemId, data) => {
        try {
            const response = await api.put(`/api/cart/item/${cartItemId}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Delete cart item
    deleteCartItem: async (cartItemId) => {
        try {
            const response = await api.delete(`/api/cart/item/${cartItemId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default cartService;
