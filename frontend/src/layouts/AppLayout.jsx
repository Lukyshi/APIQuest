import { Outlet, NavLink, Link } from 'react-router-dom';
import { useAuthStore } from '../features/auth/authStore';
import { useState } from 'react';
import {
  BookOpen, Code2, Zap, Trophy, LayoutDashboard,
  LogOut, Menu, X, Swords, Flame, Heart
} from 'lucide-react';
import { openCookiePreferences } from '../components/CookieConsent';

const navItems = [
  { to: '/concepts',    label: 'Learn',       icon: BookOpen },
  { to: '/sandbox',     label: 'Sandbox',     icon: Code2 },
  { to: '/challenges',  label: 'Challenges',  icon: Swords },
  { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
];

export default function AppLayout() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-moss-950 text-slate-100">
      {/* ── Temple Navbar ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-emerald-500/20 bg-moss-950/95 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo — Kept exactly as-is with original arcade yellow/orange styling */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
            <img
              src="/logo.png"
              alt="API Quest logo"
              className="h-9 w-auto group-hover:scale-105 transition-transform drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
            />
            <span className="font-pixel text-xl text-white font-extrabold tracking-wide">
              API<span className="gradient-text">QUEST</span>
              <span className="text-[10px] text-emerald-400 font-sans block tracking-widest font-normal opacity-85">TEMPLE EDITION</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `nav-link font-pixel text-sm px-3.5 py-2 ${isActive ? 'active' : ''}`}
              >
                <Icon size={16} className="text-emerald-400" />
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Auth & User HUD */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-pixel">
                  <Flame size={14} className="text-amber-400 fill-amber-400" />
                  <span>PLAYER: <strong className="text-white">{user?.username}</strong></span>
                </div>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) => `nav-link font-pixel text-xs py-1.5 px-3 ${isActive ? 'active' : ''}`}
                >
                  <LayoutDashboard size={14} />
                  HUD
                </NavLink>
                <button
                  onClick={logout}
                  className="btn-ghost py-1.5 px-3 text-xs text-slate-400 hover:text-emerald-400"
                  aria-label="Log out"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-xs font-pixel py-2 px-3.5">Log In</Link>
                <Link to="/register" className="btn-primary text-xs font-pixel py-2 px-4">
                  <Zap size={14} className="fill-slate-950" /> Join Temple
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden btn-ghost p-2 text-emerald-400"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-emerald-500/20 bg-moss-900 px-4 py-4 space-y-2 animate-fade-in shadow-xl">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `nav-link font-pixel w-full py-2.5 ${isActive ? 'active' : ''}`}
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <div className="pt-2 border-t border-emerald-500/20 space-y-2">
                <NavLink to="/dashboard" onClick={() => setMobileOpen(false)} className={({ isActive }) => `nav-link font-pixel w-full ${isActive ? 'active' : ''}`}>
                  <LayoutDashboard size={16} /> Player HUD
                </NavLink>
                <button onClick={() => { logout(); setMobileOpen(false); }} className="nav-link font-pixel w-full text-rose-400">
                  <LogOut size={16} /> Quit Game
                </button>
              </div>
            ) : (
              <div className="flex gap-2 pt-2 border-t border-emerald-500/20">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-outline flex-1 font-pixel text-center text-xs py-2.5">Log In</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary flex-1 font-pixel text-center text-xs py-2.5">Join Temple</Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* ── Page Content ─────────────────────────────────────────────────── */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ── Temple Footer ────────────────────────────────────────────────── */}
      <footer className="border-t border-emerald-500/20 bg-moss-950 py-10 text-xs text-slate-400 font-pixel">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
          {/* Main Footer Row */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2.5 text-emerald-400 hover:text-emerald-300 transition-colors">
                <img
                  src="/logo.png"
                  alt="API Quest logo"
                  className="h-6 w-auto"
                />
                <span className="font-bold tracking-wider">API QUEST</span>
              </Link>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="text-slate-400 text-[11px] hidden sm:inline">
                © {new Date().getFullYear()} API Quest. All rights reserved.
              </span>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-wrap items-center justify-center gap-5 text-slate-300">
              <Link to="/concepts" className="hover:text-emerald-400 transition-colors">Learn</Link>
              <Link to="/sandbox" className="hover:text-emerald-400 transition-colors">Sandbox</Link>
              <Link to="/challenges" className="hover:text-emerald-400 transition-colors">Quests</Link>
              <Link to="/leaderboard" className="hover:text-emerald-400 transition-colors">Leaderboard</Link>
            </div>
          </div>

          {/* Secondary Footer Row: Legal & Creator Credit */}
          <div className="pt-4 border-t border-moss-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <div>
              Created with <Heart size={11} className="inline text-rose-500 fill-rose-500 mx-0.5" /> by <strong className="text-slate-300 font-normal">Luiz</strong>
            </div>

            <div className="flex items-center gap-4 text-slate-400">
              <Link to="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
              <span>•</span>
              <Link to="/terms" className="hover:text-emerald-400 transition-colors">Terms & Conditions</Link>
              <span>•</span>
              <button
                onClick={openCookiePreferences}
                className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
              >
                Cookie Preferences
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
