# SkillForge LMS — Payment Integration & Architecture Guide

This document details the payment gateway integration, the development mock simulator, Razorpay gateway configuration, and production safety controls.

---

## 1. Local Development Quickstart

### Prerequisites
- Java 21 or Java 23 (with Maven wrapper `./mvn.ps1`)
- MySQL 8.0 running locally on port 3306 (service `MYSQL80`)
- Node.js 18+ for `lms-frontend`

### Running Backend
```powershell
# From lms-backend directory
powershell -ExecutionPolicy Bypass -File .\mvn.ps1 spring-boot:run
```

### Running Frontend
```powershell
# From lms-frontend directory
npm run dev
```

The frontend runs on `http://localhost:5173` and automatically proxies `/api` requests to `http://localhost:8080`.

---

## 2. Payment Provider Architecture

The payment system uses an abstraction interface (`PaymentProvider`) with two concrete implementations:

1. **`MockPaymentProvider` (`MOCK`)**:
   - For local development, staging tests, and automated CI pipelines without gateway credentials.
   - Authoritative prices are retrieved from the database.
   - Generates mock order references (`mock_ord_...`).
   - Enables the interactive frontend **Mock Checkout Simulator**.
   - Generates simulated payment records (`MOCK-TXN-...`, `mock_pay_...`).
   - Automatically disabled and rejected if running in production profiles.

2. **`RazorpayPaymentProvider` (`RAZORPAY`)**:
   - Integrates with official Razorpay REST APIs for order creation.
   - Uses backend HMAC-SHA256 signature verification for callbacks and webhooks.
   - Detects Test Mode (`rzp_test_...`) vs Live Mode (`rzp_live_...`).
   - Gracefully handles missing credentials during development startup.

---

## 3. Configuration & Environment Variables

| Variable | Description | Default (Dev) | Production Requirement |
|---|---|---|---|
| `PAYMENT_PROVIDER` | Active provider: `mock` or `razorpay` | `mock` | `razorpay` |
| `PAYMENT_MOCK_ENABLED` | Enables mock checkout and endpoints | `true` | `false` |
| `RAZORPAY_KEY_ID` | Razorpay API Key ID (`rzp_test_...` or `rzp_live_...`) | _(empty)_ | Required |
| `RAZORPAY_KEY_SECRET` | Razorpay API Key Secret | _(empty)_ | Required (backend secret) |
| `RAZORPAY_WEBHOOK_SECRET` | Secret for validating incoming webhook signatures | _(empty)_ | Required |
| `RAZORPAY_CURRENCY` | Default transaction currency | `INR` | `INR` |

---

## 4. How to Test Development Mock Payments

1. Start both backend and frontend in development mode (`PAYMENT_PROVIDER=mock`, `PAYMENT_MOCK_ENABLED=true`).
2. Log in as a student (or register a new student account).
3. Browse the course catalog at `/courses` and click on any published course.
4. Click **Buy Course & Start Learning**.
5. The **Development Mock Payment Gateway** modal will appear:
   - Displays course title, order number, and authoritative database price.
   - Prominently labeled with yellow warning banners indicating `TEST ENVIRONMENT`.
6. Choose one of the three simulation actions:
   - **Simulate Successful Payment**:
     - Calls `POST /v1/payments/mock/simulate` with `action: 'SUCCESS'`.
     - Validates order ownership and pending state.
     - Creates a `Payment` entity with status `CAPTURED` and provider `MOCK`.
     - Unlocks the course and enrolls the student exactly once.
     - Sends order confirmation notification.
     - Redirects the student to the learning player (`/learn/:courseId`).
   - **Simulate Payment Failure**:
     - Select a failure reason (e.g. Card Declined, Insufficient Funds).
     - Calls `POST /v1/payments/mock/simulate` with `action: 'FAILURE'`.
     - Marks the order as `FAILED`, creates a failed payment audit trail, and leaves the course locked.
   - **Simulate User Cancellation**:
     - Calls `POST /v1/payments/mock/simulate` with `action: 'CANCEL'`.
     - Marks the order as `CANCELLED` and closes checkout without unlocking the course.

---

## 5. Security & Idempotency Rules

- **Authentication Required**: All order creation and mock simulation endpoints require valid JWT authentication.
- **Ownership Verification**: Backend strictly validates that the order belongs to the authenticated user. Requests attempting to process another student's order are rejected with `400 Bad Request`.
- **Authoritative Server Pricing**: The amount charged is always pulled directly from the course database record, completely ignoring client-supplied amounts.
- **No Direct Paid Status from Frontend**: The frontend cannot mark an order as `PAID`. Transitions happen strictly through the backend after verified gateway callback, verified webhook, or authenticated mock simulation.
- **Exactly-Once Enrollment**: If an order is already marked `PAID`, subsequent calls return an idempotent response without duplicate payment records or double enrollment.
- **Production Guard (`PaymentSecurityValidator`)**:
  - Automatically runs at application startup.
  - If any production profile (`prod`, `production`, `live`) is active while `PAYMENT_MOCK_ENABLED=true` or `PAYMENT_PROVIDER=mock`, the application fails to start immediately with an `IllegalStateException`.

---

## 6. How to Configure Razorpay (Later)

When you obtain live or test credentials from the [Razorpay Dashboard](https://dashboard.razorpay.com):

1. Set the environment variables on the backend server:
   ```bash
   export RAZORPAY_KEY_ID="rzp_test_YourKeyIdHere"
   export RAZORPAY_KEY_SECRET="YourKeySecretHere"
   export RAZORPAY_WEBHOOK_SECRET="YourWebhookSecretHere"
   export PAYMENT_PROVIDER="razorpay"
   export PAYMENT_MOCK_ENABLED="false"
   ```
2. Configure your Razorpay Webhook in the Razorpay Dashboard:
   - Webhook URL: `https://your-domain.com/api/v1/payments/webhook`
   - Active Events: `payment.captured`, `order.paid`
   - Secret: Set to match `RAZORPAY_WEBHOOK_SECRET`
3. Restart the backend.
4. **Testing Razorpay Test Mode**:
   - Use test cards provided in Razorpay documentation (e.g., standard test OTP `123456`).
   - The frontend checkout will initialize the real Razorpay Modal.
   - The admin orders table will display `[⚡ RAZORPAY TEST]` badges.

---

## 7. Admin Transaction Management

Administrators can navigate to `/admin/orders` to inspect all platform transactions:
- View internal order ID, student details, course, amount, status, provider, mode, and gateway reference.
- Filter easily between **All**, **Real Gateway**, and **Mock / Test**.
- Revenue reporting on `/admin/dashboard` strictly counts real gateway transactions and isolates development mock volume, ensuring revenue figures are never inflated.
