import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, LogIn, Loader2 } from 'lucide-react';
import { authApi } from './api';
import { useAuthStore } from './authStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/dashboard';

  const setAuth = useAuthStore((s) => s.setAuth);
  const [form, setForm] = useState({ email: '', password: '', _hp_trap: '' });
  const [showPw, setShowPw] = useState(false);

  const mutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      toast.success(`Welcome back, Player ${data.user.username}!`);
      navigate(redirectTarget);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Login failed');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form._hp_trap) {
      // Honeypot triggered by bot
      return;
    }
    const { _hp_trap, ...payload } = form;
    mutation.mutate(payload);
  };

  return (
    <div className="glass-card p-8 animate-slide-up border-2 border-amber-500/40">
      <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-4">
        <LogIn size={24} />
      </div>

      <h1 className="font-pixel text-2xl font-bold text-white mb-1">PLAYER LOGIN</h1>
      <p className="text-slate-300 text-xs mb-8">Log in to resume your quests, earn XP, and level up.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Anti-bot honeypot field */}
        <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
          <input
            type="text"
            name="_hp_trap"
            value={form._hp_trap}
            onChange={(e) => setForm({ ...form, _hp_trap: e.target.value })}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-xs font-pixel text-amber-400 mb-2">EMAIL ADDRESS</label>
          <input
            id="email"
            type="email"
            className="input font-mono text-xs"
            placeholder="player@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-pixel text-amber-400 mb-2">PASSWORD</label>
          <div className="relative">
            <input
              id="password"
              type={showPw ? 'text' : 'password'}
              className="input pr-10 font-mono text-xs"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              aria-label={showPw ? 'Hide password' : 'Show password'}
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          id="login-submit"
          type="submit"
          className="btn-primary w-full font-pixel text-xs py-3.5"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
          {mutation.isPending ? 'LOGGING IN...' : 'LOG IN'}
        </button>
      </form>

      <p className="text-center text-xs font-pixel text-slate-400 mt-6">
        NEW PLAYER?{' '}
        <Link to={`/register${redirectTarget !== '/dashboard' ? `?redirect=${redirectTarget}` : ''}`} className="text-amber-400 hover:underline">
          CREATE ACCOUNT
        </Link>
      </p>
    </div>
  );
}
