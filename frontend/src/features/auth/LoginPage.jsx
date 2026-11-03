import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, LogIn, Loader2, Mail, Gamepad2 } from 'lucide-react';
import { authApi } from './api';
import { useAuthStore } from './authStore';
import CharacterStage from './CharacterStage';
import PixelWind from '../../components/PixelWind';

/* ─── Social SVG Icons ──────────────────────────────────────────────────── */
function SocialLinks() {
  const icons = [
    {
      label: 'Discord',
      href: 'https://discord.com',
      path: 'M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z',
    },
    {
      label: 'Twitch',
      href: 'https://twitch.tv',
      path: 'M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z',
    },
    {
      label: 'X / Twitter',
      href: 'https://twitter.com',
      path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
      size: 'w-3 h-3',
    },
    {
      label: 'Facebook',
      href: 'https://facebook.com',
      path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
    },
  ];

  return (
    <div className="flex items-center gap-2.5 mt-auto pt-6 lg:pt-8">
      {icons.map((icon) => (
        <a
          key={icon.label}
          href={icon.href}
          target="_blank"
          rel="noreferrer"
          aria-label={icon.label}
          className="w-9 h-9 rounded-lg bg-white/35 hover:bg-white text-[#1b3a06] flex items-center justify-center transition-all shadow-sm hover:scale-110 hover:shadow-md"
        >
          <svg className={`${icon.size || 'w-3.5 h-3.5'} fill-current`} viewBox="0 0 24 24">
            <path d={icon.path} />
          </svg>
        </a>
      ))}
    </div>
  );
}

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
    if (form._hp_trap) return;
    const { _hp_trap, ...payload } = form;
    mutation.mutate(payload);
  };

  return (
    <div
      className="relative w-full min-h-screen flex flex-col justify-between overflow-x-hidden"
      style={{
        background: 'linear-gradient(135deg, #78b832 0%, #529224 35%, #2a5f1a 70%, #143510 100%)',
      }}
    >
      {/* ══════════════════════════════════════════════════════════════════════
          THEME BACKGROUND LAYERS (Jungle Temple + Facets + Particle Drift)
          ══════════════════════════════════════════════════════════════════════ */}

      {/* Subtle Jungle Temple Background Artwork overlay for authentic API Quest theme */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-[0.14] mix-blend-overlay"
        style={{
          backgroundImage: 'url(/apiBackground.jpg)',
          filter: 'saturate(1.2) contrast(1.1)',
        }}
      />

      {/* Faceted Polygon Geometry — stretches edge-to-edge */}
      <svg
        className="pointer-events-none fixed inset-0 w-full h-full opacity-[0.16] z-0"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <polygon points="0,0 55,0 28,100 0,100" fill="#ffffff" opacity="0.3" />
        <polygon points="45,0 100,0 100,65 65,100 32,100" fill="#0f2610" opacity="0.25" />
        <polygon points="58,10 100,42 75,90 42,50" fill="#ffffff" opacity="0.12" />
        <polygon points="0,60 30,100 0,100" fill="#0f2610" opacity="0.2" />
        <line x1="28" y1="0" x2="65" y2="100" stroke="#ffffff" strokeWidth="0.35" opacity="0.35" />
        <line x1="0" y1="35" x2="100" y2="65" stroke="#0f2610" strokeWidth="0.35" opacity="0.3" />
      </svg>

      {/* Ambient Jungle Glows */}
      <div className="pointer-events-none fixed top-0 left-0 w-[600px] h-[600px] rounded-full bg-emerald-400/20 blur-[150px] -translate-x-1/3 -translate-y-1/4 z-0" />
      <div className="pointer-events-none fixed bottom-0 right-0 w-[700px] h-[700px] rounded-full bg-[#183020]/40 blur-[180px] translate-x-1/4 translate-y-1/4 z-0" />
      <div className="pointer-events-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-amber-400/10 blur-[130px] z-0" />

      {/* Floating Pixel Spore Particles */}
      <PixelWind count={25} />

      {/* Giant character watermark silhouette on the left behind form */}
      <div className="pointer-events-none fixed -left-8 bottom-0 w-[42vw] max-w-[550px] opacity-[0.08] select-none z-0">
        <img
          src="/character.png"
          alt=""
          className="w-full h-auto object-cover object-bottom filter grayscale contrast-150"
        />
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          TOP NAVIGATION BAR (Aligned with Content Stage)
          ══════════════════════════════════════════════════════════════════════ */}
      <header className="relative z-20 w-full">
        <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-5 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="w-11 h-11 rounded-xl bg-white/35 backdrop-blur-sm flex items-center justify-center text-[#1b3a06] shadow-sm">
              <Gamepad2 size={26} />
            </div>
            <div className="flex flex-col">
              <span className="font-pixel text-base sm:text-lg font-extrabold tracking-tight leading-none text-[#152e04]">
                API QUEST
              </span>
              <span className="text-[10px] font-sans font-medium text-[#2d5512]/80 tracking-wider uppercase">
                Game Anywhere
              </span>
            </div>
          </Link>

          {/* Right Nav */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              to="/"
              className="font-pixel text-[11px] sm:text-xs text-[#244709] hover:text-[#0f2103] font-bold tracking-wider uppercase transition-colors"
            >
              HOME
            </Link>
            <Link
              to={`/register${redirectTarget !== '/dashboard' ? `?redirect=${redirectTarget}` : ''}`}
              className="bg-white/90 hover:bg-white text-[#1b3a06] font-pixel text-[11px] sm:text-xs font-bold py-2 px-5 rounded-xl shadow-sm transition-all uppercase tracking-wider"
            >
              JOIN
            </Link>
            <div className="hidden md:flex items-center gap-2 text-[10px] font-sans font-semibold text-[#2f5a13]">
              <span className="opacity-50">RU</span>
              <span className="opacity-50">FR</span>
              <span className="font-bold text-[#152e04] flex items-center gap-0.5">
                <span className="text-xs">→</span> EN
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════════════
          MAIN CONTENT — BALANCED & COHESIVE CENTERPIECE COMPOSITION
          ══════════════════════════════════════════════════════════════════════ */}
      <main className="relative z-10 flex-1 w-full flex items-center justify-center">
        <div className="w-full max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 items-center lg:items-end gap-8 lg:gap-6 xl:gap-8 pb-6 lg:pb-0 h-full">
          {/* ── LEFT: Form Column (7 cols) ────────────────────────────────── */}
          <div className="lg:col-span-7 flex flex-col justify-center h-full max-w-lg lg:max-w-xl mx-auto lg:mx-0 w-full py-4 lg:py-6 z-10">
            {/* Eyebrow */}
            <div className="text-[11px] font-pixel text-[#244709] uppercase tracking-[0.2em] font-extrabold mb-1.5">
              START FOR FREE
            </div>

            {/* Headline */}
            <h1 className="font-pixel text-4xl sm:text-5xl lg:text-6xl font-black text-[#152e04] tracking-tight leading-[0.95]">
              SIGN IN
            </h1>
            <div className="w-24 sm:w-32 h-[3px] bg-[#1a3806] rounded-full mt-2.5 mb-3.5" />

            {/* Switch Link */}
            <p className="text-sm text-[#274f0c] font-sans mb-7">
              Don't have an Account?{' '}
              <Link
                to={`/register${redirectTarget !== '/dashboard' ? `?redirect=${redirectTarget}` : ''}`}
                className="text-[#ff5a13] font-bold hover:underline ml-1"
              >
                Create Account
              </Link>
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md w-full">
              {/* Honeypot */}
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

              {/* Email or Username Input — Perfectly Centered Icon */}
              <div className="group relative rounded-2xl bg-white/85 hover:bg-white/90 focus-within:bg-white backdrop-blur-sm border border-white/60 focus-within:border-white focus-within:ring-2 focus-within:ring-[#ff6000]/30 shadow-sm hover:shadow transition-all">
                <div className="py-2.5 px-4 pr-12">
                  <label
                    htmlFor="email"
                    className="block text-[10px] font-sans font-semibold text-stone-500 uppercase tracking-wider mb-0.5"
                  >
                    Email or Username
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full bg-transparent font-sans text-sm text-stone-900 placeholder-stone-400 focus:outline-none"
                    placeholder="player@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-stone-400 pointer-events-none">
                  <Mail size={17} />
                </div>
              </div>

              {/* Password Input — Perfectly Centered Eye Toggle Button */}
              <div className="group relative rounded-2xl bg-white/85 hover:bg-white/90 focus-within:bg-white backdrop-blur-sm border border-white/60 focus-within:border-white focus-within:ring-2 focus-within:ring-[#ff6000]/30 shadow-sm hover:shadow transition-all">
                <div className="py-2.5 px-4 pr-12">
                  <label
                    htmlFor="password"
                    className="block text-[10px] font-sans font-semibold text-stone-500 uppercase tracking-wider mb-0.5"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type={showPw ? 'text' : 'password'}
                    className="w-full bg-transparent font-sans text-sm text-stone-900 placeholder-stone-400 focus:outline-none"
                    placeholder="••••••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    autoComplete="current-password"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors p-0 cursor-pointer"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  id="login-submit"
                  type="submit"
                  className="bg-[#ff6000] hover:bg-[#ff7214] active:scale-[0.97] text-white font-pixel text-sm tracking-wider uppercase py-3.5 px-10 rounded-xl shadow-[0_8px_24px_rgba(255,96,0,0.35)] hover:shadow-[0_12px_32px_rgba(255,96,0,0.45)] flex items-center justify-center gap-2.5 transition-all disabled:opacity-70 cursor-pointer"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? (
                    <Loader2 size={17} className="animate-spin" />
                  ) : (
                    <LogIn size={17} />
                  )}
                  <span>{mutation.isPending ? 'LOGGING IN...' : 'LOGIN'}</span>
                </button>
              </div>
            </form>

            {/* Social Links */}
            <SocialLinks />
          </div>

          {/* ── RIGHT: Cohesive Character Column (5 cols, close to form) ──── */}
          <div className="flex lg:col-span-5 items-end justify-center h-full w-full pt-4 lg:pt-0">
            <CharacterStage />
          </div>
        </div>
      </main>
    </div>
  );
}
