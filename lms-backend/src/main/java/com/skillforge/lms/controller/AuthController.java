package com.skillforge.lms.controller;

import com.skillforge.lms.dto.auth.*;
import com.skillforge.lms.dto.common.ApiResponse;
import com.skillforge.lms.entity.User;
import com.skillforge.lms.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/auth")
@Tag(name = "Authentication", description = "Endpoints for registration, login, OTP verification, and password reset")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new student account")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletResponse response) {
        AuthResponse authResponse = authService.register(request, response);
        return ResponseEntity.ok(ApiResponse.success("Account registered successfully", authResponse));
    }

    @PostMapping("/login")
    @Operation(summary = "Login with email and password")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response) {
        AuthResponse authResponse = authService.login(request, response);
        return ResponseEntity.ok(ApiResponse.success("Logged in successfully", authResponse));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout and clear authentication cookies")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletResponse response) {
        authService.logout(response);
        return ResponseEntity.ok(ApiResponse.success("Logged out successfully", null));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user profile")
    public ResponseEntity<ApiResponse<AuthResponse>> getCurrentUser() {
        try {
            User user = authService.getCurrentUser();
            AuthResponse authResponse = AuthResponse.fromUser(user, null);
            return ResponseEntity.ok(ApiResponse.success(authResponse));
        } catch (com.skillforge.lms.exception.UnauthorizedException e) {
            return ResponseEntity.ok(ApiResponse.success(null));
        }
    }

    @PostMapping("/otp/request")
    @Operation(summary = "Request an OTP verification code via SMS or Email")
    public ResponseEntity<ApiResponse<java.util.Map<String, Object>>> requestOtp(@Valid @RequestBody OtpRequestDto request) {
        authService.requestOtp(request);
        java.util.Map<String, Object> data = new java.util.HashMap<>();
        data.put("email", request.getEmail());
        data.put("phone", request.getPhone());
        return ResponseEntity.ok(ApiResponse.success("Verification code sent successfully to your registered email", data));
    }

    @PostMapping("/otp/verify")
    @Operation(summary = "Verify an OTP code")
    public ResponseEntity<ApiResponse<Boolean>> verifyOtp(@Valid @RequestBody OtpVerifyDto request) {
        boolean verified = authService.verifyOtp(request);
        return ResponseEntity.ok(ApiResponse.success("Verification successful", verified));
    }

    @PostMapping("/password/reset-confirm")
    @Operation(summary = "Reset password using verified OTP code")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody PasswordResetConfirmDto request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.success("Password reset successfully. You can now login.", null));
    }
}
