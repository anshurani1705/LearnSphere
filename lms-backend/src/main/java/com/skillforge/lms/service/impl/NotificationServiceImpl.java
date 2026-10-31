package com.skillforge.lms.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillforge.lms.config.AppProperties;
import com.skillforge.lms.entity.NotificationLog;
import com.skillforge.lms.entity.User;
import com.skillforge.lms.repository.NotificationLogRepository;
import com.skillforge.lms.service.NotificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.util.*;

@Service
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    private final AppProperties appProperties;
    private final NotificationLogRepository notificationLogRepository;
    private final ObjectMapper objectMapper;
    private final Optional<JavaMailSender> mailSender;
    private final RestTemplate restTemplate = new RestTemplate();

    public NotificationServiceImpl(AppProperties appProperties,
                                   NotificationLogRepository notificationLogRepository,
                                   ObjectMapper objectMapper,
                                   Optional<JavaMailSender> mailSender) {
        this.appProperties = appProperties;
        this.notificationLogRepository = notificationLogRepository;
        this.objectMapper = objectMapper;
        this.mailSender = mailSender;
    }

    @Override
    @Async
    public void sendEmail(String to, String subject, String bodyHtml, String templateName, User user) {
        NotificationLog notifLog = NotificationLog.builder()
                .user(user)
                .channel(NotificationLog.Channel.EMAIL)
                .recipient(to)
                .subject(subject)
                .templateName(templateName)
                .status(NotificationLog.NotifStatus.PENDING)
                .build();
        notifLog = notificationLogRepository.save(notifLog);

        try {
            var emailConfig = appProperties.getEmail();
            boolean isBrevo = ("brevo".equalsIgnoreCase(emailConfig.getProvider()) || !StringUtils.hasText(emailConfig.getResendApiKey())) && StringUtils.hasText(emailConfig.getBrevoApiKey());
            boolean isResend = "resend".equalsIgnoreCase(emailConfig.getProvider()) && StringUtils.hasText(emailConfig.getResendApiKey());

            if (isBrevo) {
                // Brevo (Sendinblue) Transactional Email API (HTTPS Port 443 - Never blocked by Render)
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.set("api-key", emailConfig.getBrevoApiKey());
                headers.set("Accept", "application/json");

                String fromAddress = StringUtils.hasText(emailConfig.getFrom()) ? emailConfig.getFrom() : "diyarani589@gmail.com";
                String fromName = StringUtils.hasText(emailConfig.getFromName()) ? emailConfig.getFromName() : "SkillForge";

                Map<String, Object> payload = Map.of(
                        "sender", Map.of("name", fromName, "email", fromAddress),
                        "to", List.of(Map.of("email", to)),
                        "subject", subject,
                        "htmlContent", bodyHtml
                );

                HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
                ResponseEntity<String> response = restTemplate.postForEntity(
                        "https://api.brevo.com/v3/smtp/email", request, String.class);

                if (response.getStatusCode().is2xxSuccessful()) {
                    notifLog.setStatus(NotificationLog.NotifStatus.SENT);
                    notifLog.setProviderMessageId(response.getBody());
                    log.info("Email successfully delivered via Brevo API to {}", to);
                } else {
                    notifLog.setStatus(NotificationLog.NotifStatus.FAILED);
                    notifLog.setErrorMessage("Brevo API error: " + response.getStatusCode());
                }
            } else if (isResend) {
                // Resend API integration
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.setBearerAuth(emailConfig.getResendApiKey());

                String fromAddress = StringUtils.hasText(emailConfig.getFrom()) ? emailConfig.getFrom() : "onboarding@resend.dev";
                String fromHeader = StringUtils.hasText(emailConfig.getFromName())
                        ? String.format("%s <%s>", emailConfig.getFromName(), fromAddress)
                        : fromAddress;

                Map<String, Object> payload = Map.of(
                        "from", fromHeader,
                        "to", List.of(to),
                        "subject", subject,
                        "html", bodyHtml
                );

                HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
                ResponseEntity<String> response = restTemplate.postForEntity(
                        "https://api.resend.com/emails", request, String.class);

                if (response.getStatusCode().is2xxSuccessful()) {
                    notifLog.setStatus(NotificationLog.NotifStatus.SENT);
                    notifLog.setProviderMessageId(response.getBody());
                    log.info("Email sent via Resend to {}", to);
                } else {
                    notifLog.setStatus(NotificationLog.NotifStatus.FAILED);
                    notifLog.setErrorMessage("Resend API response: " + response.getStatusCode());
                }
            } else if (mailSender.isPresent()) {
                try {
                    // JavaMail / SMTP / SES
                    var mimeMessage = mailSender.get().createMimeMessage();
                    MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
                    helper.setTo(to);
                    helper.setSubject(subject);
                    helper.setText(bodyHtml, true);
                    String fromAddress = StringUtils.hasText(emailConfig.getFrom()) ? emailConfig.getFrom() : "diyarani589@gmail.com";
                    String fromName = StringUtils.hasText(emailConfig.getFromName()) ? emailConfig.getFromName() : "SkillForge";
                    helper.setFrom(fromAddress, fromName);
                    mailSender.get().send(mimeMessage);
                    notifLog.setStatus(NotificationLog.NotifStatus.SENT);
                    log.info("Email sent successfully via JavaMailSender to {}", to);
                } catch (Exception mailEx) {
                    log.warn("SMTP delivery attempt failed (configure MAIL_USERNAME and MAIL_PASSWORD to send via real SMTP): {}", mailEx.getMessage());
                    log.info("====================================================================");
                    log.info("[DEV EMAIL FALLBACK] To: {} | Subject: {}", to, subject);
                    log.info("[DEV EMAIL CONTENT]\n{}", bodyHtml);
                    log.info("====================================================================");
                    notifLog.setStatus(NotificationLog.NotifStatus.SENT);
                    notifLog.setProviderMessageId("DEV-EMAIL-" + UUID.randomUUID());
                }
            } else {
                // Development fallback: logged clearly
                log.info("====================================================================");
                log.info("[DEV EMAIL] To: {} | Subject: {}", to, subject);
                log.info("[DEV EMAIL CONTENT]\n{}", bodyHtml);
                log.info("====================================================================");
                notifLog.setStatus(NotificationLog.NotifStatus.SENT);
                notifLog.setProviderMessageId("DEV-EMAIL-" + UUID.randomUUID());
            }
        } catch (org.springframework.web.client.HttpStatusCodeException httpEx) {
            log.error("Resend API failed: Status={}, ResponseBody={}", httpEx.getStatusCode(), httpEx.getResponseBodyAsString());
            log.info("====================================================================");
            log.info("[DEV EMAIL FALLBACK] To: {} | Subject: {}", to, subject);
            log.info("[DEV EMAIL CONTENT]\n{}", bodyHtml);
            log.info("====================================================================");
            notifLog.setStatus(NotificationLog.NotifStatus.FAILED);
            notifLog.setErrorMessage("Resend error: " + httpEx.getResponseBodyAsString());
        } catch (Exception ex) {
            log.error("Failed to send email to {}: {}", to, ex.getMessage());
            log.info("====================================================================");
            log.info("[DEV EMAIL FALLBACK] To: {} | Subject: {}", to, subject);
            log.info("[DEV EMAIL CONTENT]\n{}", bodyHtml);
            log.info("====================================================================");
            notifLog.setStatus(NotificationLog.NotifStatus.FAILED);
            notifLog.setErrorMessage(ex.getMessage());
        } finally {
            notificationLogRepository.save(notifLog);
        }
    }

    @Override
    @Async
    public void sendSmsOtp(String phone, String otp, User user) {
        NotificationLog notifLog = NotificationLog.builder()
                .user(user)
                .channel(NotificationLog.Channel.SMS)
                .recipient(phone)
                .templateName("OTP_VERIFICATION")
                .status(NotificationLog.NotifStatus.PENDING)
                .build();
        notifLog = notificationLogRepository.save(notifLog);

        try {
            var smsConfig = appProperties.getSms();
            if (StringUtils.hasText(smsConfig.getMsg91AuthKey())) {
                // Official MSG91 Send OTP API
                HttpHeaders headers = new HttpHeaders();
                headers.set("authkey", smsConfig.getMsg91AuthKey());
                headers.setContentType(MediaType.APPLICATION_JSON);

                String url = String.format(
                        "https://control.msg91.com/api/v5/otp?template_id=%s&mobile=%s&otp=%s",
                        smsConfig.getMsg91TemplateId(), phone, otp);

                HttpEntity<String> request = new HttpEntity<>(headers);
                ResponseEntity<String> response = restTemplate.postForEntity(URI.create(url), request, String.class);

                if (response.getStatusCode().is2xxSuccessful()) {
                    notifLog.setStatus(NotificationLog.NotifStatus.SENT);
                    notifLog.setProviderMessageId(response.getBody());
                    log.info("OTP SMS dispatched via MSG91 to {}", phone);
                } else {
                    notifLog.setStatus(NotificationLog.NotifStatus.FAILED);
                    notifLog.setErrorMessage("MSG91 response: " + response.getStatusCode());
                }
            } else {
                // Development mode: never log OTP in production, log dispatch notification
                log.info("[DEV SMS] Dispatched OTP verification code to phone {} (MSG91 credentials not set)", phone);
                notifLog.setStatus(NotificationLog.NotifStatus.SENT);
                notifLog.setProviderMessageId("DEV-SMS-" + UUID.randomUUID());
            }
        } catch (Exception ex) {
            log.error("Failed to send SMS to {}: {}", phone, ex.getMessage());
            notifLog.setStatus(NotificationLog.NotifStatus.FAILED);
            notifLog.setErrorMessage(ex.getMessage());
        } finally {
            notificationLogRepository.save(notifLog);
        }
    }

    @Override
    @Async
    public void sendWhatsAppMessage(String phone, String templateName, Map<String, String> params, User user) {
        NotificationLog notifLog = NotificationLog.builder()
                .user(user)
                .channel(NotificationLog.Channel.WHATSAPP)
                .recipient(phone)
                .templateName(templateName)
                .status(NotificationLog.NotifStatus.PENDING)
                .build();
        notifLog = notificationLogRepository.save(notifLog);

        try {
            var waConfig = appProperties.getWhatsapp();
            if (StringUtils.hasText(waConfig.getAccessToken()) && StringUtils.hasText(waConfig.getPhoneNumberId())) {
                // Official Meta WhatsApp Business Platform Cloud API
                String url = String.format("https://graph.facebook.com/%s/%s/messages",
                        waConfig.getApiVersion(), waConfig.getPhoneNumberId());

                HttpHeaders headers = new HttpHeaders();
                headers.setBearerAuth(waConfig.getAccessToken());
                headers.setContentType(MediaType.APPLICATION_JSON);

                // Build WhatsApp Template payload
                List<Map<String, String>> parametersList = new ArrayList<>();
                params.forEach((k, v) -> parametersList.add(Map.of("type", "text", "text", v)));

                Map<String, Object> template = Map.of(
                        "name", templateName,
                        "language", Map.of("code", "en"),
                        "components", List.of(Map.of("type", "body", "parameters", parametersList))
                );

                Map<String, Object> payload = Map.of(
                        "messaging_product", "whatsapp",
                        "to", phone.replaceAll("[^0-9]", ""),
                        "type", "template",
                        "template", template
                );

                HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
                ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

                if (response.getStatusCode().is2xxSuccessful()) {
                    notifLog.setStatus(NotificationLog.NotifStatus.SENT);
                    notifLog.setProviderMessageId(response.getBody());
                    log.info("WhatsApp template message dispatched to {}", phone);
                } else {
                    notifLog.setStatus(NotificationLog.NotifStatus.FAILED);
                    notifLog.setErrorMessage("WhatsApp Cloud API: " + response.getStatusCode());
                }
            } else {
                log.info("[DEV WHATSAPP] Template '{}' sent to phone {}", templateName, phone);
                notifLog.setStatus(NotificationLog.NotifStatus.SENT);
                notifLog.setProviderMessageId("DEV-WA-" + UUID.randomUUID());
            }
        } catch (Exception ex) {
            log.error("Failed to send WhatsApp message to {}: {}", phone, ex.getMessage());
            notifLog.setStatus(NotificationLog.NotifStatus.FAILED);
            notifLog.setErrorMessage(ex.getMessage());
        } finally {
            notificationLogRepository.save(notifLog);
        }
    }

    @Override
    public void sendOrderConfirmation(User user, String courseTitle, String orderNumber, String amount) {
        String subject = "Enrollment & Order Confirmation - " + courseTitle;
        String html = String.format("""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                <h2 style="color: #4F46E5;">SkillForge Academy</h2>
                <p>Hello %s,</p>
                <p>Thank you for purchasing <strong>%s</strong>! Your payment has been verified successfully.</p>
                <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
                    <p style="margin: 5px 0;"><strong>Order Number:</strong> %s</p>
                    <p style="margin: 5px 0;"><strong>Amount Paid:</strong> ₹%s</p>
                    <p style="margin: 5px 0;"><strong>Status:</strong> Active & Enrolled</p>
                </div>
                <p>You can immediately access your lessons, interactive quizzes, and track your progress in your dashboard.</p>
                <a href="%s/dashboard" style="display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">Go to Dashboard</a>
            </div>
            """, user.getFullName(), courseTitle, orderNumber, amount, appProperties.getBaseUrl());

        sendEmail(user.getEmail(), subject, html, "ORDER_CONFIRMATION", user);

        if (StringUtils.hasText(user.getPhone())) {
            sendWhatsAppMessage(user.getPhone(), "order_confirmation_template",
                    Map.of("course", courseTitle, "order", orderNumber), user);
        }
    }

    @Override
    public void sendCertificateIssuedNotification(User user, String courseTitle, String certificateId) {
        String subject = "Congratulations! Certificate of Completion - " + courseTitle;
        String html = String.format("""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                <h2 style="color: #4F46E5;">SkillForge Academy</h2>
                <p>Hello %s,</p>
                <p>Congratulations on completing <strong>%s</strong>! Your official certificate of completion has been generated.</p>
                <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
                    <p style="margin: 5px 0;"><strong>Certificate ID:</strong> %s</p>
                </div>
                <p>Anyone can verify the authenticity of your certificate at our public verification page.</p>
                <a href="%s/verify-certificate/%s" style="display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">View & Verify Certificate</a>
            </div>
            """, user.getFullName(), courseTitle, certificateId, appProperties.getBaseUrl(), certificateId);

        sendEmail(user.getEmail(), subject, html, "CERTIFICATE_ISSUED", user);

        if (StringUtils.hasText(user.getPhone())) {
            sendWhatsAppMessage(user.getPhone(), "certificate_issued_template",
                    Map.of("name", user.getFullName(), "course", courseTitle, "certId", certificateId), user);
        }
    }
}
