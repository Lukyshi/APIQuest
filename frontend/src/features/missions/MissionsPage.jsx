import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { missionsApi } from './api';
import { useAuthStore } from '../auth/authStore';
import {
  Bug, FlaskConical, Sword, ArrowRight, CheckCircle2,
  Zap, Loader2, LogIn, UserPlus, Lock, Target, Coins
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────

const DIFFICULTY_ORDER = ['BEGINNER', 'EXPLORER', 'BUILDER', 'DEBUGGER_LVL', 'ADVANCED', 'BOSS'];

const DIFFICULTY_META = {
  BEGINNER:    { label: '🟢 Beginner',   cls: 'pill-emerald' },
  EXPLORER:    { label: '🔵 Explorer',   cls: 'pill-slate' },
  BUILDER:     { label: '🟡 Builder',    cls: 'pill-yellow' },
  DEBUGGER_LVL:{ label: '🟠 Debugger',  cls: 'pill-orange' },
  ADVANCED:    { label: '🔴 Advanced',  cls: 'pill-rose' },
  BOSS:        { label: '👾 Boss',       cls: 'pill-rose' },
};

const TYPE_META = {
  DEBUGGER:   { label: 'Debugger',   icon: Bug,         cls: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
  EXPERIMENT: { label: 'Experiment', icon: FlaskConical, cls: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
  MISSION:    { label: 'Mission',    icon: Target,       cls: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function MissionsPage() {
  const { isAuthenticated } = useAuthStore();

  const { data: missions, isLoading } = useQuery({
    queryKey: ['missions'],
    queryFn: missionsApi.list,
  });

  // Group missions by difficulty
  const grouped = missions
    ? DIFFICULTY_ORDER.reduce((acc, diff) => {
        const group = missions.filter((m) => m.difficulty === diff);
        if (group.length > 0) acc[diff] = group;
        return acc;
      }, {})
    : {};

  const completedCount = missions?.filter((m) => m.isCompleted).length || 0;
  const totalCount = missions?.length || 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">

      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <div className="mb-10 animate-fade-in">
        <div className="inline-flex items-center gap-1.5 pill-yellow mb-3">
          <Sword size={14} /> API ADVENTURE
        </div>
        <h1 className="font-pixel text-3xl sm:text-5xl font-extrabold text-white mb-3">
          MISSION CONTROL
        </h1>
        <p className="text-slate-300 max-w-2xl text-sm leading-relaxed mb-4">
          Fix broken APIs, experiment with requests, and solve real debugging scenarios.
          Each mission teaches through doing — not just answering.
        </p>

        {/* Type legend */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(TYPE_META).map(([type, { label, icon: Icon, cls }]) => (
            <span key={type} className={`inline-flex items-center gap-1.5 text-xs font-pixel px-2.5 py-1 rounded-md border ${cls}`}>
              <Icon size={12} /> {label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Guest Banner ─────────────────────────────────────────────────────── */}
      {!isAuthenticated && (
        <div className="mb-8 p-4 rounded-xl glass-card border-amber-500/40 bg-amber-500/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-amber-300 text-xs font-pixel">
            <Lock size={18} className="text-amber-400 flex-shrink-0" />
            <span>VISITOR MODE: Browse missions freely — login required to submit and earn XP!</span>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Link to="/login"    className="btn-ghost font-pixel text-xs py-1.5 px-3">Log In</Link>
            <Link to="/register" className="btn-primary font-pixel text-xs py-1.5 px-3">Sign Up</Link>
          </div>
        </div>
      )}

      {/* ── Progress Summary ─────────────────────────────────────────────────── */}
      {isAuthenticated && missions && (
        <div className="mb-8 glass-card p-5 border-2 border-amber-500/30 flex flex-wrap items-center gap-6">
          <div className="text-center">
            <div className="font-pixel text-2xl font-extrabold text-amber-300">{completedCount}</div>
            <div className="text-[10px] font-pixel text-slate-400">COMPLETED</div>
          </div>
          <div className="flex-1 min-w-[120px]">
            <div className="flex justify-between text-[10px] font-pixel text-slate-400 mb-1.5">
              <span>Mission Progress</span>
              <span>{completedCount} / {totalCount}</span>
            </div>
            <div className="xp-bar">
              <div
                className="xp-bar-fill"
                style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Loading ──────────────────────────────────────────────────────────── */}
      {isLoading && (
        <div className="flex justify-center py-24">
          <Loader2 size={32} className="text-amber-400 animate-spin" />
        </div>
      )}

      {/* ── Mission Groups ───────────────────────────────────────────────────── */}
      {!isLoading && missions && (
        <div className="space-y-10 animate-slide-up">
          {Object.entries(grouped).map(([diff, group]) => {
            const meta = DIFFICULTY_META[diff];
            return (
              <section key={diff}>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`font-pixel text-xs font-bold px-3 py-1.5 rounded-lg border ${meta.cls}`}>
                    {meta.label}
                  </span>
                  <div className="flex-1 h-px bg-emerald-500/15" />
                  <span className="text-[10px] font-pixel text-slate-500">
                    {group.filter(m => m.isCompleted).length}/{group.length} done
                  </span>
                </div>

                <div className="space-y-3">
                  {group.map((mission) => {
                    const typeMeta = TYPE_META[mission.type] || TYPE_META.MISSION;
                    const TypeIcon = typeMeta.icon;

                    return (
                      <Link
                        key={mission.id}
                        to={`/missions/${mission.id}`}
                        id={`mission-${mission.id}`}
                        className={`glass-card p-5 flex items-center gap-4 group transition-all duration-200 ${
                          mission.isCompleted
                            ? 'border-emerald-500/40 bg-emerald-500/5'
                            : 'hover:border-amber-500/60 hover:shadow-glow'
                        }`}
                      >
                        {/* Type Icon */}
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border text-lg ${
                          mission.isCompleted
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                            : `${typeMeta.cls}`
                        }`}>
                          {mission.isCompleted
                            ? <CheckCircle2 size={22} className="text-emerald-400" />
                            : <TypeIcon size={20} />
                          }
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-pixel px-2 py-0.5 rounded border ${typeMeta.cls}`}>
                              <TypeIcon size={10} /> {typeMeta.label}
                            </span>
                            <span className="text-[10px] font-pixel text-slate-400 uppercase tracking-wider">
                              {mission.category}
                            </span>
                            {mission.isCompleted && (
                              <span className="pill-emerald text-[10px] flex items-center gap-1">
                                <CheckCircle2 size={10} /> COMPLETED
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-semibold text-slate-200 group-hover:text-white line-clamp-1">
                            {mission.title}
                          </p>
                          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                            {mission.description}
                          </p>
                        </div>

                        {/* Rewards */}
                        <div className="flex items-center gap-4 flex-shrink-0">
                          <div className="text-right hidden sm:block">
                            <div className="font-pixel text-xs font-bold text-amber-300 flex items-center justify-end gap-1">
                              <Zap size={11} className="text-amber-400 fill-amber-400" />
                              +{mission.xpReward} XP
                            </div>
                            {mission.coinReward > 0 && (
                              <div className="font-pixel text-[10px] text-yellow-400 flex items-center justify-end gap-1 mt-0.5">
                                <Coins size={10} /> +{mission.coinReward}
                              </div>
                            )}
                          </div>
                          <ArrowRight size={18} className="text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}

          {missions.length === 0 && (
            <div className="glass-card p-12 text-center text-slate-400 font-pixel">
              No missions available yet. Check back soon!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
