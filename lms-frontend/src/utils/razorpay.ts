import { api } from '../api/client';
import { OrderResponse, User } from '../types';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

interface CheckoutOptions {
  courseId: number;
  courseTitle: string;
  user: User;
  onMockCheckout?: (order: OrderResponse) => void;
  onSuccess: (orderNumber: string) => void;
  onError: (errorMsg: string) => void;
}

export const initiateCheckout = async ({
  courseId,
  courseTitle,
  user,
  onMockCheckout,
  onSuccess,
  onError,
}: CheckoutOptions) => {
  try {
    // 1. Create order on backend with authoritative DB course price
    const orderRes = await api.post('/v1/orders', { courseId });
    if (!orderRes.data?.success) {
      throw new Error(orderRes.data?.message || 'Failed to initiate order.');
    }

    const order: OrderResponse = orderRes.data.data;

    // 2. Check if development mock payment mode is active
    if (order.mockMode || order.provider === 'MOCK') {
      if (onMockCheckout) {
        onMockCheckout(order);
        return;
      } else {
        throw new Error('Mock payment mode is enabled on the server, but mock checkout modal is not configured.');
      }
    }

    // 3. Razorpay Gateway Mode
    if (!order.razorpayKeyId || order.razorpayKeyId.trim() === '') {
      throw new Error(
        'Razorpay payment gateway is not configured on the server. ' +
        'Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET on backend, or switch to development mock mode.'
      );
    }

    if (typeof window.Razorpay !== 'function') {
      throw new Error(
        'Razorpay checkout SDK is not loaded. Please ensure internet connectivity or disable ad-blockers blocking checkout.razorpay.com.'
      );
    }

    // 4. Initialize real Razorpay Checkout dialog
    const options = {
      key: order.razorpayKeyId,
      amount: Math.round(order.amount * 100), // in paise
      currency: order.currency || 'INR',
      name: 'SkillForge Academy',
      description: `Enrollment: ${courseTitle}`,
      order_id: order.razorpayOrderId,
      prefill: {
        name: user.fullName,
        email: user.email,
        contact: user.phone || '',
      },
      theme: {
        color: '#4F46E5',
      },
      handler: async function (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }) {
        try {
          // Send cryptographic signature to backend for HMAC-SHA256 verification
          const verifyRes = await api.post('/v1/payments/verify', {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });

          if (verifyRes.data?.success) {
            onSuccess(order.orderNumber);
          } else {
            onError(verifyRes.data?.message || 'Payment signature verification failed.');
          }
        } catch (err: any) {
          onError(err.response?.data?.message || err.message || 'Error verifying payment signature with server.');
        }
      },
      modal: {
        ondismiss: function () {
          onError('Payment checkout window was closed before completion.');
        },
      },
    };

    const rzpInstance = new window.Razorpay(options);
    rzpInstance.on('payment.failed', function (resp: any) {
      onError(resp.error?.description || 'Payment failed.');
    });
    rzpInstance.open();
  } catch (err: any) {
    onError(err.response?.data?.message || err.message || 'Unable to initiate checkout.');
  }
};

// Backwards-compatible export
export const initiateRazorpayCheckout = initiateCheckout;
