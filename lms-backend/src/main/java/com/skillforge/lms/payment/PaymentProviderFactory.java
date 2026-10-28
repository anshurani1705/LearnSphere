package com.skillforge.lms.payment;

import com.skillforge.lms.config.AppProperties;
import com.skillforge.lms.exception.BadRequestException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Slf4j
public class PaymentProviderFactory {

    private final AppProperties appProperties;
    private final List<PaymentProvider> providers;

    public PaymentProviderFactory(AppProperties appProperties, List<PaymentProvider> providers) {
        this.appProperties = appProperties;
        this.providers = providers;
    }

    public PaymentProvider getActiveProvider() {
        String configuredProvider = appProperties.getPayment().getProvider();
        PaymentProviderType providerType;

        try {
            providerType = PaymentProviderType.valueOf(configuredProvider.trim().toUpperCase());
        } catch (Exception e) {
            log.warn("Invalid payment provider '{}' configured; defaulting to RAZORPAY", configuredProvider);
            providerType = PaymentProviderType.RAZORPAY;
        }

        if (providerType == PaymentProviderType.MOCK && !appProperties.getPayment().isMockEnabled()) {
            throw new BadRequestException("Mock payment provider is requested but mock mode is disabled in this environment.");
        }

        final PaymentProviderType targetType = providerType;
        return providers.stream()
                .filter(p -> p.getProviderType() == targetType)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("No payment provider registered for type " + targetType));
    }

    public PaymentProvider getProvider(PaymentProviderType providerType) {
        return providers.stream()
                .filter(p -> p.getProviderType() == providerType)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("No payment provider registered for type " + providerType));
    }
}
