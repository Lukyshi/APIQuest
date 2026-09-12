import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { progressApi } from './api';
import { useAuthStore } from '../auth/authStore';
import {
  Zap, Star, Flame, Trophy, Shield, ArrowRight,
  BookOpen, Swords, Loader2, Calendar, User
} from 'lucide-react';
import {
  PixelFirstBlood, PixelLink, PixelScroll, PixelBolt,
  PixelCentury, PixelTrophy
} from '../../components/PixelIcons';

const BADGE_META = {
  first_blood:  { icon: PixelFirstBlood, label: 'First Blood',   desc: 'Completed your first quest' },
  rest_rookie:  { icon: PixelLink,       label: 'REST Rookie',    desc: 'Mastered REST API concepts' },
  soap_slinger: { icon: PixelScroll,     label: 'SOAP Slinger',   desc: 'Mastered SOAP protocol' },
  graphql_guru: { icon: PixelBolt,       label: 'GraphQL Guru',   desc: 'Mastered GraphQL queries' },
  century:      { icon: PixelCentury,    label: 'Century',        desc: 'Earned 100+ XP' },
  legend:       { icon: PixelTrophy,     label: 'Legend',         desc: 'Earned 500+ XP' },
};

function XPBar({ xpTotal }) {
  const xpInLevel = xpTotal % 100;
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
    refetchOnMount: true, // always get fresh XP after completing a challenge
  });

  if (isLoading) return (
    <div className="flex justify-center py-32">
      <Loader2 size={32} className="text-amber-400 animate-spin" />
    </div>
  );

  const xpTotal   = progress?.xpTotal   || 0;
  const level     = progress?.level     || 1;
  const xpInLevel = xpTotal % 100;
  const badgesEarned = progress?.badges?.length || 0;
  const initials  = (user?.username || '??').slice(0, 2).toUpperCase();

  // Format join date if available
  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-8">

      {/* ── Profile Hero ─────────────────────────────────────────────────────── */}
      <div className="glass-card p-8 border-2 border-amber-500/30 animate-fade-in">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

          {/* Avatar tile */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-glow">
              <span className="font-pixel text-2xl font-extrabold text-slate-950">{initials}</span>
            </div>
            {/* Level badge */}
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-surface-1 border-2 border-amber-500 flex items-center justify-center">
              <span className="font-pixel text-xs font-bold text-amber-400">{level}</span>
            </div>
          </div>

          {/* Player info */}
          <div className="flex-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 pill-yellow mb-2 text-[10px]">
              <Star size={10} className="fill-amber-400" /> PLAYER HUD
            </div>
            <h1 className="font-pixel text-3xl sm:text-4xl font-extrabold text-white mb-1">
              {user?.username}
            </h1>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-400 font-pixel mt-2">
              {user?.email && (
                <span className="flex items-center gap-1.5">
                  <User size={11} className="text-amber-400" /> {user.email}
                </span>
              )}
              {joinDate && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={11} className="text-amber-400" /> Joined {joinDate}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Trophy size={11} className="text-amber-400" /> {badgesEarned} / {Object.keys(BADGE_META).length} badges
              </span>
            </div>

            {/* XP progress inline */}
            <div className="mt-4 max-w-xs mx-auto sm:mx-0">
              <div className="flex justify-between text-[10px] font-pixel text-slate-400 mb-1">
                <span className="flex items-center gap-1">
                  <Zap size={10} className="text-amber-400" /> {xpTotal} XP TOTAL
                </span>
                <span>{xpInLevel}/100 → Level {level + 1}</span>
              </div>
              <XPBar xpTotal={xpTotal} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Row ─────────────────────────────────────────────────────────── */}
      <div className="grid sm:grid-cols-3 gap-5">
        {/* Level */}
        <div className="glass-card p-6 border-2 border-amber-500/30">
          <div className="flex items-start justify-between mb-3">
            <div className="text-[10px] font-pixel text-slate-400 uppercase">Player Level</div>
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Star size={18} className="fill-amber-400" />
            </div>
          </div>
          <div className="font-pixel text-4xl font-extrabold gradient-text mb-1">{level}</div>
          <div className="text-[11px] font-pixel text-slate-400">{xpInLevel}/100 XP to next level</div>
        </div>

        {/* Streak */}
        <div className="glass-card p-6 border-2 border-amber-500/30">
          <div className="flex items-start justify-between mb-3">
            <div className="text-[10px] font-pixel text-slate-400 uppercase">Daily Streak</div>
            <div className="w-9 h-9 rounded-lg bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <Flame size={18} className="fill-orange-400" />
            </div>
          </div>
          <div className="font-pixel text-4xl font-extrabold text-orange-400 mb-1">
            {progress?.streakCount || 0}
          </div>
          <div className="text-[11px] font-pixel text-slate-400">consecutive days active</div>
        </div>

        {/* Badges */}
        <div className="glass-card p-6 border-2 border-amber-500/30">
          <div className="flex items-start justify-between mb-3">
            <div className="text-[10px] font-pixel text-slate-400 uppercase">Badges Earned</div>
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Shield size={18} />
            </div>
          </div>
          <div className="font-pixel text-4xl font-extrabold text-amber-300 mb-1">{badgesEarned}</div>
          <div className="text-[11px] font-pixel text-slate-400">out of {Object.keys(BADGE_META).length} total</div>
        </div>
      </div>

      {/* ── Achievement Badges ────────────────────────────────────────────────── */}
      <div className="glass-card p-6 border-2 border-amber-500/30">
        <h2 className="font-pixel text-sm font-bold text-white mb-5 flex items-center gap-2">
          <Trophy size={16} className="text-amber-400" /> ACHIEVEMENT BADGES
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {Object.entries(BADGE_META).map(([code, { icon: BadgeIcon, label, desc }]) => {
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
                <div className="w-10 h-10 flex items-center justify-center mb-2">
                  <BadgeIcon size={28} />
                </div>
                <span className={`text-[10px] font-pixel leading-tight ${earned ? 'text-amber-300 font-bold' : 'text-slate-500'}`}>
                  {label}
                </span>
                {earned && (
                  <span className="text-[9px] font-pixel text-emerald-400 mt-0.5">EARNED</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Quick Actions ─────────────────────────────────────────────────────── */}
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
            <div className="flex-1 min-w-0">
              <div className="font-pixel text-xs font-bold text-white">{label}</div>
              <div className="text-[10px] font-pixel text-slate-400">{sub}</div>
            </div>
            <ArrowRight size={16} className="text-slate-500 ml-auto group-hover:text-amber-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
