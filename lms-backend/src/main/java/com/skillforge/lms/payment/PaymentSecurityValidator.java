package com.skillforge.lms.payment;

import com.skillforge.lms.config.AppProperties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Set;

@Component
@Slf4j
public class PaymentSecurityValidator implements ApplicationRunner {

    private final AppProperties appProperties;
    private final Environment environment;

    public PaymentSecurityValidator(AppProperties appProperties, Environment environment) {
        this.appProperties = appProperties;
        this.environment = environment;
    }

    private static final Set<String> PRODUCTION_PROFILES = Set.of("prod", "production", "live");

    @Override
    public void run(ApplicationArguments args) {
        validateConfiguration();
    }

    public void validateConfiguration() {
        boolean isProduction = Arrays.stream(environment.getActiveProfiles())
                .anyMatch(p -> PRODUCTION_PROFILES.contains(p.toLowerCase()));

        var paymentConfig = appProperties.getPayment();
        boolean mockRequested = "mock".equalsIgnoreCase(paymentConfig.getProvider()) || paymentConfig.isMockEnabled();

        if (isProduction && mockRequested) {
            String errorMsg = "CRITICAL CONFIGURATION ERROR: Mock payment mode is strictly prohibited in production! " +
                    "Set PAYMENT_MOCK_ENABLED=false and PAYMENT_PROVIDER=razorpay before deploying.";
            log.error(errorMsg);
            throw new IllegalStateException(errorMsg);
        }

        if (paymentConfig.isMockEnabled()) {
            log.warn("====================================================================");
            log.warn("[!] DEVELOPMENT MOCK PAYMENT PROVIDER IS ENABLED");
            log.warn("[!] No real transactions or charges will occur.");
            log.warn("[!] Disable before moving to staging/production.");
            log.warn("====================================================================");
        } else {
            log.info("Payment provider configured: {}", paymentConfig.getProvider());
        }
    }
}
