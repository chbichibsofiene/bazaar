import api from './api';

export const orderService = {
    // Create order
    createOrder: async (address, paymentMethod = 'CASH_ON_DELIVERY') => {
        try {
            const response = await api.post(`/api/orders?paymentMethod=${paymentMethod}`, address);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get order history
    getOrderHistory: async () => {
        try {
            const response = await api.get('/api/orders/user');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get order by ID
    getOrderById: async (orderId) => {
        try {
            const response = await api.get(`/api/orders/${orderId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Cancel order
    cancelOrder: async (orderId) => {
        try {
            const response = await api.put(`/api/orders/${orderId}/cancel`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default orderService;
