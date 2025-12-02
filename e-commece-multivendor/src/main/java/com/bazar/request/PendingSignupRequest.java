package com.bazar.request;

import java.time.LocalDateTime;

public class PendingSignupRequest {
    private String email;
    private String fullName;
    private String hashedPassword;
    private String otp;
    private LocalDateTime expiryTime;

    // Constructors
    public PendingSignupRequest() {
    }

    public PendingSignupRequest(String email, String fullName, String hashedPassword, String otp,
            LocalDateTime expiryTime) {
        this.email = email;
        this.fullName = fullName;
        this.hashedPassword = hashedPassword;
        this.otp = otp;
        this.expiryTime = expiryTime;
    }

    // Getters and Setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getHashedPassword() {
        return hashedPassword;
    }

    public void setHashedPassword(String hashedPassword) {
        this.hashedPassword = hashedPassword;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    public LocalDateTime getExpiryTime() {
        return expiryTime;
    }

    public void setExpiryTime(LocalDateTime expiryTime) {
        this.expiryTime = expiryTime;
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiryTime);
    }
}
