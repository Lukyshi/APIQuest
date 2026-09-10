import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { conceptsApi } from './api';
import { ArrowRight, BookOpen, Loader2, Swords, Sparkles, Layers } from 'lucide-react';

export default function ConceptsPage() {
  const { data: concepts, isLoading, isError } = useQuery({
    queryKey: ['concepts'],
    queryFn: conceptsApi.getAll,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-10 animate-fade-in text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 pill-yellow mb-3">
          <BookOpen size={14} /> KNOWLEDGE LIBRARY
        </div>
        <h1 className="font-pixel text-3xl sm:text-5xl font-extrabold text-white mb-3">API CONCEPTS & REALMS</h1>
        <p className="text-slate-300 max-w-2xl text-sm leading-relaxed">
          Comprehensive guides covering architectural patterns, protocol specifications, security controls, auth flows, and production best practices.
        </p>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={32} className="text-amber-400 animate-spin" />
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="glass-card p-8 text-center text-slate-400 font-pixel">
          <p>Failed to load concepts. Ensure backend server is running.</p>
        </div>
      )}

      {/* Grid */}
      {concepts && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
          {concepts.map((concept) => (
            <div key={concept.id} className="pixel-card p-6 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="pill-yellow text-[10px]">{concept.protocol}</span>
                  <span className="text-[11px] font-pixel text-slate-400 flex items-center gap-1">
                    <Swords size={12} className="text-amber-400" /> {concept._count?.challenges || 0} QUESTS
                  </span>
                </div>

                <h2 className="font-pixel text-lg font-bold text-white mb-3 leading-snug group-hover:text-amber-400 transition-colors">
                  {concept.title}
                </h2>

                <p className="text-xs text-slate-300 leading-relaxed mb-6 line-clamp-3">
                  {concept.explanation.split('\n')[0]}
                </p>

                {/* Comparison preview */}
                <div className="space-y-1.5 border-t border-amber-500/15 pt-3 mb-6">
                  {concept.comparisonPoints?.slice(0, 3).map((pt) => (
                    <div key={pt.id} className="flex justify-between text-[11px]">
                      <span className="text-slate-400 font-pixel">{pt.label}:</span>
                      <span className="text-amber-300 font-medium truncate ml-2 max-w-[150px]">{pt.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                to={`/concepts/${concept.slug}`}
                className="btn-primary text-xs font-pixel py-2.5 w-full text-center"
              >
                STUDY {concept.protocol} <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
