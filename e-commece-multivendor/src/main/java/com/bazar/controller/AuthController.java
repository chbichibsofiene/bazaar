package com.bazar.controller;

import com.bazar.domain.User_Role;
import com.bazar.model.User;
import com.bazar.model.VerificationCode;
import com.bazar.repository.UserRepository;
import com.bazar.repository.VerificationCodeRepository;
import com.bazar.request.LoginOtpRequest;
import com.bazar.request.LoginRequest;
import com.bazar.request.PasswordLoginRequest;
import com.bazar.request.SignupWithPasswordRequest;
import com.bazar.request.PendingSignupRequest;
import com.bazar.request.VerifyOtpRequest;
import com.bazar.request.ForgotPasswordRequest;
import com.bazar.request.ResetPasswordRequest;
import com.bazar.response.ApiResponse;
import com.bazar.response.AuthResponse;
import com.bazar.response.SignupRequest;
import com.bazar.service.AuthService;
import com.bazar.service.EmailService;
import com.bazar.utils.OtpUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.bazar.config.JwtProvider;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserRepository userRepository;
    private final AuthService authService;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final EmailService emailService;
    private final VerificationCodeRepository verificationCodeRepository;

    // In-memory storage for pending signups (temporary data before OTP
    // verification)
    private static final Map<String, PendingSignupRequest> pendingSignups = new ConcurrentHashMap<>();

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> createUserHandler(@RequestBody SignupRequest req) throws Exception {

        String jwt = authService.createUser(req);

        AuthResponse res = new AuthResponse();
        res.setJwt(jwt);
        res.setMessage("User created successfully");
        res.setRole(User_Role.ROLE_CUSTOMER);

        return ResponseEntity.ok(res);
    }

    @PostMapping("/sent/login-signup-otp")
    public ResponseEntity<ApiResponse> sentOtpHandler(@RequestBody LoginOtpRequest req) throws Exception {

        authService.sentLoginOtp(req.getEmail(), req.getRole());

        ApiResponse res = new ApiResponse();

        res.setMessage("Verification code sent to email successfully");

        return ResponseEntity.ok(res);
    }

    @PostMapping("/signing")
    public ResponseEntity<AuthResponse> loginHandler(@RequestBody LoginRequest req) throws Exception {

        AuthResponse authResponse = authService.signing(req);
        return ResponseEntity.ok(authResponse);
    }

    // New password-based signup endpoint
    @PostMapping("/signup-password")
    public ResponseEntity<AuthResponse> signupWithPassword(@RequestBody SignupWithPasswordRequest req)
            throws Exception {

        // Check if user already exists
        User existingUser = userRepository.findByEmail(req.getEmail());
        if (existingUser != null) {
            throw new Exception("User already exists with email: " + req.getEmail());
        }

        // Create new user with password
        User user = new User();
        user.setEmail(req.getEmail());
        user.setFullName(req.getFullName());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole(User_Role.ROLE_CUSTOMER);

        User savedUser = userRepository.save(user);

        // Generate JWT
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(savedUser.getRole().toString()));
        Authentication authentication = new UsernamePasswordAuthenticationToken(savedUser.getEmail(), null,
                authorities);
        String jwt = jwtProvider.generateToken(authentication);

        AuthResponse res = new AuthResponse();
        res.setJwt(jwt);
        res.setMessage("Signup successful");
        res.setRole(User_Role.ROLE_CUSTOMER);

        return new ResponseEntity<>(res, HttpStatus.CREATED);
    }

    // New password-based login endpoint
    @PostMapping("/login-password")
    public ResponseEntity<AuthResponse> loginWithPassword(@RequestBody PasswordLoginRequest req) throws Exception {

        // Find user by email
        User user = userRepository.findByEmail(req.getEmail());
        if (user == null) {
            throw new Exception("Invalid email or password");
        }

        // Verify password
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new Exception("Invalid email or password");
        }

        // Generate JWT
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(user.getRole().toString()));
        Authentication authentication = new UsernamePasswordAuthenticationToken(user.getEmail(), null, authorities);
        String jwt = jwtProvider.generateToken(authentication);

        AuthResponse res = new AuthResponse();
        res.setJwt(jwt);
        res.setMessage("Login successful");
        res.setRole(user.getRole());

        return ResponseEntity.ok(res);
    }

    // Two-step signup: Step 1 - Send OTP
    @PostMapping("/signup-send-otp")
    public ResponseEntity<ApiResponse> sendSignupOtp(@RequestBody SignupWithPasswordRequest req) throws Exception {

        // Check if user already exists
        User existingUser = userRepository.findByEmail(req.getEmail());
        if (existingUser != null) {
            throw new Exception("User already exists with email: " + req.getEmail());
        }

        // Generate OTP
        String otp = OtpUtil.generateOtp();

        // Log OTP to console for development/testing
        System.out.println("===========================================");
        System.out.println("OTP for " + req.getEmail() + ": " + otp);
        System.out.println("===========================================");

        // Hash password
        String hashedPassword = passwordEncoder.encode(req.getPassword());

        // Create pending signup (in-memory for temporary data)
        PendingSignupRequest pendingSignup = new PendingSignupRequest(
                req.getEmail(),
                req.getFullName(),
                hashedPassword,
                otp,
                LocalDateTime.now().plusMinutes(10) // 10 minute expiry
        );

        // Store in pending map
        pendingSignups.put(req.getEmail(), pendingSignup);

        // Save OTP to database
        VerificationCode verificationCode = verificationCodeRepository.findByEmail(req.getEmail());
        if (verificationCode == null) {
            verificationCode = new VerificationCode();
        }
        verificationCode.setEmail(req.getEmail());
        verificationCode.setOtp(otp);
        verificationCodeRepository.save(verificationCode);

        // Send OTP email
        String subject = "Bazaar - Email Verification Code";
        String text = "Welcome to Bazaar! Your verification code is: " + otp
                + "\n\nThis code will expire in 10 minutes.";
        emailService.sendVerificationOtpEmail(req.getEmail(), otp, subject, text);

        ApiResponse response = new ApiResponse();
        response.setMessage("OTP sent to your email. Please verify to complete signup.");

        return ResponseEntity.ok(response);
    }

    // Two-step signup: Step 2 - Verify OTP and create account
    @PostMapping("/signup-verify-otp")
    public ResponseEntity<AuthResponse> verifySignupOtp(@RequestBody VerifyOtpRequest req) throws Exception {

        // Get pending signup from in-memory map
        PendingSignupRequest pendingSignup = pendingSignups.get(req.getEmail());
        if (pendingSignup == null) {
            throw new Exception("No pending signup found. Please request OTP again.");
        }

        // Check if expired
        if (pendingSignup.isExpired()) {
            pendingSignups.remove(req.getEmail());
            VerificationCode vc = verificationCodeRepository.findByEmail(req.getEmail());
            if (vc != null) {
                verificationCodeRepository.delete(vc);
            }
            throw new Exception("OTP has expired. Please request a new one.");
        }

        // Verify OTP from database
        VerificationCode verificationCode = verificationCodeRepository.findByEmail(req.getEmail());
        if (verificationCode == null || !verificationCode.getOtp().equals(req.getOtp())) {
            throw new Exception("Invalid OTP. Please try again.");
        }

        // Create user account
        User user = new User();
        user.setEmail(pendingSignup.getEmail());
        user.setFullName(pendingSignup.getFullName());
        user.setPassword(pendingSignup.getHashedPassword());
        user.setRole(User_Role.ROLE_CUSTOMER);

        User savedUser = userRepository.save(user);

        // Remove from pending map and database
        pendingSignups.remove(req.getEmail());
        verificationCodeRepository.delete(verificationCode);

        // Generate JWT
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(savedUser.getRole().toString()));
        Authentication authentication = new UsernamePasswordAuthenticationToken(savedUser.getEmail(), null,
                authorities);
        String jwt = jwtProvider.generateToken(authentication);

        AuthResponse response = new AuthResponse();
        response.setJwt(jwt);
        response.setMessage("Signup successful! Welcome to Bazaar.");
        response.setRole(User_Role.ROLE_CUSTOMER);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Forgot Password: Step 1 - Send OTP
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse> forgotPassword(@RequestBody ForgotPasswordRequest req) throws Exception {

        // Check if user exists
        User user = userRepository.findByEmail(req.getEmail());
        if (user == null) {
            throw new Exception("No account found with email: " + req.getEmail());
        }

        // Generate OTP
        String otp = OtpUtil.generateOtp();

        // Log OTP to console for development/testing
        System.out.println("===========================================");
        System.out.println("Password Reset OTP for " + req.getEmail() + ": " + otp);
        System.out.println("===========================================");

        // Save OTP to database
        VerificationCode verificationCode = verificationCodeRepository.findByEmail(req.getEmail());
        if (verificationCode == null) {
            verificationCode = new VerificationCode();
        }
        verificationCode.setEmail(req.getEmail());
        verificationCode.setOtp(otp);
        verificationCode.setUser(user);
        verificationCodeRepository.save(verificationCode);

        // Send OTP email
        emailService.sendPasswordResetOtp(req.getEmail(), otp);

        ApiResponse response = new ApiResponse();
        response.setMessage("Password reset code sent to your email. Please check your inbox.");

        return ResponseEntity.ok(response);
    }

    // Forgot Password: Step 2 - Verify OTP and Reset Password
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse> resetPassword(@RequestBody ResetPasswordRequest req) throws Exception {

        // Verify OTP from database
        VerificationCode verificationCode = verificationCodeRepository.findByEmail(req.getEmail());
        if (verificationCode == null || !verificationCode.getOtp().equals(req.getOtp())) {
            throw new Exception("Invalid OTP. Please try again.");
        }

        // Find user
        User user = userRepository.findByEmail(req.getEmail());
        if (user == null) {
            throw new Exception("User not found.");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);

        // Delete verification code
        verificationCodeRepository.delete(verificationCode);

        ApiResponse response = new ApiResponse();
        response.setMessage("Password reset successful! You can now login with your new password.");

        return ResponseEntity.ok(response);
    }
}
