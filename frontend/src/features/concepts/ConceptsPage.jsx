import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { conceptsApi } from './api';
import { ArrowRight, BookOpen, Loader2, Swords } from 'lucide-react';

const protocolConfig = {
  REST:    { gradient: 'from-brand-600 to-brand-400',  pill: 'pill-brand',   desc: 'The modern web standard for CRUD APIs over HTTP.' },
  SOAP:    { gradient: 'from-violet-600 to-violet-400', pill: 'pill-violet',  desc: 'Enterprise-grade XML protocol with formal contracts (WSDL).' },
  GRAPHQL: { gradient: 'from-pink-600 to-pink-400',    pill: 'pill-rose',    desc: 'A query language that lets clients request exactly the data they need.' },
};

export default function ConceptsPage() {
  const { data: concepts, isLoading, isError } = useQuery({
    queryKey: ['concepts'],
    queryFn: conceptsApi.getAll,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-10 animate-fade-in">
        <div className="flex items-center gap-2 text-brand-400 text-sm font-semibold mb-3">
          <BookOpen size={14} /> Concept Library
        </div>
        <h1 className="text-4xl font-bold text-white mb-3">API Technologies</h1>
        <p className="text-slate-400 max-w-2xl">
          Deep explanations of the three most important API styles — not just what they are, but <em>why</em> they exist and when to use each.
        </p>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={32} className="text-brand-400 animate-spin" />
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="glass-card p-8 text-center text-slate-400">
          <p>Failed to load concepts. Make sure the backend is running.</p>
        </div>
      )}

      {/* Grid */}
      {concepts && (
        <div className="grid md:grid-cols-3 gap-6 animate-slide-up">
          {concepts.map((concept) => {
            const cfg = protocolConfig[concept.protocol] || {};
            return (
              <div key={concept.id} className="glass-card overflow-hidden group">
                {/* Card top gradient bar */}
                <div className={`h-1.5 bg-gradient-to-r ${cfg.gradient}`} />
                <div className="p-7">
                  <div className="flex items-start justify-between mb-4">
                    <span className={cfg.pill}>{concept.protocol}</span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Swords size={12} /> {concept._count?.challenges || 0} challenges
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-white mb-3 leading-tight">{concept.title}</h2>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6">{cfg.desc}</p>

                  {/* Comparison point preview */}
                  {concept.comparisonPoints?.slice(0, 3).map((pt) => (
                    <div key={pt.id} className="flex gap-2 text-xs mb-1.5">
                      <span className="text-slate-500 w-28 flex-shrink-0">{pt.label}</span>
                      <span className="text-slate-300">{pt.value}</span>
                    </div>
                  ))}

                  <Link
                    to={`/concepts/${concept.slug}`}
                    className="btn-outline w-full mt-6 group-hover:border-brand-400/60"
                  >
                    Learn {concept.protocol} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
