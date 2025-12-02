import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    role: null, // 'ROLE_CUSTOMER', 'ROLE_SELLER', 'ROLE_ADMIN'
    isAuthenticated: false,
    jwt: localStorage.getItem('jwt') || null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.user = action.payload.user;
            state.role = action.payload.role;
            state.jwt = action.payload.jwt;
            state.isAuthenticated = true;
            localStorage.setItem('jwt', action.payload.jwt);
        },
        logout: (state) => {
            state.user = null;
            state.role = null;
            state.jwt = null;
            state.isAuthenticated = false;
            localStorage.removeItem('jwt');
        },
    },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
