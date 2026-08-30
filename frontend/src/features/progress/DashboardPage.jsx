import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { progressApi } from './api';
import { useAuthStore } from '../auth/authStore';
import {
  Zap, Star, Flame, Trophy, Shield, ArrowRight,
  BookOpen, Swords, Loader2
} from 'lucide-react';

const BADGE_META = {
  first_blood:  { emoji: '🩸', label: 'First Blood',   desc: 'Completed your first challenge' },
  rest_rookie:  { emoji: '🔗', label: 'REST Rookie',    desc: 'Completed all REST challenges' },
  soap_slinger: { emoji: '📜', label: 'SOAP Slinger',   desc: 'Completed all SOAP challenges' },
  graphql_guru: { emoji: '⚡', label: 'GraphQL Guru',   desc: 'Completed all GraphQL challenges' },
  century:      { emoji: '💯', label: 'Century',        desc: 'Earned 100+ XP' },
  legend:       { emoji: '🏆', label: 'Legend',         desc: 'Earned 500+ XP' },
};

function XPBar({ xp }) {
  const xpInLevel = xp % 100;
  return (
    <div className="xp-bar">
      <div className="xp-bar-fill" style={{ width: `${xpInLevel}%` }} />
    </div>
  );
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { data: progress, isLoading } = useQuery({
    queryKey: ['progress'],
    queryFn: progressApi.getMe,
  });

  if (isLoading) return (
    <div className="flex justify-center py-32">
      <Loader2 size={32} className="text-brand-400 animate-spin" />
    </div>
  );

  const xpInLevel = (progress?.xpTotal || 0) % 100;
  const level = progress?.level || 1;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="animate-fade-in mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Welcome back, <span className="gradient-text">{user?.username}</span>! 👋
        </h1>
        <p className="text-slate-400">Your learning progress at a glance.</p>
      </div>

      {/* Stats row */}
      <div className="grid sm:grid-cols-3 gap-5 mb-8">
        {/* XP & Level */}
        <div className="glass-card p-6 animate-slide-up col-span-full sm:col-span-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Level</div>
              <div className="text-4xl font-extrabold gradient-text">{level}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-brand-500/15 border border-brand-500/25 flex items-center justify-center">
              <Star size={22} className="text-brand-400" />
            </div>
          </div>
          <div className="text-xs text-slate-500 mb-2">{xpInLevel}/100 XP to Level {level + 1}</div>
          <XPBar xp={progress?.xpTotal || 0} />
          <div className="text-xs text-slate-400 mt-2">Total: <span className="text-white font-semibold">{progress?.xpTotal || 0} XP</span></div>
        </div>

        {/* Streak */}
        <div className="glass-card p-6 animate-slide-up">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Streak</div>
              <div className="text-4xl font-extrabold text-amber-300">{progress?.streakCount || 0}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
              <Flame size={22} className="text-amber-400" />
            </div>
          </div>
          <div className="text-xs text-slate-400">consecutive days active</div>
        </div>

        {/* Badges count */}
        <div className="glass-card p-6 animate-slide-up">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Badges</div>
              <div className="text-4xl font-extrabold text-violet-300">{progress?.badges?.length || 0}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center">
              <Shield size={22} className="text-violet-400" />
            </div>
          </div>
          <div className="text-xs text-slate-400">out of {Object.keys(BADGE_META).length} total</div>
        </div>
      </div>

      {/* Badges grid */}
      <div className="glass-card p-6 mb-8 animate-slide-up">
        <h2 className="font-bold text-white mb-5 flex items-center gap-2">
          <Trophy size={16} className="text-amber-400" /> Badges
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {Object.entries(BADGE_META).map(([code, { emoji, label, desc }]) => {
            const earned = progress?.badges?.some((b) => b.badgeCode === code);
            return (
              <div
                key={code}
                title={desc}
                className={`flex flex-col items-center p-4 rounded-xl border text-center transition-all duration-200 ${
                  earned
                    ? 'border-amber-500/30 bg-amber-500/10 hover:border-amber-400/50'
                    : 'border-surface-3 bg-surface-2 opacity-40'
                }`}
              >
                <span className="text-3xl mb-2">{emoji}</span>
                <span className={`text-xs font-semibold ${earned ? 'text-amber-300' : 'text-slate-500'}`}>{label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-4 animate-slide-up">
        {[
          { to: '/concepts',    icon: BookOpen, label: 'Continue Learning', sub: 'REST, SOAP, GraphQL',   color: 'text-brand-400', bg: 'bg-brand-500/10 border-brand-500/20' },
          { to: '/challenges',  icon: Swords,   label: 'Take a Challenge',  sub: 'Earn more XP',          color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
          { to: '/leaderboard', icon: Trophy,   label: 'View Leaderboard',  sub: 'See your ranking',      color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
        ].map(({ to, icon: Icon, label, sub, color, bg }) => (
          <Link key={to} to={to} className={`glass-card p-5 flex items-center gap-4 border ${bg} hover:scale-[1.02] transition-transform`}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bg} flex-shrink-0`}>
              <Icon size={18} className={color} />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">{label}</div>
              <div className="text-xs text-slate-400">{sub}</div>
            </div>
            <ArrowRight size={14} className="text-slate-500 ml-auto" />
          </Link>
        ))}
      </div>
    </div>
  );
}
