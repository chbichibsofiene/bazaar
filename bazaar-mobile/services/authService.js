import api from './api';

export const authService = {
    // Send OTP for login or signup
    sendOtp: async (email, role = 'ROLE_CUSTOMER') => {
        try {
            const response = await api.post('/auth/sent/login-signup-otp', {
                email,
                role,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Signup with OTP
    signup: async (email, fullName, otp) => {
        try {
            const response = await api.post('/auth/signup', {
                email,
                fullName,
                otp,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Login with OTP
    login: async (email, otp) => {
        try {
            const response = await api.post('/auth/signing', {
                email,
                otp,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get user profile
    getProfile: async () => {
        try {
            const response = await api.get('/users/profile');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default authService;
