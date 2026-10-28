package com.skillforge.lms.payment;

import com.skillforge.lms.entity.Order;
import com.skillforge.lms.entity.User;

public interface PaymentProvider {
    PaymentProviderType getProviderType();
    boolean isAvailable();
    GatewayOrderDetails createGatewayOrder(Order order, User user);
}
