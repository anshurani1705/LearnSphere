package com.skillforge.lms.dto.admin;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecentOrderDto {
    private Long orderId;
    private String orderNumber;
    private String studentName;
    private String studentEmail;
    private String courseTitle;
    private BigDecimal amount;
    private String currency;
    private String status;
    private String provider;
    private String paymentMode;
    private LocalDateTime createdAt;
}
