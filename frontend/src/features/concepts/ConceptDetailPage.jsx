import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { conceptsApi } from './api';
import { ArrowLeft, Code2, Swords, Loader2, CheckCircle, Zap } from 'lucide-react';

const difficultyPill = {
  EASY:   'pill-emerald',
  MEDIUM: 'pill-yellow',
  HARD:   'pill-rose',
};

function MarkdownRenderer({ content }) {
  const lines = content.split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="font-pixel text-lg font-bold text-amber-400 mt-8 mb-3">{line.slice(3)}</h2>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="font-pixel text-sm font-semibold text-white mt-6 mb-2">{line.slice(4)}</h3>);
    } else if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <div key={i} className="code-block my-4">
          {lang && <div className="text-[10px] font-pixel text-amber-400 mb-1">{lang}</div>}
          <pre>{codeLines.join('\n')}</pre>
        </div>
      );
    } else if (line.trim() === '') {
      // skip
    } else {
      const rendered = line
        .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
        .replace(/\*(.+?)\*/g, '<em class="text-slate-300 italic">$1</em>')
        .replace(/`(.+?)`/g, '<code class="text-amber-300 bg-surface-3 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>');
      elements.push(
        <p key={i} className="text-slate-300 text-sm leading-relaxed mb-3"
           dangerouslySetInnerHTML={{ __html: rendered }} />
      );
    }
    i++;
  }
  return <>{elements}</>;
}

export default function ConceptDetailPage() {
  const { slug } = useParams();

  const { data: concept, isLoading, isError } = useQuery({
    queryKey: ['concept', slug],
    queryFn: () => conceptsApi.getBySlug(slug),
  });

  if (isLoading) return (
    <div className="flex items-center justify-center py-32">
      <Loader2 size={32} className="text-amber-400 animate-spin" />
    </div>
  );

  if (isError || !concept) return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center text-slate-400 font-pixel">
      Concept not found. <Link to="/concepts" className="text-amber-400">Back to Library</Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* Back */}
      <Link to="/concepts" className="inline-flex items-center gap-2 text-xs font-pixel text-slate-400 hover:text-amber-400 mb-8 transition-colors">
        <ArrowLeft size={14} /> BACK TO CONCEPTS
      </Link>

      {/* Header */}
      <div className="glass-card p-8 mb-8 animate-fade-in border-2 border-amber-500/30">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="pill-yellow">{concept.protocol}</span>
          <span className="text-xs font-pixel text-slate-400">TOPIC REALM</span>
        </div>
        <h1 className="font-pixel text-3xl font-extrabold text-white mb-4">{concept.title}</h1>
        <div className="flex flex-wrap gap-4">
          <a href={concept.sampleEndpoint} target="_blank" rel="noreferrer"
             className="inline-flex items-center gap-2 text-xs font-pixel text-amber-400 hover:underline">
            <Code2 size={14} /> {concept.sampleEndpoint}
          </a>
          <Link to="/sandbox" className="inline-flex items-center gap-2 text-xs font-pixel text-orange-400 hover:underline">
            TRY IN SANDBOX →
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          <div className="glass-card p-8 animate-slide-up border-amber-500/20">
            <MarkdownRenderer content={concept.explanation} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Comparison points */}
          {concept.comparisonPoints?.length > 0 && (
            <div className="glass-card p-6 animate-slide-up border-amber-500/20">
              <h3 className="font-pixel text-sm font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle size={16} className="text-amber-400" /> QUICK FACTS
              </h3>
              <div className="space-y-3">
                {concept.comparisonPoints.map((pt) => (
                  <div key={pt.id} className="border-b border-surface-3 pb-3 last:border-0 last:pb-0">
                    <div className="text-[10px] font-pixel text-slate-400 mb-0.5">{pt.label}</div>
                    <div className="text-xs font-medium text-slate-200">{pt.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quests */}
          {concept.challenges?.length > 0 && (
            <div className="glass-card p-6 animate-slide-up border-amber-500/20">
              <h3 className="font-pixel text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Swords size={16} className="text-amber-400" /> TOPIC QUESTS
              </h3>
              <div className="space-y-2">
                {concept.challenges.map((ch) => (
                  <Link key={ch.id} to={`/challenges/${ch.id}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-surface-2 hover:bg-surface-3 transition-colors group">
                    <span className="text-xs text-slate-300 group-hover:text-white line-clamp-1">{ch.question.slice(0,50)}…</span>
                    <span className={`${difficultyPill[ch.difficulty]} ml-2 flex-shrink-0 text-[10px]`}>
                      {ch.difficulty.toLowerCase()}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
