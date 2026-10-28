package com.skillforge.lms.dto.order;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MockPaymentSimulationResponse {
    private String orderNumber;
    private String status;
    private Long courseId;
    private boolean enrolled;
    private String transactionReference;
    private String message;

    public MockPaymentSimulationResponse() {
    }

    @Builder
    public MockPaymentSimulationResponse(String orderNumber, String status, Long courseId,
                                         boolean enrolled, String transactionReference, String message) {
        this.orderNumber = orderNumber;
        this.status = status;
        this.courseId = courseId;
        this.enrolled = enrolled;
        this.transactionReference = transactionReference;
        this.message = message;
    }
}

