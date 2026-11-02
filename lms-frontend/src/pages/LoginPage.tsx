import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

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

  const fillDemo = (email: string, pass: string) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', pass, { shouldValidate: true });
    setServerError(null);
  };

  return (
    <div className="flex-1 flex items-center justify-center py-16 px-4 bg-[#FAF8F5] dark:bg-[#14171A] transition-colors duration-200">
      <div className="max-w-md w-full bg-white dark:bg-[#1C2025] p-8 rounded-[8px] border border-[#E7E2DA] dark:border-[#2A3038] shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-6">
        <div>
          <h1 className="font-serif font-semibold text-2xl text-[#1F2328] dark:text-[#E6EDF3] tracking-tight">
            Sign in to SkillForge
          </h1>
          <p className="mt-1 text-xs text-[#5F6368] dark:text-[#8B949E]">
            Need an account?{' '}
            <Link to="/register" className="text-[#0E6B6B] dark:text-[#149B9B] hover:underline font-medium">
              Create a student account
            </Link>
          </p>
        </div>

        {serverError && (
          <div className="p-3 bg-[#C0392B]/10 dark:bg-[#E53E3E]/10 border border-[#C0392B]/20 dark:border-[#E53E3E]/20 rounded-[6px] text-xs text-[#C0392B] dark:text-[#E53E3E]">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#1F2328] dark:text-[#E6EDF3] mb-1.5">
              Email address
            </label>
            <input
              type="email"
              {...register('email')}
              placeholder="name@example.com"
              className="w-full px-3 py-2 text-sm bg-white dark:bg-[#14171A] border border-[#E7E2DA] dark:border-[#2A3038] rounded-[6px] text-[#1F2328] dark:text-[#E6EDF3] placeholder-[#8B949E] focus-ring transition"
            />
            {errors.email && <p className="text-xs text-[#C0392B] dark:text-[#E53E3E] mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-[#1F2328] dark:text-[#E6EDF3]">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-[#0E6B6B] dark:text-[#149B9B] hover:underline">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              {...register('password')}
              placeholder="••••••••"
              className="w-full px-3 py-2 text-sm bg-white dark:bg-[#14171A] border border-[#E7E2DA] dark:border-[#2A3038] rounded-[6px] text-[#1F2328] dark:text-[#E6EDF3] placeholder-[#8B949E] focus-ring transition"
            />
            {errors.password && <p className="text-xs text-[#C0392B] dark:text-[#E53E3E] mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0E6B6B] hover:bg-[#0A5555] dark:bg-[#149B9B] dark:hover:bg-[#118585] text-white font-medium py-2.5 rounded-[6px] text-sm transition-colors focus-ring disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign in</span>
            )}
          </button>
        </form>

        {/* Subtle Demo Account Auto-Fill */}
        <div className="pt-4 border-t border-[#E7E2DA] dark:border-[#2A3038] flex items-center justify-between text-xs text-[#5F6368] dark:text-[#8B949E]">
          <span>Testing the platform?</span>
          <div className="space-x-2">
            <button
              type="button"
              onClick={() => fillDemo('diyarani589@gmail.com', 'Student@12345')}
              className="text-[#0E6B6B] dark:text-[#149B9B] hover:underline font-medium"
            >
              Fill student demo
            </button>
            <span>&bull;</span>
            <button
              type="button"
              onClick={() => fillDemo('admin@skillforge.com', 'Admin@12345')}
              className="text-[#0E6B6B] dark:text-[#149B9B] hover:underline font-medium"
            >
              Fill admin demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
