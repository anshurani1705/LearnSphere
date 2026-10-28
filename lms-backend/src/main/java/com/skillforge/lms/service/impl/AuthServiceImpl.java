package com.skillforge.lms.service.impl;

import com.skillforge.lms.config.AppProperties;
import com.skillforge.lms.dto.auth.*;
import com.skillforge.lms.entity.OtpRecord;
import com.skillforge.lms.entity.User;
import com.skillforge.lms.exception.BadRequestException;
import com.skillforge.lms.exception.ResourceNotFoundException;
import com.skillforge.lms.exception.UnauthorizedException;
import com.skillforge.lms.repository.OtpRecordRepository;
import com.skillforge.lms.repository.UserRepository;
import com.skillforge.lms.security.JwtTokenProvider;
import com.skillforge.lms.security.UserPrincipal;
import com.skillforge.lms.service.AuthService;
import com.skillforge.lms.service.NotificationService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final OtpRecordRepository otpRecordRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final NotificationService notificationService;
    private final AppProperties appProperties;
    private final SecureRandom secureRandom = new SecureRandom();

    public AuthServiceImpl(UserRepository userRepository,
                           OtpRecordRepository otpRecordRepository,
                           PasswordEncoder passwordEncoder,
                           JwtTokenProvider tokenProvider,
                           NotificationService notificationService,
                           AppProperties appProperties) {
        this.userRepository = userRepository;
        this.otpRecordRepository = otpRecordRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.notificationService = notificationService;
        this.appProperties = appProperties;
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request, HttpServletResponse response) {
        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new BadRequestException("An account with this email address already exists.");
        }

        User user = User.builder()
                .email(request.getEmail().toLowerCase().trim())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName().trim())
                .phone(request.getPhone() != null ? request.getPhone().trim() : null)
                .role(User.Role.STUDENT)
                .enabled(true)
                .build();

        user = userRepository.save(user);

        String token = tokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        setAuthCookie(response, token);

        // Send welcome email
        notificationService.sendEmail(user.getEmail(),
                "Welcome to SkillForge Academy!",
                String.format("<p>Hello %s,</p><p>Welcome to SkillForge Academy! Your account has been created successfully.</p>", user.getFullName()),
                "WELCOME_EMAIL", user);

        return AuthResponse.fromUser(user, token);
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request, HttpServletResponse response) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password."));

        if (!user.isEnabled()) {
            throw new UnauthorizedException("Your account has been deactivated. Please contact support.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid email or password.");
        }

        String token = tokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        setAuthCookie(response, token);

        return AuthResponse.fromUser(user, token);
    }

    @Override
    public void logout(HttpServletResponse response) {
        clearAuthCookie(response);
    }

    @Override
    @Transactional
    public String requestOtp(OtpRequestDto request) {
        OtpRecord.OtpPurpose purpose;
        try {
            purpose = OtpRecord.OtpPurpose.valueOf(request.getPurpose());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid OTP purpose: " + request.getPurpose());
        }

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime cooldownThreshold = now.minusSeconds(appProperties.getSms().getOtpResendCooldownSeconds());

        User user = null;
        if (StringUtils.hasText(request.getEmail())) {
            String cleanEmail = request.getEmail().toLowerCase().trim();
            user = userRepository.findByEmail(cleanEmail).orElse(null);
            
            // Validate that account exists when resetting password
            if (purpose == OtpRecord.OtpPurpose.PASSWORD_RESET && user == null) {
                throw new BadRequestException("No registered account found with email: " + cleanEmail);
            }

            long recentCount = otpRecordRepository.countByEmailAndPurposeAndCreatedAtAfter(
                    cleanEmail, purpose, cooldownThreshold);
            if (recentCount > 0) {
                throw new BadRequestException("Please wait " + appProperties.getSms().getOtpResendCooldownSeconds() +
                        " seconds before requesting a new verification code.");
            }
        } else if (StringUtils.hasText(request.getPhone())) {
            String cleanPhone = request.getPhone().trim();
            user = userRepository.findByPhone(cleanPhone).orElse(null);
            
            if (purpose == OtpRecord.OtpPurpose.PASSWORD_RESET && user == null) {
                throw new BadRequestException("No registered account found with phone number: " + cleanPhone);
            }

            long recentCount = otpRecordRepository.countByPhoneAndPurposeAndCreatedAtAfter(
                    cleanPhone, purpose, cooldownThreshold);
            if (recentCount > 0) {
                throw new BadRequestException("Please wait " + appProperties.getSms().getOtpResendCooldownSeconds() +
                        " seconds before requesting a new verification code.");
            }
        } else {
            throw new BadRequestException("Either phone or email must be provided to request an OTP.");
        }

        // Generate 6-digit cryptographically secure OTP
        int otpCode = 100000 + secureRandom.nextInt(900000);
        String otpString = String.valueOf(otpCode);

        OtpRecord otpRecord = OtpRecord.builder()
                .user(user)
                .email(request.getEmail() != null ? request.getEmail().toLowerCase().trim() : null)
                .phone(request.getPhone() != null ? request.getPhone().trim() : null)
                .otpHash(passwordEncoder.encode(otpString))
                .purpose(purpose)
                .attempts(0)
                .verified(false)
                .expiresAt(now.plusSeconds(appProperties.getSms().getOtpExpirySeconds()))
                .build();

        otpRecordRepository.save(otpRecord);

        log.info("====================================================================");
        log.info("🔑 [DEV OTP] Purpose: {} | Target: {} | CODE: [{}]", 
                purpose, 
                request.getEmail() != null ? request.getEmail() : request.getPhone(), 
                otpString);
        log.info("====================================================================");

        // Dispatch via appropriate channel
        if (StringUtils.hasText(request.getPhone())) {
            notificationService.sendSmsOtp(request.getPhone().trim(), otpString, user);
        } else if (StringUtils.hasText(request.getEmail())) {
            String recipientEmail = (user != null && StringUtils.hasText(user.getEmail()))
                    ? user.getEmail()
                    : request.getEmail().toLowerCase().trim();
            String htmlContent = String.format(
                    "<div style=\"font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px;\">" +
                    "<div style=\"margin-bottom: 24px;\"><h2 style=\"margin: 0; color: #4F46E5; font-size: 22px; font-weight: 800;\">SkillForge Academy</h2></div>" +
                    "<h3 style=\"margin: 0 0 12px 0; color: #0f172a; font-size: 18px;\">Password Reset Verification Code</h3>" +
                    "<p style=\"margin: 0 0 20px 0; color: #475569; font-size: 14px; line-height: 1.6;\">We received a request to reset your password. Use the 6-digit code below to set a new password:</p>" +
                    "<div style=\"background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;\">" +
                    "<span style=\"font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #4F46E5; font-family: monospace;\">%s</span>" +
                    "</div>" +
                    "<p style=\"margin: 0 0 16px 0; color: #64748b; font-size: 13px; line-height: 1.5;\">This verification code expires in <strong>5 minutes</strong>. If you did not request this password reset, please ignore this email.</p>" +
                    "<hr style=\"border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;\" />" +
                    "<p style=\"margin: 0; color: #94a3b8; font-size: 12px; text-align: center;\">SkillForge Academy &bull; Secure Learning Platform</p>" +
                    "</div>", otpString);

            notificationService.sendEmail(recipientEmail,
                    "SkillForge Password Reset Code: " + otpString,
                    htmlContent,
                    "PASSWORD_RESET_OTP", user);
        }

        return otpString;
    }

    @Override
    @Transactional
    public boolean verifyOtp(OtpVerifyDto request) {
        OtpRecord.OtpPurpose purpose;
        try {
            purpose = OtpRecord.OtpPurpose.valueOf(request.getPurpose());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid OTP purpose: " + request.getPurpose());
        }

        LocalDateTime now = LocalDateTime.now();
        OtpRecord record;

        if (StringUtils.hasText(request.getPhone())) {
            record = otpRecordRepository.findTopByPhoneAndPurposeAndVerifiedFalseAndExpiresAtAfterOrderByCreatedAtDesc(
                    request.getPhone().trim(), purpose, now)
                    .orElseThrow(() -> new BadRequestException("No active verification code found or code has expired."));
        } else if (StringUtils.hasText(request.getEmail())) {
            record = otpRecordRepository.findTopByEmailAndPurposeAndVerifiedFalseAndExpiresAtAfterOrderByCreatedAtDesc(
                    request.getEmail().toLowerCase().trim(), purpose, now)
                    .orElseThrow(() -> new BadRequestException("No active verification code found or code has expired."));
        } else {
            throw new BadRequestException("Either phone or email must be provided.");
        }

        if (record.getAttempts() >= appProperties.getSms().getOtpMaxAttempts()) {
            throw new BadRequestException("Maximum attempt limit reached. Please request a new verification code.");
        }

        record.setAttempts(record.getAttempts() + 1);

        if (!passwordEncoder.matches(request.getOtp(), record.getOtpHash())) {
            otpRecordRepository.save(record);
            throw new BadRequestException("Invalid verification code. Please check and try again.");
        }

        record.setVerified(true);
        otpRecordRepository.save(record);

        // If user exists, update verified flag
        if (record.getUser() != null) {
            User u = record.getUser();
            if (purpose == OtpRecord.OtpPurpose.PHONE_VERIFY) {
                u.setPhoneVerified(true);
                userRepository.save(u);
            } else if (purpose == OtpRecord.OtpPurpose.EMAIL_VERIFY) {
                u.setEmailVerified(true);
                userRepository.save(u);
            }
        }

        return true;
    }

    @Override
    @Transactional
    public void resetPassword(PasswordResetConfirmDto request) {
        String cleanEmail = request.getEmail().toLowerCase().trim();
        User user = userRepository.findByEmail(cleanEmail)
                .orElseThrow(() -> new BadRequestException("No registered account found with email: " + cleanEmail));

        if (!StringUtils.hasText(request.getNewPassword()) || request.getNewPassword().trim().length() < 8) {
            throw new BadRequestException("New password must be at least 8 characters long.");
        }

        // Verify OTP was submitted and matches
        OtpVerifyDto verifyDto = new OtpVerifyDto();
        verifyDto.setEmail(cleanEmail);
        verifyDto.setOtp(request.getOtp().trim());
        verifyDto.setPurpose("PASSWORD_RESET");
        verifyOtp(verifyDto);

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword().trim()));
        userRepository.save(user);

        notificationService.sendEmail(user.getEmail(),
                "Your SkillForge Password Was Reset Successfully",
                "<div style=\"font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;\">" +
                "<h3 style=\"color: #4F46E5;\">SkillForge Academy</h3>" +
                "<p>Your password has been successfully reset. You can now log into your account using your new credentials.</p>" +
                "<p style=\"color: #e11d48; font-size: 13px;\">If you did not initiate this change, please contact support immediately.</p>" +
                "</div>",
                "PASSWORD_RESET_SUCCESS", user);
    }

    @Override
    @Transactional(readOnly = true)
    public User getCurrentUser() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserPrincipal principal)) {
            throw new UnauthorizedException("You must be logged in to perform this operation.");
        }
        return userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", principal.getId()));
    }

    @Override
    public void setAuthCookie(HttpServletResponse response, String token) {
        var jwtConfig = appProperties.getJwt();
        ResponseCookie cookie = ResponseCookie.from(jwtConfig.getCookieName(), token)
                .httpOnly(true)
                .secure(jwtConfig.isCookieSecure())
                .path("/")
                .maxAge(jwtConfig.getExpirationMs() / 1000)
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    @Override
    public void clearAuthCookie(HttpServletResponse response) {
        var jwtConfig = appProperties.getJwt();
        ResponseCookie cookie = ResponseCookie.from(jwtConfig.getCookieName(), "")
                .httpOnly(true)
                .secure(jwtConfig.isCookieSecure())
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}
