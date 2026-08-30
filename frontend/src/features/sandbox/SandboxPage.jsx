import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { sandboxApi } from './api';
import {
  Send, Loader2, Clock, CheckCircle2, Code2,
  ChevronDown, ChevronUp, Globe, Zap, FileCode
} from 'lucide-react';

const PROTOCOLS = ['REST', 'GraphQL', 'SOAP'];

const REST_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
const METHOD_COLORS = {
  GET: 'text-emerald-400', POST: 'text-brand-400',
  PUT: 'text-amber-400', PATCH: 'text-orange-400', DELETE: 'text-rose-400',
};

const SOAP_OPERATIONS = ['Add', 'Subtract', 'Multiply', 'Divide'];

const DEFAULT_GRAPHQL_QUERY = `query {
  country(code: "US") {
    name
    capital
    currency
    continent { name }
  }
}`;

export default function SandboxPage() {
  const [activeTab, setActiveTab] = useState('REST');

  // REST state
  const [restMethod, setRestMethod] = useState('GET');
  const [restPath, setRestPath] = useState('/posts/1');
  const [restBody, setRestBody] = useState('');
  const [showRestBody, setShowRestBody] = useState(false);

  // GraphQL state
  const [gqlQuery, setGqlQuery] = useState(DEFAULT_GRAPHQL_QUERY);

  // SOAP state
  const [soapOp, setSoapOp] = useState('Add');
  const [soapA, setSoapA] = useState('5');
  const [soapB, setSoapB] = useState('3');

  const [result, setResult] = useState(null);

  const mutation = useMutation({
    mutationFn: async () => {
      if (activeTab === 'REST') return sandboxApi.rest({ method: restMethod, path: restPath, body: restBody ? JSON.parse(restBody) : undefined });
      if (activeTab === 'GraphQL') return sandboxApi.graphql({ query: gqlQuery });
      return sandboxApi.soap({ operation: soapOp, intA: Number(soapA), intB: Number(soapB) });
    },
    onSuccess: (data) => { setResult(data); toast.success(`Response received in ${data.timing?.ms}ms`); },
    onError: (err) => toast.error(err.response?.data?.message || 'Request failed'),
  });

  const handleSend = () => {
    if (activeTab === 'REST' && restBody) {
      try { JSON.parse(restBody); } catch { toast.error('Request body is not valid JSON'); return; }
    }
    mutation.mutate();
  };

  const tabIcons = { REST: Globe, GraphQL: Zap, SOAP: FileCode };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-2 text-brand-400 text-sm font-semibold mb-3">
          <Code2 size={14} /> Interactive Sandbox
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">API Sandbox</h1>
        <p className="text-slate-400">Send real requests and see exactly what happens under the hood — no CORS issues, full timing and headers.</p>
      </div>

      {/* Protocol Tabs */}
      <div className="flex gap-2 mb-6">
        {PROTOCOLS.map((p) => {
          const Icon = tabIcons[p];
          return (
            <button
              key={p}
              id={`sandbox-tab-${p.toLowerCase()}`}
              onClick={() => { setActiveTab(p); setResult(null); }}
              className={`btn ${activeTab === p ? 'btn-primary' : 'btn-ghost'} text-sm`}
            >
              <Icon size={14} /> {p}
            </button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* ── Request Panel ──────────────────────────────────────────────────── */}
        <div className="glass-card p-6 animate-slide-up">
          <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
            <Send size={15} className="text-brand-400" /> Request
            {activeTab === 'REST' && (
              <span className="ml-auto text-xs text-slate-500">
                Base: <code className="text-brand-300 text-xs">jsonplaceholder.typicode.com</code>
              </span>
            )}
            {activeTab === 'GraphQL' && (
              <span className="ml-auto text-xs text-slate-500">
                Endpoint: <code className="text-brand-300 text-xs">countries.trevorblades.com</code>
              </span>
            )}
          </h2>

          {/* REST Form */}
          {activeTab === 'REST' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <select
                  value={restMethod}
                  onChange={(e) => setRestMethod(e.target.value)}
                  className={`input w-28 flex-shrink-0 font-mono font-bold ${METHOD_COLORS[restMethod]}`}
                >
                  {REST_METHODS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={restPath}
                  onChange={(e) => setRestPath(e.target.value)}
                  placeholder="/posts/1"
                  className="input font-mono"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowRestBody((v) => !v)}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                {showRestBody ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                {showRestBody ? 'Hide' : 'Add'} Request Body (JSON)
              </button>
              {showRestBody && (
                <textarea
                  value={restBody}
                  onChange={(e) => setRestBody(e.target.value)}
                  placeholder='{ "title": "My new post" }'
                  className="textarea h-32"
                />
              )}
            </div>
          )}

          {/* GraphQL Form */}
          {activeTab === 'GraphQL' && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">Query</label>
              <textarea
                value={gqlQuery}
                onChange={(e) => setGqlQuery(e.target.value)}
                className="textarea h-48"
                spellCheck={false}
              />
            </div>
          )}

          {/* SOAP Form */}
          {activeTab === 'SOAP' && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                Using the DNE Online Calculator SOAP service. Returns a mock response if the live service is unreachable.
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">Operation</label>
                <select value={soapOp} onChange={(e) => setSoapOp(e.target.value)} className="input">
                  {SOAP_OPERATIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2">Value A</label>
                  <input type="number" value={soapA} onChange={(e) => setSoapA(e.target.value)} className="input font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2">Value B</label>
                  <input type="number" value={soapB} onChange={(e) => setSoapB(e.target.value)} className="input font-mono" />
                </div>
              </div>
              <div className="text-xs text-slate-500">
                Operation: {soapA} {soapOp.toLowerCase().replace('add','+').replace('subtract','-').replace('multiply','×').replace('divide','÷')} {soapB}
              </div>
            </div>
          )}

          <button
            id="sandbox-send"
            onClick={handleSend}
            className="btn-primary w-full mt-6"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
            {mutation.isPending ? 'Sending…' : 'Send Request'}
          </button>
        </div>

        {/* ── Response Panel ─────────────────────────────────────────────────── */}
        <div className="glass-card p-6 animate-slide-up">
          <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
            <CheckCircle2 size={15} className="text-emerald-400" /> Response
          </h2>

          {!result && !mutation.isPending && (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500 text-sm">
              <Code2 size={32} className="mb-3 opacity-30" />
              Hit "Send Request" to see the response here
            </div>
          )}

          {mutation.isPending && (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400 text-sm">
              <Loader2 size={32} className="animate-spin text-brand-400 mb-3" />
              Sending request…
            </div>
          )}

          {result && (
            <div className="space-y-4">
              {/* Status row */}
              <div className="flex flex-wrap items-center gap-3">
                <span className={`pill font-mono font-bold ${result.status < 300 ? 'pill-emerald' : result.status < 400 ? 'pill-amber' : 'pill-rose'}`}>
                  {result.status} {result.statusText || ''}
                </span>
                {result.timing && (
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock size={11} /> {result.timing.ms}ms
                  </span>
                )}
                {result.note && (
                  <span className="text-xs text-amber-400">{result.note}</span>
                )}
              </div>

              {/* Response body */}
              <div>
                <div className="text-xs text-slate-500 mb-2">Response Body</div>
                <div className="code-block">
                  <pre className="whitespace-pre-wrap break-words">
                    {typeof result.data === 'string'
                      ? result.data
                      : JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              </div>

              {/* SOAP envelope */}
              {result.requestEnvelope && (
                <div>
                  <div className="text-xs text-slate-500 mb-2">Sent SOAP Envelope</div>
                  <div className="code-block text-xs">
                    <pre className="whitespace-pre-wrap">{result.requestEnvelope}</pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Explanation cards */}
      <div className="mt-8 grid sm:grid-cols-3 gap-4">
        {[
          { title: 'Why a server-side proxy?', text: 'Requests are proxied through the backend to avoid CORS restrictions and to log/replay calls for learning purposes.' },
          { title: 'Real responses', text: 'You\'re hitting real public APIs — JSONPlaceholder for REST, countries.trevorblades.com for GraphQL, DNE Calculator for SOAP.' },
          { title: 'Rate limited', text: 'The sandbox is rate-limited to 30 requests/minute to prevent abuse. Upgrade to see logs of your previous requests.' },
        ].map(({ title, text }) => (
          <div key={title} className="glass-card p-4">
            <h3 className="text-sm font-semibold text-white mb-1.5">{title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
