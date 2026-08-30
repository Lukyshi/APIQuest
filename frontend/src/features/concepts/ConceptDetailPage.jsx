import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { conceptsApi } from './api';
import { ArrowLeft, Code2, Swords, Loader2, CheckCircle } from 'lucide-react';

const protocolConfig = {
  REST:    { pill: 'pill-brand',  gradient: 'from-brand-600 to-brand-400' },
  SOAP:    { pill: 'pill-violet', gradient: 'from-violet-600 to-violet-400' },
  GRAPHQL: { pill: 'pill-rose',   gradient: 'from-pink-600 to-pink-400' },
};

const difficultyPill = {
  EASY:   'pill-emerald',
  MEDIUM: 'pill-amber',
  HARD:   'pill-rose',
};

// Simple markdown-to-JSX for h2/h3/code-block/bold/italic/paragraph
function MarkdownRenderer({ content }) {
  const lines = content.split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="text-xl font-bold text-white mt-8 mb-3">{line.slice(3)}</h2>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="text-lg font-semibold text-brand-300 mt-6 mb-2">{line.slice(4)}</h3>);
    } else if (line.startsWith('```')) {
      // collect code block
      const lang = line.slice(3).trim();
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <div key={i} className="code-block my-4">
          {lang && <div className="text-xs text-slate-500 mb-2">{lang}</div>}
          <pre>{codeLines.join('\n')}</pre>
        </div>
      );
    } else if (line.trim() === '') {
      // skip blanks
    } else {
      // inline formatting
      const rendered = line
        .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
        .replace(/\*(.+?)\*/g, '<em class="text-slate-300 italic">$1</em>')
        .replace(/`(.+?)`/g, '<code class="text-brand-300 bg-surface-3 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>');
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
  const cfg = protocolConfig[slug?.toUpperCase()] || {};

  const { data: concept, isLoading, isError } = useQuery({
    queryKey: ['concept', slug],
    queryFn: () => conceptsApi.getBySlug(slug),
  });

  if (isLoading) return (
    <div className="flex items-center justify-center py-32">
      <Loader2 size={32} className="text-brand-400 animate-spin" />
    </div>
  );

  if (isError || !concept) return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center text-slate-400">
      Concept not found. <Link to="/concepts" className="text-brand-400 hover:underline">Back to library</Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* Back */}
      <Link to="/concepts" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft size={14} /> Back to Concepts
      </Link>

      {/* Header */}
      <div className="glass-card overflow-hidden mb-8 animate-fade-in">
        <div className={`h-2 bg-gradient-to-r ${cfg.gradient}`} />
        <div className="p-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={cfg.pill}>{concept.protocol}</span>
            <span className="text-xs text-slate-500">Protocol</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">{concept.title}</h1>
          <div className="flex flex-wrap gap-3">
            <a href={concept.sampleEndpoint} target="_blank" rel="noreferrer"
               className="inline-flex items-center gap-2 text-xs text-brand-400 hover:text-brand-300 transition-colors">
              <Code2 size={12} /> {concept.sampleEndpoint}
            </a>
            <Link to={`/sandbox`}
               className="inline-flex items-center gap-2 text-xs text-violet-400 hover:text-violet-300 transition-colors">
              Try in Sandbox →
            </Link>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          <div className="glass-card p-8 animate-slide-up">
            <MarkdownRenderer content={concept.explanation} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Comparison points */}
          {concept.comparisonPoints?.length > 0 && (
            <div className="glass-card p-6 animate-slide-up">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle size={15} className="text-brand-400" /> Quick Facts
              </h3>
              <div className="space-y-3">
                {concept.comparisonPoints.map((pt) => (
                  <div key={pt.id} className="border-b border-surface-3 pb-3 last:border-0 last:pb-0">
                    <div className="text-xs text-slate-500 mb-0.5">{pt.label}</div>
                    <div className="text-sm text-slate-200">{pt.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Challenges */}
          {concept.challenges?.length > 0 && (
            <div className="glass-card p-6 animate-slide-up">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Swords size={15} className="text-amber-400" /> Challenges
              </h3>
              <div className="space-y-2">
                {concept.challenges.map((ch) => (
                  <Link key={ch.id} to={`/challenges/${ch.id}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-surface-2 hover:bg-surface-3 transition-colors group">
                    <span className="text-sm text-slate-300 group-hover:text-white transition-colors line-clamp-1">{ch.question.slice(0,60)}…</span>
                    <span className={`${difficultyPill[ch.difficulty]} ml-2 flex-shrink-0`}>
                      {ch.difficulty.toLowerCase()}
                    </span>
                  </Link>
                ))}
              </div>
              <Link to={`/challenges?concept=${slug}`} className="btn-outline w-full mt-4 text-sm">
                All {concept.protocol} Challenges
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
