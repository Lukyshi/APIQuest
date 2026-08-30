import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { challengesApi } from './api';
import { Swords, ArrowRight, Loader2, Filter } from 'lucide-react';

const PROTOCOLS = ['rest', 'soap', 'graphql'];
const difficultyPill = { EASY: 'pill-emerald', MEDIUM: 'pill-amber', HARD: 'pill-rose' };
const typePill = { QUIZ: 'pill-brand', FIX_REQUEST: 'pill-violet', PREDICT_RESPONSE: 'pill-slate' };
const typeLabel = { QUIZ: 'Quiz', FIX_REQUEST: 'Fix the Request', PREDICT_RESPONSE: 'Predict Response' };

export default function ChallengesPage() {
  const [activeProtocol, setActiveProtocol] = useState('rest');

  const { data: challenges, isLoading } = useQuery({
    queryKey: ['challenges', activeProtocol],
    queryFn: () => challengesApi.listByConcept(activeProtocol),
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold mb-3">
          <Swords size={14} /> Challenges
        </div>
        <h1 className="text-4xl font-bold text-white mb-3">Test Your Knowledge</h1>
        <p className="text-slate-400">Quiz questions, broken request puzzles, and response prediction challenges — earn XP for every correct answer.</p>
      </div>

      {/* Protocol Filter */}
      <div className="flex items-center gap-2 mb-8">
        <Filter size={13} className="text-slate-500" />
        {PROTOCOLS.map((p) => (
          <button
            key={p}
            id={`filter-${p}`}
            onClick={() => setActiveProtocol(p)}
            className={`btn text-sm py-1.5 px-4 capitalize ${activeProtocol === p ? 'btn-primary' : 'btn-ghost'}`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-20">
          <Loader2 size={28} className="text-brand-400 animate-spin" />
        </div>
      )}

      {/* Challenge list */}
      {challenges && (
        <div className="space-y-4 animate-slide-up">
          {challenges.map((ch, idx) => (
            <Link
              key={ch.id}
              to={`/challenges/${ch.id}`}
              id={`challenge-${ch.id}`}
              className="glass-card p-5 flex items-center gap-5 group hover:border-brand-500/40 transition-all duration-200"
            >
              {/* Number */}
              <div className="w-10 h-10 rounded-xl bg-surface-3 border border-surface-2 flex items-center justify-center text-slate-400 font-bold text-sm flex-shrink-0">
                {idx + 1}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className={difficultyPill[ch.difficulty]}>{ch.difficulty.toLowerCase()}</span>
                  <span className={typePill[ch.type]}>{typeLabel[ch.type]}</span>
                </div>
                <p className="text-sm text-slate-200 group-hover:text-white transition-colors line-clamp-2">
                  {ch.question.split('\n')[0]}
                </p>
              </div>

              {/* XP + Arrow */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right">
                  <div className="text-xs text-slate-500">XP</div>
                  <div className="text-sm font-bold text-brand-300">+{ch.xpReward}</div>
                </div>
                <ArrowRight size={16} className="text-slate-500 group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}

          {challenges.length === 0 && (
            <div className="glass-card p-12 text-center text-slate-400">
              No challenges found for {activeProtocol.toUpperCase()}.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
