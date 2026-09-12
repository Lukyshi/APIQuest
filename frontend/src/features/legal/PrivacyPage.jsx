import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, Lock, FileText, CheckCircle2 } from 'lucide-react';
import { openCookiePreferences } from '../../components/CookieConsent';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Back button */}
      <Link to="/" className="inline-flex items-center gap-2 text-xs font-pixel text-slate-400 hover:text-amber-400 mb-8 transition-colors">
        <ArrowLeft size={14} /> BACK TO ARCADE
      </Link>

      <div className="glass-card p-8 sm:p-12 border-2 border-amber-500/30 animate-fade-in">
        <div className="inline-flex items-center gap-2 pill-yellow mb-4">
          <Shield size={14} className="text-amber-400" />
          <span>LEGAL & COMPLIANCE</span>
        </div>

        <h1 className="font-pixel text-3xl sm:text-4xl font-extrabold text-white mb-2">
          PRIVACY POLICY
        </h1>
        <p className="text-xs text-slate-400 font-pixel mb-8">
          Last updated: September 2026 • Version 1.1
        </p>

        <div className="space-y-8 text-sm text-slate-300 leading-relaxed font-sans">
          <section>
            <h2 className="font-pixel text-lg text-amber-400 font-bold mb-3 flex items-center gap-2">
              <span className="text-amber-500">1.</span> Information We Collect
            </h2>
            <p className="mb-3">
              API Quest collects minimal information necessary to deliver our educational gaming and API sandbox services:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
              <li><strong>Account Credentials:</strong> Username, email address, and securely salted/hashed passwords.</li>
              <li><strong>Gameplay & Progress Data:</strong> Experience points (XP), unlocked challenge nodes, completed quests, streaks, and achievement badges.</li>
              <li><strong>Sandbox Telemetry:</strong> Request methods, endpoint paths, response latency metrics, and status codes for latency display and rate limiting protection.</li>
              <li><strong>Technical Metadata:</strong> IP addresses and browser user-agent headers collected solely for security, fraud prevention, and rate limiting.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-pixel text-lg text-amber-400 font-bold mb-3 flex items-center gap-2">
              <span className="text-amber-500">2.</span> How We Use Your Information
            </h2>
            <p className="mb-2">We utilize your information to:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
              <li>Maintain your player profile, session state, and global leaderboard rankings.</li>
              <li>Evaluate challenge submissions and calculate correct answer awards.</li>
              <li>Enforce rate limits on live sandbox request proxies and protect services from spam/abuse.</li>
              <li>Continuously improve API Quest educational content and tutorial mechanics.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-pixel text-lg text-amber-400 font-bold mb-3 flex items-center gap-2">
              <span className="text-amber-500">3.</span> Cookies & Local Storage
            </h2>
            <p className="mb-3">
              API Quest utilizes HTTP authentication tokens and browser <code className="bg-surface-2 px-1.5 py-0.5 rounded text-amber-300 font-mono text-xs">localStorage</code> to preserve your login session and UI preferences.
            </p>
            <p className="mb-3">
              We do not use invasive third-party cross-site advertising trackers. You can adjust your cookie settings at any time by clicking the button below:
            </p>
            <button
              onClick={openCookiePreferences}
              className="btn-arcade text-xs font-pixel py-2 px-4 inline-flex items-center gap-2"
            >
              <FileText size={14} /> Open Cookie Preferences
            </button>
          </section>

          <section>
            <h2 className="font-pixel text-lg text-amber-400 font-bold mb-3 flex items-center gap-2">
              <span className="text-amber-500">4.</span> Data Retention & Security
            </h2>
            <p>
              Your passwords are cryptographically hashed with industry-standard bcrypt algorithms before storage. We implement TLS encryption for all data in transit. You can request deletion of your player account and associated progress records at any time.
            </p>
          </section>

          <section>
            <h2 className="font-pixel text-lg text-amber-400 font-bold mb-3 flex items-center gap-2">
              <span className="text-amber-500">5.</span> Contact & Inquiries
            </h2>
            <p>
              If you have any questions or data privacy requests regarding API Quest, please contact the team at <span className="text-amber-400 font-mono">support@apiquest.dev</span> or connect via our community channels.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
