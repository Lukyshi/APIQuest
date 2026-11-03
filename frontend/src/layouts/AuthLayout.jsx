import { Outlet } from 'react-router-dom';

/**
 * AuthLayout — Full-Screen Edge-to-Edge Gaming Layout
 * 
 * Removes all outer borders, card wrappers, and padding gaps,
 * allowing the authentication view to completely fill 100vw × 100vh.
 */
export default function AuthLayout() {
  return (
    <div className="w-full min-h-screen bg-[#76ad32] text-slate-900 relative overflow-x-hidden selection:bg-[#ff6000] selection:text-white">
      <Outlet />
    </div>
  );
}
