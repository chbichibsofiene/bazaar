package com.bazar.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender javaMailSender;

    public void sendVerificationOtpEmail(String userEmail, String otp, String subject, String text)
            throws MessagingException {
        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, "utf-8");

            // Create HTML email template
            String htmlContent = buildSignupOtpEmailTemplate(otp);

            mimeMessageHelper.setSubject(subject);
            mimeMessageHelper.setText(htmlContent, true); // true = HTML content
            mimeMessageHelper.setTo(userEmail);
            mimeMessageHelper.setFrom("noreply@bazaar.com");

            javaMailSender.send(mimeMessage);
            System.out.println("✅ Signup OTP email sent successfully to: " + userEmail);

        } catch (Exception e) {
            // Log error but don't throw exception - fallback to console logging
            System.err.println("⚠️ Failed to send email to " + userEmail + ": " + e.getMessage());
            System.err.println("📧 SMTP Error - Using console fallback mode");
            System.out.println("===========================================");
            System.out.println("📧 EMAIL FALLBACK MODE");
            System.out.println("To: " + userEmail);
            System.out.println("Subject: " + subject);
            System.out.println("OTP Code: " + otp);
            System.out.println("===========================================");
            // Don't throw exception - allow signup to continue
        }
    }

    public void sendPasswordResetOtp(String userEmail, String otp) throws MessagingException {
        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, "utf-8");

            // Create HTML email template
            String htmlContent = buildPasswordResetEmailTemplate(otp);

            mimeMessageHelper.setSubject("Bazaar - Password Reset Code");
            mimeMessageHelper.setText(htmlContent, true); // true = HTML content
            mimeMessageHelper.setTo(userEmail);
            mimeMessageHelper.setFrom("noreply@bazaar.com");

            javaMailSender.send(mimeMessage);
            System.out.println("✅ Password reset OTP email sent successfully to: " + userEmail);

        } catch (Exception e) {
            // Log error but don't throw exception - fallback to console logging
            System.err.println("⚠️ Failed to send password reset email to " + userEmail + ": " + e.getMessage());
            System.err.println("📧 SMTP Error - Using console fallback mode");
            System.out.println("===========================================");
            System.out.println("📧 EMAIL FALLBACK MODE - PASSWORD RESET");
            System.out.println("To: " + userEmail);
            System.out.println("Subject: Bazaar - Password Reset Code");
            System.out.println("OTP Code: " + otp);
            System.out.println("===========================================");
            // Don't throw exception - allow password reset to continue
        }
    }

    private String buildSignupOtpEmailTemplate(String otp) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<style>" +
                "body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #e8f0f1; margin: 0; padding: 0; }"
                +
                ".container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(30, 32, 25, 0.1); }"
                +
                ".header { background: linear-gradient(135deg, #587B7F 0%, #394032 100%); padding: 40px 0; text-align: center; }"
                +
                ".header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: 1px; }" +
                ".content { padding: 40px; color: #1E2019; line-height: 1.6; }" +
                ".otp-box { background-color: #f8faf9; border: 2px dashed #8DAB7F; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0; }"
                +
                ".otp-code { font-size: 36px; font-weight: 700; color: #587B7F; letter-spacing: 5px; }" +
                ".footer { background-color: #f8faf9; padding: 20px; text-align: center; font-size: 12px; color: #5a5f52; border-top: 1px solid #d4dcd8; }"
                +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class=\"container\">" +
                "<div class=\"header\">" +
                "<h1>Welcome to Bazaar!</h1>" +
                "</div>" +
                "<div class=\"content\">" +
                "<p>Hello,</p>" +
                "<p>Thank you for joining our community. To complete your registration, please use the verification code below:</p>"
                +
                "<div class=\"otp-box\">" +
                "<div class=\"otp-code\">" + otp + "</div>" +
                "</div>" +
                "<p>This code will expire in 10 minutes.</p>" +
                "<p>If you didn't create an account with Bazaar, you can safely ignore this email.</p>" +
                "</div>" +
                "<div class=\"footer\">" +
                "<p>&copy; 2025 Bazaar Multi-Vendor Marketplace. All rights reserved.</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }

    private String buildPasswordResetEmailTemplate(String otp) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<style>" +
                "body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #e8f0f1; margin: 0; padding: 0; }"
                +
                ".container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(30, 32, 25, 0.1); }"
                +
                ".header { background: linear-gradient(135deg, #8DAB7F 0%, #587B7F 100%); padding: 40px 0; text-align: center; }"
                +
                ".header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: 1px; }" +
                ".content { padding: 40px; color: #1E2019; line-height: 1.6; }" +
                ".otp-box { background-color: #f8faf9; border: 2px dashed #587B7F; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0; }"
                +
                ".otp-code { font-size: 36px; font-weight: 700; color: #394032; letter-spacing: 5px; }" +
                ".footer { background-color: #f8faf9; padding: 20px; text-align: center; font-size: 12px; color: #5a5f52; border-top: 1px solid #d4dcd8; }"
                +
                ".warning { color: #c85a54; font-weight: bold; font-size: 14px; margin-top: 20px; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class=\"container\">" +
                "<div class=\"header\">" +
                "<h1>Password Reset Request</h1>" +
                "</div>" +
                "<div class=\"content\">" +
                "<p>Hello,</p>" +
                "<p>We received a request to reset your password. Use the code below to complete the process:</p>" +
                "<div class=\"otp-box\">" +
                "<div class=\"otp-code\">" + otp + "</div>" +
                "</div>" +
                "<p class=\"warning\">If you didn't request a password reset, please ignore this email immediately. Your account is safe.</p>"
                +
                "<p>This code will expire in 10 minutes.</p>" +
                "</div>" +
                "<div class=\"footer\">" +
                "<p>&copy; 2025 Bazaar Multi-Vendor Marketplace. All rights reserved.</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }

    public void sendOrderToDelivery(String deliveryEmail, String orderDetails, String sellerAddress) {
        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, "utf-8");

            String htmlContent = buildOrderDeliveryEmailTemplate(orderDetails, sellerAddress);

            mimeMessageHelper.setSubject("Bazaar - New Order for Delivery");
            mimeMessageHelper.setText(htmlContent, true);
            mimeMessageHelper.setTo(deliveryEmail);
            mimeMessageHelper.setFrom("noreply@bazaar.com");

            javaMailSender.send(mimeMessage);
            System.out.println("✅ Order delivery email sent successfully to: " + deliveryEmail);

        } catch (Exception e) {
            System.err.println("⚠️ Failed to send delivery email to " + deliveryEmail + ": " + e.getMessage());
            System.err.println("📧 SMTP Error - Using console fallback mode");
            System.out.println("===========================================");
            System.out.println("📧 EMAIL FALLBACK MODE - ORDER DELIVERY");
            System.out.println("To: " + deliveryEmail);
            System.out.println("Subject: Bazaar - New Order for Delivery");
            System.out.println("Order Details:\n" + orderDetails);
            System.out.println("Seller Address:\n" + sellerAddress);
            System.out.println("===========================================");
        }
    }

    private String buildOrderDeliveryEmailTemplate(String orderDetails, String sellerAddress) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<style>" +
                "body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #e8f0f1; margin: 0; padding: 0; }"
                +
                ".container { max-width: 700px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(30, 32, 25, 0.1); }"
                +
                ".header { background: linear-gradient(135deg, #587B7F 0%, #394032 100%); padding: 40px 0; text-align: center; }"
                +
                ".header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: 1px; }" +
                ".content { padding: 40px; color: #1E2019; line-height: 1.6; }" +
                ".section { background-color: #f8faf9; border-left: 4px solid #587B7F; padding: 20px; margin: 20px 0; border-radius: 4px; }"
                +
                ".section h3 { color: #587B7F; margin-top: 0; font-size: 18px; }" +
                ".section p { margin: 8px 0; white-space: pre-line; }" +
                ".footer { background-color: #f8faf9; padding: 20px; text-align: center; font-size: 12px; color: #5a5f52; border-top: 1px solid #d4dcd8; }"
                +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class=\"container\">" +
                "<div class=\"header\">" +
                "<h1>📦 New Order for Delivery</h1>" +
                "</div>" +
                "<div class=\"content\">" +
                "<p>Hello Delivery Team,</p>" +
                "<p>A new order is ready for pickup and delivery. Please find the details below:</p>" +
                "<div class=\"section\">" +
                "<h3>📋 Order Details</h3>" +
                "<p>" + orderDetails + "</p>" +
                "</div>" +
                "<div class=\"section\">" +
                "<h3>📍 Pickup Address (Seller Location)</h3>" +
                "<p>" + sellerAddress + "</p>" +
                "</div>" +
                "<p>Please coordinate with the seller for pickup at your earliest convenience.</p>" +
                "</div>" +
                "<div class=\"footer\">" +
                "<p>&copy; 2025 Bazaar Multi-Vendor Marketplace. All rights reserved.</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }
}
