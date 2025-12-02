package com.bazar.controller;

import com.bazar.config.JwtProvider;
import com.bazar.domain.AccountStatus;
import com.bazar.model.Order;
import com.bazar.model.Seller;
import com.bazar.model.SellerReport;
import com.bazar.model.VerificationCode;
import com.bazar.repository.SellerRepository;
import com.bazar.repository.VerificationCodeRepository;
import com.bazar.request.LoginRequest;
import com.bazar.request.PasswordLoginRequest;
import com.bazar.response.ApiResponse;
import com.bazar.response.AuthResponse;
import com.bazar.response.TopSellingProductDTO;
import com.bazar.service.AuthService;
import com.bazar.service.EmailService;
import com.bazar.service.SellerReportService;
import com.bazar.service.SellerService;
import com.bazar.utils.OtpUtil;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/sellers")
public class SellerController {
    private final SellerService sellerService;
    private final VerificationCodeRepository verificationCodeRepository;
    private final AuthService authService;
    private final EmailService emailService;
    private final JwtProvider jwtProvider;
    private final SellerReportService sellerReportSerive;
    private final PasswordEncoder passwordEncoder;
    private final SellerRepository sellerRepository;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginSeller(@RequestBody LoginRequest req) throws Exception {
        String otp = req.getOtp();
        String email = req.getEmail();

        req.setEmail("seller_" + email);
        System.out.println(otp + " " + email);
        AuthResponse authResponse = authService.signing(req);

        return ResponseEntity.ok(authResponse);

    }

    // New password-based seller login endpoint
    @PostMapping("/login-password")
    public ResponseEntity<AuthResponse> sellerLoginWithPassword(@RequestBody PasswordLoginRequest req)
            throws Exception {

        // Find seller by email
        Seller seller = sellerRepository.findByEmail(req.getEmail());
        if (seller == null) {
            throw new Exception("Invalid email or password");
        }

        // Verify password
        if (!passwordEncoder.matches(req.getPassword(), seller.getPassword())) {
            throw new Exception("Invalid email or password");
        }

        // Generate JWT
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(seller.getRole().toString()));
        Authentication authentication = new UsernamePasswordAuthenticationToken(seller.getEmail(), null, authorities);
        String jwt = jwtProvider.generateToken(authentication);

        AuthResponse res = new AuthResponse();
        res.setJwt(jwt);
        res.setMessage("Login successful");
        res.setRole(seller.getRole());

        return ResponseEntity.ok(res);
    }

    @PatchMapping("/verify/{otp}")
    public ResponseEntity<AuthResponse> verifySellerEmail(@PathVariable String otp) throws Exception {

        VerificationCode verificationCode = verificationCodeRepository.findByOtp(otp);
        if (verificationCode == null || !verificationCode.getOtp().equals(otp)) {
            throw new Exception("Invalid OTP");
        }
        Seller seller = sellerService.verifyEmail(verificationCode.getEmail(), otp);

        // Generate JWT
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(seller.getRole().toString()));
        Authentication authentication = new UsernamePasswordAuthenticationToken(seller.getEmail(), null, authorities);
        String jwt = jwtProvider.generateToken(authentication);

        AuthResponse res = new AuthResponse();
        res.setJwt(jwt);
        res.setMessage("Email verified successfully");
        res.setRole(seller.getRole());

        return new ResponseEntity<>(res, HttpStatus.OK);

    }

    @PostMapping
    public ResponseEntity<Seller> createSeller(@RequestBody Seller seller) throws Exception {
        Seller savedSeller = sellerService.createSeller(seller);
        String otp = OtpUtil.generateOtp();
        VerificationCode verificationCode = new VerificationCode();
        verificationCode.setOtp(otp);
        verificationCode.setEmail(seller.getEmail());
        verificationCodeRepository.save(verificationCode);
        String subject = "Bazaar Email Verification Code";
        String text = "Welcome to Bazaar! verify your account using this link  :   ";
        String frontend_url = "http://localhost:3000/verify-seller/";
        emailService.sendVerificationOtpEmail(seller.getEmail(), verificationCode.getOtp(), subject,
                text + frontend_url);
        return new ResponseEntity<>(savedSeller, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Seller> getSellerById(@PathVariable Long id) throws Exception {
        Seller seller = sellerService.getSellerById(id);
        return new ResponseEntity<>(seller, HttpStatus.OK);
    }

    @GetMapping("/profile")
    public ResponseEntity<Seller> getSellerByJwt(@RequestHeader("Authorization") String jwt) throws Exception {

        Seller seller = sellerService.getSellerProfile(jwt);
        return new ResponseEntity<>(seller, HttpStatus.OK);
    }

    @GetMapping("/report")
    public ResponseEntity<SellerReport> getSellerReport(@RequestHeader("Authorization") String jwt) throws Exception {

        Seller seller = sellerService.getSellerProfile(jwt);
        SellerReport report = sellerReportSerive.getSellerReport(seller);
        return new ResponseEntity<>(report, HttpStatus.OK);
    }

    @GetMapping("/analytics/top-products")
    public ResponseEntity<List<TopSellingProductDTO>> getTopProducts(
            @RequestHeader("Authorization") String jwt,
            @RequestParam(defaultValue = "5") int limit) throws Exception {

        Seller seller = sellerService.getSellerProfile(jwt);
        List<TopSellingProductDTO> topProducts = sellerService.getTopSellingProducts(seller.getId(), limit);
        return ResponseEntity.ok(topProducts);
    }

    @GetMapping("/analytics/recent-orders")
    public ResponseEntity<List<Order>> getRecentOrders(
            @RequestHeader("Authorization") String jwt,
            @RequestParam(defaultValue = "10") int limit) throws Exception {

        Seller seller = sellerService.getSellerProfile(jwt);
        List<Order> recentOrders = sellerService.getRecentOrders(seller.getId(), limit);
        return ResponseEntity.ok(recentOrders);
    }

    @GetMapping
    public ResponseEntity<List<Seller>> getAllSellers(@RequestParam(required = false) AccountStatus status) {
        List<Seller> sellers = sellerService.getAllSellers(status);
        return ResponseEntity.ok(sellers);
    }

    @PatchMapping
    public ResponseEntity<Seller> updateSeller(@RequestHeader("Authorization") String jwt, @RequestBody Seller seller)
            throws Exception {
        Seller profile = sellerService.getSellerProfile(jwt);
        Seller updatedSeller = sellerService.updateSeller(profile.getId(), seller);
        return ResponseEntity.ok(updatedSeller);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSeller(@PathVariable Long id) throws Exception {
        sellerService.deleteSeller(id);
        return ResponseEntity.noContent().build();
    }

}
