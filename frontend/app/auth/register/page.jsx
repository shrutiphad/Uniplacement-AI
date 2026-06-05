'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { DEPARTMENTS, SEMESTERS } from '@/lib/utils';
import toast from 'react-hot-toast';
import { BrainCircuit, Eye, EyeOff, Loader2, UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = await registerUser(data);
      toast.success(`Welcome to UniPlacement AI, ${user.name.split(' ')[0]}!`);
      router.push('/student/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 bg-grid flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-hero-glow pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center">
              <BrainCircuit className="w-6 h-6 text-dark-950" />
            </div>
            <span className="font-display font-bold text-xl text-white">UniPlacement<span className="text-brand-400"> AI</span></span>
          </Link>
          <h1 className="font-display text-3xl font-bold text-white">Create account</h1>
          <p className="text-dark-400 mt-2 text-sm">Join the AI-powered placement platform</p>
        </div>

        <div className="card p-8 glow-brand">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
<<<<<<< HEAD
              <input type="text" placeholder="Arjun Sharma" className={errors.name ? 'input-error' : 'input'}
=======
              <input type="text" placeholder="Shruti Phad" className={errors.name ? 'input-error' : 'input'}
>>>>>>> 86838480ddaa8475541949c790340f60bf2c49a6
                {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Too short' } })} />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="label">Email Address</label>
<<<<<<< HEAD
              <input type="email" placeholder="you@university.edu" className={errors.email ? 'input-error' : 'input'}
=======
              <input type="email" placeholder="shruti@gmail.com" className={errors.email ? 'input-error' : 'input'}
>>>>>>> 86838480ddaa8475541949c790340f60bf2c49a6
                {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })} />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Department</label>
                <select className={errors.department ? 'input-error' : 'input'}
                  {...register('department', { required: 'Required' })}>
                  <option value="">Select</option>
                  {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                {errors.department && <p className="text-red-400 text-xs mt-1">{errors.department.message}</p>}
              </div>
              <div>
                <label className="label">Semester</label>
                <select className={errors.semester ? 'input-error' : 'input'}
                  {...register('semester', { required: 'Required' })}>
                  <option value="">Select</option>
                  {SEMESTERS.map((s) => <option key={s} value={s}>Semester {s}</option>)}
                </select>
                {errors.semester && <p className="text-red-400 text-xs mt-1">{errors.semester.message}</p>}
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} placeholder="Min 8 characters"
                  className={`${errors.password ? 'input-error' : 'input'} pr-11`}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Min 8 characters' },
                    pattern: { value: /(?=.*[A-Z])(?=.*[0-9])/, message: 'Must include uppercase and number' }
                  })} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-200">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 mt-2">
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</>
              ) : (
                <><UserPlus className="w-4 h-4" /> Create Account</>
              )}
            </button>
          </form>

          <p className="text-center text-dark-400 text-sm mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}