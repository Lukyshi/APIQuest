import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, UserPlus, Loader2, Sparkles } from 'lucide-react';
import { authApi } from './api';
import { useAuthStore } from './authStore';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/challenges';

  const setAuth = useAuthStore((s) => s.setAuth);
  const [form, setForm] = useState({ email: '', username: '', password: '', _hp_trap: '' });
  const [showPw, setShowPw] = useState(false);

  const mutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      toast.success(`Player profile created! Welcome ${data.user.username}!`);
      navigate(redirectTarget);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Registration failed');
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
        <Sparkles size={24} />
      </div>

      <h1 className="font-pixel text-2xl font-bold text-white mb-1">NEW PLAYER REGISTRATION</h1>
      <p className="text-slate-300 text-xs mb-8">Join API Quest — track XP, unlock nodes, and claim badges.</p>

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
          <label htmlFor="reg-email" className="block text-xs font-pixel text-amber-400 mb-2">EMAIL ADDRESS</label>
          <input
            id="reg-email"
            type="email"
            className="input font-mono text-xs"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="reg-username" className="block text-xs font-pixel text-amber-400 mb-2">PLAYER USERNAME</label>
          <input
            id="reg-username"
            type="text"
            className="input font-mono text-xs"
            placeholder="api_hero_99"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
            autoComplete="username"
            pattern="[a-zA-Z0-9_]{3,30}"
            title="3-30 characters, letters, numbers, underscores only"
          />
        </div>

        <div>
          <label htmlFor="reg-password" className="block text-xs font-pixel text-amber-400 mb-2">PASSWORD</label>
          <div className="relative">
            <input
              id="reg-password"
              type={showPw ? 'text' : 'password'}
              className="input pr-10 font-mono text-xs"
              placeholder="Min 8 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={8}
              autoComplete="new-password"
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
          id="register-submit"
          type="submit"
          className="btn-primary w-full font-pixel text-xs py-3.5"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
          {mutation.isPending ? 'CREATING PROFILE...' : 'START PLAYER JOURNEY'}
        </button>
      </form>

      <p className="text-center text-xs font-pixel text-slate-400 mt-6">
        ALREADY HAVE A PROFILE?{' '}
        <Link to={`/login${redirectTarget !== '/challenges' ? `?redirect=${redirectTarget}` : ''}`} className="text-amber-400 hover:underline">
          LOG IN
        </Link>
      </p>
    </div>
  );
}
