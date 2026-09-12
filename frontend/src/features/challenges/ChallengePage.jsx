import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { challengesApi } from './api';
import { useAuthStore } from '../auth/authStore';
import { toast } from 'react-hot-toast';
import {
  ArrowLeft, CheckCircle2, XCircle, Zap, Star,
  Loader2, Swords, ChevronRight, Trophy, LogIn, UserPlus, X
} from 'lucide-react';
import {
  PixelFirstBlood, PixelLink, PixelScroll, PixelBolt,
  PixelCentury, PixelTrophy, PixelLock
} from '../../components/PixelIcons';

const difficultyPill = { EASY: 'pill-emerald', MEDIUM: 'pill-yellow', HARD: 'pill-rose' };
const typeLabel = { QUIZ: 'Quiz', FIX_REQUEST: 'Fix Request', PREDICT_RESPONSE: 'Predict Response' };

const BADGE_META = {
  first_blood:  { icon: PixelFirstBlood, label: 'First Blood' },
  rest_rookie:  { icon: PixelLink,       label: 'REST Rookie' },
  soap_slinger: { icon: PixelScroll,     label: 'SOAP Slinger' },
  graphql_guru: { icon: PixelBolt,       label: 'GraphQL Guru' },
  century:      { icon: PixelCentury,    label: 'Century' },
  legend:       { icon: PixelTrophy,     label: 'Legend' },
};

export default function ChallengePage() {
  const { id } = useParams();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [forceRetry, setForceRetry] = useState(false);

  const { data: challenge, isLoading } = useQuery({
    queryKey: ['challenge', id],
    queryFn: () => challengesApi.getById(id),
  });

  // Pre-populate answered state if challenge was already completed
  const alreadyCompleted = challenge?.isCompleted && !forceRetry;
  const answeredCorrectly = challenge?.isCorrect;

  const mutation = useMutation({
    mutationFn: (optionId) => challengesApi.submit(id, optionId),
    onSuccess: (data) => {
      setResult(data);
      if (data.isCorrect) {
        toast.success(`Correct! +${data.xpAwarded} XP earned`);
        qc.invalidateQueries({ queryKey: ['progress'] });
      } else {
        toast.error('Not quite — review the explanation below.');
      }
    },
    onError: (err) => {
      if (err.response?.status === 401) {
        setShowAuthModal(true);
      } else {
        toast.error(err.response?.data?.message || 'Submission failed');
      }
    },
  });

  const handleSubmit = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    if (!selected) {
      toast.error('Select an option first');
      return;
    }
    mutation.mutate(selected);
  };

  if (isLoading) return (
    <div className="flex justify-center py-32">
      <Loader2 size={32} className="text-amber-400 animate-spin" />
    </div>
  );

  if (!challenge) return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center text-slate-400 font-pixel">
      Challenge not found. <Link to="/challenges" className="text-amber-400">Back to Map</Link>
    </div>
  );

  const answered = !!result || alreadyCompleted;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Back to map */}
      <Link to="/challenges" className="inline-flex items-center gap-2 text-xs font-pixel text-slate-400 hover:text-amber-400 mb-8 transition-colors">
        <ArrowLeft size={14} /> BACK TO WORLD MAP
      </Link>

      {/* Guest Notice Banner */}
      {!isAuthenticated && (
        <div className="mb-6 p-4 rounded-xl glass-card border-amber-500/40 bg-amber-500/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs text-amber-300 font-pixel">
            <Lock size={16} className="text-amber-400 flex-shrink-0" />
            <span>PLAYER LOGIN REQUIRED: Log in to submit your answer and save earned XP!</span>
          </div>
          <button onClick={() => setShowAuthModal(true)} className="btn-primary font-pixel text-xs py-1.5 px-3">
            Log In
          </button>
        </div>
      )}

      {/* Challenge Card */}
      <div className="glass-card p-8 animate-fade-in border-2 border-amber-500/30">
        {/* Header row */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className={difficultyPill[challenge.difficulty]}>{challenge.difficulty.toLowerCase()}</span>
          <span className="pill-slate">{typeLabel[challenge.type]}</span>
          {challenge.level && (
            <span className="pill-yellow text-[10px]">LEVEL {challenge.level}</span>
          )}
          <span className="ml-auto flex items-center gap-1.5 font-pixel text-sm font-bold text-amber-300">
            <Zap size={14} className="text-amber-400 fill-amber-400" /> +{challenge.xpReward} XP
          </span>
        </div>

        {/* Question text */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-pixel uppercase tracking-wider mb-3">
            <Swords size={14} /> QUEST QUESTION
          </div>
          <pre className="text-slate-100 text-sm leading-relaxed whitespace-pre-wrap font-sans bg-surface-1 p-5 rounded-xl border border-amber-500/20">
            {challenge.question}
          </pre>
        </div>

        {/* Options selection */}
        <div className="space-y-3 mb-8">
          {challenge.options?.map((opt) => {
            let cls = 'glass-card p-4 w-full text-left text-sm transition-all duration-200 cursor-pointer flex items-center gap-3 font-medium';
            if (!answered) {
              cls += selected === opt.id
                ? ' border-amber-400 bg-amber-500/15 text-white shadow-glow'
                : ' hover:border-amber-500/40 hover:text-white text-slate-300';
            } else if (opt.id === result.correctOptionId) {
              cls += ' border-emerald-400 bg-emerald-500/15 text-emerald-200 font-bold';
            } else if (opt.id === selected && !result.isCorrect) {
              cls += ' border-rose-400 bg-rose-500/15 text-rose-300';
            } else {
              cls += ' opacity-50 text-slate-400 cursor-default';
            }

            return (
              <button
                key={opt.id}
                id={`option-${opt.id}`}
                className={cls}
                onClick={() => !answered && setSelected(opt.id)}
                disabled={answered}
              >
                {answered && opt.id === result.correctOptionId && <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />}
                {answered && opt.id === selected && !result.isCorrect && <XCircle size={18} className="text-rose-400 flex-shrink-0" />}
                {(!answered || (opt.id !== result.correctOptionId && opt.id !== selected)) && (
                  <div className={`w-4 h-4 rounded-full border flex-shrink-0 transition-all ${selected === opt.id ? 'border-amber-400 bg-amber-500' : 'border-slate-600'}`} />
                )}
                <span>{opt.optionText}</span>
              </button>
            );
          })}
        </div>

        {/* Action Button / Answer Result */}
        {!answered ? (
          <button
            id="challenge-submit"
            onClick={handleSubmit}
            className="btn-primary w-full font-pixel text-xs py-3.5"
            disabled={!selected || mutation.isPending}
          >
            {mutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <ChevronRight size={16} />}
            {mutation.isPending ? 'SUBMITTING...' : 'SUBMIT ANSWER'}
          </button>
        ) : result ? (
          // Live result from this session
          <div className={`rounded-xl p-6 border ${result.isCorrect ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-rose-500/40 bg-rose-500/10'}`}>
            <div className="flex items-center gap-2 font-pixel text-base mb-3">
              {result.isCorrect ? (
                <>
                  <CheckCircle2 size={20} className="text-emerald-400" />
                  <span className="text-emerald-300 font-bold">QUEST COMPLETE! +{result.xpAwarded} XP EARNED</span>
                </>
              ) : (
                <>
                  <XCircle size={20} className="text-rose-400" />
                  <span className="text-rose-300 font-bold">NOT QUITE THIS TIME</span>
                </>
              )}
            </div>

            {result.explanation && (
              <p className="text-xs text-slate-300 leading-relaxed bg-surface-1 p-4 rounded-lg border border-slate-800 mb-4">
                <strong>Explanation:</strong> {result.explanation}
              </p>
            )}

            {/* Badges */}
            {result.newBadges?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-emerald-500/20">
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-pixel mb-2">
                  <Trophy size={14} /> NEW BADGE UNLOCKED!
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.newBadges.map((code) => {
                    const meta = BADGE_META[code];
                    const IconComponent = meta?.icon || PixelTrophy;
                    return (
                      <span key={code} className="pill-yellow text-xs flex items-center gap-1.5">
                        <IconComponent size={14} /> {meta?.label || code}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <Link to="/challenges" className="btn-ghost flex-1 text-xs font-pixel text-center py-2.5">
                ← ALL QUESTS
              </Link>
              <Link to="/dashboard" className="btn-primary flex-1 text-xs font-pixel text-center py-2.5">
                <Star size={14} /> VIEW PLAYER HUD
              </Link>
            </div>
          </div>
        ) : (
          // Loaded from DB — already completed before this session
          <div className={`rounded-xl p-6 border ${answeredCorrectly ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-slate-700 bg-surface-2'}`}>
            <div className="flex items-center gap-2 font-pixel text-sm mb-3">
              {answeredCorrectly ? (
                <>
                  <CheckCircle2 size={18} className="text-emerald-400" />
                  <span className="text-emerald-300 font-bold">QUEST ALREADY COMPLETED ✓</span>
                </>
              ) : (
                <>
                  <XCircle size={18} className="text-slate-400" />
                  <span className="text-slate-300 font-bold">PREVIOUSLY ATTEMPTED — INCORRECT</span>
                </>
              )}
            </div>
            <p className="text-xs text-slate-400 font-pixel mb-4">
              {answeredCorrectly
                ? 'You already answered this correctly. XP has been awarded.'
                : 'You answered this incorrectly before. Review the options and try again.'}
            </p>
            <div className="flex gap-3">
              <Link to="/challenges" className="btn-ghost flex-1 text-xs font-pixel text-center py-2.5">
                ← ALL QUESTS
              </Link>
              {!answeredCorrectly && (
                <button
                  onClick={() => { setForceRetry(true); setSelected(null); }}
                  className="btn-primary flex-1 text-xs font-pixel py-2.5"
                >
                  TRY AGAIN
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── AUTH MODAL ────────────────────────────────────────────────────── */}
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
              <PixelLock size={24} locked={true} />
            </div>

            <h3 className="font-pixel text-xl font-bold text-white text-center mb-2">
              PLAYER LOGIN REQUIRED
            </h3>

            <p className="text-xs text-slate-300 text-center leading-relaxed mb-6">
              You must be logged in to submit challenge answers and claim XP points on your profile!
            </p>

            <div className="space-y-3">
              <Link
                to={`/login?redirect=/challenges/${id}`}
                className="btn-primary w-full font-pixel text-xs py-3 flex items-center justify-center gap-2"
              >
                <LogIn size={14} /> LOG IN TO PLAY
              </Link>

              <Link
                to={`/register?redirect=/challenges/${id}`}
                className="btn-arcade w-full text-xs py-3 flex items-center justify-center gap-2"
              >
                <UserPlus size={14} /> CREATE PLAYER ACCOUNT
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
