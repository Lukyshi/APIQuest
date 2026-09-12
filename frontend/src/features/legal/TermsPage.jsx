import { Link } from 'react-router-dom';
import { FileText, ArrowLeft, Shield, AlertTriangle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Back button */}
      <Link to="/" className="inline-flex items-center gap-2 text-xs font-pixel text-slate-400 hover:text-amber-400 mb-8 transition-colors">
        <ArrowLeft size={14} /> BACK TO ARCADE
      </Link>

      <div className="glass-card p-8 sm:p-12 border-2 border-amber-500/30 animate-fade-in">
        <div className="inline-flex items-center gap-2 pill-yellow mb-4">
          <FileText size={14} className="text-amber-400" />
          <span>LEGAL & COMPLIANCE</span>
        </div>

        <h1 className="font-pixel text-3xl sm:text-4xl font-extrabold text-white mb-2">
          TERMS & CONDITIONS
        </h1>
        <p className="text-xs text-slate-400 font-pixel mb-8">
          Last updated: September 2026 • Version 1.1
        </p>

        <div className="space-y-8 text-sm text-slate-300 leading-relaxed font-sans">
          <section>
            <h2 className="font-pixel text-lg text-amber-400 font-bold mb-3 flex items-center gap-2">
              <span className="text-amber-500">1.</span> Acceptance of Terms
            </h2>
            <p>
              By accessing or using API Quest (including our interactive sandbox, quest maps, concept library, and leaderboard), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use the service.
            </p>
          </section>

          <section>
            <h2 className="font-pixel text-lg text-amber-400 font-bold mb-3 flex items-center gap-2">
              <span className="text-amber-500">2.</span> Account Responsibilities
            </h2>
            <p className="mb-2">
              When creating an API Quest account, you agree to provide accurate information and safeguard your credentials. You are responsible for all activities occurring under your player username.
            </p>
          </section>

          <section>
            <h2 className="font-pixel text-lg text-amber-400 font-bold mb-3 flex items-center gap-2">
              <span className="text-amber-500">3.</span> Acceptable Use & Fair Play Rules
            </h2>
            <p className="mb-2">
              API Quest is an educational platform. To ensure a fair and safe experience for all developers:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
              <li><strong>Leaderboard Integrity:</strong> Automated scripting or exploitation of challenge endpoints to artificially inflate XP or streak scores is strictly prohibited.</li>
              <li><strong>Sandbox Safety:</strong> The live API sandbox proxy must not be used to launch denial-of-service (DoS) attacks, port scans, or proxy malicious requests to external third-party servers.</li>
              <li><strong>Rate Limiting Compliance:</strong> You agree not to bypass, disable, or tamper with API rate limiters or security controls.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-pixel text-lg text-amber-400 font-bold mb-3 flex items-center gap-2">
              <span className="text-amber-500">4.</span> Intellectual Property
            </h2>
            <p>
              All game mechanics, pixel assets, visual designs, quest challenges, documentation, and code trademarks are the property of API Quest and its creator. Educational code examples and tutorial snippets are provided under permissive terms for individual learning.
            </p>
          </section>

          <section>
            <h2 className="font-pixel text-lg text-amber-400 font-bold mb-3 flex items-center gap-2">
              <span className="text-amber-500">5.</span> Disclaimers & Limitation of Liability
            </h2>
            <p>
              API Quest is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis for educational purposes. We make no warranties regarding uninterrupted service or third-party API availability during simulated sandbox tests.
            </p>
          </section>

          <section>
            <h2 className="font-pixel text-lg text-amber-400 font-bold mb-3 flex items-center gap-2">
              <span className="text-amber-500">6.</span> Changes to Terms
            </h2>
            <p>
              We reserve the right to modify these terms as API Quest evolves. Significant revisions will be highlighted on the platform or updated with a revised timestamp.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
