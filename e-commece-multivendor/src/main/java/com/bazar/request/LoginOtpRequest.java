package com.bazar.request;

import com.bazar.domain.User_Role;
import lombok.Data;

@Data
public class LoginOtpRequest {
    private String email;
    private String otp;
    private User_Role role;

}
