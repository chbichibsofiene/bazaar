import api from './api';

export const reviewService = {
    // Get reviews for a product
    getReviews: async (productId) => {
        try {
            const response = await api.get(`/api/products/${productId}/reviews`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Create a review
    createReview: async (productId, reviewData) => {
        try {
            const response = await api.post(`/api/products/${productId}/reviews`, {
                reviewText: reviewData.reviewText,
                reviewRating: reviewData.reviewRating,
                productImages: reviewData.productImages || [],
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update a review
    updateReview: async (reviewId, reviewData) => {
        try {
            const response = await api.patch(`/api/reviews/${reviewId}`, {
                reviewText: reviewData.reviewText,
                reviewRating: reviewData.reviewRating,
                productImages: reviewData.productImages || [],
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Delete a review
    deleteReview: async (reviewId) => {
        try {
            const response = await api.delete(`/api/reviews/${reviewId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default reviewService;
