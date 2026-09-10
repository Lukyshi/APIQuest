import { Outlet, NavLink, Link } from 'react-router-dom';
import { useAuthStore } from '../features/auth/authStore';
import { useState } from 'react';
import {
  BookOpen, Code2, Zap, Trophy, LayoutDashboard,
  LogOut, Menu, X, Swords, Flame, Gamepad2
} from 'lucide-react';

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
    <div className="min-h-screen flex flex-col bg-surface">
      {/* ── Arcade Navbar ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-amber-500/20 bg-surface/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Pixel Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-gold shadow-glow text-slate-950 font-bold group-hover:scale-105 transition-transform">
              <Gamepad2 size={20} className="text-slate-950" />
            </div>
            <span className="font-pixel text-xl text-white font-extrabold tracking-wide">
              API<span className="gradient-text">QUEST</span>
              <span className="text-[10px] text-amber-400 font-sans block tracking-widest font-normal opacity-80">ARCADE EDITION</span>
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
                <Icon size={16} className="text-amber-400" />
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Auth & User HUD */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-pixel">
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
                  className="btn-ghost py-1.5 px-3 text-xs text-slate-400 hover:text-amber-400"
                  aria-label="Log out"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-xs font-pixel py-2 px-3.5">Log In</Link>
                <Link to="/register" className="btn-primary text-xs font-pixel py-2 px-4">
                  <Zap size={14} className="fill-slate-950" /> Join Arcade
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden btn-ghost p-2 text-amber-400"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-amber-500/20 bg-surface-1 px-4 py-4 space-y-2 animate-fade-in">
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
              <div className="pt-2 border-t border-amber-500/10 space-y-2">
                <NavLink to="/dashboard" onClick={() => setMobileOpen(false)} className={({ isActive }) => `nav-link font-pixel w-full ${isActive ? 'active' : ''}`}>
                  <LayoutDashboard size={16} /> Player HUD
                </NavLink>
                <button onClick={() => { logout(); setMobileOpen(false); }} className="nav-link font-pixel w-full text-rose-400">
                  <LogOut size={16} /> Quit Game
                </button>
              </div>
            ) : (
              <div className="flex gap-2 pt-2 border-t border-amber-500/10">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-outline flex-1 font-pixel text-center text-xs py-2.5">Log In</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary flex-1 font-pixel text-center text-xs py-2.5">Join Arcade</Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* ── Page Content ─────────────────────────────────────────────────── */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ── Arcade Retro Footer ──────────────────────────────────────────── */}
      <footer className="border-t border-amber-500/15 bg-surface-1 py-8 text-center text-xs text-slate-400 font-pixel">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-amber-400">
            <Gamepad2 size={16} />
            <span>API QUEST ARCADE © {new Date().getFullYear()}</span>
          </div>
          <p className="text-slate-500 text-xs">
            Learn REST, SOAP, GraphQL, Auth, Security & Webhooks the fun way.
          </p>
          <div className="flex gap-4 text-slate-400">
            <Link to="/concepts" className="hover:text-amber-400">Learn</Link>
            <Link to="/sandbox" className="hover:text-amber-400">Sandbox</Link>
            <Link to="/challenges" className="hover:text-amber-400">Quests</Link>
            <Link to="/leaderboard" className="hover:text-amber-400">Scores</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
