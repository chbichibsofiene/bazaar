package com.bazar.service;

import com.bazar.domain.User_Role;
import com.bazar.request.LoginRequest;
import com.bazar.response.AuthResponse;
import com.bazar.response.SignupRequest;

public interface AuthService {
    void sentLoginOtp(String email, User_Role role) throws Exception;
    String createUser(SignupRequest req) throws Exception;
    AuthResponse signing(LoginRequest req) throws Exception;
}
