import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import {
  Eye,
  EyeOff,
  ArrowLeft,
  RotateCw,
  Loader2,
} from 'lucide-react';

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
      const res = await api.post('/v1/auth/forgot-password', { email: cleanEmail });
      if (res.data?.success) {
        setSuccessMsg(res.data.message || 'Verification code sent to your email.');
        setStep('VERIFY');
        setResendCooldown(60);
      } else {
        setError(res.data?.message || 'Failed to send verification code. Please check your email.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanOtp = otp.trim();

    if (!cleanOtp || cleanOtp.length !== 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await api.post('/v1/auth/reset-password', {
        email: email.trim().toLowerCase(),
        otp: cleanOtp,
        newPassword,
      });

      if (res.data?.success) {
        setSuccessMsg('Password updated successfully. Redirecting to sign in...');
        setTimeout(() => {
          navigate('/login', {
            state: { message: 'Password reset successful. Please sign in with your new password.' },
          });
        }, 1500);
      } else {
        setError(res.data?.message || 'Invalid or expired verification code.');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid or expired verification code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-16 px-4 bg-[#FAF8F5] dark:bg-[#14171A] transition-colors duration-200">
      <div className="max-w-md w-full bg-white dark:bg-[#1C2025] p-8 rounded-[8px] border border-[#E7E2DA] dark:border-[#2A3038] shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-6">
        <div>
          <h1 className="font-serif font-semibold text-2xl text-[#1F2328] dark:text-[#E6EDF3] tracking-tight">
            {step === 'REQUEST' ? 'Reset your password' : 'Enter verification code'}
          </h1>
          <p className="mt-1 text-xs text-[#5F6368] dark:text-[#8B949E]">
            {step === 'REQUEST' ? (
              <>
                Remembered your password?{' '}
                <Link to="/login" className="text-[#0E6B6B] dark:text-[#149B9B] hover:underline font-medium">
                  Sign in
                </Link>
              </>
            ) : (
              <span>We sent a 6-digit verification code to your email.</span>
            )}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-[#C0392B]/10 dark:bg-[#E53E3E]/10 border border-[#C0392B]/20 dark:border-[#E53E3E]/20 rounded-[6px] text-xs text-[#C0392B] dark:text-[#E53E3E]">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-[#2F855A]/10 dark:bg-[#38A169]/10 border border-[#2F855A]/20 dark:border-[#38A169]/20 rounded-[6px] text-xs text-[#2F855A] dark:text-[#38A169]">
            {successMsg}
          </div>
        )}

        {step === 'REQUEST' ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#1F2328] dark:text-[#E6EDF3] mb-1.5">
                Registered email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="name@example.com"
                className="w-full px-3 py-2 text-sm bg-white dark:bg-[#14171A] border border-[#E7E2DA] dark:border-[#2A3038] rounded-[6px] text-[#1F2328] dark:text-[#E6EDF3] placeholder-[#8B949E] focus-ring transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0E6B6B] hover:bg-[#0A5555] dark:bg-[#149B9B] dark:hover:bg-[#118585] text-white font-medium py-2.5 rounded-[6px] text-sm transition-colors focus-ring disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending code...</span>
                </>
              ) : (
                <span>Send verification code</span>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetConfirm} className="space-y-4">
            <div className="flex items-center justify-between text-xs bg-[#FAF8F5] dark:bg-[#14171A] p-2.5 rounded-[6px] border border-[#E7E2DA] dark:border-[#2A3038]">
              <span className="text-[#5F6368] dark:text-[#8B949E] truncate max-w-[200px]">
                Sent to: <strong className="text-[#1F2328] dark:text-[#E6EDF3]">{email}</strong>
              </span>
              <button
                type="button"
                onClick={() => {
                  setStep('REQUEST');
                  setError(null);
                }}
                className="text-[#0E6B6B] dark:text-[#149B9B] hover:underline font-medium inline-flex items-center space-x-1"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Change</span>
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-[#1F2328] dark:text-[#E6EDF3]">
                  6-digit verification code
                </label>
                {resendCooldown > 0 ? (
                  <span className="text-[11px] text-[#8B949E]">
                    Resend in {resendCooldown}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleRequestOtp()}
                    disabled={loading}
                    className="text-[11px] text-[#0E6B6B] dark:text-[#149B9B] hover:underline font-medium inline-flex items-center space-x-1 disabled:opacity-50"
                  >
                    <RotateCw className="w-3 h-3" />
                    <span>Resend code</span>
                  </button>
                )}
              </div>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full px-3 py-2 text-base tracking-widest font-mono bg-white dark:bg-[#14171A] border border-[#E7E2DA] dark:border-[#2A3038] rounded-[6px] text-[#1F2328] dark:text-[#E6EDF3] focus-ring"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1F2328] dark:text-[#E6EDF3] mb-1.5">
                New password (min. 8 characters)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-3 pr-9 py-2 text-sm bg-white dark:bg-[#14171A] border border-[#E7E2DA] dark:border-[#2A3038] rounded-[6px] text-[#1F2328] dark:text-[#E6EDF3] focus-ring"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B949E] hover:text-[#1F2328] dark:hover:text-[#E6EDF3]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1F2328] dark:text-[#E6EDF3] mb-1.5">
                Confirm new password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-3 pr-9 py-2 text-sm bg-white dark:bg-[#14171A] border border-[#E7E2DA] dark:border-[#2A3038] rounded-[6px] text-[#1F2328] dark:text-[#E6EDF3] focus-ring"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B949E] hover:text-[#1F2328] dark:hover:text-[#E6EDF3]"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="mt-1 text-xs text-[#C0392B] dark:text-[#E53E3E]">Passwords do not match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || (confirmPassword.length > 0 && newPassword !== confirmPassword)}
              className="w-full bg-[#0E6B6B] hover:bg-[#0A5555] dark:bg-[#149B9B] dark:hover:bg-[#118585] text-white font-medium py-2.5 rounded-[6px] text-sm transition-colors focus-ring disabled:opacity-50"
            >
              {loading ? 'Updating password...' : 'Save new password & sign in'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
