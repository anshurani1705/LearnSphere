import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Lock, Mail, User, Phone, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { Alert } from '../components/ui/Alert';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setServerError(null);
    try {
      await registerUser(data.fullName, data.email, data.password, data.phone);
      navigate('/dashboard');
    } catch (err: any) {
      setServerError(err.message || 'Registration failed');
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
          <h2 className="mt-4 text-xl font-bold text-[#20252B] tracking-tight">Create your student account</h2>
          <p className="mt-1 text-xs text-[#697386]">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-[#287C78] hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        {serverError && (
          <Alert type="error" message={serverError} />
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#20252B] mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                {...register('fullName')}
                placeholder="Priya Sharma"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#172B4D] focus:bg-white text-[#20252B] transition"
              />
            </div>
            {errors.fullName && <p className="text-xs text-rose-600 mt-1">{errors.fullName.message}</p>}
          </div>

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
            <label className="block text-xs font-semibold text-[#20252B] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="At least 8 characters"
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

          <div>
            <label className="block text-xs font-semibold text-[#20252B] mb-1.5">
              Phone Number <span className="text-[#697386] font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                {...register('phone')}
                placeholder="+91 9876543210"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#172B4D] focus:bg-white text-[#20252B] transition"
              />
            </div>
          </div>

          <p className="text-[11px] text-[#697386] leading-relaxed">
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="text-[#287C78] underline">Terms of Service</Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-[#287C78] underline">Privacy Policy</Link>.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#172B4D] hover:bg-[#0F1E36] text-white font-medium py-2.5 rounded-md text-xs sm:text-sm shadow-sm transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Student Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
