package com.skillforge.lms.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillforge.lms.config.AppProperties;
import com.skillforge.lms.dto.order.CreateOrderRequest;
import com.skillforge.lms.dto.order.MockPaymentSimulationRequest;
import com.skillforge.lms.dto.order.MockPaymentSimulationResponse;
import com.skillforge.lms.dto.order.OrderResponseDto;
import com.skillforge.lms.dto.order.PaymentVerificationRequest;
import com.skillforge.lms.entity.*;
import com.skillforge.lms.exception.BadRequestException;
import com.skillforge.lms.exception.PaymentVerificationException;
import com.skillforge.lms.exception.ResourceNotFoundException;
import com.skillforge.lms.payment.*;
import com.skillforge.lms.repository.AuditLogRepository;
import com.skillforge.lms.repository.CourseRepository;
import com.skillforge.lms.repository.OrderRepository;
import com.skillforge.lms.repository.PaymentRepository;
import com.skillforge.lms.service.EnrollmentService;
import com.skillforge.lms.service.NotificationService;
import com.skillforge.lms.service.PaymentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HexFormat;
import java.util.UUID;

@Service
@Slf4j
public class PaymentServiceImpl implements PaymentService {

    private final AppProperties appProperties;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentService enrollmentService;
    private final NotificationService notificationService;
    private final AuditLogRepository auditLogRepository;
    private final PaymentProviderFactory paymentProviderFactory;
    private final ObjectMapper objectMapper;

    public PaymentServiceImpl(AppProperties appProperties,
                              OrderRepository orderRepository,
                              PaymentRepository paymentRepository,
                              CourseRepository courseRepository,
                              EnrollmentService enrollmentService,
                              NotificationService notificationService,
                              AuditLogRepository auditLogRepository,
                              PaymentProviderFactory paymentProviderFactory,
                              ObjectMapper objectMapper) {
        this.appProperties = appProperties;
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
        this.courseRepository = courseRepository;
        this.enrollmentService = enrollmentService;
        this.notificationService = notificationService;
        this.auditLogRepository = auditLogRepository;
        this.paymentProviderFactory = paymentProviderFactory;
        this.objectMapper = objectMapper;
    }

    @Override
    @Transactional
    public OrderResponseDto createOrder(CreateOrderRequest request, User user) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", request.getCourseId()));

        if (course.getStatus() != Course.CourseStatus.PUBLISHED) {
            throw new BadRequestException("This course is currently not open for enrollment.");
        }

        if (enrollmentService.isEnrolled(user.getId(), course.getId())) {
            throw new BadRequestException("You are already enrolled in this course.");
        }

        String orderNumber = "ORD-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        PaymentProvider activeProvider = paymentProviderFactory.getActiveProvider();

        Order order = Order.builder()
                .orderNumber(orderNumber)
                .user(user)
                .course(course)
                .amount(course.getPrice()) // Authoritative server-side price from DB!
                .currency(course.getCurrency())
                .status(Order.OrderStatus.PENDING)
                .provider(activeProvider.getProviderType())
                .build();

        // Delegate gateway order generation to selected provider abstraction
        GatewayOrderDetails gatewayDetails = activeProvider.createGatewayOrder(order, user);
        order.setRazorpayOrderId(gatewayDetails.getGatewayOrderId());
        order.setPaymentMode(gatewayDetails.getPaymentMode());

        order = orderRepository.save(order);
        log.info("Created order {} (provider: {}, mode: {}) for course '{}' and user {}",
                orderNumber, order.getProvider(), order.getPaymentMode(), course.getTitle(), user.getEmail());

        return OrderResponseDto.fromEntity(order, gatewayDetails.getGatewayKeyId());
    }

    @Override
    @Transactional
    public boolean verifyPaymentSignature(PaymentVerificationRequest request, User user) {
        Order order = orderRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order with gateway order ID " + request.getRazorpayOrderId() + " not found."));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Order does not belong to the authenticated user.");
        }

        if (order.getProvider() == PaymentProviderType.MOCK) {
            throw new BadRequestException("Mock orders must be completed through the development mock payment endpoint.");
        }

        // Idempotency check: if order is already marked PAID, return true
        if (order.getStatus() == Order.OrderStatus.PAID) {
            log.info("Order {} already marked as PAID, idempotent return", order.getOrderNumber());
            return true;
        }

        // Verify Razorpay HMAC-SHA256 signature
        var rzConfig = appProperties.getRazorpay();
        if (!StringUtils.hasText(rzConfig.getKeySecret())) {
            throw new PaymentVerificationException("Razorpay gateway secret is not configured for signature verification.");
        }

        String payload = request.getRazorpayOrderId() + "|" + request.getRazorpayPaymentId();
        String expectedSignature = calculateHmacSha256(payload, rzConfig.getKeySecret());

        if (!MessageDigest.isEqual(expectedSignature.getBytes(StandardCharsets.UTF_8),
                request.getRazorpaySignature().getBytes(StandardCharsets.UTF_8))) {
            log.error("Signature mismatch for order {}. Expected: {}, Received: {}",
                    order.getOrderNumber(), expectedSignature, request.getRazorpaySignature());
            order.setStatus(Order.OrderStatus.FAILED);
            orderRepository.save(order);
            throw new PaymentVerificationException("Invalid payment signature verification failed.");
        }

        // Record verified gateway payment entity
        Payment payment = Payment.builder()
                .order(order)
                .provider(PaymentProviderType.RAZORPAY)
                .paymentMode(order.getPaymentMode())
                .razorpayPaymentId(request.getRazorpayPaymentId())
                .razorpayOrderId(request.getRazorpayOrderId())
                .razorpaySignature(request.getRazorpaySignature())
                .transactionReference(request.getRazorpayPaymentId())
                .amount(order.getAmount())
                .currency(order.getCurrency())
                .status(Payment.PaymentStatus.CAPTURED)
                .method("RAZORPAY_CHECKOUT")
                .build();
        paymentRepository.save(payment);

        // Update Order to PAID
        order.setStatus(Order.OrderStatus.PAID);
        orderRepository.save(order);

        // Enroll student into course exactly once
        enrollmentService.enrollStudent(user, order.getCourse());

        // Audit log
        auditLogRepository.save(AuditLog.builder()
                .userId(user.getId())
                .action("PAYMENT_VERIFIED")
                .entityType("ORDER")
                .entityId(order.getId())
                .details(String.format("{\"orderNumber\":\"%s\",\"amount\":%s,\"provider\":\"RAZORPAY\",\"mode\":\"%s\"}",
                        order.getOrderNumber(), order.getAmount(), order.getPaymentMode()))
                .build());

        // Send confirmation notifications
        notificationService.sendOrderConfirmation(user, order.getCourse().getTitle(),
                order.getOrderNumber(), order.getAmount().toString());

        return true;
    }

    @Override
    @Transactional
    public MockPaymentSimulationResponse simulateMockPayment(MockPaymentSimulationRequest request, User user) {
        if (!appProperties.getPayment().isMockEnabled()) {
            throw new BadRequestException("Mock payments are disabled in this environment.");
        }

        Order order = orderRepository.findByOrderNumber(request.getOrderNumber())
                .orElseThrow(() -> new ResourceNotFoundException("Order with number " + request.getOrderNumber() + " not found."));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Order does not belong to the authenticated user.");
        }

        if (order.getProvider() != PaymentProviderType.MOCK) {
            throw new BadRequestException("Order was initiated with a real gateway provider and cannot be processed by the mock simulation.");
        }

        // Check idempotency if already PAID
        if (order.getStatus() == Order.OrderStatus.PAID) {
            if (request.getAction() == MockPaymentSimulationRequest.MockPaymentAction.SUCCESS) {
                log.info("Mock order {} is already marked as PAID; returning idempotent response", order.getOrderNumber());
                return MockPaymentSimulationResponse.builder()
                        .orderNumber(order.getOrderNumber())
                        .status("PAID")
                        .courseId(order.getCourse().getId())
                        .enrolled(true)
                        .transactionReference("MOCK-ALREADY-PAID")
                        .message("Order is already paid and course access is active.")
                        .build();
            } else {
                throw new BadRequestException("Order " + order.getOrderNumber() + " is already marked as PAID and cannot be modified.");
            }
        }

        if (order.getStatus() == Order.OrderStatus.CANCELLED) {
            throw new BadRequestException("Order " + order.getOrderNumber() + " was already cancelled.");
        }

        if (order.getStatus() != Order.OrderStatus.PENDING) {
            throw new BadRequestException("Order " + order.getOrderNumber() + " is in state " + order.getStatus() + " and cannot be simulated.");
        }

        switch (request.getAction()) {
            case SUCCESS -> {
                String mockTxnRef = "MOCK-TXN-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
                String mockPaymentId = "mock_pay_" + UUID.randomUUID().toString().replace("-", "");

                Payment payment = Payment.builder()
                        .order(order)
                        .provider(PaymentProviderType.MOCK)
                        .paymentMode(PaymentMode.MOCK)
                        .razorpayPaymentId(mockPaymentId)
                        .razorpayOrderId(order.getRazorpayOrderId())
                        .transactionReference(mockTxnRef)
                        .amount(order.getAmount())
                        .currency(order.getCurrency())
                        .status(Payment.PaymentStatus.CAPTURED)
                        .method("MOCK_GATEWAY")
                        .webhookVerified(false)
                        .build();
                paymentRepository.save(payment);

                order.setStatus(Order.OrderStatus.PAID);
                orderRepository.save(order);

                // Enroll student exactly once
                enrollmentService.enrollStudent(user, order.getCourse());

                // Audit log
                auditLogRepository.save(AuditLog.builder()
                        .userId(user.getId())
                        .action("MOCK_PAYMENT_SUCCESS")
                        .entityType("ORDER")
                        .entityId(order.getId())
                        .details(String.format("{\"orderNumber\":\"%s\",\"amount\":%s,\"provider\":\"MOCK\",\"txnRef\":\"%s\"}",
                                order.getOrderNumber(), order.getAmount(), mockTxnRef))
                        .build());

                // Notification
                notificationService.sendOrderConfirmation(user, order.getCourse().getTitle(),
                        order.getOrderNumber(), order.getAmount().toString());

                log.info("[MOCK PAYMENT SUCCESS] Order {} completed with reference {}", order.getOrderNumber(), mockTxnRef);

                return MockPaymentSimulationResponse.builder()
                        .orderNumber(order.getOrderNumber())
                        .status("PAID")
                        .courseId(order.getCourse().getId())
                        .enrolled(true)
                        .transactionReference(mockTxnRef)
                        .message("Development mock payment simulated successfully! Course unlocked.")
                        .build();
            }

            case FAILURE -> {
                String failureReason = StringUtils.hasText(request.getFailureReason())
                        ? request.getFailureReason().trim()
                        : "Simulated payment failure (card declined)";

                String mockFailPayId = "mock_fail_" + UUID.randomUUID().toString().replace("-", "");
                String mockFailTxnRef = "MOCK-FAIL-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();

                Payment payment = Payment.builder()
                        .order(order)
                        .provider(PaymentProviderType.MOCK)
                        .paymentMode(PaymentMode.MOCK)
                        .razorpayPaymentId(mockFailPayId)
                        .razorpayOrderId(order.getRazorpayOrderId())
                        .transactionReference(mockFailTxnRef)
                        .amount(order.getAmount())
                        .currency(order.getCurrency())
                        .status(Payment.PaymentStatus.FAILED)
                        .method("MOCK_GATEWAY")
                        .errorCode("MOCK_PAYMENT_FAILURE")
                        .errorDescription(failureReason)
                        .webhookVerified(false)
                        .build();
                paymentRepository.save(payment);

                order.setStatus(Order.OrderStatus.FAILED);
                orderRepository.save(order);

                auditLogRepository.save(AuditLog.builder()
                        .userId(user.getId())
                        .action("MOCK_PAYMENT_FAILED")
                        .entityType("ORDER")
                        .entityId(order.getId())
                        .details(String.format("{\"orderNumber\":\"%s\",\"reason\":\"%s\"}",
                                order.getOrderNumber(), failureReason))
                        .build());

                log.info("[MOCK PAYMENT FAILED] Order {} failed: {}", order.getOrderNumber(), failureReason);

                return MockPaymentSimulationResponse.builder()
                        .orderNumber(order.getOrderNumber())
                        .status("FAILED")
                        .courseId(order.getCourse().getId())
                        .enrolled(false)
                        .transactionReference(mockFailTxnRef)
                        .message("Simulated payment failed: " + failureReason)
                        .build();
            }

            case CANCEL -> {
                order.setStatus(Order.OrderStatus.CANCELLED);
                orderRepository.save(order);

                auditLogRepository.save(AuditLog.builder()
                        .userId(user.getId())
                        .action("MOCK_PAYMENT_CANCELLED")
                        .entityType("ORDER")
                        .entityId(order.getId())
                        .details(String.format("{\"orderNumber\":\"%s\"}", order.getOrderNumber()))
                        .build());

                log.info("[MOCK PAYMENT CANCELLED] Order {} was cancelled", order.getOrderNumber());

                return MockPaymentSimulationResponse.builder()
                        .orderNumber(order.getOrderNumber())
                        .status("CANCELLED")
                        .courseId(order.getCourse().getId())
                        .enrolled(false)
                        .message("Simulated payment checkout was cancelled.")
                        .build();
            }

            default -> throw new BadRequestException("Unsupported simulation action: " + request.getAction());
        }
    }

    @Override
    @Transactional
    public void processWebhook(String rawBody, String signatureHeader) {
        var rzConfig = appProperties.getRazorpay();
        if (StringUtils.hasText(rzConfig.getWebhookSecret())) {
            String expectedSig = calculateHmacSha256(rawBody, rzConfig.getWebhookSecret());
            if (!MessageDigest.isEqual(expectedSig.getBytes(StandardCharsets.UTF_8),
                    signatureHeader.getBytes(StandardCharsets.UTF_8))) {
                throw new PaymentVerificationException("Webhook signature verification failed");
            }
        }

        try {
            JsonNode root = objectMapper.readTree(rawBody);
            String event = root.path("event").asText();
            log.info("Received Razorpay webhook event: {}", event);

            if ("payment.captured".equals(event) || "order.paid".equals(event)) {
                JsonNode paymentEntity = root.path("payload").path("payment").path("entity");
                String rzOrderId = paymentEntity.path("order_id").asText();
                String rzPaymentId = paymentEntity.path("id").asText();

                var orderOpt = orderRepository.findByRazorpayOrderId(rzOrderId);
                if (orderOpt.isPresent()) {
                    Order order = orderOpt.get();
                    if (order.getStatus() != Order.OrderStatus.PAID) {
                        order.setStatus(Order.OrderStatus.PAID);
                        orderRepository.save(order);

                        // Save payment if not exists
                        if (!paymentRepository.existsByRazorpayPaymentId(rzPaymentId)) {
                            Payment payment = Payment.builder()
                                     .order(order)
                                    .provider(PaymentProviderType.RAZORPAY)
                                    .paymentMode(order.getPaymentMode())
                                    .razorpayPaymentId(rzPaymentId)
                                    .razorpayOrderId(rzOrderId)
                                    .transactionReference(rzPaymentId)
                                    .amount(order.getAmount())
                                    .currency(order.getCurrency())
                                    .status(Payment.PaymentStatus.CAPTURED)
                                    .webhookVerified(true)
                                    .build();
                            paymentRepository.save(payment);
                        }

                        // Ensure enrollment
                        enrollmentService.enrollStudent(order.getUser(), order.getCourse());

                        // Send confirmation
                        notificationService.sendOrderConfirmation(order.getUser(), order.getCourse().getTitle(),
                                order.getOrderNumber(), order.getAmount().toString());
                    }
                }
            }
        } catch (Exception e) {
            log.error("Error processing webhook payload", e);
            throw new BadRequestException("Webhook processing error: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderResponseDto> getUserOrders(User user, Pageable pageable) {
        return orderRepository.findByUserId(user.getId(), pageable)
                .map(o -> OrderResponseDto.fromEntity(o, appProperties.getRazorpay().getKeyId()));
    }

    @Override
    @Transactional(readOnly = true)
    public Order getOrderEntity(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));
    }

    private String calculateHmacSha256(String data, String secret) {
        try {
            Mac sha256Hmac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            sha256Hmac.init(secretKey);
            byte[] hash = sha256Hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (Exception e) {
            throw new RuntimeException("Error calculating HMAC-SHA256", e);
        }
    }
}
