import { Link } from 'react-router-dom';
import { BookOpen, Code2, Swords, Trophy, ArrowRight, Zap, Shield, Globe } from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    color: 'text-brand-400',
    bg: 'bg-brand-500/10 border-brand-500/20',
    title: 'Concept Library',
    desc: 'Deep-dive explanations of REST, SOAP, and GraphQL — history, mechanics, trade-offs, and real-world use cases.',
  },
  {
    icon: Code2,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10 border-violet-500/20',
    title: 'Live Sandbox',
    desc: 'Fire real API requests — REST, GraphQL queries, SOAP envelopes — and see the raw response with timing data.',
  },
  {
    icon: Swords,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
    title: 'Challenges & Quizzes',
    desc: 'Multiple-choice quizzes, "fix this request" puzzles, and response prediction exercises per protocol.',
  },
  {
    icon: Trophy,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    title: 'XP & Leaderboard',
    desc: 'Earn XP, level up, unlock badges, maintain streaks, and compete on the global leaderboard.',
  },
];

const protocols = [
  { name: 'REST',    color: 'from-brand-600 to-brand-400',   desc: 'The modern standard',          slug: 'rest' },
  { name: 'SOAP',   color: 'from-violet-600 to-violet-400',  desc: 'Enterprise battle-tested',      slug: 'soap' },
  { name: 'GraphQL',color: 'from-pink-600 to-pink-400',      desc: 'Query exactly what you need',   slug: 'graphql' },
];

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-24">
        {/* Ambient */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-brand-600/15 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-violet-600/15 blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 pill-brand mb-6">
            <Zap size={12} />
            Learn APIs the fun way
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
            Master{' '}
            <span className="gradient-text">REST, SOAP</span>
            <br />& <span className="gradient-text">GraphQL</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 text-balance">
            Don't just <em>call</em> APIs — understand <em>why</em> they're built the way they are.
            Interactive sandbox, gamified challenges, and a deep concept library built for developers.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/concepts" className="btn-primary text-base px-8 py-3.5">
              Start Learning <ArrowRight size={16} />
            </Link>
            <Link to="/sandbox" className="btn-outline text-base px-8 py-3.5">
              Try the Sandbox <Code2 size={16} />
            </Link>
          </div>

          {/* Protocol pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-12">
            {protocols.map(({ name, color, desc, slug }) => (
              <Link
                key={slug}
                to={`/concepts/${slug}`}
                className="glass-card px-5 py-3 flex items-center gap-3 hover:scale-105 transition-transform duration-200"
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
                  <Globe size={14} className="text-white" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-white">{name}</div>
                  <div className="text-xs text-slate-400">{desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-14 animate-slide-up">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Everything you need to master APIs</h2>
          <p className="text-slate-400 mt-3">Built for junior devs, CS students, and bootcamp learners.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, color, bg, title, desc }) => (
            <div key={title} className="glass-card p-6 animate-slide-up">
              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-5 ${bg}`}>
                <Icon size={22} className={color} />
              </div>
              <h3 className="font-bold text-white mb-2">{title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center glass-card p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 to-violet-600/10 rounded-2xl" />
          <Shield size={40} className="text-brand-400 mx-auto mb-4 animate-float relative" />
          <h2 className="text-3xl font-bold text-white mb-3 relative">Ready to level up?</h2>
          <p className="text-slate-400 mb-8 relative">Create a free account to track progress, earn badges, and compete on the leaderboard.</p>
          <Link to="/register" className="btn-primary text-base px-10 py-3.5 relative">
            Create Free Account <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
