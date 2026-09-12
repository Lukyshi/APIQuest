import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Cookie, X, Check } from 'lucide-react';

const STORAGE_KEY = 'apiquest_cookie_consent';

export function openCookiePreferences() {
  window.dispatchEvent(new CustomEvent('apiquest:open-cookie-settings'));
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // always required
    analytics: true,
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      // Small delay for smooth entry on first load
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handleOpen = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setPreferences({ essential: true, analytics: !!parsed.analytics });
        } catch {
          setPreferences({ essential: true, analytics: true });
        }
      }
      setShowPreferences(true);
      setVisible(true);
    };

    window.addEventListener('apiquest:open-cookie-settings', handleOpen);
    return () => window.removeEventListener('apiquest:open-cookie-settings', handleOpen);
  }, []);

  const handleAcceptAll = () => {
    const state = { essential: true, analytics: true, timestamp: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    setVisible(false);
    setShowPreferences(false);
  };

  const handleEssentialOnly = () => {
    const state = { essential: true, analytics: false, timestamp: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    setVisible(false);
    setShowPreferences(false);
  };

  const handleSaveCustom = () => {
    const state = { essential: true, analytics: preferences.analytics, timestamp: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    setVisible(false);
    setShowPreferences(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-slide-up">
      <div className="glass-card p-5 border-2 border-amber-500/40 shadow-2xl bg-surface-1/95 backdrop-blur-xl relative">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
            <Cookie size={18} />
          </div>
          <div className="flex-1 min-w-0 pr-6">
            <h4 className="font-pixel text-sm font-bold text-white mb-0.5">COOKIE & PRIVACY PREFERENCES</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              We use essential cookies to keep you logged in and save your quest progress. You can review our{' '}
              <Link to="/privacy" className="text-amber-400 underline hover:text-amber-300">
                Privacy Policy
              </Link>.
            </p>
          </div>
          <button
            onClick={handleEssentialOnly}
            className="absolute top-4 right-4 text-slate-400 hover:text-white"
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
        </div>

        {showPreferences && (
          <div className="my-3 pt-3 border-t border-amber-500/20 space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded bg-surface-2 border border-slate-700">
              <div>
                <span className="font-pixel text-white block">Essential Storage</span>
                <span className="text-slate-400 text-[11px]">Auth tokens, session state & gameplay XP</span>
              </div>
              <span className="pill-emerald text-[10px] font-pixel">ALWAYS ON</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-surface-2 border border-slate-700">
              <div>
                <span className="font-pixel text-white block">Analytics & Telemetry</span>
                <span className="text-slate-400 text-[11px]">Performance measurements & error logging</span>
              </div>
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                className="w-4 h-4 accent-amber-500 cursor-pointer"
              />
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 mt-4 pt-2 border-t border-amber-500/20">
          <button
            onClick={handleAcceptAll}
            className="btn-primary text-xs font-pixel py-1.5 px-3.5 flex-1"
          >
            <Check size={14} /> Accept All
          </button>
          {!showPreferences ? (
            <button
              onClick={() => setShowPreferences(true)}
              className="btn-ghost text-xs font-pixel py-1.5 px-3 text-slate-300"
            >
              Customize
            </button>
          ) : (
            <button
              onClick={handleSaveCustom}
              className="btn-ghost text-xs font-pixel py-1.5 px-3 text-amber-400"
            >
              Save Preferences
            </button>
          )}
          <button
            onClick={handleEssentialOnly}
            className="btn-ghost text-xs font-pixel py-1.5 px-3 text-slate-400 hover:text-slate-200"
          >
            Essential Only
          </button>
        </div>
      </div>
    </div>
  );
}
