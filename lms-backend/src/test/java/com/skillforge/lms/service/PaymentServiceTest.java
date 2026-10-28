package com.skillforge.lms.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillforge.lms.config.AppProperties;
import com.skillforge.lms.dto.order.CreateOrderRequest;
import com.skillforge.lms.dto.order.MockPaymentSimulationRequest;
import com.skillforge.lms.dto.order.MockPaymentSimulationResponse;
import com.skillforge.lms.dto.order.PaymentVerificationRequest;
import com.skillforge.lms.entity.Course;
import com.skillforge.lms.entity.Order;
import com.skillforge.lms.entity.Payment;
import com.skillforge.lms.entity.User;
import com.skillforge.lms.exception.BadRequestException;
import com.skillforge.lms.exception.PaymentVerificationException;
import com.skillforge.lms.payment.*;
import com.skillforge.lms.repository.AuditLogRepository;
import com.skillforge.lms.repository.CourseRepository;
import com.skillforge.lms.repository.OrderRepository;
import com.skillforge.lms.repository.PaymentRepository;
import com.skillforge.lms.service.impl.PaymentServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.HexFormat;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private AppProperties appProperties;
    @Mock
    private OrderRepository orderRepository;
    @Mock
    private PaymentRepository paymentRepository;
    @Mock
    private CourseRepository courseRepository;
    @Mock
    private EnrollmentService enrollmentService;
    @Mock
    private NotificationService notificationService;
    @Mock
    private AuditLogRepository auditLogRepository;
    @Mock
    private PaymentProviderFactory paymentProviderFactory;
    @Mock
    private PaymentProvider activePaymentProvider;
    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private PaymentServiceImpl paymentService;

    private User sampleUser;
    private User anotherUser;
    private Course sampleCourse;
    private AppProperties.RazorpayProperties rzProps;
    private AppProperties.PaymentProperties paymentProps;

    @BeforeEach
    void setUp() {
        rzProps = new AppProperties.RazorpayProperties();
        rzProps.setKeyId("rzp_test_key");
        rzProps.setKeySecret("rzp_secret_12345");
        rzProps.setWebhookSecret("rzp_webhook_12345");

        paymentProps = new AppProperties.PaymentProperties();
        paymentProps.setProvider("mock");
        paymentProps.setMockEnabled(true);

        lenient().when(appProperties.getRazorpay()).thenReturn(rzProps);
        lenient().when(appProperties.getPayment()).thenReturn(paymentProps);

        sampleUser = User.builder()
                .id(1L)
                .email("student@test.com")
                .fullName("Test Student")
                .role(User.Role.STUDENT)
                .build();

        anotherUser = User.builder()
                .id(2L)
                .email("attacker@test.com")
                .fullName("Attacker")
                .role(User.Role.STUDENT)
                .build();

        sampleCourse = Course.builder()
                .id(10L)
                .title("Full Stack Web Development")
                .price(new BigDecimal("4999.00"))
                .currency("INR")
                .status(Course.CourseStatus.PUBLISHED)
                .build();
    }

    @Test
    void createOrder_UsesAuthoritativeServerPrice() {
        CreateOrderRequest req = new CreateOrderRequest();
        req.setCourseId(10L);

        when(courseRepository.findById(10L)).thenReturn(Optional.of(sampleCourse));
        when(enrollmentService.isEnrolled(1L, 10L)).thenReturn(false);
        when(paymentProviderFactory.getActiveProvider()).thenReturn(activePaymentProvider);
        when(activePaymentProvider.getProviderType()).thenReturn(PaymentProviderType.MOCK);
        when(activePaymentProvider.createGatewayOrder(any(), any())).thenReturn(
                GatewayOrderDetails.builder()
                        .gatewayOrderId("mock_ord_12345")
                        .gatewayKeyId("mock_key")
                        .providerType(PaymentProviderType.MOCK)
                        .paymentMode(PaymentMode.MOCK)
                        .mockMode(true)
                        .build()
        );

        when(orderRepository.save(any(Order.class))).thenAnswer(i -> {
            Order o = i.getArgument(0);
            o.setId(100L);
            return o;
        });

        var orderRes = paymentService.createOrder(req, sampleUser);

        assertNotNull(orderRes);
        assertEquals(new BigDecimal("4999.00"), orderRes.getAmount());
        assertEquals("INR", orderRes.getCurrency());
        assertTrue(orderRes.isMockMode());
        assertEquals("MOCK", orderRes.getProvider());
        verify(orderRepository).save(argThat(order ->
                order.getAmount().compareTo(new BigDecimal("4999.00")) == 0 &&
                order.getProvider() == PaymentProviderType.MOCK
        ));
    }

    @Test
    void createOrder_UnpublishedCourse_ThrowsBadRequestException() {
        Course unpublishedCourse = Course.builder()
                .id(11L)
                .title("Draft Course")
                .price(new BigDecimal("1999.00"))
                .currency("INR")
                .status(Course.CourseStatus.DRAFT)
                .build();

        CreateOrderRequest req = new CreateOrderRequest();
        req.setCourseId(11L);

        when(courseRepository.findById(11L)).thenReturn(Optional.of(unpublishedCourse));

        assertThrows(BadRequestException.class, () -> paymentService.createOrder(req, sampleUser));
        verify(orderRepository, never()).save(any());
    }

    @Test
    void createOrder_AlreadyEnrolled_ThrowsBadRequestException() {
        CreateOrderRequest req = new CreateOrderRequest();
        req.setCourseId(10L);

        when(courseRepository.findById(10L)).thenReturn(Optional.of(sampleCourse));
        when(enrollmentService.isEnrolled(1L, 10L)).thenReturn(true);

        assertThrows(BadRequestException.class, () -> paymentService.createOrder(req, sampleUser));
        verify(orderRepository, never()).save(any());
    }

    @Test
    void simulateMockPayment_Success_EnrollsStudentAndCreatesPaymentRecord() {
        Order order = Order.builder()
                .id(100L)
                .orderNumber("ORD-1001")
                .user(sampleUser)
                .course(sampleCourse)
                .amount(sampleCourse.getPrice())
                .currency("INR")
                .status(Order.OrderStatus.PENDING)
                .provider(PaymentProviderType.MOCK)
                .paymentMode(PaymentMode.MOCK)
                .razorpayOrderId("mock_ord_1001")
                .build();

        when(orderRepository.findByOrderNumber("ORD-1001")).thenReturn(Optional.of(order));

        MockPaymentSimulationRequest req = new MockPaymentSimulationRequest();
        req.setOrderNumber("ORD-1001");
        req.setAction(MockPaymentSimulationRequest.MockPaymentAction.SUCCESS);

        MockPaymentSimulationResponse response = paymentService.simulateMockPayment(req, sampleUser);

        assertNotNull(response);
        assertEquals("PAID", response.getStatus());
        assertTrue(response.isEnrolled());
        assertTrue(response.getTransactionReference().startsWith("MOCK-TXN-"));

        assertEquals(Order.OrderStatus.PAID, order.getStatus());
        verify(paymentRepository).save(argThat(p ->
                p.getProvider() == PaymentProviderType.MOCK &&
                p.getPaymentMode() == PaymentMode.MOCK &&
                p.getStatus() == Payment.PaymentStatus.CAPTURED &&
                p.getAmount().compareTo(sampleCourse.getPrice()) == 0
        ));
        verify(enrollmentService).enrollStudent(sampleUser, sampleCourse);
        verify(notificationService).sendOrderConfirmation(any(), any(), any(), any());
    }

    @Test
    void simulateMockPayment_Failure_DoesNotEnrollAndMarksFailed() {
        Order order = Order.builder()
                .id(100L)
                .orderNumber("ORD-1002")
                .user(sampleUser)
                .course(sampleCourse)
                .amount(sampleCourse.getPrice())
                .status(Order.OrderStatus.PENDING)
                .provider(PaymentProviderType.MOCK)
                .paymentMode(PaymentMode.MOCK)
                .razorpayOrderId("mock_ord_1002")
                .build();

        when(orderRepository.findByOrderNumber("ORD-1002")).thenReturn(Optional.of(order));

        MockPaymentSimulationRequest req = new MockPaymentSimulationRequest();
        req.setOrderNumber("ORD-1002");
        req.setAction(MockPaymentSimulationRequest.MockPaymentAction.FAILURE);
        req.setFailureReason("Insufficient bank balance");

        MockPaymentSimulationResponse response = paymentService.simulateMockPayment(req, sampleUser);

        assertNotNull(response);
        assertEquals("FAILED", response.getStatus());
        assertFalse(response.isEnrolled());
        assertEquals(Order.OrderStatus.FAILED, order.getStatus());

        verify(paymentRepository).save(argThat(p ->
                p.getProvider() == PaymentProviderType.MOCK &&
                p.getStatus() == Payment.PaymentStatus.FAILED &&
                "Insufficient bank balance".equals(p.getErrorDescription())
        ));
        verify(enrollmentService, never()).enrollStudent(any(), any());
    }

    @Test
    void simulateMockPayment_Cancel_DoesNotEnrollAndMarksCancelled() {
        Order order = Order.builder()
                .id(100L)
                .orderNumber("ORD-1003")
                .user(sampleUser)
                .course(sampleCourse)
                .amount(sampleCourse.getPrice())
                .status(Order.OrderStatus.PENDING)
                .provider(PaymentProviderType.MOCK)
                .paymentMode(PaymentMode.MOCK)
                .razorpayOrderId("mock_ord_1003")
                .build();

        when(orderRepository.findByOrderNumber("ORD-1003")).thenReturn(Optional.of(order));

        MockPaymentSimulationRequest req = new MockPaymentSimulationRequest();
        req.setOrderNumber("ORD-1003");
        req.setAction(MockPaymentSimulationRequest.MockPaymentAction.CANCEL);

        MockPaymentSimulationResponse response = paymentService.simulateMockPayment(req, sampleUser);

        assertNotNull(response);
        assertEquals("CANCELLED", response.getStatus());
        assertFalse(response.isEnrolled());
        assertEquals(Order.OrderStatus.CANCELLED, order.getStatus());

        verify(enrollmentService, never()).enrollStudent(any(), any());
    }

    @Test
    void simulateMockPayment_DuplicateSuccess_IsIdempotentAndDoesNotDuplicateEnrollment() {
        Order order = Order.builder()
                .id(100L)
                .orderNumber("ORD-1004")
                .user(sampleUser)
                .course(sampleCourse)
                .amount(sampleCourse.getPrice())
                .status(Order.OrderStatus.PAID) // Already paid
                .provider(PaymentProviderType.MOCK)
                .paymentMode(PaymentMode.MOCK)
                .razorpayOrderId("mock_ord_1004")
                .build();

        when(orderRepository.findByOrderNumber("ORD-1004")).thenReturn(Optional.of(order));

        MockPaymentSimulationRequest req = new MockPaymentSimulationRequest();
        req.setOrderNumber("ORD-1004");
        req.setAction(MockPaymentSimulationRequest.MockPaymentAction.SUCCESS);

        MockPaymentSimulationResponse response = paymentService.simulateMockPayment(req, sampleUser);

        assertNotNull(response);
        assertEquals("PAID", response.getStatus());
        assertTrue(response.isEnrolled());

        // Verify enrollStudent was NOT called again
        verify(enrollmentService, never()).enrollStudent(any(), any());
        verify(paymentRepository, never()).save(any());
    }

    @Test
    void simulateMockPayment_AnotherStudentsOrder_ThrowsBadRequestException() {
        Order order = Order.builder()
                .id(100L)
                .orderNumber("ORD-1005")
                .user(sampleUser) // Belongs to sampleUser
                .course(sampleCourse)
                .amount(sampleCourse.getPrice())
                .status(Order.OrderStatus.PENDING)
                .provider(PaymentProviderType.MOCK)
                .build();

        when(orderRepository.findByOrderNumber("ORD-1005")).thenReturn(Optional.of(order));

        MockPaymentSimulationRequest req = new MockPaymentSimulationRequest();
        req.setOrderNumber("ORD-1005");
        req.setAction(MockPaymentSimulationRequest.MockPaymentAction.SUCCESS);

        // anotherUser tries to pay for sampleUser's order
        assertThrows(BadRequestException.class, () -> paymentService.simulateMockPayment(req, anotherUser));
        verify(enrollmentService, never()).enrollStudent(any(), any());
    }

    @Test
    void simulateMockPayment_WhenMockDisabled_ThrowsBadRequestException() {
        paymentProps.setMockEnabled(false);

        MockPaymentSimulationRequest req = new MockPaymentSimulationRequest();
        req.setOrderNumber("ORD-1006");
        req.setAction(MockPaymentSimulationRequest.MockPaymentAction.SUCCESS);

        assertThrows(BadRequestException.class, () -> paymentService.simulateMockPayment(req, sampleUser));
    }

    @Test
    void simulateMockPayment_RazorpayOrder_ThrowsBadRequestException() {
        Order razorpayOrder = Order.builder()
                .id(100L)
                .orderNumber("ORD-1007")
                .user(sampleUser)
                .course(sampleCourse)
                .amount(sampleCourse.getPrice())
                .status(Order.OrderStatus.PENDING)
                .provider(PaymentProviderType.RAZORPAY)
                .razorpayOrderId("order_rzp_123")
                .build();

        when(orderRepository.findByOrderNumber("ORD-1007")).thenReturn(Optional.of(razorpayOrder));

        MockPaymentSimulationRequest req = new MockPaymentSimulationRequest();
        req.setOrderNumber("ORD-1007");
        req.setAction(MockPaymentSimulationRequest.MockPaymentAction.SUCCESS);

        assertThrows(BadRequestException.class, () -> paymentService.simulateMockPayment(req, sampleUser));
    }

    @Test
    void verifyPaymentSignature_ValidHmac_EnrollsStudent() throws Exception {
        Order order = Order.builder()
                .id(100L)
                .orderNumber("ORD-123")
                .user(sampleUser)
                .course(sampleCourse)
                .amount(sampleCourse.getPrice())
                .currency("INR")
                .status(Order.OrderStatus.PENDING)
                .provider(PaymentProviderType.RAZORPAY)
                .razorpayOrderId("order_rzp_123")
                .build();

        when(orderRepository.findByRazorpayOrderId("order_rzp_123")).thenReturn(Optional.of(order));

        String payload = "order_rzp_123|pay_rzp_456";
        Mac sha256Hmac = Mac.getInstance("HmacSHA256");
        sha256Hmac.init(new SecretKeySpec("rzp_secret_12345".getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
        String validSig = HexFormat.of().formatHex(sha256Hmac.doFinal(payload.getBytes(StandardCharsets.UTF_8)));

        PaymentVerificationRequest req = new PaymentVerificationRequest();
        req.setRazorpayOrderId("order_rzp_123");
        req.setRazorpayPaymentId("pay_rzp_456");
        req.setRazorpaySignature(validSig);

        boolean result = paymentService.verifyPaymentSignature(req, sampleUser);

        assertTrue(result);
        assertEquals(Order.OrderStatus.PAID, order.getStatus());
        verify(enrollmentService).enrollStudent(sampleUser, sampleCourse);
        verify(notificationService).sendOrderConfirmation(any(), any(), any(), any());
    }

    @Test
    void verifyPaymentSignature_InvalidSignature_ThrowsException() {
        Order order = Order.builder()
                .id(100L)
                .orderNumber("ORD-123")
                .user(sampleUser)
                .course(sampleCourse)
                .amount(sampleCourse.getPrice())
                .status(Order.OrderStatus.PENDING)
                .provider(PaymentProviderType.RAZORPAY)
                .razorpayOrderId("order_rzp_123")
                .build();

        when(orderRepository.findByRazorpayOrderId("order_rzp_123")).thenReturn(Optional.of(order));

        PaymentVerificationRequest req = new PaymentVerificationRequest();
        req.setRazorpayOrderId("order_rzp_123");
        req.setRazorpayPaymentId("pay_rzp_456");
        req.setRazorpaySignature("tampered_forged_signature");

        assertThrows(PaymentVerificationException.class, () ->
                paymentService.verifyPaymentSignature(req, sampleUser));

        assertEquals(Order.OrderStatus.FAILED, order.getStatus());
        verify(enrollmentService, never()).enrollStudent(any(), any());
    }

    @Test
    void verifyPaymentSignature_MockOrder_ThrowsBadRequestException() {
        Order mockOrder = Order.builder()
                .id(100L)
                .orderNumber("ORD-MOCK-1")
                .user(sampleUser)
                .course(sampleCourse)
                .amount(sampleCourse.getPrice())
                .status(Order.OrderStatus.PENDING)
                .provider(PaymentProviderType.MOCK)
                .razorpayOrderId("mock_ord_1")
                .build();

        when(orderRepository.findByRazorpayOrderId("mock_ord_1")).thenReturn(Optional.of(mockOrder));

        PaymentVerificationRequest req = new PaymentVerificationRequest();
        req.setRazorpayOrderId("mock_ord_1");
        req.setRazorpayPaymentId("pay_123");
        req.setRazorpaySignature("sig");

        assertThrows(BadRequestException.class, () ->
                paymentService.verifyPaymentSignature(req, sampleUser));
    }

    @Test
    void verifyPaymentSignature_AlreadyPaid_Idempotent() {
        Order order = Order.builder()
                .id(100L)
                .orderNumber("ORD-123")
                .user(sampleUser)
                .course(sampleCourse)
                .amount(sampleCourse.getPrice())
                .status(Order.OrderStatus.PAID)
                .provider(PaymentProviderType.RAZORPAY)
                .razorpayOrderId("order_rzp_123")
                .build();

        when(orderRepository.findByRazorpayOrderId("order_rzp_123")).thenReturn(Optional.of(order));

        PaymentVerificationRequest req = new PaymentVerificationRequest();
        req.setRazorpayOrderId("order_rzp_123");
        req.setRazorpayPaymentId("pay_rzp_456");
        req.setRazorpaySignature("signature");

        boolean result = paymentService.verifyPaymentSignature(req, sampleUser);

        assertTrue(result);
        verify(enrollmentService, never()).enrollStudent(any(), any());
    }
}
