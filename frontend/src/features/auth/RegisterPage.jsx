import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, UserPlus, Loader2 } from 'lucide-react';
import { authApi } from './api';
import { useAuthStore } from './authStore';

export default function RegisterPage() {
  const navigate = useNavigate();
  const setAuth  = useAuthStore((s) => s.setAuth);
  const [form, setForm] = useState({ email: '', username: '', password: '' });
  const [showPw, setShowPw] = useState(false);

  const mutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      toast.success(`Account created! Let's go, ${data.user.username}! 🚀`);
      navigate('/concepts');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Registration failed');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div className="glass-card p-8 animate-slide-up">
      <h1 className="text-2xl font-bold text-white mb-1">Create your account</h1>
      <p className="text-slate-400 text-sm mb-8">Join API Quest — it's free, forever.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="reg-email" className="block text-xs font-semibold text-slate-400 mb-2">Email</label>
          <input id="reg-email" type="email" className="input" placeholder="you@example.com"
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            required autoComplete="email" />
        </div>
        <div>
          <label htmlFor="reg-username" className="block text-xs font-semibold text-slate-400 mb-2">Username</label>
          <input id="reg-username" type="text" className="input" placeholder="devhero42"
            value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}
            required autoComplete="username" pattern="[a-zA-Z0-9_]{3,30}"
            title="3-30 characters, letters, numbers, underscores only" />
        </div>
        <div>
          <label htmlFor="reg-password" className="block text-xs font-semibold text-slate-400 mb-2">Password</label>
          <div className="relative">
            <input id="reg-password" type={showPw ? 'text' : 'password'} className="input pr-10"
              placeholder="At least 8 characters"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              required minLength={8} autoComplete="new-password" />
            <button type="button" onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              aria-label={showPw ? 'Hide password' : 'Show password'}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <button id="register-submit" type="submit" className="btn-primary w-full" disabled={mutation.isPending}>
          {mutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
          {mutation.isPending ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-sm text-slate-400 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium">Sign in</Link>
      </p>
    </div>
  );
}
