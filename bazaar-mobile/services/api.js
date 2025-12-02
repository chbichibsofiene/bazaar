import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5454';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
    async (config) => {
        try {
            const token = await SecureStore.getItemAsync('jwt_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error getting token:', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response;

            if (status === 401) {
                // Unauthorized - clear token and redirect to login
                await SecureStore.deleteItemAsync('jwt_token');
                // You can emit an event here to navigate to login
            }

            // Return a more user-friendly error message
            const errorMessage = data?.message || data?.error || 'An error occurred';
            return Promise.reject(new Error(errorMessage));
        } else if (error.request) {
            // Request was made but no response received
            return Promise.reject(new Error('Network error. Please check your connection.'));
        } else {
            // Something else happened
            return Promise.reject(error);
        }
    }
);

export default api;
