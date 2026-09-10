import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { progressApi } from './api';
import { useAuthStore } from '../auth/authStore';
import {
  Zap, Star, Flame, Trophy, Shield, ArrowRight,
  BookOpen, Swords, Loader2, Gamepad2
} from 'lucide-react';

const BADGE_META = {
  first_blood:  { emoji: '🩸', label: 'First Blood',   desc: 'Completed your first quest' },
  rest_rookie:  { emoji: '🔗', label: 'REST Rookie',    desc: 'Mastered REST API concepts' },
  soap_slinger: { emoji: '📜', label: 'SOAP Slinger',   desc: 'Mastered SOAP protocol' },
  graphql_guru: { emoji: '⚡', label: 'GraphQL Guru',   desc: 'Mastered GraphQL queries' },
  century:      { emoji: '💯', label: 'Century',        desc: 'Earned 100+ XP' },
  legend:       { emoji: '🏆', label: 'Legend',         desc: 'Earned 500+ XP' },
};

function XPBar({ xp }) {
  const xpInLevel = xp % 100;
  return (
    <div className="xp-bar mt-2">
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
      <Loader2 size={32} className="text-amber-400 animate-spin" />
    </div>
  );

  const xpInLevel = (progress?.xpTotal || 0) % 100;
  const level = progress?.level || 1;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="animate-fade-in mb-8">
        <div className="inline-flex items-center gap-1.5 pill-yellow mb-2">
          <Gamepad2 size={14} /> PLAYER HUD
        </div>
        <h1 className="font-pixel text-3xl sm:text-5xl font-extrabold text-white mb-2">
          PLAYER: <span className="gradient-text">{user?.username}</span>
        </h1>
        <p className="text-slate-300 text-sm">Your quest progress, earned badges, and stats dashboard.</p>
      </div>

      {/* Stats row */}
      <div className="grid sm:grid-cols-3 gap-5 mb-8">
        {/* Level */}
        <div className="glass-card p-6 border-2 border-amber-500/30">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-[10px] font-pixel text-slate-400 uppercase mb-1">PLAYER LEVEL</div>
              <div className="font-pixel text-4xl font-extrabold gradient-text">{level}</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Star size={20} className="fill-amber-400" />
            </div>
          </div>
          <div className="text-[11px] font-pixel text-slate-400 mb-1">{xpInLevel}/100 XP to Level {level + 1}</div>
          <XPBar xp={progress?.xpTotal || 0} />
          <div className="text-[11px] font-pixel text-slate-300 mt-3">TOTAL: <strong className="text-amber-300">{progress?.xpTotal || 0} XP</strong></div>
        </div>

        {/* Streak */}
        <div className="glass-card p-6 border-2 border-amber-500/30">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-[10px] font-pixel text-slate-400 uppercase mb-1">DAILY STREAK</div>
              <div className="font-pixel text-4xl font-extrabold text-orange-400">{progress?.streakCount || 0}</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <Flame size={20} className="fill-orange-400" />
            </div>
          </div>
          <div className="text-[11px] font-pixel text-slate-400">consecutive days active</div>
        </div>

        {/* Badges count */}
        <div className="glass-card p-6 border-2 border-amber-500/30">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-[10px] font-pixel text-slate-400 uppercase mb-1">BADGES EARNED</div>
              <div className="font-pixel text-4xl font-extrabold text-amber-300">{progress?.badges?.length || 0}</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Shield size={20} />
            </div>
          </div>
          <div className="text-[11px] font-pixel text-slate-400">out of {Object.keys(BADGE_META).length} total</div>
        </div>
      </div>

      {/* Badges grid */}
      <div className="glass-card p-6 mb-8 border-2 border-amber-500/30">
        <h2 className="font-pixel text-sm font-bold text-white mb-5 flex items-center gap-2">
          <Trophy size={16} className="text-amber-400" /> ACHIEVEMENT BADGES
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
                    ? 'border-amber-500/40 bg-amber-500/15 shadow-glow'
                    : 'border-slate-800 bg-surface-2 opacity-40'
                }`}
              >
                <span className="text-3xl mb-2">{emoji}</span>
                <span className={`text-[11px] font-pixel ${earned ? 'text-amber-300 font-bold' : 'text-slate-500'}`}>{label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { to: '/concepts',    icon: BookOpen, label: 'Study Library',  sub: 'Learn API theory' },
          { to: '/challenges',  icon: Swords,   label: 'Play Quests',    sub: 'Earn XP & level up' },
          { to: '/leaderboard', icon: Trophy,   label: 'High Scores',    sub: 'Compare rankings' },
        ].map(({ to, icon: Icon, label, sub }) => (
          <Link key={to} to={to} className="pixel-card p-5 flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Icon size={18} />
            </div>
            <div>
              <div className="font-pixel text-xs font-bold text-white">{label}</div>
              <div className="text-[10px] font-pixel text-slate-400">{sub}</div>
            </div>
            <ArrowRight size={16} className="text-slate-500 ml-auto group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>
    </div>
  );
}
