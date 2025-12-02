import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load token and user on app start
    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const storedToken = await SecureStore.getItemAsync('jwt_token');
            if (storedToken) {
                setToken(storedToken);
                // Fetch user profile
                const userData = await authService.getProfile();
                setUser(userData);
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            // Clear invalid token
            await SecureStore.deleteItemAsync('jwt_token');
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, otp) => {
        try {
            const response = await authService.login(email, otp);
            const { jwt, role } = response;

            // Store token
            await SecureStore.setItemAsync('jwt_token', jwt);
            setToken(jwt);

            // Fetch user profile
            const userData = await authService.getProfile();
            setUser(userData);

            return { success: true, role };
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const signup = async (email, fullName, otp) => {
        try {
            const response = await authService.signup(email, fullName, otp);
            const { jwt, role } = response;

            // Store token
            await SecureStore.setItemAsync('jwt_token', jwt);
            setToken(jwt);

            // Fetch user profile
            const userData = await authService.getProfile();
            setUser(userData);

            return { success: true, role };
        } catch (error) {
            console.error('Signup error:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await SecureStore.deleteItemAsync('jwt_token');
            setToken(null);
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const sendOtp = async (email, role = 'ROLE_CUSTOMER') => {
        try {
            const response = await authService.sendOtp(email, role);
            return response;
        } catch (error) {
            console.error('Send OTP error:', error);
            throw error;
        }
    };

    const value = {
        user,
        token,
        loading,
        login,
        signup,
        logout,
        sendOtp,
        isAuthenticated: !!token && !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
