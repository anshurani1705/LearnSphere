package com.skillforge.lms.payment;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class GatewayOrderDetails {
    private String gatewayOrderId;
    private String gatewayKeyId;
    private PaymentProviderType providerType;
    private PaymentMode paymentMode;
    private boolean mockMode;
    private Map<String, Object> additionalAttributes;

    public GatewayOrderDetails() {
    }

    @Builder
    public GatewayOrderDetails(String gatewayOrderId, String gatewayKeyId, PaymentProviderType providerType,
                               PaymentMode paymentMode, boolean mockMode, Map<String, Object> additionalAttributes) {
        this.gatewayOrderId = gatewayOrderId;
        this.gatewayKeyId = gatewayKeyId;
        this.providerType = providerType;
        this.paymentMode = paymentMode;
        this.mockMode = mockMode;
        this.additionalAttributes = additionalAttributes;
    }
}
