import { Outlet, NavLink, Link } from 'react-router-dom';
import { useAuthStore } from '../features/auth/authStore';
import { useState } from 'react';
import {
  BookOpen, Code2, Zap, Trophy, LayoutDashboard,
  LogOut, LogIn, Menu, X, Swords
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
    <div className="min-h-screen flex flex-col">
      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-brand-500/10 bg-surface/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-brand">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold text-white text-lg">
              API<span className="gradient-text">Quest</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={15} />
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <LayoutDashboard size={15} />
                  Dashboard
                </NavLink>
                <div className="w-px h-5 bg-surface-3" />
                <span className="text-sm text-slate-400 font-medium">{user?.username}</span>
                <button
                  onClick={logout}
                  className="btn-ghost py-1.5 px-3 text-xs"
                  aria-label="Log out"
                >
                  <LogOut size={14} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login"    className="btn-ghost py-2 px-4 text-sm">Sign In</Link>
                <Link to="/register" className="btn-primary py-2 px-4 text-sm">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden btn-ghost p-2"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-brand-500/10 bg-surface-1 px-4 py-4 space-y-1 animate-fade-in">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `nav-link w-full ${isActive ? 'active' : ''}`}
              >
                <Icon size={15} />
                {label}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" onClick={() => setMobileOpen(false)} className={({ isActive }) => `nav-link w-full ${isActive ? 'active' : ''}`}>
                  <LayoutDashboard size={15} /> Dashboard
                </NavLink>
                <button onClick={() => { logout(); setMobileOpen(false); }} className="nav-link w-full text-rose-400">
                  <LogOut size={15} /> Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-outline flex-1 text-center text-sm py-2">Sign In</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary flex-1 text-center text-sm py-2">Get Started</Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* ── Page content ────────────────────────────────────────────────────── */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="border-t border-brand-500/10 py-6 text-center text-xs text-slate-500">
        API Quest © {new Date().getFullYear()} — Learn APIs the fun way
      </footer>
    </div>
  );
}
