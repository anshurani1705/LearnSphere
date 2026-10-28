package com.skillforge.lms.dto.order;

import com.skillforge.lms.entity.Order;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter @Setter
public class OrderResponseDto {
    private Long id;
    private String orderNumber;
    private Long courseId;
    private String courseTitle;
    private BigDecimal amount;
    private String currency;
    private String status;
    private String provider;
    private String paymentMode;
    private boolean mockMode;
    private String razorpayOrderId;
    private String razorpayKeyId;
    private LocalDateTime createdAt;

    public OrderResponseDto() {
    }

    @Builder
    public OrderResponseDto(Long id, String orderNumber, Long courseId, String courseTitle, BigDecimal amount,
                            String currency, String status, String provider, String paymentMode, boolean mockMode,
                            String razorpayOrderId, String razorpayKeyId, LocalDateTime createdAt) {
        this.id = id;
        this.orderNumber = orderNumber;
        this.courseId = courseId;
        this.courseTitle = courseTitle;
        this.amount = amount;
        this.currency = currency;
        this.status = status;
        this.provider = provider;
        this.paymentMode = paymentMode;
        this.mockMode = mockMode;
        this.razorpayOrderId = razorpayOrderId;
        this.razorpayKeyId = razorpayKeyId;
        this.createdAt = createdAt;
    }

    public static OrderResponseDto fromEntity(Order order, String razorpayKeyId) {
        boolean isMock = order.getProvider() == com.skillforge.lms.payment.PaymentProviderType.MOCK;
        return OrderResponseDto.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .courseId(order.getCourse().getId())
                .courseTitle(order.getCourse().getTitle())
                .amount(order.getAmount())
                .currency(order.getCurrency())
                .status(order.getStatus().name())
                .provider(order.getProvider() != null ? order.getProvider().name() : "RAZORPAY")
                .paymentMode(order.getPaymentMode() != null ? order.getPaymentMode().name() : "TEST")
                .mockMode(isMock)
                .razorpayOrderId(order.getRazorpayOrderId())
                .razorpayKeyId(isMock ? null : razorpayKeyId)
                .createdAt(order.getCreatedAt())
                .build();
    }
}
