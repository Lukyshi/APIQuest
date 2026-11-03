import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/authStore';
import { useState } from 'react';
import {
  BookOpen, Code2, Zap, Trophy, LayoutDashboard,
  LogOut, Menu, X, Swords, Flame, Compass, ChevronLeft,
  ChevronRight, Home, User, Settings, Star
} from 'lucide-react';
import { openCookiePreferences } from '../components/CookieConsent';

const sidebarItems = [
  { to: '/hub',          label: 'Command Center', icon: Home,            section: 'main' },
  { to: '/hub/profile',  label: 'Player Profile', icon: User,            section: 'main' },
  { to: '/concepts',     label: 'Learn',          icon: BookOpen,        section: 'explore' },
  { to: '/sandbox',      label: 'Sandbox',        icon: Code2,           section: 'explore' },
  { to: '/challenges',   label: 'Challenges',     icon: Swords,          section: 'explore' },
  { to: '/missions',     label: 'Missions',       icon: Compass,         section: 'explore' },
  { to: '/leaderboard',  label: 'Leaderboard',    icon: Trophy,          section: 'compete' },
];

export default function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const initials = (user?.username || '??').slice(0, 2).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const SidebarContent = ({ isMobile = false }) => (
    <div className="dash-sidebar-inner">
      {/* User Mini-Card */}
      <div className={`dash-sidebar-user ${collapsed && !isMobile ? 'dash-sidebar-user--collapsed' : ''}`}>
        <div className="dash-sidebar-avatar">
          <span className="font-pixel text-sm font-extrabold text-slate-950">{initials}</span>
        </div>
        {(!collapsed || isMobile) && (
          <div className="dash-sidebar-user-info">
            <span className="font-pixel text-xs font-bold text-white truncate">{user?.username}</span>
            <span className="text-[10px] text-emerald-400 font-pixel flex items-center gap-1">
              <Flame size={9} className="text-amber-400 fill-amber-400" /> ONLINE
            </span>
          </div>
        )}
      </div>

      {/* Nav Sections */}
      <nav className="dash-sidebar-nav">
        {/* Main */}
        <div className="dash-sidebar-section">
          {(!collapsed || isMobile) && (
            <span className="dash-sidebar-section-label">HUB</span>
          )}
          {sidebarItems.filter(i => i.section === 'main').map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/hub'}
              onClick={() => isMobile && setMobileOpen(false)}
              className={({ isActive }) =>
                `dash-sidebar-link ${isActive ? 'dash-sidebar-link--active' : ''} ${collapsed && !isMobile ? 'dash-sidebar-link--collapsed' : ''}`
              }
              title={collapsed ? label : undefined}
            >
              <Icon size={18} />
              {(!collapsed || isMobile) && <span>{label}</span>}
            </NavLink>
          ))}
        </div>

        {/* Explore */}
        <div className="dash-sidebar-section">
          {(!collapsed || isMobile) && (
            <span className="dash-sidebar-section-label">EXPLORE</span>
          )}
          {sidebarItems.filter(i => i.section === 'explore').map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => isMobile && setMobileOpen(false)}
              className={({ isActive }) =>
                `dash-sidebar-link ${isActive ? 'dash-sidebar-link--active' : ''} ${collapsed && !isMobile ? 'dash-sidebar-link--collapsed' : ''}`
              }
              title={collapsed ? label : undefined}
            >
              <Icon size={18} />
              {(!collapsed || isMobile) && <span>{label}</span>}
            </NavLink>
          ))}
        </div>

        {/* Compete */}
        <div className="dash-sidebar-section">
          {(!collapsed || isMobile) && (
            <span className="dash-sidebar-section-label">COMPETE</span>
          )}
          {sidebarItems.filter(i => i.section === 'compete').map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => isMobile && setMobileOpen(false)}
              className={({ isActive }) =>
                `dash-sidebar-link ${isActive ? 'dash-sidebar-link--active' : ''} ${collapsed && !isMobile ? 'dash-sidebar-link--collapsed' : ''}`
              }
              title={collapsed ? label : undefined}
            >
              <Icon size={18} />
              {(!collapsed || isMobile) && <span>{label}</span>}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Bottom Actions */}
      <div className="dash-sidebar-bottom">
        <button
          onClick={handleLogout}
          className={`dash-sidebar-link dash-sidebar-link--danger ${collapsed && !isMobile ? 'dash-sidebar-link--collapsed' : ''}`}
          title={collapsed ? 'Log Out' : undefined}
        >
          <LogOut size={18} />
          {(!collapsed || isMobile) && <span>Log Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="dash-layout">
      {/* ── Desktop Sidebar ─────────────────────────────────────────────── */}
      <aside className={`dash-sidebar ${collapsed ? 'dash-sidebar--collapsed' : ''}`}>
        {/* Logo Bar */}
        <div className="dash-sidebar-header">
          <Link to="/hub" className="dash-sidebar-logo">
            <img src="/logo.png" alt="API Quest logo" className="h-8 w-auto" />
            {!collapsed && (
              <span className="font-pixel text-sm text-white font-extrabold tracking-wide">
                API<span className="gradient-text">QUEST</span>
              </span>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(v => !v)}
            className="dash-sidebar-toggle"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <SidebarContent />
      </aside>

      {/* ── Mobile Top Bar ──────────────────────────────────────────────── */}
      <header className="dash-mobile-header">
        <Link to="/hub" className="flex items-center gap-2.5">
          <img src="/logo.png" alt="API Quest logo" className="h-7 w-auto" />
          <span className="font-pixel text-sm text-white font-extrabold">
            API<span className="gradient-text">QUEST</span>
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(v => !v)}
          className="dash-mobile-toggle"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* ── Mobile Drawer ───────────────────────────────────────────────── */}
      {mobileOpen && (
        <>
          <div className="dash-mobile-overlay" onClick={() => setMobileOpen(false)} />
          <div className="dash-mobile-drawer">
            <SidebarContent isMobile />
          </div>
        </>
      )}

      {/* ── Main Content ────────────────────────────────────────────────── */}
      <div className={`dash-main ${collapsed ? 'dash-main--expanded' : ''}`}>
        <main className="dash-content">
          <Outlet />
        </main>

        {/* Mini Footer */}
        <footer className="dash-footer">
          <span>© {new Date().getFullYear()} API Quest • Temple Edition</span>
          <div className="dash-footer-links">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <button onClick={openCookiePreferences}>Cookies</button>
          </div>
        </footer>
      </div>
    </div>
  );
}
