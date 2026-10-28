package com.skillforge.lms.payment;

import com.skillforge.lms.config.AppProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.env.Environment;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PaymentSecurityValidatorTest {

    @Mock
    private Environment environment;

    private AppProperties appProperties;
    private PaymentSecurityValidator validator;

    @BeforeEach
    void setUp() {
        appProperties = new AppProperties();
        validator = new PaymentSecurityValidator(appProperties, environment);
    }

    @Test
    void validateConfiguration_ProductionWithMockEnabled_ThrowsIllegalStateException() {
        when(environment.getActiveProfiles()).thenReturn(new String[]{"production"});
        appProperties.getPayment().setProvider("razorpay");
        appProperties.getPayment().setMockEnabled(true);

        assertThrows(IllegalStateException.class, () -> validator.validateConfiguration());
    }

    @Test
    void validateConfiguration_ProductionWithMockProvider_ThrowsIllegalStateException() {
        when(environment.getActiveProfiles()).thenReturn(new String[]{"prod"});
        appProperties.getPayment().setProvider("mock");
        appProperties.getPayment().setMockEnabled(false);

        assertThrows(IllegalStateException.class, () -> validator.validateConfiguration());
    }

    @Test
    void validateConfiguration_ProductionWithRazorpayAndMockDisabled_Passes() {
        when(environment.getActiveProfiles()).thenReturn(new String[]{"prod"});
        appProperties.getPayment().setProvider("razorpay");
        appProperties.getPayment().setMockEnabled(false);

        assertDoesNotThrow(() -> validator.validateConfiguration());
    }

    @Test
    void validateConfiguration_DevelopmentWithMockEnabled_Passes() {
        when(environment.getActiveProfiles()).thenReturn(new String[]{"dev"});
        appProperties.getPayment().setProvider("mock");
        appProperties.getPayment().setMockEnabled(true);

        assertDoesNotThrow(() -> validator.validateConfiguration());
    }

    @Test
    void validateConfiguration_NoActiveProfiles_DefaultDevelopmentWithMock_Passes() {
        when(environment.getActiveProfiles()).thenReturn(new String[]{});
        appProperties.getPayment().setProvider("mock");
        appProperties.getPayment().setMockEnabled(true);

        assertDoesNotThrow(() -> validator.validateConfiguration());
    }

    @Test
    void applicationStartupWithoutRazorpayCredentials_DoesNotCrashInDevelopment() {
        when(environment.getActiveProfiles()).thenReturn(new String[]{"dev"});
        // Razorpay keys are empty
        appProperties.getRazorpay().setKeyId("");
        appProperties.getRazorpay().setKeySecret("");
        appProperties.getPayment().setProvider("mock");
        appProperties.getPayment().setMockEnabled(true);

        assertDoesNotThrow(() -> validator.validateConfiguration());
    }
}
