import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, Code2, Swords, Trophy, ArrowRight, Zap, Shield,
  Globe, Send, Lock, Unlock, Star, Flame, Sparkles, CheckCircle2, Play
} from 'lucide-react';
import { sandboxApi } from '../sandbox/api';

const coreHubs = [
  {
    id: 'learn',
    title: 'LEARN',
    subtitle: 'Concept Library & Mechanics',
    icon: BookOpen,
    desc: 'Deep-dive explanations of REST, SOAP, GraphQL, Auth, Security, Webhooks, and API architecture trade-offs.',
    link: '/concepts',
    pill: '9 REALMS TO EXPLORE',
    btnText: 'Open Library',
  },
  {
    id: 'sandbox',
    title: 'SANDBOX',
    subtitle: 'Live API Request Deck',
    icon: Code2,
    desc: 'Craft real HTTP calls, GraphQL queries, and SOAP XML envelopes with live timing and status inspection.',
    link: '/sandbox',
    pill: 'INTERACTIVE DECK',
    btnText: 'Launch Sandbox',
  },
  {
    id: 'challenges',
    title: 'CHALLENGES',
    subtitle: 'Gamified Quest Map',
    icon: Swords,
    desc: 'Solve quizzes, fix broken requests, and predict responses. Earn XP and unlock higher-level quest nodes.',
    link: '/challenges',
    pill: 'LEVELING SYSTEM',
    btnText: 'Enter World Map',
  },
  {
    id: 'leaderboard',
    title: 'LEADERBOARD',
    subtitle: 'Global High Scores',
    icon: Trophy,
    desc: 'Compete against developers worldwide, maintain daily win streaks, earn rare badges, and claim #1 spot.',
    link: '/leaderboard',
    pill: 'HALL OF FAME',
    btnText: 'View High Scores',
  },
];

const sampleNodes = [
  { topic: 'REST API Realm', level: 'Level 1', xp: '0 XP Req', title: 'HTTP Verbs & Status Codes', status: 'unlocked', icon: '⚡' },
  { topic: 'GraphQL Realm', level: 'Level 2', xp: '15 XP Req', title: 'Queries & Selection Sets', status: 'unlocked', icon: '🔮' },
  { topic: 'SOAP Citadel', level: 'Level 3', xp: '35 XP Req', title: 'XML Envelopes & WSDL', status: 'unlocked', icon: '📜' },
  { topic: 'Auth Fortress', level: 'Level 4', xp: '60 XP Req', title: 'JWT Tokens & OAuth 2.0', status: 'locked', icon: '🔐' },
  { topic: 'Security Vault', level: 'Level 5', xp: '90 XP Req', title: 'CORS & OWASP API Top 10', status: 'locked', icon: '🛡️' },
  { topic: 'Webhook Outpost', level: 'Level 6', xp: '125 XP Req', title: 'HMAC Signatures & Retries', status: 'locked', icon: '📡' },
];

export default function HomePage() {
  // Mini Sandbox Widget state on landing page
  const [method, setMethod] = useState('GET');
  const [path, setPath] = useState('/posts/1');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTestCall = async () => {
    setLoading(true);
    setResponse(null);
    try {
      const res = await sandboxApi.rest({ method, path });
      setResponse(res);
    } catch {
      setResponse({ status: 400, data: { error: 'Failed to complete test request' }, timing: { ms: 12 } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-hidden">
      {/* ── Arcade Hero ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-4 py-16">
        {/* Glow ambient */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-amber-500/10 blur-[120px]" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-orange-500/10 blur-[100px]" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 pill-yellow mb-6 border border-amber-500/40 shadow-glow">
            <Sparkles size={14} className="text-amber-400 animate-spin" />
            <span>PRESS START TO LEARN APIS</span>
          </div>

          <h1 className="font-pixel text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6 tracking-wide">
            MASTER THE REALM OF <br />
            <span className="gradient-text">API ENGINEERING</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 text-balance leading-relaxed">
            Level up your developer skills with an arcade game experience. Explore <strong>REST, SOAP, GraphQL, Auth, Security & Webhooks</strong> through interactive quests and live sandbox execution.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/challenges" className="btn-primary text-base font-pixel px-8 py-4">
              <Play size={18} className="fill-slate-950" /> START QUEST
            </Link>
            <Link to="/sandbox" className="btn-arcade text-sm px-7 py-3.5">
              <Code2 size={18} /> OPEN SANDBOX
            </Link>
          </div>

          {/* Core Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mt-16 text-center">
            {[
              { num: '9', label: 'API REALMS' },
              { num: '36+', label: 'QUEST LEVELS' },
              { num: '100%', label: 'PRACTICAL & FUN' },
              { num: 'LIVE', label: 'SANDBOX TESTING' },
            ].map(({ num, label }) => (
              <div key={label} className="glass-card p-4 border border-amber-500/20">
                <div className="font-pixel text-2xl sm:text-3xl font-extrabold text-amber-400">{num}</div>
                <div className="text-[11px] font-pixel text-slate-400 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Core Area Hub Cards (Surfacing 4 Pillars) ────────────────────────── */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-flex items-center gap-1.5 pill-orange mb-3">
            <Flame size={12} /> THE 4 PILLARS OF API QUEST
          </div>
          <h2 className="font-pixel text-3xl sm:text-4xl font-extrabold text-white">CHOOSE YOUR ARENA</h2>
          <p className="text-slate-400 text-sm mt-2">Everything you need to master APIs from fundamental theory to live testing.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreHubs.map(({ id, title, subtitle, icon: Icon, desc, link, pill, btnText }) => (
            <div key={id} className="pixel-card p-6 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="pill-yellow text-[10px]">{pill}</span>
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                    <Icon size={20} />
                  </div>
                </div>
                <h3 className="font-pixel text-xl font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">{title}</h3>
                <div className="text-xs font-semibold text-amber-400 mb-3">{subtitle}</div>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">{desc}</p>
              </div>

              <Link to={link} className="btn-primary text-xs font-pixel py-2.5 w-full text-center">
                {btnText} <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Interactive World Map Preview ────────────────────────────────────── */}
      <section className="py-16 px-4 bg-surface-1 border-y border-amber-500/15">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 pill-yellow mb-3">
                <Swords size={12} /> LEVELING SYSTEM
              </div>
              <h2 className="font-pixel text-3xl font-extrabold text-white">WORLD QUEST MAP</h2>
              <p className="text-slate-400 text-sm mt-1">Earn points by completing quests to unlock higher level API domains.</p>
            </div>
            <Link to="/challenges" className="btn-arcade text-xs self-start md:self-auto">
              EXPLORE ALL QUESTS <ArrowRight size={14} />
            </Link>
          </div>

          {/* Node Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sampleNodes.map(({ topic, level, xp, title, status, icon }) => (
              <div
                key={title}
                className={`glass-card p-5 border relative overflow-hidden transition-all ${
                  status === 'unlocked'
                    ? 'border-amber-500/40 hover:border-amber-400 bg-amber-500/5'
                    : 'border-slate-800 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{icon}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-pixel text-slate-400">{xp}</span>
                    {status === 'unlocked' ? (
                      <span className="pill-yellow text-[10px] flex items-center gap-1"><Unlock size={10} /> UNLOCKED</span>
                    ) : (
                      <span className="pill-slate text-[10px] flex items-center gap-1"><Lock size={10} /> LOCKED</span>
                    )}
                  </div>
                </div>
                <div className="text-xs font-pixel text-amber-400 mb-1">{topic} • {level}</div>
                <h3 className="font-bold text-white text-base mb-2">{title}</h3>
                <div className="w-full bg-surface-3 h-1.5 rounded-full overflow-hidden mt-4">
                  <div className={`h-full ${status === 'unlocked' ? 'bg-amber-400 w-full shadow-glow' : 'bg-slate-700 w-0'}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Interactive Live Sandbox Preview ──────────────────────────────────── */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="glass-card p-8 border-2 border-amber-500/30">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 pill-orange mb-3">
                <Code2 size={12} /> LIVE INTERACTIVE TEST DECK
              </div>
              <h2 className="font-pixel text-3xl font-bold text-white mb-4">TEST REAL APIS INSTANTLY</h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Try out the live API sandbox right here. Choose your HTTP method, send the request, and inspect real response status code and roundtrip millisecond latency.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => { setMethod('GET'); setPath('/posts/1'); }}
                  className={`btn text-xs font-pixel py-1.5 px-3 ${method === 'GET' ? 'btn-primary' : 'btn-ghost'}`}
                >
                  GET /posts/1
                </button>
                <button
                  onClick={() => { setMethod('POST'); setPath('/posts'); }}
                  className={`btn text-xs font-pixel py-1.5 px-3 ${method === 'POST' ? 'btn-primary' : 'btn-ghost'}`}
                >
                  POST /posts
                </button>
              </div>
            </div>

            {/* Execution Box */}
            <div className="bg-surface-1 p-5 rounded-xl border border-amber-500/20">
              <div className="flex gap-2 mb-4">
                <span className="font-pixel text-xs font-bold text-amber-400 bg-amber-500/20 px-3 py-2 rounded-lg border border-amber-500/30">
                  {method}
                </span>
                <input
                  type="text"
                  value={path}
                  onChange={(e) => setPath(e.target.value)}
                  className="input font-mono text-xs"
                />
                <button
                  onClick={handleTestCall}
                  disabled={loading}
                  className="btn-primary text-xs font-pixel px-4 py-2 flex-shrink-0"
                >
                  {loading ? '...' : <Send size={14} />}
                </button>
              </div>

              {/* Response output */}
              <div className="code-block h-44 text-xs font-mono">
                {loading && <div className="text-amber-400">Dispatching request to server...</div>}
                {!loading && !response && <div className="text-slate-500">Click the send button to test execute...</div>}
                {!loading && response && (
                  <div>
                    <div className="text-emerald-400 font-bold mb-2">
                      HTTP {response.status} OK • {response.timing?.ms}ms
                    </div>
                    <pre className="text-slate-300">
                      {JSON.stringify(response.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Leaderboard Arcade Hall of Fame Ticker ────────────────────────────── */}
      <section className="py-16 px-4 bg-surface-1 border-t border-amber-500/15">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 pill-yellow mb-3">
            <Trophy size={12} /> HIGH SCORE HALL OF FAME
          </div>
          <h2 className="font-pixel text-3xl font-extrabold text-white mb-8">TOP PLAYER LEADERBOARD</h2>

          <div className="space-y-3 mb-8 text-left">
            {[
              { rank: '#1', name: 'AlexTheDev', xp: '1,450 XP', streak: '12 Days', badge: '🥇 GOLD CHAMP' },
              { rank: '#2', name: 'CodeNinja', xp: '1,220 XP', streak: '8 Days', badge: '🥈 SILVER HERO' },
              { rank: '#3', name: 'ByteMaster', xp: '980 XP', streak: '5 Days', badge: '🥉 BRONZE LEGEND' },
            ].map(({ rank, name, xp, streak, badge }) => (
              <div key={rank} className="glass-card p-4 flex items-center justify-between border-amber-500/30">
                <div className="flex items-center gap-4">
                  <span className="font-pixel text-lg font-bold text-amber-400">{rank}</span>
                  <div>
                    <div className="font-pixel text-sm text-white font-bold">{name}</div>
                    <div className="text-[11px] text-amber-400 font-pixel">{badge}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-pixel text-sm text-amber-300 font-bold">{xp}</div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1 justify-end">
                    <Flame size={10} className="text-orange-500 fill-orange-500" /> {streak}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Link to="/leaderboard" className="btn-primary font-pixel text-xs px-8 py-3.5 inline-flex items-center gap-2">
            VIEW FULL LEADERBOARD <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center glass-card p-12 relative overflow-hidden border-2 border-amber-500/40">
          <div className="absolute inset-0 bg-gradient-gold opacity-10 rounded-2xl" />
          <Shield size={48} className="text-amber-400 mx-auto mb-4 animate-float relative" />
          <h2 className="font-pixel text-3xl font-extrabold text-white mb-3 relative">READY TO ENTER THE ARENA?</h2>
          <p className="text-slate-300 text-sm mb-8 relative max-w-xl mx-auto">
            Create a free player account to save your XP progress, unlock quest nodes, collect badges, and claim your place on the leaderboard.
          </p>
          <Link to="/register" className="btn-primary font-pixel text-sm px-10 py-4 relative inline-flex items-center gap-2">
            CREATE PLAYER ACCOUNT <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
