package com.skillforge.lms.payment;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillforge.lms.config.AppProperties;
import com.skillforge.lms.entity.Order;
import com.skillforge.lms.entity.User;
import com.skillforge.lms.exception.BadRequestException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.Map;

@Component
@Slf4j
public class RazorpayPaymentProvider implements PaymentProvider {

    private final AppProperties appProperties;
    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate;

    public RazorpayPaymentProvider(AppProperties appProperties, ObjectMapper objectMapper) {
        this.appProperties = appProperties;
        this.objectMapper = objectMapper;
        this.restTemplate = new RestTemplate();
    }

    @Override
    public PaymentProviderType getProviderType() {
        return PaymentProviderType.RAZORPAY;
    }

    @Override
    public boolean isAvailable() {
        var rzConfig = appProperties.getRazorpay();
        return rzConfig != null
                && StringUtils.hasText(rzConfig.getKeyId())
                && StringUtils.hasText(rzConfig.getKeySecret());
    }

    @Override
    public GatewayOrderDetails createGatewayOrder(Order order, User user) {
        var rzConfig = appProperties.getRazorpay();
        if (!isAvailable()) {
            throw new BadRequestException("Razorpay payment gateway is not configured on this server. " +
                    "Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET or configure development mock provider.");
        }

        String keyId = rzConfig.getKeyId();
        String keySecret = rzConfig.getKeySecret();
        PaymentMode paymentMode = keyId.startsWith("rzp_live_") ? PaymentMode.LIVE : PaymentMode.TEST;

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBasicAuth(keyId, keySecret);

            long amountInPaise = order.getAmount().multiply(new BigDecimal(100)).longValue();
            Map<String, Object> body = Map.of(
                    "amount", amountInPaise,
                    "currency", order.getCurrency(),
                    "receipt", order.getOrderNumber(),
                    "notes", Map.of(
                            "courseId", order.getCourse().getId().toString(),
                            "userId", user.getId().toString()
                    )
            );

            HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(
                    "https://api.razorpay.com/v1/orders", httpEntity, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                String rzOrderId = root.get("id").asText();
                log.info("[RAZORPAY] Created gateway order {} (mode: {}) for LMS order {}",
                        rzOrderId, paymentMode, order.getOrderNumber());

                return GatewayOrderDetails.builder()
                        .gatewayOrderId(rzOrderId)
                        .gatewayKeyId(keyId)
                        .providerType(PaymentProviderType.RAZORPAY)
                        .paymentMode(paymentMode)
                        .mockMode(false)
                        .build();
            } else {
                throw new BadRequestException("Failed to create order with Razorpay: " + response.getStatusCode());
            }
        } catch (BadRequestException e) {
            throw e;
        } catch (org.springframework.web.client.HttpStatusCodeException ex) {
            log.error("[RAZORPAY] Razorpay API error (status {}): {}", ex.getStatusCode(), ex.getResponseBodyAsString());
            throw new BadRequestException("Razorpay API error: " + ex.getResponseBodyAsString());
        } catch (Exception ex) {
            log.error("[RAZORPAY] Error creating order with Razorpay API", ex);
            throw new BadRequestException("Unable to contact Razorpay payment gateway: " + ex.getMessage());
        }
    }
}
