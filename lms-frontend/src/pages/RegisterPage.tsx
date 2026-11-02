import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

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
    <div className="flex-1 flex items-center justify-center py-16 px-4 bg-[#FAF8F5]">
      <div className="max-w-md w-full bg-white p-8 rounded-[8px] border border-[#E7E2DA] shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-6">
        <div>
          <h1 className="font-serif font-semibold text-2xl text-[#1F2328] tracking-tight">
            Create your account
          </h1>
          <p className="mt-1 text-xs text-[#5F6368]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#0E6B6B] hover:underline font-medium">
              Sign in here
            </Link>
          </p>
        </div>

        {serverError && (
          <div className="p-3 bg-[#C0392B]/10 border border-[#C0392B]/20 rounded-[6px] text-xs text-[#C0392B]">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#1F2328] mb-1.5">
              Full name
            </label>
            <input
              type="text"
              {...register('fullName')}
              placeholder="Aarav Sharma"
              className="w-full px-3 py-2 text-sm bg-white border border-[#E7E2DA] rounded-[6px] text-[#1F2328] placeholder-[#8B949E] focus-ring transition"
            />
            {errors.fullName && <p className="text-xs text-[#C0392B] mt-1">{errors.fullName.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-[#1F2328] mb-1.5">
              Email address
            </label>
            <input
              type="email"
              {...register('email')}
              placeholder="name@example.com"
              className="w-full px-3 py-2 text-sm bg-white border border-[#E7E2DA] rounded-[6px] text-[#1F2328] placeholder-[#8B949E] focus-ring transition"
            />
            {errors.email && <p className="text-xs text-[#C0392B] mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-[#1F2328] mb-1.5">
              Phone number (optional)
            </label>
            <input
              type="tel"
              {...register('phone')}
              placeholder="+91 98765 43210"
              className="w-full px-3 py-2 text-sm bg-white border border-[#E7E2DA] rounded-[6px] text-[#1F2328] placeholder-[#8B949E] focus-ring transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#1F2328] mb-1.5">
              Password (min. 8 characters)
            </label>
            <input
              type="password"
              {...register('password')}
              placeholder="••••••••"
              className="w-full px-3 py-2 text-sm bg-white border border-[#E7E2DA] rounded-[6px] text-[#1F2328] placeholder-[#8B949E] focus-ring transition"
            />
            {errors.password && <p className="text-xs text-[#C0392B] mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0E6B6B] hover:bg-[#0A5555] text-white font-medium py-2.5 rounded-[6px] text-sm transition-colors focus-ring disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <span>Create account</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
