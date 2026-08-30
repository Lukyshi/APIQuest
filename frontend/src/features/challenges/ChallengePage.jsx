import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { challengesApi } from './api';
import { toast } from 'react-hot-toast';
import {
  ArrowLeft, CheckCircle2, XCircle, Zap, Star,
  Loader2, Swords, ChevronRight, Trophy
} from 'lucide-react';

const difficultyPill = { EASY: 'pill-emerald', MEDIUM: 'pill-amber', HARD: 'pill-rose' };
const typeLabel = { QUIZ: 'Quiz', FIX_REQUEST: 'Fix the Request', PREDICT_RESPONSE: 'Predict Response' };

const BADGE_META = {
  first_blood:  { emoji: '🩸', label: 'First Blood' },
  rest_rookie:  { emoji: '🔗', label: 'REST Rookie' },
  soap_slinger: { emoji: '📜', label: 'SOAP Slinger' },
  graphql_guru: { emoji: '⚡', label: 'GraphQL Guru' },
  century:      { emoji: '💯', label: 'Century' },
  legend:       { emoji: '🏆', label: 'Legend' },
};

export default function ChallengePage() {
  const { id } = useParams();
  const qc = useQueryClient();
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);

  const { data: challenge, isLoading } = useQuery({
    queryKey: ['challenge', id],
    queryFn: () => challengesApi.getById(id),
  });

  const mutation = useMutation({
    mutationFn: (optionId) => challengesApi.submit(id, optionId),
    onSuccess: (data) => {
      setResult(data);
      if (data.isCorrect) {
        toast.success(`Correct! +${data.xpAwarded} XP`, { icon: '⚡' });
        qc.invalidateQueries({ queryKey: ['progress'] });
      } else {
        toast.error('Not quite — see the explanation below.');
      }
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Submission failed'),
  });

  const handleSubmit = () => {
    if (!selected) { toast.error('Select an option first'); return; }
    mutation.mutate(selected);
  };

  if (isLoading) return (
    <div className="flex justify-center py-32">
      <Loader2 size={32} className="text-brand-400 animate-spin" />
    </div>
  );

  if (!challenge) return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center text-slate-400">
      Challenge not found. <Link to="/challenges" className="text-brand-400">Back to challenges</Link>
    </div>
  );

  const answered = !!result;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Back */}
      <Link to="/challenges" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft size={14} /> Back to Challenges
      </Link>

      {/* Challenge card */}
      <div className="glass-card p-8 animate-fade-in">
        {/* Header row */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className={difficultyPill[challenge.difficulty]}>{challenge.difficulty.toLowerCase()}</span>
          <span className="pill-slate">{typeLabel[challenge.type]}</span>
          <span className="ml-auto flex items-center gap-1.5 text-sm font-bold text-brand-300">
            <Zap size={14} /> +{challenge.xpReward} XP
          </span>
        </div>

        {/* Question */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-4">
            <Swords size={12} /> Question
          </div>
          <pre className="text-slate-100 text-sm leading-relaxed whitespace-pre-wrap font-sans">{challenge.question}</pre>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {challenge.options?.map((opt) => {
            let cls = 'glass-card p-4 w-full text-left text-sm transition-all duration-200 cursor-pointer flex items-center gap-3';
            if (!answered) {
              cls += selected === opt.id
                ? ' border-brand-400 bg-brand-500/10 text-white'
                : ' hover:border-brand-500/40 hover:text-white text-slate-300';
            } else if (opt.id === result.correctOptionId) {
              cls += ' border-emerald-400 bg-emerald-500/10 text-emerald-200';
            } else if (opt.id === selected && !result.isCorrect) {
              cls += ' border-rose-400 bg-rose-500/10 text-rose-300';
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
                {answered && opt.id === result.correctOptionId && <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />}
                {answered && opt.id === selected && !result.isCorrect && <XCircle size={16} className="text-rose-400 flex-shrink-0" />}
                {(!answered || (opt.id !== result.correctOptionId && opt.id !== selected)) && (
                  <div className={`w-4 h-4 rounded-full border flex-shrink-0 transition-all ${selected === opt.id ? 'border-brand-400 bg-brand-500' : 'border-slate-600'}`} />
                )}
                <span>{opt.optionText}</span>
              </button>
            );
          })}
        </div>

        {/* Submit / Result */}
        {!answered ? (
          <button
            id="challenge-submit"
            onClick={handleSubmit}
            className="btn-primary w-full"
            disabled={!selected || mutation.isPending}
          >
            {mutation.isPending ? <Loader2 size={15} className="animate-spin" /> : <ChevronRight size={15} />}
            {mutation.isPending ? 'Submitting…' : 'Submit Answer'}
          </button>
        ) : (
          <div className={`rounded-xl p-5 border ${result.isCorrect ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-rose-500/30 bg-rose-500/10'}`}>
            <div className="flex items-center gap-2 font-bold mb-2">
              {result.isCorrect
                ? <><CheckCircle2 size={18} className="text-emerald-400" /><span className="text-emerald-300">Correct! {result.xpAwarded > 0 ? `+${result.xpAwarded} XP earned` : '(Already completed)'}</span></>
                : <><XCircle size={18} className="text-rose-400" /><span className="text-rose-300">Not quite this time</span></>}
            </div>
            {result.explanation && (
              <p className="text-sm text-slate-300 leading-relaxed">{result.explanation}</p>
            )}
            {/* New badges */}
            {result.newBadges?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-emerald-500/20">
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold mb-2">
                  <Trophy size={12} /> New Badge{result.newBadges.length > 1 ? 's' : ''} Unlocked!
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.newBadges.map((code) => (
                    <span key={code} className="pill-amber">
                      {BADGE_META[code]?.emoji} {BADGE_META[code]?.label || code}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-3 mt-5">
              <Link to="/challenges" className="btn-ghost flex-1 text-sm text-center">← All Challenges</Link>
              <Link to="/dashboard" className="btn-primary flex-1 text-sm text-center">
                <Star size={13} /> View Progress
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
