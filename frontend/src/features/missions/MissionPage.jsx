import { useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  ArrowLeft, Bug, FlaskConical, Target, Lightbulb, Send, Play,
  Loader2, ChevronDown, ChevronUp, Lock, LogIn, UserPlus, X,
  Zap, CheckCircle2, XCircle, Info
} from 'lucide-react';
import { missionsApi } from './api';
import api from '../../lib/axios';
import { useAuthStore } from '../auth/authStore';
import MissionCompleteModal from './MissionCompleteModal';

// ─── Constants ────────────────────────────────────────────────────────────────

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

const TYPE_META = {
  DEBUGGER:   { label: 'API Debugger',  icon: Bug,          colour: 'text-rose-400',   border: 'border-rose-500/40',   bg: 'bg-rose-500/10'   },
  EXPERIMENT: { label: 'Experiment',    icon: FlaskConical,  colour: 'text-blue-400',   border: 'border-blue-500/40',   bg: 'bg-blue-500/10'   },
  MISSION:    { label: 'Mission',       icon: Target,        colour: 'text-amber-400',  border: 'border-amber-500/40',  bg: 'bg-amber-500/10'  },
};

const DIFFICULTY_LABEL = {
  BEGINNER:    '🟢 Beginner',
  EXPLORER:    '🔵 Explorer',
  BUILDER:     '🟡 Builder',
  DEBUGGER_LVL:'🟠 Debugger',
  ADVANCED:    '🔴 Advanced',
  BOSS:        '👾 Boss',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function HeaderRow({ key: k, val, onChange, onRemove }) {
  return (
    <div className="flex gap-2 items-center">
      <input
        value={k}
        onChange={(e) => onChange(e.target.value, val)}
        placeholder="Header name"
        className="input flex-1 py-2 text-xs font-mono"
      />
      <input
        value={val}
        onChange={(e) => onChange(k, e.target.value)}
        placeholder="Value"
        className="input flex-1 py-2 text-xs font-mono"
      />
      <button
        onClick={onRemove}
        className="text-slate-500 hover:text-rose-400 transition-colors flex-shrink-0"
        aria-label="Remove header"
      >
        <X size={14} />
      </button>
    </div>
  );
}

function ResponsePanel({ response, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-xs text-slate-400 font-pixel py-4">
        <Loader2 size={14} className="animate-spin" /> Sending request...
      </div>
    );
  }
  if (!response) return null;

  const statusColour =
    response.status >= 200 && response.status < 300 ? 'text-emerald-400' :
    response.status >= 400 && response.status < 500 ? 'text-rose-400' :
    response.status >= 500 ? 'text-orange-400' : 'text-slate-400';

  return (
    <div className="space-y-2 animate-fade-in">
      <div className="flex items-center gap-2">
        <span className={`font-pixel text-sm font-bold ${statusColour}`}>
          HTTP {response.status}
        </span>
        <span className="text-xs text-slate-500 font-mono">{response.timing?.ms}ms</span>
      </div>
      <pre className="code-block text-xs overflow-auto max-h-48">
        {typeof response.data === 'string'
          ? response.data
          : JSON.stringify(response.data, null, 2)}
      </pre>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MissionPage() {
  const { id } = useParams();
  const qc = useQueryClient();
  const { isAuthenticated } = useAuthStore();

  // ── Editor state ──────────────────────────────────────────────────────────
  const [method, setMethod]     = useState('GET');
  const [endpoint, setEndpoint] = useState('');
  const [headers, setHeaders]   = useState([{ key: 'Content-Type', val: 'application/json' }]);
  const [body, setBody]         = useState('');

  // ── UI state ──────────────────────────────────────────────────────────────
  const [sandboxResponse, setSandboxResponse] = useState(null);
  const [isSending, setIsSending]             = useState(false);
  const [result, setResult]                   = useState(null);
  const [showComplete, setShowComplete]       = useState(false);
  const [showAuthModal, setShowAuthModal]     = useState(false);
  const [hintsRevealed, setHintsRevealed]     = useState([]);   // list of revealed hint texts
  const [hintsOpen, setHintsOpen]             = useState(false);
  const [hintLoading, setHintLoading]         = useState(false);
  const [headersOpen, setHeadersOpen]         = useState(true);
  const [bodyOpen, setBodyOpen]               = useState(false);

  // ── Data fetch ────────────────────────────────────────────────────────────
  const { data: mission, isLoading } = useQuery({
    queryKey: ['mission', id],
    queryFn:  () => missionsApi.getById(id),
    onSuccess: (m) => {
      // Pre-populate editor with initialRequest
      if (m?.initialRequest) {
        setMethod(m.initialRequest.method || 'GET');
        setEndpoint(m.initialRequest.endpoint || '');
        const initHeaders = Object.entries(m.initialRequest.headers || {}).map(([k, v]) => ({ key: k, val: v }));
        if (initHeaders.length > 0) setHeaders(initHeaders);
        setBody(typeof m.initialRequest.body === 'object'
          ? JSON.stringify(m.initialRequest.body, null, 2)
          : (m.initialRequest.body || ''));
        setBodyOpen(!!m.initialRequest.body);
      }
    },
  });

  // Pre-populate when mission loads (onSuccess not guaranteed in React Query v5)
  const initDone = useState(false);
  if (mission && !initDone[0]) {
    initDone[1](true);
    if (mission.initialRequest) {
      // Only set if they match defaults (not yet changed by user)
      const ir = mission.initialRequest;
      if (method === 'GET' && endpoint === '') {
        setMethod(ir.method || 'GET');
        setEndpoint(ir.endpoint || '');
        const initHeaders = Object.entries(ir.headers || {}).map(([k, v]) => ({ key: k, val: v }));
        if (initHeaders.length > 0) setHeaders(initHeaders);
        setBody(typeof ir.body === 'object' ? JSON.stringify(ir.body, null, 2) : (ir.body || ''));
        setBodyOpen(!!ir.body);
      }
    }
  }

  // ── Submit mutation ───────────────────────────────────────────────────────
  const submitMutation = useMutation({
    mutationFn: () => {
      const headersObj = headers.reduce((acc, { key: k, val: v }) => {
        if (k.trim()) acc[k.trim()] = v;
        return acc;
      }, {});
      return missionsApi.submit(id, { method, endpoint, headers: headersObj, body }, hintsRevealed.length);
    },
    onSuccess: (data) => {
      setResult(data);
      if (data.passed) {
        setShowComplete(true);
        qc.invalidateQueries({ queryKey: ['missions'] });
        qc.invalidateQueries({ queryKey: ['progress'] });
      } else {
        toast.error('Not quite — read the feedback below carefully.');
      }
    },
    onError: (err) => {
      if (err.response?.status === 401) setShowAuthModal(true);
      else toast.error(err.response?.data?.message || 'Submission failed');
    },
  });

  // ── "Send Request" — live sandbox proxy ──────────────────────────────────
  const handleSend = async () => {
    setIsSending(true);
    setSandboxResponse(null);
    try {
      const headersObj = headers.reduce((acc, { key: k, val: v }) => {
        if (k.trim()) acc[k.trim()] = v;
        return acc;
      }, {});
      // Use existing sandbox proxy
      const resp = await api.post('/sandbox/rest', {
        method,
        path: endpoint,
        headers: headersObj,
        body: body ? (() => { try { return JSON.parse(body); } catch { return body; } })() : undefined,
      });
      setSandboxResponse(resp.data.data);
    } catch (err) {
      setSandboxResponse({ status: err.response?.status || 0, data: err.response?.data || err.message, timing: { ms: 0 } });
    } finally {
      setIsSending(false);
    }
  };

  // ── Hint fetch ────────────────────────────────────────────────────────────
  const handleHint = async () => {
    if (!isAuthenticated) { setShowAuthModal(true); return; }
    setHintLoading(true);
    try {
      const next = hintsRevealed.length;
      const data = await missionsApi.getHint(id, next);
      setHintsRevealed((prev) => [...prev, { text: data.hint, xpReduction: data.xpReduction, isFirst: data.isFirst }]);
      setHintsOpen(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'No more hints available');
    } finally {
      setHintLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!isAuthenticated) { setShowAuthModal(true); return; }
    submitMutation.mutate();
  };

  const addHeader = () => setHeaders((h) => [...h, { key: '', val: '' }]);
  const removeHeader = (i) => setHeaders((h) => h.filter((_, idx) => idx !== i));
  const updateHeader = (i, k, v) => setHeaders((h) => h.map((row, idx) => idx === i ? { key: k, val: v } : row));

  // ─────────────────────────────────────────────────────────────────────────

  if (isLoading) return (
    <div className="flex justify-center py-32">
      <Loader2 size={32} className="text-amber-400 animate-spin" />
    </div>
  );
  if (!mission) return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center text-slate-400 font-pixel">
      Mission not found. <Link to="/missions" className="text-amber-400">Back to Missions</Link>
    </div>
  );

  const typeMeta   = TYPE_META[mission.type]   || TYPE_META.MISSION;
  const TypeIcon   = typeMeta.icon;
  const alreadyDone = mission.isCompleted && !result;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">

      {/* ── Back Link ──────────────────────────────────────────────────────── */}
      <Link to="/missions" className="inline-flex items-center gap-2 text-xs font-pixel text-slate-400 hover:text-amber-400 mb-8 transition-colors">
        <ArrowLeft size={14} /> BACK TO MISSIONS
      </Link>

      {/* ── Guest Banner ───────────────────────────────────────────────────── */}
      {!isAuthenticated && (
        <div className="mb-6 p-4 rounded-xl glass-card border-amber-500/40 bg-amber-500/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs text-amber-300 font-pixel">
            <Lock size={16} className="text-amber-400 flex-shrink-0" />
            <span>LOGIN REQUIRED: You can explore the mission freely — login to submit and earn XP!</span>
          </div>
          <button onClick={() => setShowAuthModal(true)} className="btn-primary font-pixel text-xs py-1.5 px-3">
            Log In
          </button>
        </div>
      )}

      {/* ── Mission Brief ──────────────────────────────────────────────────── */}
      <div className={`glass-card p-6 mb-6 border-2 ${typeMeta.border} ${typeMeta.bg}`}>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className={`inline-flex items-center gap-1.5 text-xs font-pixel px-2.5 py-1 rounded-md border ${typeMeta.colour} ${typeMeta.border} bg-black/20`}>
            <TypeIcon size={12} /> {typeMeta.label}
          </span>
          <span className="pill-slate text-[10px]">{DIFFICULTY_LABEL[mission.difficulty]}</span>
          <span className="pill-slate text-[10px]">{mission.category}</span>
          <span className="ml-auto flex items-center gap-1 font-pixel text-sm font-bold text-amber-300">
            <Zap size={13} className="text-amber-400 fill-amber-400" /> +{mission.xpReward} XP
          </span>
        </div>

        <h1 className="font-pixel text-xl sm:text-2xl font-extrabold text-white mb-3">
          {mission.title}
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed mb-4">{mission.description}</p>

        {/* Scenario context */}
        <div className="bg-black/30 border border-emerald-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-pixel uppercase tracking-wider mb-2">
            <Info size={12} /> SCENARIO
          </div>
          <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-mono">
            {mission.scenarioContext}
          </p>
        </div>

        {/* Already completed notice */}
        {alreadyDone && (
          <div className="mt-4 flex items-center gap-2 text-xs font-pixel text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-2.5">
            <CheckCircle2 size={14} /> You've already completed this mission! Feel free to experiment more.
          </div>
        )}
      </div>

      {/* ── Request Editor ─────────────────────────────────────────────────── */}
      <div className="glass-card p-6 mb-6 border-2 border-amber-500/20">
        <div className="text-xs font-pixel text-amber-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Send size={12} /> REQUEST EDITOR
        </div>

        {/* Method + Endpoint */}
        <div className="flex gap-2 mb-4">
          <select
            id="mission-method"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="input py-2.5 font-mono text-xs font-bold text-amber-300 w-28 flex-shrink-0 bg-surface-1"
            style={{ width: '6.5rem' }}
          >
            {HTTP_METHODS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <input
            id="mission-endpoint"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            placeholder="/endpoint/path"
            className="input py-2.5 font-mono text-xs flex-1"
          />
        </div>

        {/* Headers accordion */}
        <div className="mb-3">
          <button
            onClick={() => setHeadersOpen((v) => !v)}
            className="flex items-center gap-2 text-[10px] font-pixel text-slate-400 hover:text-slate-200 transition-colors w-full text-left mb-2"
          >
            {headersOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            HEADERS ({headers.filter(h => h.key.trim()).length})
          </button>
          {headersOpen && (
            <div className="space-y-2">
              {headers.map((row, i) => (
                <HeaderRow
                  key={i}
                  k={row.key}
                  val={row.val}
                  onChange={(k, v) => updateHeader(i, k, v)}
                  onRemove={() => removeHeader(i)}
                />
              ))}
              <button
                onClick={addHeader}
                className="text-[10px] font-pixel text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                + Add Header
              </button>
            </div>
          )}
        </div>

        {/* Body accordion */}
        <div className="mb-4">
          <button
            onClick={() => setBodyOpen((v) => !v)}
            className="flex items-center gap-2 text-[10px] font-pixel text-slate-400 hover:text-slate-200 transition-colors w-full text-left mb-2"
          >
            {bodyOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            BODY {body ? '(has content)' : '(empty)'}
          </button>
          {bodyOpen && (
            <textarea
              id="mission-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={'{\n  "key": "value"\n}'}
              rows={5}
              className="textarea w-full"
            />
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            id="mission-send"
            onClick={handleSend}
            disabled={isSending || !endpoint}
            className="btn-arcade text-xs py-2.5 px-4 flex items-center gap-2"
          >
            {isSending ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
            TEST REQUEST
          </button>
          <button
            id="mission-submit"
            onClick={handleSubmit}
            disabled={submitMutation.isPending || !endpoint}
            className="btn-primary text-xs font-pixel py-2.5 flex-1"
          >
            {submitMutation.isPending
              ? <><Loader2 size={14} className="animate-spin" /> EVALUATING...</>
              : <><Send size={14} /> SUBMIT ANSWER</>
            }
          </button>
        </div>
      </div>

      {/* ── Sandbox Response ───────────────────────────────────────────────── */}
      {(sandboxResponse || isSending) && (
        <div className="glass-card p-5 mb-6 border border-slate-700 animate-fade-in">
          <div className="text-[10px] font-pixel text-slate-500 uppercase tracking-wider mb-3">LIVE RESPONSE</div>
          <ResponsePanel response={sandboxResponse} isLoading={isSending} />
        </div>
      )}

      {/* ── Evaluation Result ──────────────────────────────────────────────── */}
      {result && !result.passed && (
        <div className="glass-card p-6 mb-6 border-2 border-rose-500/40 bg-rose-500/5 animate-fade-in">
          <div className="flex items-center gap-2 font-pixel text-sm text-rose-300 mb-3">
            <XCircle size={18} className="text-rose-400" />
            NOT QUITE — READ THE CLUE BELOW
          </div>
          <div className="text-sm text-slate-300 leading-relaxed bg-surface-1 p-4 rounded-xl border border-rose-500/20 font-mono">
            {result.feedback}
          </div>
          <p className="text-[11px] text-slate-500 font-pixel mt-3">
            Review your request editor above and try again. Each attempt teaches something new!
          </p>
        </div>
      )}

      {/* ── Hint Panel ─────────────────────────────────────────────────────── */}
      <div className="glass-card p-5 mb-6 border border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-[10px] font-pixel text-slate-400 uppercase tracking-wider">
            <Lightbulb size={12} className="text-amber-400" />
            HINTS
            {hintsRevealed.length > 0 && (
              <span className="pill-yellow text-[9px] py-0.5 ml-1">{hintsRevealed.length} used</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {hintsRevealed.length > 0 && (
              <button
                onClick={() => setHintsOpen((v) => !v)}
                className="text-[10px] font-pixel text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
              >
                {hintsOpen ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                {hintsOpen ? 'Hide' : 'Show'} hints
              </button>
            )}
            <button
              id="mission-hint"
              onClick={handleHint}
              disabled={hintLoading}
              className="btn-ghost text-[11px] font-pixel py-1.5 px-3 flex items-center gap-1.5"
            >
              {hintLoading ? <Loader2 size={12} className="animate-spin" /> : <Lightbulb size={12} className="text-amber-400" />}
              {hintsRevealed.length === 0 ? 'Free Hint' : `Hint ${hintsRevealed.length + 1}`}
            </button>
          </div>
        </div>

        {/* Hint note */}
        <p className="text-[10px] font-pixel text-slate-500 mb-3">
          First hint is free. Additional hints reduce XP reward slightly (max –25%).
          Hints teach concepts, not just answers.
        </p>

        {/* Revealed hints */}
        {hintsOpen && hintsRevealed.length > 0 && (
          <div className="space-y-2 animate-fade-in">
            {hintsRevealed.map((h, i) => (
              <div key={i} className="flex gap-3 p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="font-pixel text-[9px] text-amber-300">{i + 1}</span>
                </div>
                <div>
                  <p className="text-xs text-slate-300 leading-relaxed">{h.text}</p>
                  {!h.isFirst && h.xpReduction > 0 && (
                    <span className="text-[10px] font-pixel text-rose-400 mt-1 block">
                      –{h.xpReduction} XP reduction applied
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Mission Complete Modal ─────────────────────────────────────────── */}
      {showComplete && (
        <MissionCompleteModal
          result={result}
          mission={mission}
          onClose={() => setShowComplete(false)}
        />
      )}

      {/* ── Auth Modal ─────────────────────────────────────────────────────── */}
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
              Submit your answer and earn XP by logging into your account.
            </p>
            <div className="space-y-3">
              <Link
                to={`/login?redirect=/missions/${id}`}
                className="btn-primary w-full font-pixel text-xs py-3 flex items-center justify-center gap-2"
              >
                <LogIn size={14} /> LOG IN TO PLAY
              </Link>
              <Link
                to={`/register?redirect=/missions/${id}`}
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
