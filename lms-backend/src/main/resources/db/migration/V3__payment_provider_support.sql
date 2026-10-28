-- Migration: Payment Provider Abstraction Support
-- Adds provider, payment_mode and transaction_reference to orders and payments

ALTER TABLE orders
    ADD COLUMN provider VARCHAR(30) NOT NULL DEFAULT 'RAZORPAY',
    ADD COLUMN payment_mode VARCHAR(20) NOT NULL DEFAULT 'TEST';

ALTER TABLE payments
    ADD COLUMN provider VARCHAR(30) NOT NULL DEFAULT 'RAZORPAY',
    ADD COLUMN payment_mode VARCHAR(20) NOT NULL DEFAULT 'TEST',
    ADD COLUMN transaction_reference VARCHAR(100);

CREATE INDEX idx_orders_provider ON orders(provider);
CREATE INDEX idx_payments_provider ON payments(provider);
