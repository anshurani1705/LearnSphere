import React, { useState } from 'react';
import { api } from '../../api/client';
import { OrderResponse, User, MockPaymentSimulationResponse } from '../../types';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  X,
  CreditCard,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  Ban,
  Clock,
} from 'lucide-react';

interface MockCheckoutModalProps {
  order: OrderResponse;
  user: User;
  onSuccess: (orderNumber: string) => void;
  onError: (errorMsg: string) => void;
  onClose: () => void;
}

export const MockCheckoutModal: React.FC<MockCheckoutModalProps> = ({
  order,
  user,
  onSuccess,
  onError,
  onClose,
}) => {
  const [loadingAction, setLoadingAction] = useState<'SUCCESS' | 'FAILURE' | 'CANCEL' | null>(null);
  const [result, setResult] = useState<MockPaymentSimulationResponse | null>(null);
  const [failureReason, setFailureReason] = useState<string>('Card declined by issuing bank (Simulated)');
  const [customError, setCustomError] = useState<string | null>(null);

  const handleSimulate = async (action: 'SUCCESS' | 'FAILURE' | 'CANCEL') => {
    setLoadingAction(action);
    setCustomError(null);

    try {
      const res = await api.post('/v1/payments/mock/simulate', {
        orderNumber: order.orderNumber,
        action,
        failureReason: action === 'FAILURE' ? failureReason : undefined,
      });

      if (res.data?.success) {
        const simResult: MockPaymentSimulationResponse = res.data.data;
        setResult(simResult);

        if (action === 'SUCCESS') {
          setTimeout(() => {
            onSuccess(order.orderNumber);
          }, 1200);
        } else if (action === 'FAILURE') {
          onError(simResult.message || 'Payment simulation failed.');
        } else if (action === 'CANCEL') {
          setTimeout(() => {
            onClose();
          }, 800);
        }
      } else {
        setCustomError(res.data?.message || 'Simulation request failed.');
      }
    } catch (err: any) {
      setCustomError(err.response?.data?.message || err.message || 'Error executing mock simulation.');
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-amber-300 flex flex-col">
        {/* Development Top Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 px-6 py-3 text-white flex items-center justify-between text-xs font-bold tracking-wider uppercase">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-200 animate-pulse" />
            <span>Development Mode &bull; Mock Payment Gateway</span>
          </div>
          <span className="bg-black/20 px-2.5 py-0.5 rounded-full text-[10px] font-mono border border-white/20">
            TEST ENVIRONMENT
          </span>
        </div>

        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-extrabold text-slate-900">Simulate Course Purchase</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Select an outcome below to test the end-to-end enrollment, webhook, and error workflows.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Details Summary Card */}
        <div className="p-6 space-y-4">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Course:</span>
              <span className="font-bold text-slate-900 text-right max-w-[65%] truncate">
                {order.courseTitle}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Order Number:</span>
              <span className="font-mono font-bold text-slate-700">{order.orderNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Student:</span>
              <span className="font-medium text-slate-800">{user.fullName} ({user.email})</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Payment Provider:</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 font-mono">
                MOCK_PROVIDER (LOCAL)
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
              <span className="text-slate-700 font-bold">Total Amount Due:</span>
              <span className="text-xl font-black text-indigo-600 font-mono">
                ₹{order.amount.toLocaleString('en-IN')} {order.currency || 'INR'}
              </span>
            </div>
          </div>

          {/* Error Message */}
          {customError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start space-x-2">
              <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{customError}</span>
            </div>
          )}

          {/* Success Result Box */}
          {result && result.status === 'PAID' && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 space-y-1.5 animate-in fade-in">
              <div className="flex items-center space-x-2 font-bold text-sm">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Simulated Payment Captured!</span>
              </div>
              <p className="text-emerald-700">{result.message}</p>
              <p className="font-mono text-[11px] text-emerald-600 pt-1">
                Ref: {result.transactionReference}
              </p>
              <p className="text-[11px] font-semibold text-emerald-800">
                Redirecting to course player...
              </p>
            </div>
          )}

          {/* Failure Result Box */}
          {result && result.status === 'FAILED' && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 space-y-1.5 animate-in fade-in">
              <div className="flex items-center space-x-2 font-bold text-sm">
                <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>Simulated Payment Failed</span>
              </div>
              <p className="text-rose-700">{result.message}</p>
              <p className="font-mono text-[11px] text-rose-600 pt-1">
                Ref: {result.transactionReference} &bull; Course remains locked.
              </p>
            </div>
          )}

          {/* Cancel Result Box */}
          {result && result.status === 'CANCELLED' && (
            <div className="p-4 bg-slate-100 border border-slate-200 rounded-2xl text-xs text-slate-800 space-y-1 animate-in fade-in">
              <div className="flex items-center space-x-2 font-bold">
                <Ban className="w-4 h-4 text-slate-600 shrink-0" />
                <span>Checkout Cancelled</span>
              </div>
              <p className="text-slate-600">{result.message}</p>
            </div>
          )}

          {/* Failure reason dropdown */}
          {!result && (
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-500">
                Failure Reason (for "Simulate Failure" action):
              </label>
              <select
                value={failureReason}
                onChange={(e) => setFailureReason(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Card declined by issuing bank (Simulated)">Card declined by issuing bank</option>
                <option value="Insufficient funds in student account (Simulated)">Insufficient funds</option>
                <option value="OTP verification timed out (Simulated)">OTP verification timed out</option>
                <option value="Transaction flagged by fraud detection rules (Simulated)">Fraud risk limit exceeded</option>
              </select>
            </div>
          )}

          {/* Action Simulation Buttons */}
          {!result && (
            <div className="space-y-2 pt-2">
              <button
                onClick={() => handleSimulate('SUCCESS')}
                disabled={loadingAction !== null}
                className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition disabled:opacity-50 text-sm"
              >
                {loadingAction === 'SUCCESS' ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                <span>Simulate Successful Payment (Unlock Course)</span>
              </button>

              <button
                onClick={() => handleSimulate('FAILURE')}
                disabled={loadingAction !== null}
                className="w-full flex items-center justify-center space-x-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-bold py-3 px-4 rounded-xl transition disabled:opacity-50 text-sm"
              >
                {loadingAction === 'FAILURE' ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-600" />
                )}
                <span>Simulate Payment Failure</span>
              </button>

              <button
                onClick={() => handleSimulate('CANCEL')}
                disabled={loadingAction !== null}
                className="w-full flex items-center justify-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-4 rounded-xl transition disabled:opacity-50 text-xs"
              >
                {loadingAction === 'CANCEL' ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Ban className="w-3.5 h-3.5 text-slate-500" />
                )}
                <span>Simulate User Cancellation / Dismiss</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Disclaimer */}
        <div className="bg-slate-50 p-4 border-t border-slate-100 text-center text-[11px] text-slate-400">
          This mock interface is strictly for development and automated testing. It will fail safely if deployed in production.
        </div>
      </div>
    </div>
  );
};
