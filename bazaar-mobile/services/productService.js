import api from './api';

export const productService = {
    // Get all products with filters
    getAllProducts: async (filters = {}) => {
        try {
            const params = new URLSearchParams();

            if (filters.category) params.append('category', filters.category);
            if (filters.brand) params.append('brand', filters.brand);
            if (filters.colors) params.append('colors', filters.colors);
            if (filters.sizes) params.append('sizes', filters.sizes);
            if (filters.minPrice) params.append('minPrice', filters.minPrice);
            if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
            if (filters.minDiscount) params.append('minDiscount', filters.minDiscount);
            if (filters.sort) params.append('sort', filters.sort);
            if (filters.stock) params.append('stock', filters.stock);
            if (filters.pageNumber !== undefined) params.append('pageNumber', filters.pageNumber);
            if (filters.pageSize !== undefined) params.append('pageSize', filters.pageSize);

            const response = await api.get(`/products?${params.toString()}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get product by ID
    getProductById: async (productId) => {
        try {
            const response = await api.get(`/products/${productId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Search products
    searchProducts: async (query) => {
        try {
            const response = await api.get(`/products/search?query=${encodeURIComponent(query)}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default productService;
