import api from './api';

export const wishlistService = {
    // Get user's wishlist
    getWishlist: async () => {
        try {
            const response = await api.get('/api/wishlist');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Add product to wishlist
    addToWishlist: async (productId) => {
        try {
            const response = await api.post(`/api/wishlist/add-product/${productId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default wishlistService;
