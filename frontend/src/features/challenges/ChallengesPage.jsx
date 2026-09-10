import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { challengesApi } from './api';
import { useAuthStore } from '../auth/authStore';
import {
  Swords, ArrowRight, Loader2, Lock, Unlock, Star, CheckCircle2,
  LogIn, UserPlus, X, Zap, Shield, Sparkles, Trophy
} from 'lucide-react';

const TOPICS = [
  { slug: 'rest', name: 'REST' },
  { slug: 'soap', name: 'SOAP' },
  { slug: 'graphql', name: 'GraphQL' },
  { slug: 'auth', name: 'Authentication' },
  { slug: 'pagination', name: 'Pagination' },
  { slug: 'rate-limiting', name: 'Rate Limiting' },
  { slug: 'security', name: 'Security' },
  { slug: 'webhooks', name: 'Webhooks' },
  { slug: 'error-handling', name: 'Error Handling' },
];

const difficultyPill = { EASY: 'pill-emerald', MEDIUM: 'pill-yellow', HARD: 'pill-rose' };
const typeLabel = { QUIZ: 'Quiz', FIX_REQUEST: 'Fix Request', PREDICT_RESPONSE: 'Predict Response' };

export default function ChallengesPage() {
  const [activeTopic, setActiveTopic] = useState('rest');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedChallengeId, setSelectedChallengeId] = useState(null);

  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const { data: challenges, isLoading } = useQuery({
    queryKey: ['challenges', activeTopic],
    queryFn: () => challengesApi.listByConcept(activeTopic),
  });

  const handleChallengeClick = (e, challenge) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setSelectedChallengeId(challenge.id);
      setShowAuthModal(true);
      return;
    }

    if (!challenge.isUnlocked && challenge.requiredXp > 0) {
      e.preventDefault();
      alert(`🔒 Level Locked! You need ${challenge.requiredXp} total XP to unlock this node. Complete earlier challenges to earn XP!`);
      return;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-10 animate-fade-in text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 pill-yellow mb-3">
          <Swords size={14} /> ARCADE WORLD MAP
        </div>
        <h1 className="font-pixel text-3xl sm:text-5xl font-extrabold text-white mb-3">API QUEST MAP</h1>
        <p className="text-slate-300 max-w-2xl text-sm leading-relaxed">
          Master API topics level-by-level. Earn XP to unlock higher nodes, unlock achievement badges, and climb the leaderboard!
        </p>
      </div>

      {/* Guest Notice Banner if logged out */}
      {!isAuthenticated && (
        <div className="mb-8 p-4 rounded-xl glass-card border-amber-500/40 bg-amber-500/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-amber-300 text-xs font-pixel">
            <Lock size={18} className="text-amber-400 flex-shrink-0" />
            <span>VISITOR MODE: Browsing map enabled. Login required to enter challenges & earn XP!</span>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Link to="/login" className="btn-ghost font-pixel text-xs py-1.5 px-3">Log In</Link>
            <Link to="/register" className="btn-primary font-pixel text-xs py-1.5 px-3">Sign Up</Link>
          </div>
        </div>
      )}

      {/* Topic Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {TOPICS.map((t) => (
          <button
            key={t.slug}
            id={`topic-${t.slug}`}
            onClick={() => setActiveTopic(t.slug)}
            className={`btn text-xs font-pixel py-2 px-4 whitespace-nowrap ${
              activeTopic === t.slug ? 'btn-primary' : 'btn-ghost'
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center py-24">
          <Loader2 size={32} className="text-amber-400 animate-spin" />
        </div>
      )}

      {/* Challenge Quest Nodes Path */}
      {challenges && (
        <div className="space-y-4 animate-slide-up">
          {challenges.map((ch, idx) => {
            const isLocked = isAuthenticated && !ch.isUnlocked && ch.requiredXp > 0;
            const isCompleted = ch.isCompleted;

            return (
              <Link
                key={ch.id}
                to={`/challenges/${ch.id}`}
                id={`challenge-${ch.id}`}
                onClick={(e) => handleChallengeClick(e, ch)}
                className={`glass-card p-5 flex items-center gap-5 group transition-all duration-200 ${
                  isCompleted
                    ? 'border-emerald-500/40 bg-emerald-500/5'
                    : isLocked
                    ? 'opacity-60 border-slate-800 cursor-not-allowed'
                    : 'hover:border-amber-500/60 hover:shadow-glow'
                }`}
              >
                {/* Node Level Number */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-pixel font-bold text-sm flex-shrink-0 border ${
                    isCompleted
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      : isLocked
                      ? 'bg-surface-3 border-slate-700 text-slate-500'
                      : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 size={20} className="text-emerald-400" />
                  ) : isLocked ? (
                    <Lock size={18} className="text-slate-500" />
                  ) : (
                    `L${ch.level || idx + 1}`
                  )}
                </div>

                {/* Question Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className={difficultyPill[ch.difficulty]}>{ch.difficulty.toLowerCase()}</span>
                    <span className="pill-slate">{typeLabel[ch.type]}</span>
                    {ch.requiredXp > 0 && (
                      <span className="text-[10px] font-pixel text-slate-400">
                        {ch.requiredXp} XP Req
                      </span>
                    )}
                    {isCompleted && (
                      <span className="pill-emerald text-[10px]">⭐ COMPLETED</span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-slate-200 group-hover:text-white line-clamp-2">
                    {ch.question.split('\n')[0]}
                  </p>
                </div>

                {/* Reward & Arrow */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <div className="text-[10px] font-pixel text-slate-400">REWARD</div>
                    <div className="font-pixel text-sm font-bold text-amber-300 flex items-center justify-end gap-1">
                      <Zap size={12} className="text-amber-400 fill-amber-400" />+{ch.xpReward} XP
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            );
          })}

          {challenges.length === 0 && (
            <div className="glass-card p-12 text-center text-slate-400 font-pixel">
              No quest nodes available for this topic yet.
            </div>
          )}
        </div>
      )}

      {/* ── AUTH REQUIRED MODAL ────────────────────────────────────────── */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-card max-w-md w-full p-6 border-2 border-amber-500/50 shadow-glow relative">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto mb-4">
              <Lock size={24} />
            </div>

            <h3 className="font-pixel text-xl font-bold text-white text-center mb-2">
              PLAYER LOGIN REQUIRED
            </h3>

            <p className="text-xs text-slate-300 text-center leading-relaxed mb-6">
              Attempting quests and earning XP requires an account so your progress, level unlocks, and high scores are saved to your profile!
            </p>

            <div className="space-y-3">
              <Link
                to={`/login?redirect=/challenges/${selectedChallengeId}`}
                className="btn-primary w-full font-pixel text-xs py-3 flex items-center justify-center gap-2"
              >
                <LogIn size={14} /> LOG IN TO PLAY
              </Link>

              <Link
                to={`/register?redirect=/challenges/${selectedChallengeId}`}
                className="btn-arcade w-full text-xs py-3 flex items-center justify-center gap-2"
              >
                <UserPlus size={14} /> CREATE FREE PLAYER ACCOUNT
              </Link>

              <button
                onClick={() => setShowAuthModal(false)}
                className="btn-ghost w-full font-pixel text-xs py-2 text-slate-400"
              >
                Continue Browsing Map
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
