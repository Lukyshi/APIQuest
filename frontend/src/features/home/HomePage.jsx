import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, Code2, Swords, Trophy, ArrowRight, Zap, Shield,
  Lock, Unlock, Flame, Sparkles, CheckCircle2, Play,
  Bug, Compass, Terminal, Award,
  Layers, LogIn, Crown, TrendingUp
} from 'lucide-react';
import {
  PixelBolt, PixelCrystal, PixelScroll, PixelLock,
  PixelShield, PixelSatellite, PixelTrophy
} from '../../components/PixelIcons';
import PixelWind from '../../components/PixelWind';
import StoneContainer from '../../components/StoneContainer';

/* ─── 4 Pillars (Learn is kept strictly intact) ─────────────────────────── */
const coreHubs = [
  {
    id: 'learn',
    title: 'LEARN',
    subtitle: 'Concept Library & Mechanics',
    icon: BookOpen,
    desc: 'Deep-dive explanations of REST, SOAP, GraphQL, Auth, Security, Webhooks, and API architecture trade-offs.',
    link: '/concepts',
    pill: '9 REALMS TO EXPLORE',
    btnText: 'Open Library',
  },
  {
    id: 'sandbox',
    title: 'SANDBOX',
    subtitle: 'Live API Request Deck',
    icon: Code2,
    desc: 'Craft real HTTP calls, GraphQL queries, and SOAP XML envelopes with live timing and status inspection.',
    link: '/sandbox',
    pill: 'INTERACTIVE DECK',
    btnText: 'Launch Sandbox',
  },
  {
    id: 'challenges',
    title: 'CHALLENGES',
    subtitle: 'Gamified Quest Map',
    icon: Swords,
    desc: 'Solve quizzes, fix broken requests, and predict responses. Earn XP and unlock higher-level quest nodes.',
    link: '/challenges',
    pill: 'LEVELING SYSTEM',
    btnText: 'Enter World Map',
  },
  {
    id: 'leaderboard',
    title: 'LEADERBOARD',
    subtitle: 'Global High Scores',
    icon: Trophy,
    desc: 'Compete against developers worldwide, maintain daily win streaks, earn rare badges, and claim #1 spot.',
    link: '/leaderboard',
    pill: 'HALL OF FAME',
    btnText: 'View High Scores',
  },
];

/* ─── Sample Quest Nodes ─────────────────────────────────────────────────── */
const sampleNodes = [
  { topic: 'REST API Realm', level: 'Level 1', xp: '0 XP Req', title: 'HTTP Verbs & Status Codes', status: 'unlocked', icon: <PixelBolt size={24} /> },
  { topic: 'GraphQL Realm', level: 'Level 2', xp: '15 XP Req', title: 'Queries & Selection Sets', status: 'unlocked', icon: <PixelCrystal size={24} /> },
  { topic: 'SOAP Citadel', level: 'Level 3', xp: '35 XP Req', title: 'XML Envelopes & WSDL', status: 'unlocked', icon: <PixelScroll size={24} /> },
  { topic: 'Auth Fortress', level: 'Level 4', xp: '60 XP Req', title: 'JWT Tokens & OAuth 2.0', status: 'locked', icon: <PixelLock size={24} locked={true} /> },
  { topic: 'Security Vault', level: 'Level 5', xp: '90 XP Req', title: 'CORS & OWASP API Top 10', status: 'locked', icon: <PixelShield size={24} /> },
  { topic: 'Webhook Outpost', level: 'Level 6', xp: '125 XP Req', title: 'HMAC Signatures & Retries', status: 'locked', icon: <PixelSatellite size={24} /> },
];

/* ─── Challenge Trial Modality Previews ───────────────────────────────────── */
const trialPreviews = {
  quiz: {
    badge: 'MULTIPLE-CHOICE QUIZ',
    type: 'QUIZ TRIAL',
    question: 'A client performs a successful POST request creating a new order record. According to RFC 9110 standards, which HTTP status code must the server return with the resource location header?',
    options: [
      { text: '200 OK — Standard success response', correct: false },
      { text: '201 Created — Indicates successful resource generation (Correct)', correct: true },
      { text: '204 No Content — Indicates success without body payload', correct: false },
      { text: '302 Found — Temporary redirection to resource', correct: false },
    ],
    explanation: 'HTTP 201 Created explicitly confirms the resource has been constructed on the server. Good API design pairs this with a Location header pointing to the URI of the newly created entity.',
  },
  fix: {
    badge: 'FIX BROKEN REQUEST',
    type: 'DEBUG PUZZLE',
    question: 'The mobile app client is attempting to post JSON order data, but the API gateway consistently throws HTTP 415 Unsupported Media Type. What request parameter must be patched?',
    options: [
      { text: 'Change the HTTP verb from POST to PUT', correct: false },
      { text: 'Add header "Content-Type: application/json" to the request (Correct)', correct: true },
      { text: 'Pass the payload in the query string instead of the body', correct: false },
      { text: 'Add header "Accept-Encoding: gzip, deflate"', correct: false },
    ],
    explanation: 'HTTP 415 occurs when the origin server refuses the request payload format. Supplying "Content-Type: application/json" instructs the server parser to treat the raw body stream as JSON.',
  },
  predict: {
    badge: 'RESPONSE PREDICTION',
    type: 'SIMULATION PREDICTION',
    question: 'A client sends GET /api/v1/temple/vault without supplying an "Authorization: Bearer <token>" header to an endpoint guarded by JWT middleware. What status code will the API emit?',
    options: [
      { text: '403 Forbidden — Server understood request but refuses authorization', correct: false },
      { text: '401 Unauthorized — Authentication credentials missing or invalid (Correct)', correct: true },
      { text: '400 Bad Request — General syntax malformation', correct: false },
      { text: '404 Not Found — Protected route hidden from unauthenticated clients', correct: false },
    ],
    explanation: 'HTTP 401 Unauthorized denotes that the request lacks valid authentication credentials. 403 Forbidden is reserved for when identity is confirmed, but the actor lacks permissions.',
  },
};

/* ─── Sandbox Protocol Mock Preview Data ─────────────────────────────────── */
const sandboxProtocolData = {
  REST: {
    verb: 'POST',
    path: '/api/v1/temple/relics',
    headers: 'Content-Type: application/json\nAuthorization: Bearer temple_eyJh...',
    body: '{\n  "name": "Amber Sun Amulet",\n  "realm": "REST",\n  "powerLevel": 95\n}',
    status: '201 Created',
    statusClass: 'text-emerald-400',
    time: '18ms',
    size: '412 B',
    response: '{\n  "status": "success",\n  "message": "Relic registered in temple vault",\n  "data": {\n    "id": "relic_amber_95",\n    "name": "Amber Sun Amulet",\n    "realm": "REST",\n    "powerLevel": 95,\n    "createdAt": "2026-10-31T03:25:00Z"\n  }\n}',
  },
  GraphQL: {
    verb: 'POST',
    path: '/graphql',
    headers: 'Content-Type: application/json\nX-Temple-Key: gq_master_key',
    body: 'query GetRelicsByRealm {\n  relics(realm: "GraphQL") {\n    id\n    name\n    powerLevel\n    keeper {\n      username\n    }\n  }\n}',
    status: '200 OK',
    statusClass: 'text-emerald-400',
    time: '24ms',
    size: '568 B',
    response: '{\n  "data": {\n    "relics": [\n      {\n        "id": "gq_crystal_1",\n        "name": "Orb of Strict Schemas",\n        "powerLevel": 140,\n        "keeper": { "username": "AlexTheDev" }\n      }\n    ]\n  }\n}',
  },
  SOAP: {
    verb: 'POST',
    path: '/services/temple-vault.wsdl',
    headers: 'Content-Type: text/xml; charset=utf-8\nSOAPAction: "http://apiquest.io/GetRelic"',
    body: '<?xml version="1.0"?>\n<soapenv:Envelope\n  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">\n  <soapenv:Body>\n    <GetRelicRequest id="soap_scroll_88"/>\n  </soapenv:Body>\n</soapenv:Envelope>',
    status: '200 OK',
    statusClass: 'text-emerald-400',
    time: '32ms',
    size: '890 B',
    response: '<?xml version="1.0"?>\n<soapenv:Envelope\n  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">\n  <soapenv:Body>\n    <GetRelicResponse>\n      <Relic id="soap_scroll_88" status="Active"/>\n    </GetRelicResponse>\n  </soapenv:Body>\n</soapenv:Envelope>',
  },
};

/* ─── Sample Incident Missions Data ─────────────────────────────────────── */
const sampleMissions = [
  {
    id: 'm1',
    code: 'OPS-101',
    type: 'DEBUGGER',
    difficulty: 'EASY',
    difficultyClass: 'pill-emerald',
    xpReward: 30,
    title: 'The Malformed Content-Type Incursion',
    desc: 'The temple automated webhook service is rejecting all payload dispatches with HTTP 415. Inspect the outbound request headers, trace the media type mismatch, and patch the content header.',
    skills: ['HTTP Request Headers', 'Content-Type Negotiation', 'RFC 9110'],
    outcome: '+30 XP • +1 Bug Fixed count • Unlocks REST Detective Badge progress',
  },
  {
    id: 'm2',
    code: 'OPS-204',
    type: 'INVESTIGATION',
    difficulty: 'MEDIUM',
    difficultyClass: 'pill-yellow',
    xpReward: 50,
    title: 'The Expired Bearer Token Anomaly',
    desc: 'Authenticated explorers report sporadic session dropouts during ritual trials. Inspect the JWT authorization payload, verify the Unix epoch expiration timestamp, and implement seamless token renewal.',
    skills: ['JWT Signature Validation', 'HTTP 401 vs 403', 'Token Refresh Cycles'],
    outcome: '+50 XP • +1 Bug Fixed count • Boosts Global Leaderboard rank',
  },
  {
    id: 'm3',
    code: 'OPS-309',
    type: 'EXPERIMENT',
    difficulty: 'HARD',
    difficultyClass: 'pill-rose',
    xpReward: 80,
    title: 'The Circular GraphQL Query Storm',
    desc: 'A recursive relationship between Temple Guardians and Sacred Relics allows malicious clients to dispatch infinite nested queries, exhausting server thread pools. Determine query depth limits and query cost analysis.',
    skills: ['Query Depth Limiting', 'GraphQL Query Complexity', 'Denial of Service Prevention'],
    outcome: '+80 XP • +1 Bug Fixed count • Accelerates Legend (500 XP) milestone',
  },
];

/* ─── Hall of Fame Leaderboard Top 3 ─────────────────────────────────────── */
const topPlayers = [
  { rank: '#1', name: 'AlexTheDev', xp: 1450, streak: 12, rankNum: 1, badgeLabel: 'GOLD CHAMPION', title: 'Grandmaster Architect', bugs: 28 },
  { rank: '#2', name: 'CodeNinja', xp: 1220, streak: 8, rankNum: 2, badgeLabel: 'SILVER HERO', title: 'SOAP & REST Veteran', bugs: 22 },
  { rank: '#3', name: 'ByteMaster', xp: 980, streak: 5, rankNum: 3, badgeLabel: 'BRONZE LEGEND', title: 'GraphQL Specialist', bugs: 17 },
];

export default function HomePage() {
  const [activeTrial, setActiveTrial] = useState('quiz');
  const [activeProtocol, setActiveProtocol] = useState('REST');

  return (
    <div className="relative min-h-screen text-slate-100 overflow-hidden bg-moss-950">
      {/* ── Full-Bleed Jungle Temple Background with Scrim ──────────────── */}
      <div
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat opacity-45"
        style={{
          backgroundImage: 'url(/apiBackground.jpg)',
          filter: 'saturate(1.1) brightness(0.9)',
        }}
      />

      {/* Multi-layered dark moss gradient scrim for maximum readability */}
      <div
        className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-moss-950/80 via-moss-950/85 to-moss-950"
      />

      {/* ── Pixelated Wind & Spore Particle Overlay ───────────────────────── */}
      <PixelWind count={45} />

      <div className="relative z-10">
        {/* ═══════════════════════════════════════════════════════════════════
            HERO SECTION — ASYMMETRICAL SPLIT COMPOSITION (IMAGE 3 / 2 INSPIRATION)
        ════════════════════════════════════════════════════════════════════ */}
        <section className="relative min-h-[92vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          {/* Ambient Jungle Glows */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-[650px] h-[650px] rounded-full bg-emerald-500/15 blur-[140px]" />
            <div className="absolute bottom-1/4 right-1/4 w-[550px] h-[550px] rounded-full bg-amber-500/15 blur-[130px]" />
          </div>

          <div className="relative max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Massive Headline, Readable Intro, CTAs, Horizontal Stats Bar */}
            <div className="lg:col-span-7 text-left space-y-6 sm:space-y-8 animate-fade-in">
              {/* Eyebrow Badge */}
              <div className="inline-flex items-center gap-2.5 pill-emerald shadow-emerald-glow py-1.5 px-4 text-xs font-pixel">
                <Sparkles size={14} className="text-emerald-300 animate-spin" />
                <span className="tracking-wider">PRESS START TO ENTER THE JUNGLE TEMPLE</span>
              </div>

              {/* Massive High-Impact Two-Tone Headline */}
              <h1 className="font-pixel text-4xl sm:text-6xl md:text-7xl lg:text-[5rem] font-black text-white leading-[1.08] tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                MASTER THE REALM OF <br />
                <span className="gradient-text drop-shadow-[0_0_35px_rgba(52,211,153,0.35)]">
                  API ENGINEERING
                </span>
              </h1>

              {/* Enhanced Description Text Size for Readability */}
              <p className="text-base sm:text-lg lg:text-xl text-slate-200 max-w-2xl leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-normal">
                Explore the ancient ruins of <strong className="text-white font-semibold">REST, SOAP, GraphQL, Auth, Security & Webhooks</strong>. Solve gamified trials, level up your developer rank, and test real APIs in the temple sandbox.
              </p>

              {/* Dual Primary & Secondary Action CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link to="/register" className="btn-primary text-base sm:text-lg font-pixel px-8 py-4 shadow-amber-glow">
                  <Play size={20} className="fill-slate-950" /> JOIN TEMPLE
                </Link>
                <Link to="/login" className="btn-arcade text-sm sm:text-base font-pixel px-7 py-4">
                  <LogIn size={20} /> PLAYER LOG IN
                </Link>
              </div>

              {/* Horizontal Key Metrics Bar directly integrated into Hero (Image 3 inspiration) */}
              <div className="pt-6 border-t border-emerald-500/20 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                {[
                  { icon: Zap, num: '9', label: 'API REALMS', color: 'text-amber-400' },
                  { icon: Swords, num: '36+', label: 'QUEST LEVELS', color: 'text-emerald-400' },
                  { icon: Shield, num: '100%', label: 'PRACTICAL & FUN', color: 'text-amber-400' },
                  { icon: Terminal, num: 'LIVE', label: 'SANDBOX TESTING', color: 'text-emerald-400' },
                ].map(({ icon: Icon, num, label, color }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-moss-950/80 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 shadow-inner">
                      <Icon size={18} className={color} />
                    </div>
                    <div>
                      <div className="font-pixel text-xl sm:text-2xl font-black text-white leading-tight">
                        {num}
                      </div>
                      <div className="text-[10px] sm:text-[11px] font-pixel text-slate-400 tracking-wider">
                        {label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Visual Relic Shrine Showcase Card (Image 3 & Image 2 Inspiration) */}
            <div className="lg:col-span-5 flex justify-center animate-slide-up">
              <StoneContainer className="w-full max-w-md p-6 sm:p-8 border-2 border-amber-500/40 relative overflow-hidden" hoverGlow="amber">
                {/* Floating ambient glow behind emblem */}
                <div className="pointer-events-none absolute -top-12 -right-12 w-48 h-48 rounded-full bg-amber-500/20 blur-[60px]" />
                <div className="pointer-events-none absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-emerald-500/20 blur-[60px]" />

                {/* Status Bar */}
                <div className="flex items-center justify-between pb-4 border-b border-emerald-500/20 text-xs font-pixel">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>TEMPLE STATUS: ONLINE</span>
                  </div>
                  <span className="text-amber-400">REALM 01: ACTIVE</span>
                </div>

                {/* Floating Emblem Centerpiece */}
                <div className="py-6 flex flex-col items-center text-center">
                  <img
                    src="/logo.png"
                    alt="API Quest logo"
                    className="h-24 sm:h-28 w-auto animate-float drop-shadow-[0_0_25px_rgba(245,158,11,0.5)] mb-4"
                  />
                  <h3 className="font-pixel text-2xl font-extrabold text-white">
                    API<span className="gradient-text">QUEST</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 font-pixel">
                    THE DEVELOPER'S TEMPLE TRIAL
                  </p>
                </div>

                {/* Expedition Preview Node */}
                <div className="p-4 rounded-xl bg-moss-950/80 border border-emerald-500/30 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] font-pixel">
                    <span className="text-amber-400 flex items-center gap-1.5">
                      <PixelBolt size={14} /> REST API REALM
                    </span>
                    <span className="pill-emerald text-[9px]">LEVEL 1 UNLOCKED</span>
                  </div>
                  <div className="text-sm font-bold text-white leading-snug">
                    HTTP Verbs & Status Code Verification
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-300 pt-1">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                      GET /api/v1/temple/relics
                    </span>
                    <span className="text-amber-300 font-pixel text-[10px]">+15 XP</span>
                  </div>
                </div>

                {/* Protocol Tags */}
                <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
                  {['REST', 'SOAP', 'GRAPHQL', 'JWT AUTH', 'WEBHOOKS'].map((p) => (
                    <span key={p} className="pill-slate text-[9px] font-pixel py-1 px-2.5">
                      {p}
                    </span>
                  ))}
                </div>
              </StoneContainer>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            RETRO ARCADE TOURNAMENT MARQUEE RIBBON (IMAGE 2 INSPIRATION)
        ════════════════════════════════════════════════════════════════════ */}
        <div className="relative z-20 w-full overflow-hidden bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-pixel font-black text-xs sm:text-sm py-3 border-y-2 border-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.35)] select-none">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-8">
            <span>⚡ REST PROTOCOL DECK</span>
            <span>•</span>
            <span>🔮 GRAPHQL SELECTION SETS</span>
            <span>•</span>
            <span>📜 SOAP XML CITADEL</span>
            <span>•</span>
            <span>🔐 JWT AUTH & OAUTH 2.0</span>
            <span>•</span>
            <span>🛡️ OWASP API TOP 10 SECURITY</span>
            <span>•</span>
            <span>📡 WEBHOOK HMAC VERIFICATION</span>
            <span>•</span>
            <span>💯 100% HANDS-ON LEARNING</span>
            <span>•</span>
            <span>🏆 GLOBAL LEADERBOARD PODIUM</span>
            <span>•</span>
            <span>🐛 TACTICAL INCIDENT MISSIONS</span>
            <span>•</span>
            <span>⚡ REST PROTOCOL DECK</span>
            <span>•</span>
            <span>🔮 GRAPHQL SELECTION SETS</span>
            <span>•</span>
            <span>📜 SOAP XML CITADEL</span>
            <span>•</span>
            <span>🔐 JWT AUTH & OAUTH 2.0</span>
            <span>•</span>
            <span>🛡️ OWASP API TOP 10 SECURITY</span>
            <span>•</span>
            <span>📡 WEBHOOK HMAC VERIFICATION</span>
            <span>•</span>
            <span>💯 100% HANDS-ON LEARNING</span>
            <span>•</span>
            <span>🏆 GLOBAL LEADERBOARD PODIUM</span>
            <span>•</span>
            <span>🐛 TACTICAL INCIDENT MISSIONS</span>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            THE 4 PILLARS (LEARN IS KEPT STRICTLY INTACT & UNCHANGED)
        ════════════════════════════════════════════════════════════════════ */}
        <section className="py-20 px-4 max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-slide-up">
            <div className="inline-flex items-center gap-1.5 pill-amber mb-4 shadow-amber-glow">
              <Flame size={14} className="text-amber-400" /> THE 4 PILLARS OF API QUEST
            </div>
            <h2 className="font-pixel text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-wide">
              CHOOSE YOUR ARENA
            </h2>
            <p className="text-slate-300 text-base sm:text-lg mt-3 max-w-2xl mx-auto leading-relaxed">
              Explore the ancient ruin sanctuaries to conquer every API protocol.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreHubs.map(({ id, title, subtitle, icon: Icon, desc, link, pill, btnText }) => (
              <StoneContainer
                key={id}
                className="p-6 sm:p-7 flex flex-col justify-between"
                hoverGlow="emerald"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="pill-emerald text-[11px] font-pixel">{pill}</span>
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 group-hover:scale-110 transition-transform">
                      <Icon size={24} />
                    </div>
                  </div>
                  <h3 className="font-pixel text-2xl font-bold text-white mb-1.5 group-hover:text-emerald-300 transition-colors">
                    {title}
                  </h3>
                  <div className="text-xs sm:text-sm font-semibold text-amber-400 mb-3">{subtitle}</div>
                  <p className="text-sm text-slate-300 leading-relaxed mb-6">{desc}</p>
                </div>

                <Link to={link} className="btn-emerald text-xs sm:text-sm font-pixel py-3 w-full text-center">
                  {btnText} <ArrowRight size={16} />
                </Link>
              </StoneContainer>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            FEATURE 1: CHALLENGES PREVIEW SECTION (REDESIGNED LAYOUT & HIERARCHY)
        ════════════════════════════════════════════════════════════════════ */}
        <section className="py-24 px-4 bg-moss-900/60 border-y border-emerald-500/20 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto space-y-16">
            {/* Header with Enhanced Visual Prominence */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-emerald-500/20">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 pill-emerald mb-4">
                  <Swords size={14} /> LEVELING SYSTEM & EXPEDITION TRIALS
                </div>
                <h2 className="font-pixel text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-wide">
                  WORLD QUEST MAP & CHALLENGES
                </h2>
                <p className="text-slate-300 text-base sm:text-lg mt-3 leading-relaxed">
                  Put your engineering knowledge to the test through progressive quest nodes across 9 API realms. Solve multiple-choice trials, patch broken requests, and predict server responses to level up and earn XP.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 self-start md:self-auto flex-shrink-0">
                <Link to="/login" className="btn-primary text-xs sm:text-sm font-pixel px-6 py-3.5">
                  <LogIn size={16} /> LOG IN TO PLAY
                </Link>
                <Link to="/register" className="btn-arcade text-xs sm:text-sm font-pixel px-6 py-3.5">
                  <Sparkles size={16} /> SIGN UP TO SAVE XP
                </Link>
              </div>
            </div>

            {/* 4 Feature Value Highlights with Enhanced Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  icon: Swords,
                  title: '3 Trial Modalities',
                  desc: 'Multiple-choice quizzes, "Fix This Request" debugging puzzles, and "Predict Response" status simulations.',
                },
                {
                  icon: TrendingUp,
                  title: 'Skills Developed',
                  desc: 'RFC status code compliance, JWT authentication flows, GraphQL schemas, and SOAP XML envelopes.',
                },
                {
                  icon: Zap,
                  title: 'XP & Leveling System',
                  desc: 'Earn +10 to +25 XP per challenge. Accumulate points to advance from Level 1 Novice to Master Architect.',
                },
                {
                  icon: Award,
                  title: 'Rare Temple Badges',
                  desc: 'Unlock milestone badges including First Blood, REST Rookie, SOAP Slinger, and Century (100 XP).',
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="p-5 rounded-xl bg-moss-950/80 border border-emerald-500/25 transition-all hover:border-emerald-400/50">
                  <Icon size={24} className="text-emerald-400 mb-3" />
                  <h4 className="font-pixel text-lg font-bold text-white mb-1.5">{title}</h4>
                  <p className="text-sm text-slate-300 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            {/* Interactive Trial Modality Preview Card */}
            <StoneContainer className="p-6 sm:p-10 border-2 border-emerald-500/40" hoverGlow="emerald">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-emerald-500/20">
                <div>
                  <span className="font-pixel text-xs text-amber-400 uppercase tracking-widest block mb-1">
                    INTERACTIVE TRIAL DEMO
                  </span>
                  <h3 className="font-pixel text-2xl sm:text-3xl font-extrabold text-white">
                    Experience a Real Challenge
                  </h3>
                </div>
                {/* Modality switcher */}
                <div className="flex flex-wrap gap-2.5">
                  {[
                    { id: 'quiz', label: 'QUIZ TRIAL' },
                    { id: 'fix', label: 'FIX REQUEST' },
                    { id: 'predict', label: 'PREDICT RESPONSE' },
                  ].map(({ id, label }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTrial(id)}
                      className={`btn text-xs font-pixel py-2 px-4 rounded-lg transition-all ${
                        activeTrial === id
                          ? 'btn-emerald shadow-[0_0_15px_rgba(52,211,153,0.35)]'
                          : 'btn-ghost text-slate-400 hover:text-white'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Trial Showcase */}
              <div className="mt-8 space-y-6">
                <div>
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <span className="pill-yellow text-[10px] font-pixel">{trialPreviews[activeTrial].badge}</span>
                    <span className="text-xs font-pixel text-slate-400">BOUNTY: +15 XP ON SUBMISSION</span>
                  </div>
                  <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
                    {trialPreviews[activeTrial].question}
                  </p>
                </div>

                {/* Multiple choice options */}
                <div className="grid sm:grid-cols-2 gap-3.5">
                  {trialPreviews[activeTrial].options.map((opt, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-xl border text-xs sm:text-sm font-mono transition-all flex items-start gap-3 ${
                        opt.correct
                          ? 'bg-emerald-500/15 border-emerald-400/60 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                          : 'bg-moss-950/70 border-slate-800 text-slate-300'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-md flex items-center justify-center font-pixel text-xs font-bold flex-shrink-0 ${
                        opt.correct ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="leading-snug pt-0.5">{opt.text}</span>
                    </div>
                  ))}
                </div>

                {/* Explanation Box */}
                <div className="p-5 rounded-xl bg-moss-950/90 border border-emerald-500/30 text-sm text-slate-300">
                  <div className="font-pixel text-xs text-emerald-400 font-bold mb-1.5 flex items-center gap-2">
                    <CheckCircle2 size={15} /> ARCHITECTURAL EXPLANATION
                  </div>
                  <p className="leading-relaxed">{trialPreviews[activeTrial].explanation}</p>
                </div>

                {/* Locked Action Bar */}
                <div className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-sm text-amber-300 text-center sm:text-left">
                    <Lock size={18} className="text-amber-400 flex-shrink-0" />
                    <span>Log in to submit answers, earn XP bounties, and level up your player profile.</span>
                  </div>
                  <Link to="/login" className="btn-primary text-xs sm:text-sm font-pixel py-2.5 px-6 flex-shrink-0">
                    LOG IN TO PLAY
                  </Link>
                </div>
              </div>
            </StoneContainer>

            {/* Quest World Map Realm Nodes */}
            <div className="space-y-8">
              <div className="text-center">
                <span className="font-pixel text-xs text-amber-400 uppercase tracking-widest block mb-1.5">
                  PROGRESSIVE TEMPLE REALMS
                </span>
                <h3 className="font-pixel text-3xl sm:text-4xl font-black text-white">
                  6 Realm Sanctuaries to Conquer
                </h3>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sampleNodes.map(({ topic, level, xp, title, status, icon }) => (
                  <StoneContainer
                    key={title}
                    className={`p-6 transition-all ${
                      status === 'unlocked'
                        ? 'border-emerald-500/40 hover:border-emerald-300'
                        : 'border-slate-800/80 opacity-70'
                    }`}
                    hoverGlow={status === 'unlocked' ? 'emerald' : 'none'}
                  >
                    <div className="flex items-center justify-between mb-3.5">
                      <span className="text-2xl text-emerald-400">{icon}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-pixel text-slate-400">{xp}</span>
                        {status === 'unlocked' ? (
                          <span className="pill-emerald text-[10px] font-pixel flex items-center gap-1">
                            <Unlock size={11} /> UNLOCKED
                          </span>
                        ) : (
                          <span className="pill-slate text-[10px] font-pixel flex items-center gap-1">
                            <Lock size={11} /> LOCKED
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-xs font-pixel text-amber-400 mb-1">{topic} • {level}</div>
                    <h4 className="font-bold text-white text-base sm:text-lg mb-2">{title}</h4>
                    <div className="w-full bg-moss-950 h-2.5 rounded-full overflow-hidden mt-4 border border-emerald-500/20">
                      <div
                        className={`h-full ${
                          status === 'unlocked'
                            ? 'bg-gradient-to-r from-emerald-500 to-amber-400 w-full shadow-emerald-glow'
                            : 'bg-slate-700 w-0'
                        }`}
                      />
                    </div>
                  </StoneContainer>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            FEATURE 2: SANDBOX PREVIEW SECTION (REDESIGNED DECK LAYOUT)
        ════════════════════════════════════════════════════════════════════ */}
        <section className="py-24 px-4 max-w-6xl mx-auto space-y-16">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 pill-emerald mb-4 shadow-emerald-glow">
              <Code2 size={14} className="text-emerald-400" /> LIVE TEST WORKBENCH
            </div>
            <h2 className="font-pixel text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 tracking-wide">
              THE INTERACTIVE API SANDBOX
            </h2>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              A built-in developer laboratory for testing live API requests across REST, GraphQL, and SOAP without installing external desktop clients or configuring local mock servers.
            </p>
          </div>

          {/* 4 Feature Pillars of the Sandbox */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: Layers,
                title: '3 Protocol Decks',
                desc: 'Seamlessly switch between RESTful HTTP, GraphQL selection queries, and legacy enterprise SOAP XML envelopes.',
              },
              {
                icon: Terminal,
                title: 'How It Works',
                desc: 'Select your verb, formulate headers and request payloads in the editor, and dispatch to receive live mock responses.',
              },
              {
                icon: CheckCircle2,
                title: 'What You Practice',
                desc: 'Observe how status codes, response headers, and latency change based on valid vs malformed client requests.',
              },
              {
                icon: Shield,
                title: 'Risk-Free Environment',
                desc: 'Experiment safely with zero fear of corrupting databases, triggering production alerts, or burning API quotas.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <StoneContainer key={title} className="p-5" hoverGlow="emerald">
                <Icon size={24} className="text-emerald-400 mb-3" />
                <h4 className="font-pixel text-lg font-bold text-white mb-1.5">{title}</h4>
                <p className="text-sm text-slate-300 leading-relaxed">{desc}</p>
              </StoneContainer>
            ))}
          </div>

          {/* Interactive Simulated Workbench Preview */}
          <StoneContainer className="p-6 sm:p-10 border-2 border-emerald-500/40 relative" hoverGlow="amber">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-emerald-500/20">
              <div>
                <span className="font-pixel text-xs text-amber-400 uppercase tracking-widest block mb-1">
                  WORKBENCH SIMULATION
                </span>
                <h3 className="font-pixel text-2xl sm:text-3xl font-extrabold text-white">
                  Multi-Protocol Request Deck
                </h3>
              </div>
              {/* Protocol selector buttons */}
              <div className="flex gap-2.5">
                {['REST', 'GraphQL', 'SOAP'].map((proto) => (
                  <button
                    key={proto}
                    onClick={() => setActiveProtocol(proto)}
                    className={`btn text-xs sm:text-sm font-pixel py-2 px-4 rounded-lg transition-all ${
                      activeProtocol === proto
                        ? 'btn-emerald shadow-[0_0_15px_rgba(52,211,153,0.35)]'
                        : 'btn-ghost text-slate-400 hover:text-white'
                    }`}
                  >
                    {proto}
                  </button>
                ))}
              </div>
            </div>

            {/* Workbench Display */}
            <div className="grid lg:grid-cols-2 gap-6 mt-8">
              {/* Request Panel Preview */}
              <div className="bg-moss-950/80 p-5 sm:p-6 rounded-xl border border-emerald-500/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4 text-xs font-pixel text-slate-400">
                    <span>INCOMING REQUEST DISPATCH</span>
                    <span className="text-amber-400">{activeProtocol} DECK</span>
                  </div>

                  {/* URL Bar */}
                  <div className="flex gap-2.5 mb-5">
                    <span className="font-pixel text-xs sm:text-sm font-bold text-amber-400 bg-amber-500/20 px-3.5 py-2 rounded-lg border border-amber-500/40">
                      {sandboxProtocolData[activeProtocol].verb}
                    </span>
                    <div className="input font-mono text-xs sm:text-sm flex items-center flex-1 text-slate-200 overflow-hidden text-ellipsis whitespace-nowrap">
                      {sandboxProtocolData[activeProtocol].path}
                    </div>
                  </div>

                  {/* Headers & Body */}
                  <div className="space-y-4">
                    <div>
                      <span className="font-pixel text-[11px] text-slate-400 block mb-1.5">HEADERS</span>
                      <pre className="p-3 rounded-lg bg-surface-1 border border-slate-800 text-xs font-mono text-emerald-300">
                        {sandboxProtocolData[activeProtocol].headers}
                      </pre>
                    </div>
                    <div>
                      <span className="font-pixel text-[11px] text-slate-400 block mb-1.5">PAYLOAD BODY</span>
                      <pre className="p-3 rounded-lg bg-surface-1 border border-slate-800 text-xs font-mono text-slate-200 max-h-40 overflow-auto">
                        {sandboxProtocolData[activeProtocol].body}
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-800 flex items-center justify-between text-xs font-pixel text-slate-400">
                  <span>MOCK ENGINE: READY</span>
                  <span className="text-emerald-400">TEMPLE SERVER ONLINE</span>
                </div>
              </div>

              {/* Response Panel Preview */}
              <div className="bg-moss-950/80 p-5 sm:p-6 rounded-xl border border-emerald-500/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4 text-xs font-pixel text-slate-400">
                    <span>TELEMETRY & RAW OUTPUT</span>
                    <span className={sandboxProtocolData[activeProtocol].statusClass}>
                      HTTP {sandboxProtocolData[activeProtocol].status} • {sandboxProtocolData[activeProtocol].time}
                    </span>
                  </div>

                  {/* Response Code Block */}
                  <div className="code-block h-64 text-xs font-mono">
                    <div className="text-emerald-400 font-bold mb-2">
                      HTTP/1.1 {sandboxProtocolData[activeProtocol].status} ({sandboxProtocolData[activeProtocol].time}) • {sandboxProtocolData[activeProtocol].size}
                    </div>
                    <pre className="text-slate-200">
                      {sandboxProtocolData[activeProtocol].response}
                    </pre>
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-800 flex items-center justify-between text-xs font-pixel text-slate-400">
                  <span>PAYLOAD SIZE: {sandboxProtocolData[activeProtocol].size}</span>
                  <span className="text-amber-400">TIMING: {sandboxProtocolData[activeProtocol].time}</span>
                </div>
              </div>
            </div>

            {/* Login Required Overlay Banner */}
            <div className="mt-8 p-5 sm:p-6 rounded-xl bg-gradient-to-r from-amber-500/15 via-moss-950/90 to-amber-500/15 border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0">
                  <Lock size={22} />
                </div>
                <div>
                  <div className="font-pixel text-sm font-bold text-white mb-0.5">
                    INTERACTIVE EXECUTION LOCKED FOR VISITORS
                  </div>
                  <div className="text-xs sm:text-sm text-slate-300">
                    Log in or register to dispatch custom live requests, test real GraphQL queries, and save your sandbox logs.
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <Link to="/login" className="btn-primary text-xs sm:text-sm font-pixel py-3 px-6">
                  LOG IN TO USE
                </Link>
                <Link to="/register" className="btn-arcade text-xs sm:text-sm font-pixel py-3 px-5">
                  SIGN UP
                </Link>
              </div>
            </div>
          </StoneContainer>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            FEATURE 3: MISSIONS PREVIEW SECTION (REDESIGNED DOSSIER CARDS)
        ════════════════════════════════════════════════════════════════════ */}
        <section className="py-24 px-4 bg-moss-900/60 border-y border-emerald-500/20 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto space-y-16">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-emerald-500/20">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 pill-rose mb-4">
                  <Compass size={14} /> TACTICAL INCIDENT OPERATIONS
                </div>
                <h2 className="font-pixel text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-wide">
                  API INCIDENT MISSIONS
                </h2>
                <p className="text-slate-300 text-base sm:text-lg mt-3 leading-relaxed">
                  Step into the boots of an on-call backend investigator. Diagnose broken integrations, trace failing headers, and resolve authentic production outages under realistic scenario constraints.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 self-start md:self-auto flex-shrink-0">
                <Link to="/login" className="btn-primary text-xs sm:text-sm font-pixel px-6 py-3.5">
                  <LogIn size={16} /> LOG IN TO ACCEPT
                </Link>
                <Link to="/register" className="btn-arcade text-xs sm:text-sm font-pixel px-6 py-3.5">
                  <Sparkles size={16} /> JOIN AS INVESTIGATOR
                </Link>
              </div>
            </div>

            {/* Missions Educational Value Highlights */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  icon: Bug,
                  title: 'Production Debugging',
                  desc: 'Inspect real server logs, stack traces, and malformed request bodies to discover why endpoints are failing.',
                },
                {
                  icon: Compass,
                  title: '3 Operational Types',
                  desc: 'Debugger Ops (Syntax & Headers), Experiment Trials (Boundary Testing), and Investigations (Auth & Security).',
                },
                {
                  icon: Zap,
                  title: 'High-Value XP Bounties',
                  desc: 'Earn generous +30 to +80 XP rewards per mission resolved to rapidly boost your developer rank.',
                },
                {
                  icon: Award,
                  title: 'Bugs Fixed Counter',
                  desc: 'Every resolved mission permanently increments your public "Bugs Fixed" metric on your player profile.',
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="p-5 rounded-xl bg-moss-950/80 border border-emerald-500/25 transition-all hover:border-rose-400/50">
                  <Icon size={24} className="text-rose-400 mb-3" />
                  <h4 className="font-pixel text-lg font-bold text-white mb-1.5">{title}</h4>
                  <p className="text-sm text-slate-300 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            {/* Mission Dossier Cards Showcase */}
            <div className="space-y-8">
              <div className="text-center">
                <span className="font-pixel text-xs text-rose-400 uppercase tracking-widest block mb-1.5">
                  ACTIVE TEMPLE INCIDENTS
                </span>
                <h3 className="font-pixel text-3xl sm:text-4xl font-black text-white">
                  Sample Tactical Mission Dossiers
                </h3>
              </div>

              <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6">
                {sampleMissions.map((m) => (
                  <StoneContainer
                    key={m.id}
                    className="p-6 sm:p-7 flex flex-col justify-between border-2 border-slate-800/80 hover:border-rose-500/40"
                    hoverGlow="amber"
                  >
                    <div>
                      {/* Meta header */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-pixel text-xs text-slate-400">{m.code}</span>
                        <div className="flex items-center gap-2">
                          <span className={`${m.difficultyClass} text-[10px] font-pixel`}>{m.difficulty}</span>
                          <span className="pill-amber text-[10px] font-pixel flex items-center gap-1">
                            <Zap size={9} /> +{m.xpReward} XP
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <div className="flex items-start gap-2.5 mb-3">
                        <Bug size={18} className="text-rose-400 flex-shrink-0 mt-0.5" />
                        <h4 className="font-pixel text-lg font-bold text-white leading-snug">
                          {m.title}
                        </h4>
                      </div>

                      {/* Brief */}
                      <p className="text-sm text-slate-300 leading-relaxed mb-5">
                        {m.desc}
                      </p>

                      {/* Skills Covered */}
                      <div className="space-y-2 mb-5">
                        <span className="font-pixel text-[11px] text-slate-400 uppercase tracking-wider block">
                          SKILLS TESTED:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {m.skills.map((s) => (
                            <span key={s} className="pill-slate text-[10px] font-pixel py-0.5 px-2">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Reward & CTA footer */}
                    <div className="pt-5 border-t border-emerald-500/15">
                      <div className="text-xs font-pixel text-emerald-400 mb-3.5 flex items-center gap-1.5">
                        <CheckCircle2 size={13} /> {m.outcome}
                      </div>
                      <Link
                        to="/login"
                        className="btn-arcade text-xs sm:text-sm font-pixel py-2.5 w-full text-center flex items-center justify-center gap-2"
                      >
                        <Lock size={14} /> LOG IN TO ACCEPT
                      </Link>
                    </div>
                  </StoneContainer>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            FEATURE 4: LEADERBOARD PREVIEW SECTION (REDESIGNED PODIUM)
        ════════════════════════════════════════════════════════════════════ */}
        <section className="py-24 px-4 max-w-6xl mx-auto space-y-16">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 pill-amber mb-4 shadow-amber-glow">
              <Trophy size={14} className="text-amber-400" /> GLOBAL ARENA STANDINGS
            </div>
            <h2 className="font-pixel text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 tracking-wide">
              THE TEMPLE HALL OF FAME
            </h2>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Compete against developers worldwide. Maintain your daily streak, resolve incident missions, and accumulate XP relics to earn a permanent place on the podium.
            </p>
          </div>

          {/* Ranking System Mechanics */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: Zap,
                title: 'Merit-Based XP',
                desc: 'Every quest solved and mission debugged awards verified XP. Your accumulated total dictates your global rank.',
              },
              {
                icon: TrendingUp,
                title: 'Level Progression',
                desc: 'Every 100 XP unlocks the next player level tier. Climb from Level 1 Initiate to high-level Temple Architect.',
              },
              {
                icon: Flame,
                title: 'Daily Streak Multipliers',
                desc: 'Active daily logins and quest activity increment your streak counter, recognized with special flame badges.',
              },
              {
                icon: Crown,
                title: 'Podium Recognition',
                desc: 'Top 3 developers are enshrined with Gold Champion (#1), Silver Hero (#2), and Bronze Legend (#3) honors.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <StoneContainer key={title} className="p-5" hoverGlow="amber">
                <Icon size={24} className="text-amber-400 mb-3" />
                <h4 className="font-pixel text-lg font-bold text-white mb-1.5">{title}</h4>
                <p className="text-sm text-slate-300 leading-relaxed">{desc}</p>
              </StoneContainer>
            ))}
          </div>

          {/* Leaderboard Podium & Standings Preview */}
          <StoneContainer className="p-6 sm:p-10 border-2 border-emerald-500/35" hoverGlow="amber">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-emerald-500/20">
              <div>
                <span className="font-pixel text-xs text-amber-400 uppercase tracking-widest block mb-1">
                  CURRENT TOP PODIUM
                </span>
                <h3 className="font-pixel text-2xl sm:text-3xl font-extrabold text-white">
                  Global High Score Leaderboard
                </h3>
              </div>
              <div className="text-xs sm:text-sm font-pixel text-emerald-400 flex items-center gap-2">
                <Sparkles size={16} className="text-amber-400" />
                <span>UPDATED IN REAL TIME</span>
              </div>
            </div>

            {/* Top 3 Player Cards */}
            <div className="space-y-4 mt-8">
              {topPlayers.map(({ rank, name, xp, streak, rankNum, badgeLabel, title, bugs }) => (
                <div
                  key={rank}
                  className="p-5 rounded-xl bg-moss-950/80 border border-emerald-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-amber-400/50 transition-all"
                >
                  <div className="flex items-center gap-4 sm:gap-5">
                    <span className="font-pixel text-2xl sm:text-3xl font-black text-amber-400 w-10 text-center drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">
                      {rank}
                    </span>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-pixel text-base sm:text-lg text-white font-bold">{name}</span>
                        <span className="text-xs text-slate-400 font-pixel">({title})</span>
                      </div>
                      <div className="text-xs font-pixel text-emerald-400 flex items-center gap-1.5 mt-1">
                        <PixelTrophy rank={rankNum} size={15} /> {badgeLabel}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 self-end sm:self-auto text-right">
                    <div>
                      <span className="font-pixel text-sm sm:text-base text-amber-300 font-bold block">{xp.toLocaleString()} XP</span>
                      <span className="text-xs text-slate-400 font-pixel">{bugs} bugs resolved</span>
                    </div>
                    <div className="text-xs font-pixel text-slate-300 flex items-center gap-1.5 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
                      <Flame size={14} className="text-amber-500 fill-amber-500" /> {streak}d Streak
                    </div>
                  </div>
                </div>
              ))}

              {/* Locked Player Entry Placeholder */}
              <div className="p-5 sm:p-6 rounded-xl bg-amber-500/10 border-2 border-dashed border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-5">
                <div className="flex items-center gap-4 text-center sm:text-left">
                  <span className="font-pixel text-2xl font-bold text-slate-500 w-10 text-center">
                    #???
                  </span>
                  <div>
                    <div className="font-pixel text-sm sm:text-base text-amber-300 font-bold">
                      YOUR EXPLORER HANDLE COULD BE HERE
                    </div>
                    <div className="text-xs sm:text-sm text-slate-300 mt-0.5">
                      Log in or create a player profile to claim your verified leaderboard rank and track your daily streak.
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <Link to="/login" className="btn-primary text-xs sm:text-sm font-pixel py-2.5 px-6">
                    CLAIM YOUR RANK
                  </Link>
                  <Link to="/register" className="btn-arcade text-xs sm:text-sm font-pixel py-2.5 px-5">
                    SIGN UP
                  </Link>
                </div>
              </div>
            </div>
          </StoneContainer>
        </section>

        {/* ── CTA Shrine Banner ────────────────────────────────────────────── */}
        <section className="py-24 px-4">
          <StoneContainer className="max-w-4xl mx-auto text-center p-10 sm:p-16 border-2 border-emerald-500/40" hoverGlow="amber">
            <Shield size={54} className="text-amber-400 mx-auto mb-5 animate-float drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]" />
            <h2 className="font-pixel text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 tracking-wide">
              READY TO ENTER THE TEMPLE?
            </h2>
            <p className="text-slate-200 text-base sm:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Create a free player account to preserve your XP relics, unlock secret quest sanctuaries, collect badges, debug real incidents, and climb the leaderboard.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/register" className="btn-primary font-pixel text-base sm:text-lg px-10 py-4 inline-flex items-center gap-2.5 shadow-amber-glow">
                CREATE PLAYER ACCOUNT <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn-arcade font-pixel text-sm sm:text-base px-8 py-4 inline-flex items-center gap-2">
                LOG IN TO EXISTING PROFILE <LogIn size={18} />
              </Link>
            </div>
          </StoneContainer>
        </section>
      </div>
    </div>
  );
}
