import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { sandboxApi } from './api';
import {
  Send, Loader2, Clock, CheckCircle2, Code2,
  ChevronDown, ChevronUp, Globe, Zap, FileCode, BookOpen,
  HelpCircle, Info, Sparkles, Play, Layers
} from 'lucide-react';

const PROTOCOLS = ['REST', 'GraphQL', 'SOAP'];
const REST_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

const METHOD_COLORS = {
  GET: 'text-emerald-400',
  POST: 'text-amber-400',
  PUT: 'text-orange-400',
  PATCH: 'text-yellow-400',
  DELETE: 'text-rose-400',
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

const PRESETS = {
  REST: [
    { label: 'GET Fetch Single Post', method: 'GET', path: '/posts/1', body: '', note: 'Retrieves a single resource object' },
    { label: 'POST Create New Post', method: 'POST', path: '/posts', body: '{\n  "title": "API Quest Arcade",\n  "body": "Testing REST POST calls!"\n}', note: 'Submits payload to create a new resource' },
    { label: 'PUT Replace Post', method: 'PUT', path: '/posts/1', body: '{\n  "id": 1,\n  "title": "Updated Title",\n  "body": "Replaced entire object"\n}', note: 'Replaces the entire resource payload' },
  ],
  GraphQL: [
    {
      label: 'Query Country Details',
      query: `query {\n  country(code: "US") {\n    name\n    capital\n    currency\n  }\n}`,
      note: 'Fetches exact fields: name, capital, currency',
    },
    {
      label: 'Query Continent & Languages',
      query: `query {\n  country(code: "JP") {\n    name\n    native\n    languages { name }\n  }\n}`,
      note: 'Nested object graph query without over-fetching',
    },
  ],
  SOAP: [
    { label: 'Add 5 + 3', op: 'Add', a: '5', b: '3', note: 'XML Envelope dispatch to DNE Calculator' },
    { label: 'Multiply 12 × 4', op: 'Multiply', a: '12', b: '4', note: 'SOAP RPC math calculation' },
  ],
};

export default function SandboxPage() {
  const [activeTab, setActiveTab] = useState('REST');
  const [showGuide, setShowGuide] = useState(true);
  const [guideStep, setGuideStep] = useState(1);

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
      if (activeTab === 'REST') {
        return sandboxApi.rest({
          method: restMethod,
          path: restPath,
          body: restBody ? JSON.parse(restBody) : undefined,
        });
      }
      if (activeTab === 'GraphQL') {
        return sandboxApi.graphql({ query: gqlQuery });
      }
      return sandboxApi.soap({
        operation: soapOp,
        intA: Number(soapA),
        intB: Number(soapB),
      });
    },
    onSuccess: (data) => {
      setResult(data);
      toast.success(`Response received in ${data.timing?.ms}ms`, { icon: '⚡' });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Request execution failed'),
  });

  const handleSend = () => {
    if (activeTab === 'REST' && restBody) {
      try {
        JSON.parse(restBody);
      } catch {
        toast.error('Request body is not valid JSON syntax');
        return;
      }
    }
    mutation.mutate();
  };

  const applyPreset = (preset) => {
    setResult(null);
    if (activeTab === 'REST') {
      setRestMethod(preset.method);
      setRestPath(preset.path);
      setRestBody(preset.body || '');
      if (preset.body) setShowRestBody(true);
    } else if (activeTab === 'GraphQL') {
      setGqlQuery(preset.query);
    } else if (activeTab === 'SOAP') {
      setSoapOp(preset.op);
      setSoapA(preset.a);
      setSoapB(preset.b);
    }
    toast.success(`Preset loaded: ${preset.label}`, { icon: '🎮' });
  };

  const tabIcons = { REST: Globe, GraphQL: Zap, SOAP: FileCode };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-6 animate-fade-in flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 pill-yellow mb-2">
            <Code2 size={14} /> LIVE API TESTING ARENA
          </div>
          <h1 className="font-pixel text-3xl sm:text-4xl font-extrabold text-white">INTERACTIVE SANDBOX</h1>
          <p className="text-slate-300 text-sm mt-1">
            Dispatch real API calls across REST, GraphQL, and SOAP — inspect roundtrip latency, headers, and raw response payloads.
          </p>
        </div>

        {/* Guide Toggle Button */}
        <button
          onClick={() => setShowGuide((v) => !v)}
          className="btn-arcade text-xs flex items-center gap-2 self-start md:self-auto"
        >
          <BookOpen size={14} /> {showGuide ? 'HIDE FIELD GUIDE' : 'OPEN FIELD GUIDE'}
        </button>
      </div>

      {/* ── BUILT-IN FIELD GUIDE & ONBOARDING STEPPER ─────────────────────── */}
      {showGuide && (
        <div className="mb-8 glass-card p-6 border-2 border-amber-500/40 bg-amber-500/5 animate-fade-in relative">
          <div className="flex items-center justify-between mb-4 border-b border-amber-500/20 pb-3">
            <div className="flex items-center gap-2 text-amber-300 font-pixel text-sm">
              <Sparkles size={16} className="text-amber-400" />
              <span>FIELD GUIDE: HOW TO USE THE API SANDBOX</span>
            </div>
            <span className="text-[11px] font-pixel text-slate-400">STEP {guideStep} OF 4</span>
          </div>

          {/* Stepper Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {[
              { num: 1, title: '1. Select Protocol', text: 'Pick REST, GraphQL, or SOAP' },
              { num: 2, title: '2. Craft Request', text: 'Choose HTTP Method / Body' },
              { num: 3, title: '3. Dispatch Call', text: 'Hit Send Request button' },
              { num: 4, title: '4. Read Response', text: 'Inspect Status & Latency ms' },
            ].map((s) => (
              <button
                key={s.num}
                onClick={() => setGuideStep(s.num)}
                className={`p-3 rounded-lg text-left transition-all border ${
                  guideStep === s.num
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                    : 'bg-surface-2 border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-pixel text-xs">{s.title}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{s.text}</div>
              </button>
            ))}
          </div>

          {/* Step Detail Explanation */}
          <div className="bg-surface-1 p-4 rounded-xl border border-amber-500/20 text-xs text-slate-300 leading-relaxed">
            {guideStep === 1 && (
              <p>
                <strong>Protocol Selection:</strong> <em>REST</em> operates on URIs with standard HTTP verbs (GET, POST, PUT). <em>GraphQL</em> sends single POST queries requesting exact JSON field selection sets. <em>SOAP</em> packages structured XML envelopes according to formal WSDL specs.
              </p>
            )}
            {guideStep === 2 && (
              <p>
                <strong>Crafting Requests:</strong> Use the Method dropdown (GET to read, POST to create, PUT to replace, PATCH to partially update) and path endpoint. For POST/PUT, expand the Request Body editor and input valid JSON formatting.
              </p>
            )}
            {guideStep === 3 && (
              <p>
                <strong>Dispatch & Proxying:</strong> Clicking "Send Request" sends your parameters through our secure server proxy. This bypasses browser CORS locks while preserving true network timing and header inspection.
              </p>
            )}
            {guideStep === 4 && (
              <p>
                <strong>Inspecting Output:</strong> The response panel displays the HTTP Status Code (200 OK, 404 Not Found), roundtrip latency in milliseconds (ms), and formatted JSON/XML payload returned by the live backend service.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Protocol Tabs */}
      <div className="flex gap-2 mb-6">
        {PROTOCOLS.map((p) => {
          const Icon = tabIcons[p];
          return (
            <button
              key={p}
              id={`sandbox-tab-${p.toLowerCase()}`}
              onClick={() => { setActiveTab(p); setResult(null); }}
              className={`btn font-pixel text-xs py-2.5 px-5 ${
                activeTab === p ? 'btn-primary' : 'btn-ghost'
              }`}
            >
              <Icon size={16} /> {p}
            </button>
          );
        })}
      </div>

      {/* Presets Bar */}
      <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        <span className="font-pixel text-[11px] text-amber-400 flex items-center gap-1 flex-shrink-0">
          <Play size={12} /> PRESETS:
        </span>
        {PRESETS[activeTab]?.map((preset) => (
          <button
            key={preset.label}
            onClick={() => applyPreset(preset)}
            className="btn-ghost text-[11px] py-1.5 px-3 font-pixel whitespace-nowrap bg-surface-2 hover:border-amber-400"
            title={preset.note}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* ── Request Panel ────────────────────────────────────────────────── */}
        <div className="glass-card p-6 animate-slide-up border-2 border-amber-500/25">
          <h2 className="font-pixel text-base font-bold text-white mb-5 flex items-center gap-2">
            <Send size={16} className="text-amber-400" /> REQUEST BUILDER
            {activeTab === 'REST' && (
              <span className="ml-auto text-[10px] font-pixel text-slate-400">
                HOST: <code className="text-amber-300">jsonplaceholder.typicode.com</code>
              </span>
            )}
            {activeTab === 'GraphQL' && (
              <span className="ml-auto text-[10px] font-pixel text-slate-400">
                ENDPOINT: <code className="text-amber-300">countries.trevorblades.com</code>
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
                  className={`input w-28 flex-shrink-0 font-pixel text-xs font-bold ${METHOD_COLORS[restMethod]}`}
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
                  className="input font-mono text-xs"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowRestBody((v) => !v)}
                className="flex items-center gap-1.5 text-xs font-pixel text-amber-400 hover:text-white transition-colors"
              >
                {showRestBody ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                {showRestBody ? 'HIDE' : 'ADD'} REQUEST BODY (JSON)
              </button>
              {showRestBody && (
                <textarea
                  value={restBody}
                  onChange={(e) => setRestBody(e.target.value)}
                  placeholder='{ "title": "API Quest Arcade" }'
                  className="textarea h-36"
                />
              )}
            </div>
          )}

          {/* GraphQL Form */}
          {activeTab === 'GraphQL' && (
            <div>
              <label className="block text-xs font-pixel text-amber-400 mb-2">GRAPHQL QUERY SELECTION SET</label>
              <textarea
                value={gqlQuery}
                onChange={(e) => setGqlQuery(e.target.value)}
                className="textarea h-52 font-mono"
                spellCheck={false}
              />
            </div>
          )}

          {/* SOAP Form */}
          {activeTab === 'SOAP' && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 leading-relaxed font-sans">
                Connecting to DNE Online Calculator SOAP web service. Builds formal XML envelope automatically.
              </div>
              <div>
                <label className="block text-xs font-pixel text-amber-400 mb-2">OPERATION</label>
                <select value={soapOp} onChange={(e) => setSoapOp(e.target.value)} className="input font-pixel text-xs">
                  {SOAP_OPERATIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-pixel text-slate-400 mb-1">VALUE A</label>
                  <input type="number" value={soapA} onChange={(e) => setSoapA(e.target.value)} className="input font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-pixel text-slate-400 mb-1">VALUE B</label>
                  <input type="number" value={soapB} onChange={(e) => setSoapB(e.target.value)} className="input font-mono" />
                </div>
              </div>
            </div>
          )}

          <button
            id="sandbox-send"
            onClick={handleSend}
            className="btn-primary font-pixel text-xs w-full mt-6 py-3.5"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            {mutation.isPending ? 'DISPATCHING CALL...' : 'SEND REQUEST'}
          </button>
        </div>

        {/* ── Response Panel ────────────────────────────────────────────────── */}
        <div className="glass-card p-6 animate-slide-up border-2 border-amber-500/25">
          <h2 className="font-pixel text-base font-bold text-white mb-5 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-400" /> RESPONSE INSPECTOR
          </h2>

          {!result && !mutation.isPending && (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500 text-xs font-pixel">
              <Code2 size={36} className="mb-3 opacity-30 text-amber-400" />
              HIT "SEND REQUEST" TO SEE RESPONSE PAYLOAD & METRICS
            </div>
          )}

          {mutation.isPending && (
            <div className="flex flex-col items-center justify-center h-64 text-amber-300 text-xs font-pixel">
              <Loader2 size={36} className="animate-spin text-amber-400 mb-3" />
              EXECUTING REQUEST...
            </div>
          )}

          {result && (
            <div className="space-y-4">
              {/* Status row */}
              <div className="flex flex-wrap items-center gap-3">
                <span className={`pill font-pixel text-xs font-bold ${
                  result.status < 300 ? 'pill-emerald' : result.status < 400 ? 'pill-yellow' : 'pill-rose'
                }`}>
                  {result.status} {result.statusText || 'OK'}
                </span>
                {result.timing && (
                  <span className="flex items-center gap-1 font-pixel text-xs text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/30">
                    <Clock size={12} className="text-amber-400" /> {result.timing.ms}ms LATENCY
                  </span>
                )}
              </div>

              {/* Response body */}
              <div>
                <div className="text-xs font-pixel text-slate-400 mb-2">RESPONSE BODY PAYLOAD</div>
                <div className="code-block font-mono text-xs">
                  <pre className="whitespace-pre-wrap break-words">
                    {typeof result.data === 'string'
                      ? result.data
                      : JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              </div>

              {/* SOAP Envelope if present */}
              {result.requestEnvelope && (
                <div>
                  <div className="text-xs font-pixel text-amber-400 mb-2">DISPATCHED SOAP XML ENVELOPE</div>
                  <div className="code-block text-[11px]">
                    <pre className="whitespace-pre-wrap">{result.requestEnvelope}</pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Explanation Cards */}
      <div className="mt-8 grid sm:grid-cols-3 gap-4">
        {[
          { title: 'Server Proxying', text: 'Requests are proxied securely through the API Quest backend to eliminate browser CORS blocks and measure accurate latency.' },
          { title: 'Real Live Endpoints', text: 'You are communicating with live backends — JSONPlaceholder for REST, TrevorBlades Countries for GraphQL, DNE for SOAP.' },
          { title: 'Response Inspection', text: 'Status codes under 300 indicate success, 4xx indicates client input errors, and 5xx indicates server side issues.' },
        ].map(({ title, text }) => (
          <div key={title} className="glass-card p-4 border border-amber-500/20">
            <h3 className="font-pixel text-xs font-bold text-white mb-1.5">{title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
