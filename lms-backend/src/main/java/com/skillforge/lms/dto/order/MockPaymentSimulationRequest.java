package com.skillforge.lms.dto.order;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MockPaymentSimulationRequest {

    @NotBlank(message = "Order number is required")
    private String orderNumber;

    @NotNull(message = "Simulation action is required (SUCCESS, FAILURE, CANCEL)")
    private MockPaymentAction action;

    private String failureReason;

    public enum MockPaymentAction {
        SUCCESS,
        FAILURE,
        CANCEL
    }
}
