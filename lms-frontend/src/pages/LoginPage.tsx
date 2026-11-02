import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Lock, Mail, Eye, EyeOff, ArrowRight, Loader2, KeyRound } from 'lucide-react';
import { Alert } from '../components/ui/Alert';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setServerError(null);
    try {
      const auth = await login(data.email, data.password);
      if (auth.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setServerError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (email: string, pass: string) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', pass, { shouldValidate: true });
    setServerError(null);
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#FAFAF8]">
      <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-lg border border-[#E5E7EB] shadow-card space-y-6">
        {/* Brand Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 group">
            <div className="w-8 h-8 rounded-md bg-[#172B4D] flex items-center justify-center text-white">
              <GraduationCap className="w-5 h-5 text-teal-300" />
            </div>
            <span className="font-bold text-xl tracking-tight text-[#172B4D]">
              Skill<span className="text-[#287C78]">Forge</span>
            </span>
          </Link>
          <h2 className="mt-4 text-xl font-bold text-[#20252B] tracking-tight">Sign in to your account</h2>
          <p className="mt-1 text-xs text-[#697386]">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-medium text-[#287C78] hover:underline">
              Create student account
            </Link>
          </p>
        </div>

        {serverError && (
          <Alert type="error" message={serverError} />
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#20252B] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                {...register('email')}
                placeholder="you@example.com"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#172B4D] focus:bg-white text-[#20252B] transition"
              />
            </div>
            {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-[#20252B]">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs font-medium text-[#287C78] hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="••••••••"
                className="w-full pl-9 pr-9 py-2 text-xs sm:text-sm bg-slate-50 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#172B4D] focus:bg-white text-[#20252B] transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-rose-600 mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#172B4D] hover:bg-[#0F1E36] text-white font-medium py-2.5 rounded-md text-xs sm:text-sm shadow-sm transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Helper Pill for Evaluators/Recruiters */}
        <div className="pt-3 border-t border-[#E5E7EB]">
          <p className="text-[11px] font-semibold text-[#697386] uppercase tracking-wider mb-2 flex items-center gap-1">
            <KeyRound className="w-3.5 h-3.5 text-slate-400" /> Demo Credentials:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo('admin@skillforge.com', 'admin123')}
              className="p-2 text-left bg-slate-50 hover:bg-slate-100 border border-[#E5E7EB] rounded-md transition-colors"
            >
              <p className="text-xs font-semibold text-[#20252B]">Admin Demo</p>
              <p className="text-[10px] text-[#697386]">admin@skillforge.com</p>
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('diyarani589@gmail.com', 'Admin@1234')}
              className="p-2 text-left bg-slate-50 hover:bg-slate-100 border border-[#E5E7EB] rounded-md transition-colors"
            >
              <p className="text-xs font-semibold text-[#20252B]">Student Demo</p>
              <p className="text-[10px] text-[#697386]">diyarani589@gmail.com</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
