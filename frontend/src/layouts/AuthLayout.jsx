import { Outlet, Link } from 'react-router-dom';
import { Gamepad2 } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-surface">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-amber-500/15 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-orange-500/15 blur-[100px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <Link to="/" className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-gold shadow-glow">
            <Gamepad2 size={22} className="text-slate-950" />
          </div>
          <span className="font-pixel text-2xl font-extrabold text-white tracking-wide">
            API<span className="gradient-text">QUEST</span>
          </span>
        </Link>
        <Outlet />
      </div>
    </div>
  );
}
