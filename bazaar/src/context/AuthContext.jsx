import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [jwt, setJwt] = useState(localStorage.getItem('jwt'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (jwt) {
            fetchUserProfile();
        } else {
            setLoading(false);
        }
    }, [jwt]);

    const fetchUserProfile = async () => {
        try {
            const userType = localStorage.getItem('userType') || 'customer';

            if (userType === 'seller') {
                const sellerResponse = await api.get('/sellers/profile');
                setUser({ ...sellerResponse.data, role: sellerResponse.data.role || 'ROLE_SELLER' });
            } else {
                const response = await api.get('/users/profile');
                setUser({ ...response.data, role: response.data.role || 'ROLE_CUSTOMER' });
            }
        } catch (error) {
            console.error("Error fetching profile", error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            let response;
            let userRole = null;

            // Try user login first
            try {
                response = await api.post('/auth/login-password', credentials);
                const { jwt } = response.data;
                localStorage.setItem('jwt', jwt);
                localStorage.setItem('userType', 'customer');
                setJwt(jwt);

                // Fetch profile to get role
                const profileResponse = await api.get('/users/profile');
                userRole = profileResponse.data.role;
                setUser({ ...profileResponse.data, role: userRole || 'ROLE_CUSTOMER' });
            } catch (userError) {
                // If user login fails, try seller login
                response = await api.post('/sellers/login-password', credentials);
                const { jwt } = response.data;
                localStorage.setItem('jwt', jwt);
                localStorage.setItem('userType', 'seller');
                setJwt(jwt);

                // Fetch seller profile
                const sellerProfileResponse = await api.get('/sellers/profile');
                userRole = sellerProfileResponse.data.role || 'ROLE_SELLER';
                setUser({ ...sellerProfileResponse.data, role: userRole });
            }

            return userRole;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const register = async (signupData) => {
        try {
            const response = await api.post('/auth/signup-password', signupData);
            const token = response.data.jwt;
            localStorage.setItem('jwt', token);
            localStorage.setItem('userType', 'customer');
            setJwt(token);
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('jwt');
        localStorage.removeItem('userType');
        setJwt(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, jwt, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
