import { useQuery } from '@tanstack/react-query';
import { progressApi } from '../progress/api';
import { useAuthStore } from '../auth/authStore';
import {
  Zap, Star, Flame, Trophy, Shield, Calendar, User, Bug,
  CheckCircle2, Compass, Crown, Mail, Clock, Target
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

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);

  const { data: progress, isLoading } = useQuery({
    queryKey: ['progress'],
    queryFn: progressApi.getMe,
    refetchOnMount: true,
  });

  if (isLoading) return (
    <div className="flex justify-center py-32">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 mx-auto mb-4 animate-pulse" />
        <span className="font-pixel text-xs text-slate-400">LOADING PROFILE...</span>
      </div>
    </div>
  );

  const xpTotal           = progress?.xpTotal           || 0;
  const level             = progress?.level             || 1;
  const xpInLevel         = xpTotal % 100;
  const badgesEarned      = progress?.badges?.length    || 0;
  const missionsCompleted = progress?.missionsCompleted || 0;
  const bugsFixed         = progress?.bugsFixed         || 0;
  const streakCount       = progress?.streakCount       || 0;
  const initials          = (user?.username || '??').slice(0, 2).toUpperCase();

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : null;

  const joinRelative = user?.createdAt
    ? (() => {
        const days = Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24));
        if (days < 1) return 'Today';
        if (days === 1) return '1 day ago';
        if (days < 30) return `${days} days ago`;
        if (days < 365) return `${Math.floor(days / 30)} months ago`;
        return `${Math.floor(days / 365)} years ago`;
      })()
    : null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* ── Profile Hero ───────────────────────────────────────────────────── */}
      <section className="dash-section animate-fade-in" style={{ borderColor: 'rgba(245, 158, 11, 0.3)' }}>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 p-2">
          {/* Large Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.4)]">
              <span className="font-pixel text-4xl font-extrabold text-slate-950">{initials}</span>
            </div>
            <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-xl bg-moss-950 border-2 border-amber-500 flex items-center justify-center">
              <span className="font-pixel text-sm font-bold text-amber-400">{level}</span>
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 pill-yellow mb-3 text-[10px]">
              <Star size={10} className="fill-amber-400" /> PLAYER PROFILE
            </div>
            <h1 className="font-pixel text-3xl md:text-4xl font-extrabold text-white mb-2">
              {user?.username}
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-400">
              {user?.email && (
                <span className="flex items-center gap-1.5">
                  <Mail size={12} className="text-emerald-400" /> {user.email}
                </span>
              )}
              {joinDate && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={12} className="text-emerald-400" /> {joinDate}
                </span>
              )}
              {joinRelative && (
                <span className="flex items-center gap-1.5">
                  <Clock size={12} className="text-amber-400" /> Member for {joinRelative}
                </span>
              )}
            </div>

            {/* XP bar */}
            <div className="mt-5 max-w-sm mx-auto md:mx-0">
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
      </section>

      {/* ── Detailed Stats ─────────────────────────────────────────────────── */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up">
        {[
          { label: 'Total XP',     value: xpTotal.toLocaleString(), icon: Zap,     color: 'text-amber-400',   border: 'border-amber-500/30' },
          { label: 'Streak',       value: `${streakCount} days`,    icon: Flame,   color: 'text-orange-400',  border: 'border-orange-500/30' },
          { label: 'Missions',     value: missionsCompleted,        icon: Compass, color: 'text-emerald-400', border: 'border-emerald-500/30' },
          { label: 'Bugs Fixed',   value: bugsFixed,                icon: Bug,     color: 'text-rose-400',    border: 'border-rose-500/30' },
        ].map(({ label, value, icon: Icon, color, border }) => (
          <div key={label} className={`dash-section ${border} text-center p-5`}>
            <Icon size={20} className={`${color} mx-auto mb-2`} />
            <div className="font-pixel text-2xl font-extrabold text-white mb-1">{value}</div>
            <div className="text-[10px] font-pixel text-slate-400 uppercase">{label}</div>
          </div>
        ))}
      </section>

      {/* ── All Badges ─────────────────────────────────────────────────────── */}
      <section className="dash-section animate-slide-up" style={{ borderColor: 'rgba(245, 158, 11, 0.3)' }}>
        <h2 className="dash-section-title mb-6">
          <Trophy size={16} className="text-amber-400" /> ALL ACHIEVEMENT BADGES
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {Object.entries(BADGE_META).map(([code, { icon: BadgeIcon, label, desc }]) => {
            const earned = progress?.badges?.some((b) => b.badgeCode === code);
            const earnedDate = progress?.badges?.find((b) => b.badgeCode === code)?.earnedAt;
            return (
              <div
                key={code}
                title={desc}
                className={`flex flex-col items-center p-5 rounded-xl border text-center transition-all duration-300 ${
                  earned
                    ? 'border-amber-500/40 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.35)]'
                    : 'border-slate-800 bg-surface-2 opacity-40 hover:opacity-60'
                }`}
              >
                <div className="w-12 h-12 flex items-center justify-center mb-3">
                  <BadgeIcon size={32} />
                </div>
                <span className={`text-[10px] font-pixel leading-tight ${earned ? 'text-amber-300 font-bold' : 'text-slate-500'}`}>
                  {label}
                </span>
                {earned && (
                  <span className="text-[9px] font-pixel text-emerald-400 mt-1 flex items-center gap-0.5">
                    <CheckCircle2 size={8} /> EARNED
                  </span>
                )}
                {!earned && (
                  <span className="text-[9px] font-pixel text-slate-600 mt-1">LOCKED</span>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
