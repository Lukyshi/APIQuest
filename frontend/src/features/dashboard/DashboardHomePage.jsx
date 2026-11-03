import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { progressApi } from '../progress/api';
import { leaderboardApi } from '../leaderboard/api';
import { missionsApi } from '../missions/api';
import { challengesApi } from '../challenges/api';
import { useAuthStore } from '../auth/authStore';
import {
  Zap, Star, Flame, Trophy, Shield, ArrowRight, Target,
  BookOpen, Swords, Loader2, Calendar, Compass, Bug,
  CheckCircle2, Sparkles, Crown, TrendingUp, Play,
  Code2, Award, Crosshair
} from 'lucide-react';
import {
  PixelFirstBlood, PixelLink, PixelScroll, PixelBolt,
  PixelCentury, PixelTrophy
} from '../../components/PixelIcons';

/* ─── Badge Metadata ─────────────────────────────────────────────────────── */
const BADGE_META = {
  first_blood:  { icon: PixelFirstBlood, label: 'First Blood',   desc: 'Completed your first quest' },
  rest_rookie:  { icon: PixelLink,       label: 'REST Rookie',    desc: 'Mastered REST API concepts' },
  soap_slinger: { icon: PixelScroll,     label: 'SOAP Slinger',   desc: 'Mastered SOAP protocol' },
  graphql_guru: { icon: PixelBolt,       label: 'GraphQL Guru',   desc: 'Mastered GraphQL queries' },
  century:      { icon: PixelCentury,    label: 'Century',        desc: 'Earned 100+ XP' },
  legend:       { icon: PixelTrophy,     label: 'Legend',         desc: 'Earned 500+ XP' },
};

/* ─── XP Level Bar ───────────────────────────────────────────────────────── */
function XPBar({ xpTotal, className = '' }) {
  const xpInLevel = xpTotal % 100;
  return (
    <div className={`xp-bar ${className}`}>
      <div className="xp-bar-fill" style={{ width: `${xpInLevel}%` }} />
    </div>
  );
}

/* ─── Greeting based on time ─────────────────────────────────────────────── */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 6) return 'Night Owl';
  if (h < 12) return 'Good Morning';
  if (h < 18) return 'Good Afternoon';
  return 'Good Evening';
}

/* ─── Stat Card Component ─────────────────────────────────────────────────── */
function StatCard({ icon: Icon, iconClass, borderClass, label, value, sub, fillClass }) {
  return (
    <div className={`dash-stat-card ${borderClass}`}>
      <div className="dash-stat-header">
        <span className="dash-stat-label">{label}</span>
        <div className={`dash-stat-icon ${fillClass}`}>
          <Icon size={16} />
        </div>
      </div>
      <div className={`dash-stat-value ${iconClass}`}>{value}</div>
      {sub && <div className="dash-stat-sub">{sub}</div>}
    </div>
  );
}

/* ─── Main Dashboard Page ─────────────────────────────────────────────────── */
export default function DashboardHomePage() {
  const user = useAuthStore((s) => s.user);

  /* Fetch all data in parallel */
  const { data: progress, isLoading: loadingProgress } = useQuery({
    queryKey: ['progress'],
    queryFn: progressApi.getMe,
    refetchOnMount: true,
  });

  const { data: leaderboard, isLoading: loadingLeaderboard } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: leaderboardApi.get,
  });

  const { data: missions, isLoading: loadingMissions } = useQuery({
    queryKey: ['missions'],
    queryFn: missionsApi.list,
  });

  const { data: restChallenges } = useQuery({
    queryKey: ['challenges', 'rest'],
    queryFn: () => challengesApi.listByConcept('rest'),
  });

  const isLoading = loadingProgress;

  if (isLoading) return (
    <div className="flex items-center justify-center py-32">
      <div className="text-center">
        <Loader2 size={36} className="text-amber-400 animate-spin mx-auto mb-4" />
        <span className="font-pixel text-xs text-slate-400">LOADING PLAYER DATA...</span>
      </div>
    </div>
  );

  /* ── Derived Data ─────────────────────────────────────────────── */
  const xpTotal           = progress?.xpTotal           || 0;
  const level             = progress?.level             || 1;
  const xpInLevel         = xpTotal % 100;
  const xpToNext          = 100 - xpInLevel;
  const badgesEarned      = progress?.badges?.length    || 0;
  const totalBadges       = Object.keys(BADGE_META).length;
  const missionsCompleted = progress?.missionsCompleted || 0;
  const bugsFixed         = progress?.bugsFixed         || 0;
  const streakCount       = progress?.streakCount       || 0;
  const initials          = (user?.username || '??').slice(0, 2).toUpperCase();

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null;

  /* Leaderboard rank */
  const myEntry = leaderboard?.find((l) => l.userId === user?.id);
  const myRank = myEntry?.rank || null;
  const totalPlayers = leaderboard?.length || 0;

  /* Missions breakdown */
  const totalMissions = missions?.length || 0;
  const completedMissions = missions?.filter(m => m.isCompleted) || [];
  const inProgressMissions = missions?.filter(m => !m.isCompleted)?.slice(0, 3) || [];

  /* Challenges breakdown */
  const completedChallenges = restChallenges?.filter(c => c.isCompleted)?.length || 0;
  const totalChallenges = restChallenges?.length || 0;

  return (
    <div className="dash-home">
      {/* ── Welcome Hero Section ───────────────────────────────────────────── */}
      <section className="dash-welcome animate-fade-in">
        {/* Ambient glows */}
        <div className="dash-welcome-glow dash-welcome-glow--emerald" />
        <div className="dash-welcome-glow dash-welcome-glow--amber" />

        <div className="dash-welcome-content">
          <div className="dash-welcome-left">
            {/* Avatar */}
            <div className="dash-welcome-avatar">
              <div className="dash-welcome-avatar-tile">
                <span className="font-pixel text-2xl font-extrabold text-slate-950">{initials}</span>
              </div>
              <div className="dash-welcome-level-badge">
                <span className="font-pixel text-[10px] font-bold text-amber-400">{level}</span>
              </div>
            </div>

            {/* Info */}
            <div className="dash-welcome-info">
              <div className="dash-welcome-greeting">
                <Sparkles size={12} className="text-amber-400" />
                <span>{getGreeting()}, Explorer!</span>
              </div>
              <h1 className="dash-welcome-name">{user?.username}</h1>
              <div className="dash-welcome-meta">
                {joinDate && (
                  <span className="dash-welcome-meta-item">
                    <Calendar size={11} className="text-emerald-400" /> Joined {joinDate}
                  </span>
                )}
                <span className="dash-welcome-meta-item">
                  <Trophy size={11} className="text-amber-400" /> {badgesEarned}/{totalBadges} Badges
                </span>
                {myRank && (
                  <span className="dash-welcome-meta-item">
                    <Crown size={11} className="text-amber-400" /> Rank #{myRank}{totalPlayers > 0 ? ` of ${totalPlayers}` : ''}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* XP Progress */}
          <div className="dash-welcome-xp">
            <div className="dash-welcome-xp-header">
              <span className="dash-welcome-xp-label">
                <Zap size={12} className="text-amber-400" /> {xpTotal} XP TOTAL
              </span>
              <span className="dash-welcome-xp-next">
                {xpToNext} XP to Level {level + 1}
              </span>
            </div>
            <XPBar xpTotal={xpTotal} />
            <div className="dash-welcome-xp-level">
              Level {level} → Level {level + 1}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Grid ─────────────────────────────────────────────────────── */}
      <section className="dash-stats-grid animate-slide-up">
        <StatCard
          icon={Star}
          iconClass="gradient-text"
          borderClass="dash-stat-card--amber"
          fillClass="dash-stat-icon--amber"
          label="Player Level"
          value={level}
          sub={`${xpInLevel}/100 to Lv ${level + 1}`}
        />
        <StatCard
          icon={Flame}
          iconClass="text-orange-400"
          borderClass="dash-stat-card--orange"
          fillClass="dash-stat-icon--orange"
          label="Daily Streak"
          value={`${streakCount}d`}
          sub="days active"
        />
        <StatCard
          icon={Shield}
          iconClass="text-amber-300"
          borderClass="dash-stat-card--amber"
          fillClass="dash-stat-icon--amber"
          label="Badges Earned"
          value={badgesEarned}
          sub={`of ${totalBadges} unlocked`}
        />
        <StatCard
          icon={Compass}
          iconClass="text-emerald-400"
          borderClass="dash-stat-card--emerald"
          fillClass="dash-stat-icon--emerald"
          label="Missions Done"
          value={missionsCompleted}
          sub="completed"
        />
        <StatCard
          icon={Bug}
          iconClass="text-rose-400"
          borderClass="dash-stat-card--rose"
          fillClass="dash-stat-icon--rose"
          label="Bugs Fixed"
          value={bugsFixed}
          sub="debugged"
        />
      </section>

      {/* ── Main Content Grid ─────────────────────────────────────────────── */}
      <div className="dash-grid">

        {/* ── Left Column ─────────────────────────────────────────────────── */}
        <div className="dash-grid-main">

          {/* Achievement Badges Section */}
          <section className="dash-section animate-slide-up">
            <div className="dash-section-header">
              <h2 className="dash-section-title">
                <Trophy size={16} className="text-amber-400" /> ACHIEVEMENT BADGES
              </h2>
              <span className="dash-section-count">{badgesEarned}/{totalBadges}</span>
            </div>
            <div className="dash-badges-grid">
              {Object.entries(BADGE_META).map(([code, { icon: BadgeIcon, label, desc }]) => {
                const earned = progress?.badges?.some((b) => b.badgeCode === code);
                return (
                  <div
                    key={code}
                    title={desc}
                    className={`dash-badge ${earned ? 'dash-badge--earned' : 'dash-badge--locked'}`}
                  >
                    <div className="dash-badge-icon">
                      <BadgeIcon size={28} />
                    </div>
                    <span className={`dash-badge-label ${earned ? 'text-amber-300 font-bold' : 'text-slate-500'}`}>
                      {label}
                    </span>
                    {earned && (
                      <span className="dash-badge-earned-tag">
                        <CheckCircle2 size={8} /> EARNED
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Active Missions */}
          <section className="dash-section animate-slide-up">
            <div className="dash-section-header">
              <h2 className="dash-section-title">
                <Crosshair size={16} className="text-rose-400" /> ACTIVE MISSIONS
              </h2>
              <Link to="/missions" className="dash-section-link">
                View All <ArrowRight size={12} />
              </Link>
            </div>

            {loadingMissions ? (
              <div className="flex justify-center py-8">
                <Loader2 size={24} className="text-amber-400 animate-spin" />
              </div>
            ) : inProgressMissions.length > 0 ? (
              <div className="space-y-3">
                {inProgressMissions.map((mission) => (
                  <Link
                    key={mission.id}
                    to={`/missions/${mission.id}`}
                    className="dash-mission-card group"
                  >
                    <div className="dash-mission-icon">
                      {mission.type === 'DEBUGGER'
                        ? <Bug size={18} />
                        : mission.type === 'EXPERIMENT'
                        ? <Code2 size={18} />
                        : <Target size={18} />
                      }
                    </div>
                    <div className="dash-mission-info">
                      <div className="dash-mission-meta">
                        <span className="pill-slate text-[9px]">{mission.difficulty}</span>
                        <span className="pill-amber text-[9px]">
                          <Zap size={8} /> +{mission.xpReward} XP
                        </span>
                      </div>
                      <p className="dash-mission-title">{mission.title}</p>
                      <p className="dash-mission-desc">{mission.description}</p>
                    </div>
                    <ArrowRight size={16} className="text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="dash-empty-state">
                <CheckCircle2 size={24} className="text-emerald-400 mx-auto mb-2" />
                <p>All missions completed! 🎉</p>
                <Link to="/missions" className="btn-arcade text-[10px] mt-3 py-2 px-4">
                  BROWSE MISSIONS
                </Link>
              </div>
            )}
          </section>

          {/* Learning Journey / Challenge Progress */}
          <section className="dash-section animate-slide-up">
            <div className="dash-section-header">
              <h2 className="dash-section-title">
                <TrendingUp size={16} className="text-emerald-400" /> LEARNING JOURNEY
              </h2>
              <Link to="/challenges" className="dash-section-link">
                Continue <ArrowRight size={12} />
              </Link>
            </div>

            <div className="dash-journey-card">
              <div className="dash-journey-header">
                <div>
                  <p className="font-pixel text-xs text-amber-400 mb-1">REST API REALM</p>
                  <p className="text-sm font-bold text-white">
                    {completedChallenges > 0
                      ? `${completedChallenges} of ${totalChallenges} quests completed`
                      : 'Begin your REST API journey'}
                  </p>
                </div>
                <div className="dash-journey-percent">
                  <span className="font-pixel text-2xl font-extrabold gradient-text">
                    {totalChallenges > 0 ? Math.round((completedChallenges / totalChallenges) * 100) : 0}%
                  </span>
                </div>
              </div>
              <div className="xp-bar mt-3">
                <div
                  className="xp-bar-fill"
                  style={{ width: `${totalChallenges > 0 ? (completedChallenges / totalChallenges) * 100 : 0}%` }}
                />
              </div>
              <div className="dash-journey-actions">
                <Link to="/challenges" className="btn-emerald text-[10px] font-pixel py-2 px-4">
                  <Play size={12} /> CONTINUE QUESTS
                </Link>
                <Link to="/concepts" className="btn-ghost text-[10px] font-pixel py-2 px-4">
                  <BookOpen size={12} /> STUDY CONCEPTS
                </Link>
              </div>
            </div>

            {/* Mission Progress */}
            {missions && totalMissions > 0 && (
              <div className="dash-journey-card mt-4">
                <div className="dash-journey-header">
                  <div>
                    <p className="font-pixel text-xs text-rose-400 mb-1">MISSION PROGRESS</p>
                    <p className="text-sm font-bold text-white">
                      {completedMissions.length} of {totalMissions} missions completed
                    </p>
                  </div>
                  <div className="dash-journey-percent">
                    <span className="font-pixel text-2xl font-extrabold text-rose-400">
                      {Math.round((completedMissions.length / totalMissions) * 100)}%
                    </span>
                  </div>
                </div>
                <div className="xp-bar mt-3">
                  <div
                    className="xp-bar-fill"
                    style={{ width: `${(completedMissions.length / totalMissions) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </section>
        </div>

        {/* ── Right Column (Sidebar Widgets) ────────────────────────────────── */}
        <div className="dash-grid-aside">

          {/* Leaderboard Position */}
          <section className="dash-section animate-slide-up">
            <div className="dash-section-header">
              <h2 className="dash-section-title">
                <Crown size={16} className="text-amber-400" /> YOUR RANKING
              </h2>
              <Link to="/leaderboard" className="dash-section-link">
                Full Board <ArrowRight size={12} />
              </Link>
            </div>

            {loadingLeaderboard ? (
              <div className="flex justify-center py-6">
                <Loader2 size={20} className="text-amber-400 animate-spin" />
              </div>
            ) : (
              <div className="space-y-3">
                {/* Your position */}
                <div className="dash-rank-card dash-rank-card--you">
                  <div className="dash-rank-position">
                    <span className="font-pixel text-lg font-extrabold text-amber-400">
                      {myRank ? `#${myRank}` : '—'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-pixel text-xs font-bold text-white truncate block">{user?.username}</span>
                    <span className="text-[10px] font-pixel text-amber-300">{xpTotal.toLocaleString()} XP</span>
                  </div>
                  <span className="pill-yellow text-[9px] py-0.5">YOU</span>
                </div>

                {/* Top 3 */}
                {leaderboard?.slice(0, 3).map((entry) => {
                  const isMe = entry.userId === user?.id;
                  return (
                    <div
                      key={entry.userId}
                      className={`dash-rank-card ${isMe ? 'dash-rank-card--you' : ''}`}
                    >
                      <div className="dash-rank-position">
                        {entry.rank === 1
                          ? <Crown size={16} className="text-amber-400 fill-amber-400" />
                          : <span className="font-pixel text-xs text-slate-400">#{entry.rank}</span>
                        }
                      </div>
                      <div className="dash-rank-avatar">
                        {entry.username.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-pixel text-[11px] font-bold text-slate-200 truncate block">
                          {entry.username}
                        </span>
                        <span className="text-[10px] font-pixel text-slate-400 flex items-center gap-1">
                          <Zap size={8} className="text-amber-400" /> {entry.xpTotal.toLocaleString()} XP
                        </span>
                      </div>
                      {isMe && <span className="pill-yellow text-[9px] py-0.5">YOU</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Quick Actions */}
          <section className="dash-section animate-slide-up">
            <h2 className="dash-section-title mb-3">
              <Zap size={16} className="text-amber-400" /> QUICK ACTIONS
            </h2>
            <div className="space-y-2">
              {[
                { to: '/challenges',  icon: Swords,   label: 'Play Quests',    sub: 'Earn XP & level up',   color: 'text-amber-400' },
                { to: '/missions',    icon: Compass,   label: 'API Missions',   sub: 'Debug & solve issues', color: 'text-rose-400' },
                { to: '/sandbox',     icon: Code2,     label: 'Open Sandbox',   sub: 'Test live APIs',       color: 'text-emerald-400' },
                { to: '/concepts',    icon: BookOpen,   label: 'Study Library',  sub: 'Learn API theory',     color: 'text-blue-400' },
              ].map(({ to, icon: Icon, label, sub, color }) => (
                <Link key={to} to={to} className="dash-quick-action group">
                  <div className={`dash-quick-action-icon ${color}`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-pixel text-[11px] font-bold text-white group-hover:text-amber-300 transition-colors">{label}</div>
                    <div className="text-[10px] text-slate-400">{sub}</div>
                  </div>
                  <ArrowRight size={14} className="text-slate-600 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </Link>
              ))}
            </div>
          </section>

          {/* Next Milestone */}
          <section className="dash-milestone animate-slide-up">
            <div className="dash-milestone-header">
              <Award size={20} className="text-amber-400" />
              <span className="font-pixel text-[11px] text-amber-300 font-bold">NEXT MILESTONE</span>
            </div>
            <div className="dash-milestone-body">
              {xpTotal < 100 ? (
                <>
                  <p className="font-pixel text-xs text-white mb-1">Century Badge</p>
                  <p className="text-[10px] text-slate-400 mb-3">Earn 100 XP to unlock this achievement</p>
                  <div className="xp-bar">
                    <div className="xp-bar-fill" style={{ width: `${Math.min(xpTotal, 100)}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 font-pixel">{xpTotal}/100 XP</p>
                </>
              ) : xpTotal < 500 ? (
                <>
                  <p className="font-pixel text-xs text-white mb-1">Legend Badge</p>
                  <p className="text-[10px] text-slate-400 mb-3">Earn 500 XP to become a Legend</p>
                  <div className="xp-bar">
                    <div className="xp-bar-fill" style={{ width: `${(xpTotal / 500) * 100}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 font-pixel">{xpTotal}/500 XP</p>
                </>
              ) : (
                <>
                  <p className="font-pixel text-xs text-amber-300 mb-1">🏆 Legend Status Achieved!</p>
                  <p className="text-[10px] text-slate-400">You've unlocked all XP milestone badges</p>
                </>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
