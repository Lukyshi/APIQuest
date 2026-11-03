import React from 'react';

/**
 * ConceptDiagrams — Animated, Glow-Enhanced, Color-Coded Architecture Visualizations
 * Features:
 * - Traveling packet animations (<animateMotion>) along request/response connectors
 * - Marching-ants dashed connector lines showing flow direction
 * - Soft organic breathing glow around component nodes with staggered offsets
 * - Spotlight sweeps for structured data breakdowns (JWT, SOAP Envelope, RFC 7807)
 * - Semantic color coding: Amber (Requests), Emerald (Responses), Indigo (Routing/Resolvers), Rose (Errors)
 * - Full prefers-reduced-motion support
 */

// ─── Shared Styles & Animation Keyframes ──────────────────────────────────────
const SVG_STYLES = `
  @keyframes marchForward {
    from { stroke-dashoffset: 20; }
    to { stroke-dashoffset: 0; }
  }
  @keyframes marchBackward {
    from { stroke-dashoffset: 0; }
    to { stroke-dashoffset: 20; }
  }
  @keyframes boxBreathe {
    0%, 100% { opacity: 0.18; transform: scale(1); }
    50% { opacity: 0.45; transform: scale(1.02); }
  }
  @keyframes spotlightFade1 {
    0%, 30% { opacity: 1; filter: drop-shadow(0 0 6px rgba(245, 158, 11, 0.8)); }
    33%, 100% { opacity: 0.45; filter: none; }
  }
  @keyframes spotlightFade2 {
    0%, 30% { opacity: 0.45; filter: none; }
    33%, 63% { opacity: 1; filter: drop-shadow(0 0 6px rgba(52, 211, 153, 0.8)); }
    66%, 100% { opacity: 0.45; filter: none; }
  }
  @keyframes spotlightFade3 {
    0%, 63% { opacity: 0.45; filter: none; }
    66%, 96% { opacity: 1; filter: drop-shadow(0 0 6px rgba(244, 63, 94, 0.8)); }
    100% { opacity: 0.45; filter: none; }
  }
  .march-fwd {
    stroke-dasharray: 5 4;
    animation: marchForward 1.2s linear infinite;
  }
  .march-rev {
    stroke-dasharray: 5 4;
    animation: marchBackward 1.2s linear infinite;
  }
  .glow-pulse-1 { animation: boxBreathe 3.2s ease-in-out infinite; }
  .glow-pulse-2 { animation: boxBreathe 3.2s ease-in-out 0.8s infinite; }
  .glow-pulse-3 { animation: boxBreathe 3.2s ease-in-out 1.6s infinite; }
  .glow-pulse-4 { animation: boxBreathe 3.2s ease-in-out 2.4s infinite; }
  .spotlight-1 { animation: spotlightFade1 4.5s ease-in-out infinite; }
  .spotlight-2 { animation: spotlightFade2 4.5s ease-in-out infinite; }
  .spotlight-3 { animation: spotlightFade3 4.5s ease-in-out infinite; }

  @media (prefers-reduced-motion: reduce) {
    .march-fwd, .march-rev, .glow-pulse-1, .glow-pulse-2, .glow-pulse-3, .glow-pulse-4,
    .spotlight-1, .spotlight-2, .spotlight-3 {
      animation: none !important;
    }
    animateMotion, animate {
      display: none !important;
    }
  }
`;

// ─── SVG Wrappers & Building Blocks ───────────────────────────────────────────

function SVGWrap({ w = 540, h = 210, children }) {
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" style={{ maxHeight: h * 1.5, shapeRendering: 'geometricPrecision' }}>
      <defs>
        <style>{SVG_STYLES}</style>
        {/* Markers */}
        <marker id="arr-amber" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#f59e0b" />
        </marker>
        <marker id="arr-emerald" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#34d399" />
        </marker>
        <marker id="arr-indigo" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#818cf8" />
        </marker>
        <marker id="arr-rose" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#f43f5e" />
        </marker>
        <marker id="arr-slate" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#64748b" />
        </marker>

        {/* Glow Filters */}
        <filter id="glow-p" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Background Frame */}
      <rect width={w} height={h} fill="#070e09" rx="8" stroke="rgba(52,211,153,0.15)" strokeWidth="1" />
      {children}
    </svg>
  );
}

// Glowing Component Box
function NodeBox({
  x, y, w, h,
  title, subtitle, extra,
  stroke = '#10b981', fill = '#0f1c13',
  pulseClass = 'glow-pulse-1',
  rx = 5
}) {
  return (
    <g>
      {/* Soft Breathing Ambient Glow */}
      <rect
        x={x - 2} y={y - 2} width={w + 4} height={h + 4}
        rx={rx + 2}
        fill={stroke}
        opacity={0.25}
        className={`box-glow ${pulseClass}`}
        style={{ transformOrigin: `${x + w / 2}px ${y + h / 2}px` }}
      />
      {/* Solid Stone Node Box */}
      <rect x={x} y={y} width={w} height={h} rx={rx} fill={fill} stroke={stroke} strokeWidth={1.5} />
      {/* Label & Subtitle */}
      {title && (
        <text
          x={x + w / 2}
          y={subtitle ? y + h * 0.42 : y + h * 0.58}
          fontSize={8.5}
          fill={stroke}
          fontWeight="bold"
          textAnchor="middle"
          fontFamily="monospace"
        >
          {title}
        </text>
      )}
      {subtitle && (
        <text
          x={x + w / 2}
          y={extra ? y + h * 0.65 : y + h * 0.76}
          fontSize={6.8}
          fill="#94a3b8"
          textAnchor="middle"
          fontFamily="monospace"
        >
          {subtitle}
        </text>
      )}
      {extra && (
        <text
          x={x + w / 2}
          y={y + h * 0.88}
          fontSize={6.5}
          fill="#64748b"
          textAnchor="middle"
          fontFamily="monospace"
        >
          {extra}
        </text>
      )}
    </g>
  );
}

// Flow Connector with Marching Ants & Continuous Traveling Packet
function FlowConnector({
  x1, y1, x2, y2,
  color = '#f59e0b',
  packetColor = '#fbbf24',
  marker = 'arr-amber',
  label = '',
  labelYOffset = -6,
  dur = '2s',
  packetRadius = 3,
  reverse = false,
  labelColor = '#fbbf24'
}) {
  const pathData = `M ${x1} ${y1} L ${x2} ${y2}`;
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  return (
    <g>
      {/* Base Marching-Ants Flow Line */}
      <path
        d={pathData}
        stroke={color}
        strokeWidth={1.5}
        fill="none"
        markerEnd={`url(#${marker})`}
        className={reverse ? 'march-rev' : 'march-fwd'}
      />

      {/* Traveling Data Packet */}
      <circle r={packetRadius} fill={packetColor} filter="url(#glow-p)" opacity={0.95}>
        <animateMotion
          path={pathData}
          dur={dur}
          repeatCount="indefinite"
          keyPoints={reverse ? '1;0' : '0;1'}
          keyTimes="0;1"
        />
      </circle>

      {/* Optional Flow Label */}
      {label && (
        <text
          x={midX}
          y={midY + labelYOffset}
          fontSize={6.8}
          fill={labelColor}
          textAnchor="middle"
          fontFamily="monospace"
          fontWeight="bold"
        >
          {label}
        </text>
      )}
    </g>
  );
}

const TXT = ({ x, y, text, size = 9, fill = '#f1f5f9', anchor = 'middle', weight = 'normal', family = 'monospace' }) => (
  <text x={x} y={y} fontSize={size} fill={fill} textAnchor={anchor} fontWeight={weight} fontFamily={family}>{text}</text>
);

// ─── 1. REST Architecture ─────────────────────────────────────────────────────
export function RestDiagram() {
  return (
    <SVGWrap w={540} h={210}>
      <TXT x={270} y={18} text="REST Request / Response Cycle with Status Codes" size={9} fill="#34d399" weight="bold" />

      {/* 1. Client Node */}
      <NodeBox
        x={12} y={65} w={95} h={70}
        title="CLIENT" subtitle="Browser / App" extra="Stateful UI"
        stroke="#f59e0b" fill="#122016" pulseClass="glow-pulse-1"
      />

      {/* Outgoing HTTP Request Flow */}
      <FlowConnector
        x1={107} y1={85} x2={185} y2={85}
        color="#f59e0b" packetColor="#fbbf24" marker="arr-amber"
        label="GET /users/42" labelYOffset={-7} dur="1.8s"
      />

      {/* Incoming HTTP Response Flow */}
      <FlowConnector
        x1={185} y1={115} x2={107} y2={115}
        color="#10b981" packetColor="#34d399" marker="arr-emerald"
        label="200 OK {id: 42}" labelYOffset={12} dur="1.8s" reverse={true} labelColor="#34d399"
      />

      {/* 2. API Gateway Node */}
      <NodeBox
        x={185} y={55} w={110} h={88}
        title="REST GATEWAY" subtitle="Routes &amp; Auth" extra="Rate Limiting"
        stroke="#818cf8" fill="#101827" pulseClass="glow-pulse-2"
      />

      {/* Gateway -> Controller */}
      <FlowConnector
        x1={295} y1={95} x2={348} y2={95}
        color="#818cf8" packetColor="#a5b4fc" marker="arr-indigo"
        label="Dispatch" labelYOffset={-7} dur="1.4s" labelColor="#a5b4fc"
      />

      {/* 3. Controller / Service Node */}
      <NodeBox
        x={348} y={65} w={95} h={70}
        title="CONTROLLER" subtitle="Business Logic" extra="JSON Parser"
        stroke="#fbbf24" fill="#1b2315" pulseClass="glow-pulse-3"
      />

      {/* Controller -> DB */}
      <FlowConnector
        x1={443} y1={95} x2={475} y2={95}
        color="#10b981" packetColor="#34d399" marker="arr-emerald"
        dur="1.2s"
      />

      {/* 4. Database Node */}
      <NodeBox
        x={475} y={70} w={53} h={60}
        title="DB" subtitle="SQL / NoSQL"
        stroke="#34d399" fill="#0c1f14" pulseClass="glow-pulse-4"
      />

      {/* Bottom Protocol Summary */}
      <rect x={12} y={170} width={516} height={26} rx={4} fill="#0d1811" stroke="rgba(52,211,153,0.2)" />
      <TXT
        x={270} y={187}
        text="Verbs: GET (safe/idempotent) · POST · PUT · PATCH · DELETE  |  Status: 200 OK · 201 Created · 400 · 401 · 404 · 500"
        size={6.8} fill="#94a3b8"
      />
    </SVGWrap>
  );
}

// ─── 2. SOAP Architecture ─────────────────────────────────────────────────────
export function SoapDiagram() {
  return (
    <SVGWrap w={540} h={220}>
      <TXT x={270} y={18} text="SOAP XML Envelope &amp; WSDL Validation Flow" size={9} fill="#34d399" weight="bold" />

      {/* 1. Client Node */}
      <NodeBox
        x={12} y={40} w={95} h={130}
        title="SOAP CLIENT" subtitle="Generates XML" extra="WSDL Bound"
        stroke="#f59e0b" fill="#142217" pulseClass="glow-pulse-1"
      />

      {/* 2. Structured SOAP Envelope with Spotlight Animation */}
      <g>
        <rect x={125} y={35} width={150} height={140} rx={6} fill="#0b1710" stroke="#334155" strokeWidth={1.5} />
        <TXT x={200} y={52} text="SOAP ENVELOPE (XML)" size={8} fill="#94a3b8" weight="bold" />

        {/* Header Block - Spotlight 1 */}
        <g className="spotlight-1">
          <rect x={133} y={60} width={134} height={26} rx={4} fill="#18231c" stroke="#f59e0b" strokeWidth={1.2} />
          <TXT x={200} y={76} text="<soap:Header> WS-Security" size={7} fill="#fbbf24" weight="bold" />
        </g>

        {/* Body Block - Spotlight 2 */}
        <g className="spotlight-2">
          <rect x={133} y={92} width={134} height={42} rx={4} fill="#13241b" stroke="#34d399" strokeWidth={1.2} />
          <TXT x={200} y={108} text="<soap:Body> Request" size={7} fill="#34d399" weight="bold" />
          <TXT x={200} y={124} text="<web:TransferFunds>" size={6.5} fill="#6ee7b7" />
        </g>

        {/* Fault Block - Spotlight 3 */}
        <g className="spotlight-3">
          <rect x={133} y={140} width={134} height={26} rx={4} fill="#231317" stroke="#f43f5e" strokeWidth={1.2} />
          <TXT x={200} y={156} text="<soap:Fault> Error Details" size={7} fill="#fda4af" />
        </g>
      </g>

      {/* Client -> Envelope flow */}
      <FlowConnector
        x1={107} y1={95} x2={125} y2={95}
        color="#f59e0b" packetColor="#fbbf24" marker="arr-amber" dur="1.2s"
      />

      {/* Envelope -> Server flow */}
      <FlowConnector
        x1={275} y1={95} x2={345} y2={95}
        color="#f59e0b" packetColor="#fbbf24" marker="arr-amber"
        label="HTTP POST /ws" labelYOffset={-7} dur="1.8s"
      />

      {/* 3. SOAP Server Node */}
      <NodeBox
        x={345} y={40} w={105} h={130}
        title="SOAP SERVER" subtitle="Validates XSD" extra="Runs Operation"
        stroke="#818cf8" fill="#121a2c" pulseClass="glow-pulse-2"
      />

      {/* 4. WSDL Contract Badge */}
      <NodeBox
        x={465} y={65} w={65} h={80}
        title="WSDL" subtitle="Strict" extra="Contract"
        stroke="#34d399" fill="#0d2417" pulseClass="glow-pulse-3"
      />

      {/* Server <-> WSDL Validation */}
      <FlowConnector
        x1={450} y1={100} x2={465} y2={100}
        color="#34d399" packetColor="#6ee7b7" marker="arr-emerald" dur="1.5s"
      />

      {/* Response back to client */}
      <FlowConnector
        x1={345} y1={135} x2={275} y2={135}
        color="#10b981" packetColor="#34d399" marker="arr-emerald"
        dur="1.5s" reverse={true}
      />

      {/* Legend */}
      <TXT
        x={270} y={205}
        text="Strict XML Envelopes · WS-Security Signatures · Mandatory WSDL Schema Validation"
        size={6.8} fill="#64748b"
      />
    </SVGWrap>
  );
}

// ─── 3. GraphQL Architecture ──────────────────────────────────────────────────
export function GraphqlDiagram() {
  return (
    <SVGWrap w={540} h={225}>
      <TXT x={270} y={18} text="GraphQL: Single Endpoint with Concurrent Resolver Streams" size={9} fill="#34d399" weight="bold" />

      {/* 1. Multiple Client Nodes */}
      {[
        { label: 'Mobile App', y: 35 },
        { label: 'Web React', y: 90 },
        { label: 'Admin Deck', y: 145 },
      ].map(({ label, y }, i) => (
        <NodeBox
          key={label}
          x={12} y={y} w={85} h={42}
          title={label} subtitle="GraphQL Client"
          stroke="#f59e0b" fill="#142217"
          pulseClass={`glow-pulse-${(i % 3) + 1}`}
        />
      ))}

      {/* Client -> Single Endpoint Flows */}
      <FlowConnector x1={97} y1={56} x2={165} y2={100} color="#f59e0b" packetColor="#fbbf24" marker="arr-amber" dur="1.8s" />
      <FlowConnector x1={97} y1={111} x2={165} y2={111} color="#f59e0b" packetColor="#fbbf24" marker="arr-amber" dur="1.5s" />
      <FlowConnector x1={97} y1={166} x2={165} y2={122} color="#f59e0b" packetColor="#fbbf24" marker="arr-amber" dur="2.1s" />

      {/* 2. Single POST /graphql Endpoint */}
      <NodeBox
        x={165} y={75} w={125} h={75}
        title="POST /graphql" subtitle="Single Endpoint" extra="Schema &amp; Resolvers"
        stroke="#34d399" fill="#0d2417" pulseClass="glow-pulse-2"
      />

      {/* Resolvers Branching to Multiple DBs */}
      <FlowConnector x1={290} y1={95} x2={335} y2={55} color="#818cf8" packetColor="#a5b4fc" marker="arr-indigo" dur="1.4s" />
      <FlowConnector x1={290} y1={112} x2={335} y2={112} color="#10b981" packetColor="#34d399" marker="arr-emerald" dur="1.6s" />
      <FlowConnector x1={290} y1={130} x2={335} y2={165} color="#fbbf24" packetColor="#fde68a" marker="arr-amber" dur="1.8s" />

      {/* 3. Microservices / Resolver Targets */}
      <NodeBox x={335} y={35} w={85} h={40} title="Users DB" subtitle="resolveUser()" stroke="#818cf8" fill="#121a2c" />
      <NodeBox x={335} y={92} w={85} h={40} title="Posts DB" subtitle="resolvePosts()" stroke="#34d399" fill="#0c1f14" />
      <NodeBox x={335} y={148} w={85} h={40} title="Auth SVC" subtitle="DataLoader" stroke="#fbbf24" fill="#1e2213" />

      {/* 4. Query Payload Showcase */}
      <g>
        <rect x={432} y={35} width={96} height={153} rx={5} fill="#09140c" stroke="#334155" />
        <TXT x={480} y={52} text="EXACT QUERY" size={7.5} fill="#34d399" weight="bold" />
        <TXT x={440} y={68} text="query {" size={6.8} fill="#94a3b8" anchor="start" />
        <TXT x={446} y={82} text="user(id:1) {" size={6.8} fill="#fbbf24" anchor="start" />
        <TXT x={454} y={96} text="username" size={6.8} fill="#34d399" anchor="start" />
        <TXT x={454} y={110} text="badges {" size={6.8} fill="#818cf8" anchor="start" />
        <TXT x={462} y={124} text="name" size={6.8} fill="#fbbf24" anchor="start" />
        <TXT x={454} y={138} text="}" size={6.8} fill="#818cf8" anchor="start" />
        <TXT x={446} y={152} text="}" size={6.8} fill="#fbbf24" anchor="start" />
        <TXT x={440} y={166} text="}" size={6.8} fill="#94a3b8" anchor="start" />
        <TXT x={480} y={180} text="Zero Over-fetching" size={6} fill="#34d399" />
      </g>

      <TXT
        x={270} y={212}
        text="Single POST Endpoint · Strongly Typed SDL · Exact Field Selections · DataLoader Caching"
        size={6.8} fill="#64748b"
      />
    </SVGWrap>
  );
}

// ─── 4. Auth & JWT Architecture ───────────────────────────────────────────────
export function AuthDiagram() {
  return (
    <SVGWrap w={540} h={230}>
      <TXT x={270} y={18} text="JWT Authentication &amp; Token Verification Flow" size={9} fill="#34d399" weight="bold" />

      {/* 1. Client Node */}
      <NodeBox
        x={12} y={35} w={90} h={110}
        title="CLIENT" subtitle="Browser / App" extra="HttpOnly Storage"
        stroke="#f59e0b" fill="#142217" pulseClass="glow-pulse-1"
      />

      {/* Step 1: POST /login */}
      <FlowConnector
        x1={102} y1={55} x2={185} y2={55}
        color="#f59e0b" packetColor="#fbbf24" marker="arr-amber"
        label="1. POST /login" labelYOffset={-6} dur="1.8s"
      />

      {/* 2. Auth Server Node */}
      <NodeBox
        x={185} y={35} w={110} h={50}
        title="AUTH SERVER" subtitle="Verify &amp; Sign JWT"
        stroke="#818cf8" fill="#121a2c" pulseClass="glow-pulse-2"
      />

      {/* Return Tokens Flow */}
      <FlowConnector
        x1={185} y1={72} x2={102} y2={72}
        color="#10b981" packetColor="#34d399" marker="arr-emerald"
        label="access + refresh tokens" labelYOffset={12} dur="1.8s" reverse={true} labelColor="#34d399"
      />

      {/* Step 2: Request with Bearer Token */}
      <FlowConnector
        x1={102} y1={120} x2={185} y2={120}
        color="#f59e0b" packetColor="#fbbf24" marker="arr-amber"
        label="2. Bearer {token}" labelYOffset={-6} dur="1.8s"
      />

      {/* 3. Resource API Node */}
      <NodeBox
        x={185} y={100} w={110} h={45}
        title="RESOURCE API" subtitle="Verifies Signature"
        stroke="#34d399" fill="#0d2417" pulseClass="glow-pulse-3"
      />

      {/* Resource API -> Protected DB */}
      <FlowConnector
        x1={295} y1={122} x2={365} y2={122}
        color="#10b981" packetColor="#34d399" marker="arr-emerald"
        label="Grant Access" labelYOffset={-6} dur="1.4s" labelColor="#34d399"
      />

      {/* 4. Protected Resource Node */}
      <NodeBox
        x={365} y={100} w={160} h={45}
        title="PROTECTED RESOURCE" subtitle="User Invoices &amp; Profile"
        stroke="#34d399" fill="#0f2619" pulseClass="glow-pulse-4"
      />

      {/* 5. JWT Structure Spotlight Breakdown */}
      <g>
        <rect x={12} y={160} width={516} height={55} rx={6} fill="#09140c" stroke="#334155" strokeWidth={1} />
        <TXT x={270} y={174} text="JWT STRUCTURE: [Header].[Payload].[Signature]" size={7.5} fill="#94a3b8" weight="bold" />

        {/* Header Block - Spotlight 1 */}
        <g className="spotlight-1">
          <rect x={20} y={182} width={155} height={25} rx={3} fill="#1c1912" stroke="#f59e0b" strokeWidth={1.2} />
          <TXT x={97} y={198} text='{"alg":"HS256","typ":"JWT"}' size={7} fill="#fbbf24" />
        </g>

        {/* Payload Block - Spotlight 2 */}
        <g className="spotlight-2">
          <rect x={185} y={182} width={170} height={25} rx={3} fill="#112217" stroke="#34d399" strokeWidth={1.2} />
          <TXT x={270} y={198} text='{"sub":"usr_42","exp":1773000}' size={7} fill="#34d399" />
        </g>

        {/* Signature Block - Spotlight 3 */}
        <g className="spotlight-3">
          <rect x={365} y={182} width={155} height={25} rx={3} fill="#231317" stroke="#f43f5e" strokeWidth={1.2} />
          <TXT x={442} y={198} text="HMACSHA256(header+payload, key)" size={6.5} fill="#fda4af" />
        </g>
      </g>
    </SVGWrap>
  );
}

// ─── 5. Pagination Architecture ───────────────────────────────────────────────
export function PaginationDiagram() {
  return (
    <SVGWrap w={540} h={210}>
      <TXT x={270} y={18} text="Offset-Based vs Cursor-Based Pagination Mechanics" size={9} fill="#34d399" weight="bold" />

      {/* Top: Offset Pagination */}
      <TXT x={95} y={38} text="OFFSET-BASED: ?page=2&amp;limit=2" size={7.5} fill="#fbbf24" weight="bold" anchor="start" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
        const isTarget = i === 2 || i === 3;
        const isScanned = i < 2;
        return (
          <g key={i}>
            <rect
              x={20 + i * 50} y={45} width={42} height={28} rx={4}
              fill={isTarget ? '#1f2e16' : isScanned ? '#251b14' : '#0e1711'}
              stroke={isTarget ? '#fbbf24' : isScanned ? '#f59e0b' : '#334155'}
              strokeWidth={isTarget ? 1.5 : 1}
            />
            <TXT
              x={41 + i * 50} y={63}
              text={`#${i + 1}`}
              size={8}
              fill={isTarget ? '#fbbf24' : isScanned ? '#f97316' : '#94a3b8'}
              weight={isTarget ? 'bold' : 'normal'}
            />
          </g>
        );
      })}

      {/* Offset Scan Line with Marching Packet */}
      <FlowConnector
        x1={20} y1={80} x2={120} y2={80}
        color="#f97316" packetColor="#fb923c" marker="arr-rose"
        label="⚠ Full Table Scan of Previous Rows (Slow on Deep Pages)" labelYOffset={12} dur="2s" labelColor="#f97316"
      />

      {/* Bottom: Cursor Pagination */}
      <TXT x={95} y={125} text="CURSOR-BASED: ?after=id_1042&amp;limit=3" size={7.5} fill="#34d399" weight="bold" anchor="start" />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const isCursorTarget = i >= 2 && i <= 4;
        return (
          <g key={i}>
            <rect
              x={20 + i * 85} y={135} width={76} height={30} rx={4}
              fill={isCursorTarget ? '#0d281a' : '#0e1711'}
              stroke={isCursorTarget ? '#34d399' : '#334155'}
              strokeWidth={isCursorTarget ? 1.5 : 1}
            />
            <TXT
              x={58 + i * 85} y={154}
              text={`item_${1040 + i}`}
              size={7.5}
              fill={isCursorTarget ? '#6ee7b7' : '#94a3b8'}
              weight={isCursorTarget ? 'bold' : 'normal'}
            />
          </g>
        );
      })}

      {/* Cursor Direct Jump Flow */}
      <FlowConnector
        x1={190} y1={175} x2={275} y2={175}
        color="#10b981" packetColor="#34d399" marker="arr-emerald"
        label="✓ Instant O(1) Index Seek (Immune to Insertions/Deletions)" labelYOffset={14} dur="1.4s" labelColor="#34d399"
      />
    </SVGWrap>
  );
}

// ─── 6. Rate Limiting Architecture ────────────────────────────────────────────
export function RateLimitDiagram() {
  return (
    <SVGWrap w={540} h={220}>
      <TXT x={270} y={18} text="Token Bucket &amp; Sliding Window Rate Limiting" size={9} fill="#34d399" weight="bold" />

      {/* 1. Continuous Refill Stream */}
      <NodeBox x={12} y={35} w={110} h={55} title="TOKEN REFILL" subtitle="+10 Tokens / Sec" stroke="#818cf8" fill="#121a2c" pulseClass="glow-pulse-1" />

      {/* Refill -> Bucket Stream */}
      <FlowConnector
        x1={122} y1={62} x2={190} y2={62}
        color="#818cf8" packetColor="#a5b4fc" marker="arr-indigo"
        label="Refill Flow" labelYOffset={-6} dur="1.2s" labelColor="#a5b4fc"
      />

      {/* 2. Token Bucket Storage */}
      <g>
        <rect x={190} y={30} width={130} height={130} rx={6} fill="#0d1b12" stroke="#34d399" strokeWidth={1.8} />
        <TXT x={255} y={48} text="TOKEN BUCKET (Max 100)" size={7.5} fill="#34d399" weight="bold" />

        {/* Animated Tokens in Bucket */}
        {[
          [205, 60], [228, 60], [251, 60], [274, 60], [297, 60],
          [205, 80], [228, 80], [251, 80], [274, 80], [297, 80],
          [205, 100], [228, 100], [251, 100], [274, 100], [297, 100],
        ].map(([tx, ty], i) => (
          <rect
            key={i} x={tx} y={ty} width={18} height={12} rx={2}
            fill="#34d399" opacity={0.75}
          />
        ))}
        <TXT x={255} y={145} text="Capacity: 87 / 100 Available" size={6.8} fill="#94a3b8" />
      </g>

      {/* 3. Incoming Client Requests */}
      <NodeBox x={12} y={115} w={110} h={55} title="CLIENT CALLS" subtitle="Burst Traffic" stroke="#f59e0b" fill="#182315" pulseClass="glow-pulse-2" />

      {/* Client -> Bucket Inspection */}
      <FlowConnector
        x1={122} y1={142} x2={190} y2={142}
        color="#f59e0b" packetColor="#fbbf24" marker="arr-amber"
        label="Consume 1 Token" labelYOffset={-6} dur="1.4s"
      />

      {/* 4A. Allowed Path (Token Available) */}
      <FlowConnector
        x1={320} y1={65} x2={400} y2={65}
        color="#10b981" packetColor="#34d399" marker="arr-emerald"
        label="200 OK (Allowed)" labelYOffset={-6} dur="1.5s" labelColor="#34d399"
      />
      <NodeBox x={400} y={45} w={125} h={40} title="API EXECUTION" subtitle="Process Request" stroke="#34d399" fill="#0d2417" />

      {/* 4B. Throttled Path (Bucket Empty) */}
      <FlowConnector
        x1={320} y1={130} x2={400} y2={130}
        color="#f43f5e" packetColor="#fda4af" marker="arr-rose"
        label="Bucket Empty" labelYOffset={-6} dur="1.5s" labelColor="#f43f5e"
      />
      <NodeBox x={400} y={110} w={125} h={55} title="429 TOO MANY" subtitle="Retry-After: 30s" extra="RateLimit-Reset" stroke="#f43f5e" fill="#231216" />

      {/* Bottom Header Standards */}
      <TXT
        x={270} y={200}
        text="Headers: RateLimit-Limit · RateLimit-Remaining · RateLimit-Reset · Retry-After"
        size={6.8} fill="#64748b"
      />
    </SVGWrap>
  );
}

// ─── 7. Security & Threat Protection Architecture ─────────────────────────────
export function SecurityDiagram() {
  return (
    <SVGWrap w={540} h={210}>
      <TXT x={270} y={18} text="Defense-in-Depth API Security Layer Pipeline" size={9} fill="#34d399" weight="bold" />

      {/* Pipeline Stages */}
      {[
        { title: '1. TLS 1.3', sub: 'HSTS Transport', color: '#34d399', x: 12 },
        { title: '2. WAF / CORS', sub: 'Origin Lock', color: '#818cf8', x: 118 },
        { title: '3. AUTH (JWT)', sub: 'Identity Check', color: '#f59e0b', x: 224 },
        { title: '4. BOLA GUARD', sub: 'Object AuthZ', color: '#34d399', x: 330 },
        { title: '5. SANITIZE', sub: 'SQL Injection', color: '#818cf8', x: 436 },
      ].map(({ title, sub, color, x }, i) => (
        <NodeBox
          key={title}
          x={x} y={55} w={92} h={75}
          title={title} subtitle={sub} extra="Active Shield"
          stroke={color} fill="#0d1911"
          pulseClass={`glow-pulse-${(i % 4) + 1}`}
        />
      ))}

      {/* Connectors between pipeline layers */}
      <FlowConnector x1={104} y1={92} x2={118} y2={92} color="#34d399" packetColor="#6ee7b7" marker="arr-emerald" dur="1.2s" />
      <FlowConnector x1={210} y1={92} x2={224} y2={92} color="#818cf8" packetColor="#a5b4fc" marker="arr-indigo" dur="1.2s" />
      <FlowConnector x1={316} y1={92} x2={330} y2={92} color="#f59e0b" packetColor="#fbbf24" marker="arr-amber" dur="1.2s" />
      <FlowConnector x1={422} y1={92} x2={436} y2={92} color="#34d399" packetColor="#6ee7b7" marker="arr-emerald" dur="1.2s" />

      {/* Bottom Summary Banner */}
      <rect x={12} y={155} width={516} height={38} rx={4} fill="#0b1710" stroke="rgba(52,211,153,0.2)" />
      <TXT
        x={270} y={172}
        text="OWASP API Top 10 Protections: BOLA (Broken Object Level Auth) · Broken AuthN · BOPLA · Mass Assignment"
        size={6.8} fill="#94a3b8"
      />
      <TXT
        x={270} y={185}
        text="Security Headers: X-Content-Type-Options: nosniff · X-Frame-Options: DENY · CSP: default-src 'none'"
        size={6.5} fill="#64748b"
      />
    </SVGWrap>
  );
}

// ─── 8. Webhooks Architecture ─────────────────────────────────────────────────
export function WebhooksDiagram() {
  return (
    <SVGWrap w={540} h={225}>
      <TXT x={270} y={18} text="Polling (Inefficient) vs Webhooks (Event-Driven Push)" size={9} fill="#34d399" weight="bold" />

      {/* Top Half: Polling Pull Model */}
      <TXT x={85} y={38} text="POLLING (Pull Model — 99% Wasted Calls)" size={7.5} fill="#f43f5e" weight="bold" anchor="start" />
      <NodeBox x={12} y={45} w={85} h={40} title="YOUR APP" subtitle="Poll every 5s" stroke="#f43f5e" fill="#201115" />

      <FlowConnector
        x1={97} y1={58} x2={220} y2={58}
        color="#f43f5e" packetColor="#fda4af" marker="arr-rose"
        label="GET /orders/new" labelYOffset={-6} dur="1.8s" labelColor="#f43f5e"
      />
      <FlowConnector
        x1={220} y1={72} x2={97} y2={72}
        color="#64748b" packetColor="#94a3b8" marker="arr-slate"
        label='"No new orders" × 2,880/day' labelYOffset={11} dur="1.8s" reverse={true} labelColor="#64748b"
      />

      <NodeBox x={220} y={45} w={85} h={40} title="STRIPE / GITHUB" subtitle="Provider" stroke="#64748b" fill="#141915" />

      {/* Bottom Half: Webhook Push Model */}
      <TXT x={85} y={118} text="WEBHOOKS (Push Model — Sub-Second Event Dispatch)" size={7.5} fill="#34d399" weight="bold" anchor="start" />
      <NodeBox x={12} y={125} w={95} h={70} title="YOUR APP" subtitle="POST /webhooks" extra="Idempotent Store" stroke="#34d399" fill="#0d2417" pulseClass="glow-pulse-1" />

      {/* Instant Push Flow on Event */}
      <FlowConnector
        x1={220} y1={145} x2={107} y2={145}
        color="#10b981" packetColor="#34d399" marker="arr-emerald"
        label="POST event (instant on trigger)" labelYOffset={-7} dur="1.4s" reverse={true} labelColor="#34d399"
      />
      <FlowConnector
        x1={107} y1={172} x2={220} y2={172}
        color="#34d399" packetColor="#6ee7b7" marker="arr-emerald"
        label="200 OK (Immediate ack)" labelYOffset={12} dur="1.4s" labelColor="#34d399"
      />

      <NodeBox x={220} y={125} w={95} h={70} title="PROVIDER" subtitle="Event Triggered" extra="Signs HMAC-SHA256" stroke="#f59e0b" fill="#1b2315" pulseClass="glow-pulse-2" />

      {/* HMAC Verification Spotlight Box */}
      <g className="spotlight-2">
        <rect x={335} y={125} width={193} height={70} rx={6} fill="#0f1f14" stroke="#34d399" strokeWidth={1.5} />
        <TXT x={431} y={142} text="HMAC SIGNATURE VERIFICATION" size={7.5} fill="#34d399" weight="bold" />
        <TXT x={345} y={158} text="Stripe-Signature: t=..., v1=hash" size={6.5} fill="#fbbf24" anchor="start" />
        <TXT x={345} y={172} text="timingSafeEqual(expected, received)" size={6.5} fill="#6ee7b7" anchor="start" />
        <TXT x={345} y={186} text="Prevents replay attacks &amp; forged events" size={6.2} fill="#94a3b8" anchor="start" />
      </g>
    </SVGWrap>
  );
}

// ─── 9. Error Handling Architecture ───────────────────────────────────────────
export function ErrorHandlingDiagram() {
  return (
    <SVGWrap w={540} h={230}>
      <TXT x={270} y={18} text="HTTP Status Code Taxonomy &amp; RFC 7807 Problem Details" size={9} fill="#34d399" weight="bold" />

      {/* 4 Status Code Category Boxes */}
      {[
        { range: '2xx', label: 'SUCCESS', codes: ['200 OK', '201 Created', '204 No Content'], color: '#34d399', x: 12 },
        { range: '3xx', label: 'REDIRECT', codes: ['301 Moved', '304 Not Modified'], color: '#818cf8', x: 142 },
        { range: '4xx', label: 'CLIENT ERROR', codes: ['400 Bad Req', '401 Unauth', '404 Not Found', '422 Unproc'], color: '#fbbf24', x: 272 },
        { range: '5xx', label: 'SERVER ERROR', codes: ['500 Internal', '502 Bad Gateway', '503 Unavail'], color: '#f43f5e', x: 402 },
      ].map(({ range, label, codes, color, x }, i) => (
        <g key={range}>
          <rect x={x} y={32} width={124} height={95} rx={5} fill="#0d1811" stroke={color} strokeWidth={1.3} className={`glow-pulse-${i + 1}`} />
          <TXT x={x + 62} y={50} text={range} size={13} fill={color} weight="bold" />
          <TXT x={x + 62} y={63} text={label} size={6.8} fill="#94a3b8" />
          {codes.map((c, idx) => (
            <TXT key={c} x={x + 10} y={78 + idx * 13} text={`• ${c}`} size={6.8} fill={color} anchor="start" />
          ))}
        </g>
      ))}

      {/* RFC 7807 Spotlight Breakdown */}
      <g>
        <rect x={12} y={138} width={514} height={75} rx={6} fill="#09140c" stroke="#334155" strokeWidth={1} />
        <TXT x={270} y={152} text="RFC 7807 PROBLEM DETAILS STANDARD (application/problem+json)" size={7.5} fill="#94a3b8" weight="bold" />

        {/* Part 1: Type & Title - Spotlight 1 */}
        <g className="spotlight-1">
          <rect x={20} y={160} width={155} height={42} rx={3} fill="#18231c" stroke="#f59e0b" strokeWidth={1.2} />
          <TXT x={28} y={176} text='"type": "https://api/err/422",' size={6.5} fill="#fbbf24" anchor="start" />
          <TXT x={28} y={190} text='"title": "Validation Failed"' size={6.5} fill="#fde68a" anchor="start" />
        </g>

        {/* Part 2: Status & Detail - Spotlight 2 */}
        <g className="spotlight-2">
          <rect x={185} y={160} width={160} height={42} rx={3} fill="#12241b" stroke="#34d399" strokeWidth={1.2} />
          <TXT x={193} y={176} text='"status": 422,' size={6.5} fill="#34d399" anchor="start" />
          <TXT x={193} y={190} text='"detail": "Invalid password length"' size={6.2} fill="#6ee7b7" anchor="start" />
        </g>

        {/* Part 3: TraceId & Errors - Spotlight 3 */}
        <g className="spotlight-3">
          <rect x={355} y={160} width={163} height={42} rx={3} fill="#231317" stroke="#f43f5e" strokeWidth={1.2} />
          <TXT x={363} y={176} text='"traceId": "req_902bf81a",' size={6.5} fill="#fda4af" anchor="start" />
          <TXT x={363} y={190} text='"invalidParams": [{"field":"pwd"}]' size={6.2} fill="#f43f5e" anchor="start" />
        </g>
      </g>
    </SVGWrap>
  );
}

// ─── Selector: Pick diagram by slug ──────────────────────────────────────────
const DIAGRAM_MAP = {
  'rest':           RestDiagram,
  'soap':           SoapDiagram,
  'graphql':        GraphqlDiagram,
  'auth':           AuthDiagram,
  'pagination':     PaginationDiagram,
  'rate-limiting':  RateLimitDiagram,
  'security':       SecurityDiagram,
  'webhooks':       WebhooksDiagram,
  'error-handling': ErrorHandlingDiagram,
};

export function ConceptDiagram({ slug }) {
  const Diagram = DIAGRAM_MAP[slug];
  if (!Diagram) return null;
  return (
    <div className="stone-card p-5 border-emerald-500/30 animate-slide-up">
      <div className="text-[11px] font-pixel text-emerald-400 mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-amber-400">⚡</span> LIVE ARCHITECTURE &amp; DATA FLOW
        </div>
        <div className="text-[9px] text-slate-400 font-sans flex items-center gap-2">
          <span className="inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" /> Outgoing Request</span>
          <span className="inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Response Data</span>
        </div>
      </div>
      <Diagram />
    </div>
  );
}
