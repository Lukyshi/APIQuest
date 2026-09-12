import { Outlet, Link } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-surface">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-amber-500/15 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-orange-500/15 blur-[100px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <Link to="/" className="flex items-center justify-center gap-3 mb-8 group">
          <img
              src="/logo.png"
              alt="API Quest logo"
              className="h-12 w-auto group-hover:scale-105 transition-transform drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
            />
          <span className="font-pixel text-2xl font-extrabold text-white tracking-wide">
            API<span className="gradient-text">QUEST</span>
          </span>
        </Link>
        <Outlet />
      </div>
    </div>
  );
}
