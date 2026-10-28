package com.skillforge.lms.payment;

import com.skillforge.lms.config.AppProperties;
import com.skillforge.lms.entity.Order;
import com.skillforge.lms.entity.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@Slf4j
public class MockPaymentProvider implements PaymentProvider {

    private final AppProperties appProperties;

    public MockPaymentProvider(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    @Override
    public PaymentProviderType getProviderType() {
        return PaymentProviderType.MOCK;
    }

    @Override
    public boolean isAvailable() {
        return appProperties.getPayment().isMockEnabled();
    }

    @Override
    public GatewayOrderDetails createGatewayOrder(Order order, User user) {
        if (!isAvailable()) {
            throw new IllegalStateException("Mock payment provider is disabled in this environment.");
        }

        String mockGatewayOrderId = "mock_ord_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);
        log.info("[MOCK PAYMENT PROVIDER] Created mock gateway order {} for order {}", mockGatewayOrderId, order.getOrderNumber());

        return GatewayOrderDetails.builder()
                .gatewayOrderId(mockGatewayOrderId)
                .gatewayKeyId("mock_key_development")
                .providerType(PaymentProviderType.MOCK)
                .paymentMode(PaymentMode.MOCK)
                .mockMode(true)
                .build();
    }
}
