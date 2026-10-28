package com.skillforge.lms.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Getter @Setter
public class Order {

    public Order() {
    }

    @Builder
    public Order(Long id, String orderNumber, User user, Course course, BigDecimal amount,
                 String currency, OrderStatus status, com.skillforge.lms.payment.PaymentProviderType provider,
                 com.skillforge.lms.payment.PaymentMode paymentMode, String razorpayOrderId, String notes,
                 LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.orderNumber = orderNumber;
        this.user = user;
        this.course = course;
        this.amount = amount;
        this.currency = currency != null ? currency : "INR";
        this.status = status != null ? status : OrderStatus.PENDING;
        this.provider = provider != null ? provider : com.skillforge.lms.payment.PaymentProviderType.RAZORPAY;
        this.paymentMode = paymentMode != null ? paymentMode : com.skillforge.lms.payment.PaymentMode.TEST;
        this.razorpayOrderId = razorpayOrderId;
        this.notes = notes;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_number", nullable = false, unique = true)
    private String orderNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, length = 3)
    private String currency = "INR";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private OrderStatus status = OrderStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(name = "provider", length = 30)
    private com.skillforge.lms.payment.PaymentProviderType provider = com.skillforge.lms.payment.PaymentProviderType.RAZORPAY;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_mode", length = 20)
    private com.skillforge.lms.payment.PaymentMode paymentMode = com.skillforge.lms.payment.PaymentMode.TEST;

    @Column(name = "razorpay_order_id")
    private String razorpayOrderId;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum OrderStatus {
        PENDING, PAID, FAILED, REFUNDED, CANCELLED
    }
}
