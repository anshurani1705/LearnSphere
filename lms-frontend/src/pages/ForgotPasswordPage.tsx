import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import {
  GraduationCap,
  Mail,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  ArrowLeft,
  RotateCw,
  Loader2,
} from 'lucide-react';
import { Alert } from '../components/ui/Alert';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'REQUEST' | 'VERIFY'>('REQUEST');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState<number>(0);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError('Please enter your email address.');
      return;
    }
    if (!validateEmail(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      await api.post('/v1/auth/otp/request', {
        email: cleanEmail,
        purpose: 'PASSWORD_RESET',
      });

      setSuccessMsg(`A 6-digit verification code has been dispatched to ${cleanEmail}. Please check your inbox.`);
      setStep('VERIFY');
      setResendCooldown(30);
    } catch (err: any) {
      const msg =
        err?.message ||
        err?.response?.data?.message ||
        (typeof err === 'string' ? err : 'Failed to dispatch verification code');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanOtp = otp.trim();
    if (!cleanOtp || cleanOtp.length !== 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/v1/auth/password/reset-confirm', {
        email: email.trim().toLowerCase(),
        otp: cleanOtp,
        newPassword: newPassword.trim(),
      });

      navigate('/login', {
        state: { message: 'Password reset successfully! You can now log in with your new credentials.' },
      });
    } catch (err: any) {
      const msg =
        err?.message ||
        err?.response?.data?.message ||
        (typeof err === 'string' ? err : 'Password reset failed. Please verify your OTP code.');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#FAFAF8]">
      <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-lg border border-[#E5E7EB] shadow-card space-y-6">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 group">
            <div className="w-8 h-8 rounded-md bg-[#172B4D] flex items-center justify-center text-white">
              <GraduationCap className="w-5 h-5 text-teal-300" />
            </div>
            <span className="font-bold text-xl tracking-tight text-[#172B4D]">
              Skill<span className="text-[#287C78]">Forge</span>
            </span>
          </Link>
          <h2 className="mt-4 text-xl font-bold text-[#20252B] tracking-tight">
            {step === 'REQUEST' ? 'Reset your password' : 'Enter Verification Code'}
          </h2>
          <p className="mt-1 text-xs text-[#697386]">
            {step === 'REQUEST' ? (
              <>
                Remember your credentials?{' '}
                <Link to="/login" className="font-medium text-[#287C78] hover:underline">
                  Sign in
                </Link>
              </>
            ) : (
              <span>Enter the 6-digit verification code sent to your email.</span>
            )}
          </p>
        </div>

        {error && (
          <Alert type="error" message={error} />
        )}

        {successMsg && (
          <Alert type="success" message={successMsg} />
        )}

        {step === 'REQUEST' ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#20252B] mb-1.5">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#172B4D] focus:bg-white text-[#20252B] transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#172B4D] hover:bg-[#0F1E36] text-white font-medium py-2.5 rounded-md text-xs sm:text-sm shadow-sm transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending Verification Code...</span>
                </>
              ) : (
                <span>Send Verification Code</span>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetConfirm} className="space-y-4">
            <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-md border border-[#E5E7EB]">
              <span className="text-[#697386] truncate max-w-[220px]">
                Sent to: <strong className="text-[#20252B]">{email}</strong>
              </span>
              <button
                type="button"
                onClick={() => {
                  setStep('REQUEST');
                  setError(null);
                }}
                className="text-[#287C78] hover:underline font-medium inline-flex items-center space-x-1"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Change</span>
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#20252B]">
                  6-Digit Verification Code
                </label>
                {resendCooldown > 0 ? (
                  <span className="text-[11px] text-[#697386]">
                    Resend in {resendCooldown}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleRequestOtp()}
                    disabled={loading}
                    className="text-[11px] text-[#287C78] hover:underline font-medium inline-flex items-center space-x-1 disabled:opacity-50"
                  >
                    <RotateCw className="w-3 h-3" />
                    <span>Resend Code</span>
                  </button>
                )}
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full pl-9 pr-3 py-2 text-sm sm:text-base tracking-widest font-mono bg-slate-50 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#172B4D] focus:bg-white text-[#20252B] font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#20252B] mb-1.5">
                New Password (Minimum 8 chars)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-9 py-2 text-xs sm:text-sm bg-slate-50 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#172B4D] focus:bg-white text-[#20252B] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#20252B] mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-9 py-2 text-xs sm:text-sm bg-slate-50 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#172B4D] focus:bg-white text-[#20252B] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="mt-1 text-xs text-rose-600">Passwords do not match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || (confirmPassword.length > 0 && newPassword !== confirmPassword)}
              className="w-full bg-[#172B4D] hover:bg-[#0F1E36] text-white font-medium py-2.5 rounded-md text-xs sm:text-sm shadow-sm transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Resetting Password...</span>
                </>
              ) : (
                <span>Save New Password & Sign In</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
