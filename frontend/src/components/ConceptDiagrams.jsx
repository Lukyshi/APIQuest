import React from 'react';

// Shared pixel style helpers
const BOX = ({ x, y, w, h, fill = '#1d1d35', stroke = '#f59e0b', strokeW = 1.5, rx = 4 }) => (
  <rect x={x} y={y} width={w} height={h} rx={rx} fill={fill} stroke={stroke} strokeWidth={strokeW} />
);
const TXT = ({ x, y, text, size = 9, fill = '#f1f5f9', anchor = 'middle', weight = 'normal', family = 'monospace' }) => (
  <text x={x} y={y} fontSize={size} fill={fill} textAnchor={anchor} fontWeight={weight} fontFamily={family}>{text}</text>
);
const ARROW = ({ x1, y1, x2, y2, color = '#f59e0b' }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.5} markerEnd="url(#arr)" />
);
const DARR = ({ x1, y1, x2, y2, color = '#64748b' }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.5} strokeDasharray="4 3" markerEnd="url(#arr-gray)" />
);

function SVGWrap({ w = 520, h = 200, children }) {
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" style={{ maxHeight: h * 1.5, shapeRendering: 'crispEdges' }}>
      <defs>
        <marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#f59e0b" />
        </marker>
        <marker id="arr-gray" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#64748b" />
        </marker>
        <marker id="arr-green" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#34d399" />
        </marker>
      </defs>
      <rect width={w} height={h} fill="#0d0d12" rx="8" />
      {children}
    </svg>
  );
}

// ─── REST Architecture ────────────────────────────────────────────────────────
export function RestDiagram() {
  return (
    <SVGWrap w={520} h={200}>
      {/* Client */}
      <BOX x={10} y={75} w={90} h={50} fill="#1d1d35" stroke="#f59e0b" />
      <TXT x={55} y={97} text="CLIENT" size={9} fill="#f59e0b" weight="bold" />
      <TXT x={55} y={111} text="Browser/App" size={7} fill="#94a3b8" />

      {/* HTTP verbs */}
      <ARROW x1={100} y1={90} x2={175} y2={90} />
      <TXT x={138} y={85} text="GET /users/1" size={7} fill="#fbbf24" />
      <DARR x1={175} y1={110} x2={100} y2={110} color="#34d399" />
      <TXT x={138} y={122} text='200 OK { "id":1 }' size={7} fill="#34d399" />

      {/* API Gateway */}
      <BOX x={175} y={65} w={100} h={70} fill="#14141c" stroke="#6366f1" />
      <TXT x={225} y={87} text="REST API" size={9} fill="#818cf8" weight="bold" />
      <TXT x={225} y={101} text="Routes &amp; Auth" size={7} fill="#94a3b8" />
      <TXT x={225} y={115} text="Rate Limit" size={7} fill="#94a3b8" />

      <ARROW x1={275} y1={100} x2={330} y2={100} />

      {/* Controller / Service */}
      <BOX x={330} y={65} w={90} h={70} fill="#14141c" stroke="#f59e0b" />
      <TXT x={375} y={87} text="CONTROLLER" size={8} fill="#fbbf24" weight="bold" />
      <TXT x={375} y={101} text="Business" size={7} fill="#94a3b8" />
      <TXT x={375} y={113} text="Logic" size={7} fill="#94a3b8" />

      <ARROW x1={420} y1={100} x2={460} y2={100} />

      {/* DB */}
      <BOX x={460} y={75} w={50} h={50} fill="#14141c" stroke="#34d399" />
      <TXT x={485} y={97} text="DB" size={9} fill="#34d399" weight="bold" />
      <TXT x={485} y={111} text="SQL/No" size={7} fill="#94a3b8" />

      {/* HTTP verbs legend */}
      <TXT x={10} y={175} text="Verbs: GET · POST · PUT · PATCH · DELETE    Status: 200 · 201 · 204 · 400 · 401 · 404 · 500" size={7} fill="#64748b" anchor="start" />
    </SVGWrap>
  );
}

// ─── SOAP Architecture ───────────────────────────────────────────────────────
export function SoapDiagram() {
  return (
    <SVGWrap w={520} h={210}>
      <TXT x={260} y={18} text="SOAP Request/Response Flow" size={9} fill="#818cf8" weight="bold" />

      {/* Client */}
      <BOX x={10} y={35} w={90} h={140} fill="#1d1d35" stroke="#f59e0b" />
      <TXT x={55} y={56} text="CLIENT" size={9} fill="#f59e0b" weight="bold" />
      <TXT x={55} y={70} text="Generates" size={7} fill="#94a3b8" />
      <TXT x={55} y={82} text="XML Envelope" size={7} fill="#94a3b8" />

      {/* WSDL */}
      <BOX x={10} y={120} w={90} h={40} fill="#14141c" stroke="#6366f1" />
      <TXT x={55} y={137} text="WSDL" size={8} fill="#818cf8" weight="bold" />
      <TXT x={55} y={150} text="Contract" size={7} fill="#94a3b8" />

      {/* Envelope structure */}
      <BOX x={130} y={35} w={130} h={140} fill="#14141c" stroke="#64748b" />
      <TXT x={195} y={55} text="SOAP ENVELOPE" size={8} fill="#94a3b8" weight="bold" />
      <BOX x={138} y={62} w={114} h={25} fill="#1d1d35" stroke="#f59e0b" strokeW={1} />
      <TXT x={195} y={79} text="&lt;Header&gt; WS-Security" size={7} fill="#fbbf24" />
      <BOX x={138} y={92} w={114} h={25} fill="#1d1d35" stroke="#6366f1" strokeW={1} />
      <TXT x={195} y={109} text="&lt;Body&gt; Operation Call" size={7} fill="#818cf8" />
      <BOX x={138} y={122} w={114} h={44} fill="#1d1d35" stroke="#34d399" strokeW={1} />
      <TXT x={195} y={139} text="&lt;intA&gt;5&lt;/intA&gt;" size={7} fill="#34d399" />
      <TXT x={195} y={152} text="&lt;intB&gt;3&lt;/intB&gt;" size={7} fill="#34d399" />
      <TXT x={195} y={165} text="Result: 8" size={7} fill="#34d399" />

      <ARROW x1={260} y1={100} x2={310} y2={100} />
      <TXT x={285} y={93} text="HTTP POST" size={7} fill="#fbbf24" />

      {/* Server */}
      <BOX x={310} y={35} w={100} h={80} fill="#14141c" stroke="#6366f1" />
      <TXT x={360} y={56} text="SOAP SERVER" size={8} fill="#818cf8" weight="bold" />
      <TXT x={360} y={70} text="Parses XML" size={7} fill="#94a3b8" />
      <TXT x={360} y={82} text="Validates vs WSDL" size={7} fill="#94a3b8" />
      <TXT x={360} y={94} text="Runs Operation" size={7} fill="#94a3b8" />

      <DARR x1={310} y1={130} x2={270} y2={130} color="#34d399" />
      <TXT x={290} y={125} text="XML Response" size={7} fill="#34d399" />

      <TXT x={10} y={200} text="Always HTTP POST · Content-Type: text/xml · WS-Security for message-level encryption" size={7} fill="#64748b" anchor="start" />
    </SVGWrap>
  );
}

// ─── GraphQL Architecture ─────────────────────────────────────────────────────
export function GraphqlDiagram() {
  return (
    <SVGWrap w={520} h={220}>
      <TXT x={260} y={18} text="GraphQL: One Endpoint, Flexible Queries" size={9} fill="#818cf8" weight="bold" />

      {/* Multiple clients */}
      {[['Mobile', 30], ['Web App', 80], ['Dashboard', 130]].map(([label, y]) => (
        <g key={label}>
          <BOX x={10} y={y} w={75} h={30} fill="#1d1d35" stroke="#f59e0b" />
          <TXT x={47} y={y + 19} text={label} size={8} fill="#94a3b8" />
        </g>
      ))}

      {/* Lines to single endpoint */}
      {[45, 95, 145].map((y, i) => (
        <ARROW key={i} x1={85} y1={y} x2={165} y2={100} />
      ))}

      {/* Single /graphql endpoint */}
      <BOX x={165} y={70} w={110} h={60} fill="#14141c" stroke="#f59e0b" />
      <TXT x={220} y={90} text="POST /graphql" size={8} fill="#fbbf24" weight="bold" />
      <TXT x={220} y={104} text="Schema +SDL" size={7} fill="#94a3b8" />
      <TXT x={220} y={116} text="Resolver chain" size={7} fill="#94a3b8" />

      {/* Resolvers */}
      <ARROW x1={275} y1={100} x2={310} y2={65} />
      <ARROW x1={275} y1={100} x2={310} y2={100} />
      <ARROW x1={275} y1={100} x2={310} y2={135} />

      {[['Users DB', 50, '#34d399'], ['Posts DB', 85, '#34d399'], ['Auth SVC', 120, '#818cf8']].map(([label, y, color]) => (
        <g key={label}>
          <BOX x={310} y={y} w={90} h={28} fill="#14141c" stroke={color} />
          <TXT x={355} y={y + 17} text={label} size={7.5} fill={color} />
        </g>
      ))}

      {/* Query example */}
      <BOX x={420} y={30} w={95} h={115} fill="#14141c" stroke="#64748b" />
      <TXT x={467} y={47} text="QUERY" size={7} fill="#94a3b8" weight="bold" />
      <TXT x={430} y={62} text="{ user(id:1) {" size={7} fill="#34d399" anchor="start" />
      <TXT x={438} y={75} text="name" size={7} fill="#fbbf24" anchor="start" />
      <TXT x={438} y={88} text="posts {" size={7} fill="#fbbf24" anchor="start" />
      <TXT x={446} y={101} text="title" size={7} fill="#94a3b8" anchor="start" />
      <TXT x={438} y={114} text="}" size={7} fill="#fbbf24" anchor="start" />
      <TXT x={430} y={127} text="}}" size={7} fill="#34d399" anchor="start" />

      <TXT x={10} y={210} text="No over-fetching · No under-fetching · Strongly typed schema · Subscriptions for real-time" size={7} fill="#64748b" anchor="start" />
    </SVGWrap>
  );
}

// ─── Auth Architecture ─────────────────────────────────────────────────────────
export function AuthDiagram() {
  return (
    <SVGWrap w={520} h={220}>
      <TXT x={260} y={18} text="JWT Auth Flow (Access + Refresh Tokens)" size={9} fill="#818cf8" weight="bold" />

      {/* Client */}
      <BOX x={10} y={35} w={80} h={50} fill="#1d1d35" stroke="#f59e0b" />
      <TXT x={50} y={57} text="CLIENT" size={9} fill="#f59e0b" weight="bold" />
      <TXT x={50} y={71} text="Browser" size={7} fill="#94a3b8" />

      {/* Step 1: Login */}
      <ARROW x1={90} y1={55} x2={160} y2={55} />
      <TXT x={125} y={49} text="POST /login" size={7} fill="#fbbf24" />

      {/* Auth Server */}
      <BOX x={160} y={35} w={100} h={50} fill="#14141c" stroke="#818cf8" />
      <TXT x={210} y={57} text="AUTH SERVER" size={8} fill="#818cf8" weight="bold" />
      <TXT x={210} y={71} text="Verify + Sign JWT" size={7} fill="#94a3b8" />

      <DARR x1={160} y1={70} x2={90} y2={70} color="#34d399" />
      <TXT x={125} y={82} text="accessToken + refreshToken" size={6.5} fill="#34d399" />

      {/* Step 2: API Request */}
      <ARROW x1={90} y1={110} x2={160} y2={110} />
      <TXT x={125} y={104} text="Bearer {accessToken}" size={6.5} fill="#fbbf24" />

      <BOX x={160} y={95} w={100} h={40} fill="#14141c" stroke="#f59e0b" />
      <TXT x={210} y={113} text="RESOURCE API" size={8} fill="#fbbf24" weight="bold" />
      <TXT x={210} y={127} text="Verify JWT sig" size={7} fill="#94a3b8" />

      <DARR x1={260} y1={115} x2={310} y2={115} color="#34d399" />
      <BOX x={310} y={95} w={80} h={40} fill="#14141c" stroke="#34d399" />
      <TXT x={350} y={113} text="Protected" size={8} fill="#34d399" weight="bold" />
      <TXT x={350} y={127} text="Resource" size={7} fill="#94a3b8" />

      {/* JWT structure */}
      <BOX x={10} y={160} w={495} h={48} fill="#14141c" stroke="#64748b" />
      <TXT x={258} y={178} text="JWT = Header.Payload.Signature" size={8} fill="#818cf8" weight="bold" />
      <TXT x={80} y={196} text='{"alg":"HS256"}' size={7} fill="#f59e0b" />
      <TXT x={258} y={196} text='{"sub":"user_id","exp":1234567}' size={7} fill="#34d399" />
      <TXT x={435} y={196} text="HMAC_SHA256(...)" size={7} fill="#f43f5e" />
    </SVGWrap>
  );
}

// ─── Pagination Architecture ─────────────────────────────────────────────────
export function PaginationDiagram() {
  return (
    <SVGWrap w={520} h={200}>
      <TXT x={260} y={18} text="Offset vs Cursor Pagination" size={9} fill="#818cf8" weight="bold" />

      {/* Offset */}
      <TXT x={130} y={38} text="OFFSET (page-based)" size={8} fill="#fbbf24" weight="bold" />
      {[0,1,2,3,4,5,6,7,8,9].map((i) => (
        <g key={i}>
          <BOX x={10 + i*48} y={45} w={40} h={30} fill={i >= 2 && i <= 3 ? '#422006' : '#14141c'} stroke={i >= 2 && i <= 3 ? '#f59e0b' : '#334155'} />
          <TXT x={30 + i*48} y={64} text={`${i+1}`} size={8} fill={i >= 2 && i <= 3 ? '#fbbf24' : '#94a3b8'} />
        </g>
      ))}
      <TXT x={10} y={92} text="GET /items?page=2&amp;limit=2  → rows 3,4 scanned from offset 2" size={7} fill="#94a3b8" anchor="start" />
      <TXT x={10} y={105} text="⚠  Slow on large tables (DB must scan all rows before offset)" size={7} fill="#f59e0b" anchor="start" />

      {/* Cursor */}
      <TXT x={130} y={130} text="CURSOR (pointer-based)" size={8} fill="#34d399" weight="bold" />
      {[0,1,2,3,4,5].map((i) => (
        <g key={i}>
          <BOX x={10 + i*48} y={137} w={40} h={30} fill={i >= 2 ? '#052e16' : '#14141c'} stroke={i >= 2 ? '#34d399' : '#334155'} />
          <TXT x={30 + i*48} y={156} text={`id_${i+1}`} size={7} fill={i >= 2 ? '#34d399' : '#94a3b8'} />
        </g>
      ))}
      <TXT x={10} y={184} text="GET /items?after=id_2&amp;limit=3  → starts immediately after cursor, O(1) seek" size={7} fill="#94a3b8" anchor="start" />
    </SVGWrap>
  );
}

// ─── Rate Limiting Diagram ────────────────────────────────────────────────────
export function RateLimitDiagram() {
  return (
    <SVGWrap w={520} h={210}>
      <TXT x={260} y={18} text="Token Bucket Algorithm" size={9} fill="#818cf8" weight="bold" />

      {/* Bucket */}
      <rect x={180} y={30} width={100} height={120} rx={4} fill="#14141c" stroke="#f59e0b" strokeWidth={1.5} />
      <TXT x={230} y={50} text="TOKEN BUCKET" size={7} fill="#f59e0b" weight="bold" />
      {/* Tokens */}
      {[[198,65],[198,85],[198,105],[198,125],[220,65],[220,85],[220,105],[220,125],[242,65],[242,85]].map(([tx,ty],i) => (
        <rect key={i} x={tx} y={ty} width={18} height={12} rx={2} fill="#f59e0b" opacity={0.8} />
      ))}
      <TXT x={230} y={158} text="10/10 tokens" size={7} fill="#94a3b8" />

      {/* Refill arrow */}
      <ARROW x1={130} y1={70} x2={180} y2={70} />
      <TXT x={105} y={55} text="Refill" size={7} fill="#818cf8" />
      <TXT x={105} y={67} text="+1 tok/sec" size={7} fill="#818cf8" />

      {/* Good request */}
      <BOX x={10} y={90} w={75} h={28} fill="#1d1d35" stroke="#34d399" />
      <TXT x={47} y={108} text="Request" size={8} fill="#34d399" />
      <ARROW x1={85} y1={104} x2={180} y2={100} />
      <TXT x={120} y={97} text="-1 token" size={7} fill="#34d399" />

      {/* 429 path */}
      <BOX x={10} y={140} w={75} h={28} fill="#1d1d35" stroke="#f43f5e" />
      <TXT x={47} y={158} text="Too Many" size={8} fill="#f43f5e" />
      <BOX x={310} y={130} w={110} h={40} fill="#14141c" stroke="#f43f5e" />
      <TXT x={365} y={148} text="429 Too Many" size={8} fill="#f43f5e" weight="bold" />
      <TXT x={365} y={162} text="Retry-After: 5s" size={7} fill="#94a3b8" />
      <ARROW x1={280} y1={100} x2={310} y2={148} />
      <TXT x={290} y={88} text="Bucket empty?" size={7} fill="#64748b" />

      <TXT x={10} y={200} text="Headers: X-RateLimit-Limit · X-RateLimit-Remaining · X-RateLimit-Reset · Retry-After" size={7} fill="#64748b" anchor="start" />
    </SVGWrap>
  );
}

// ─── Security Diagram ─────────────────────────────────────────────────────────
export function SecurityDiagram() {
  return (
    <SVGWrap w={520} h={200}>
      <TXT x={260} y={18} text="API Security Defence Layers" size={9} fill="#818cf8" weight="bold" />

      {[
        { label: 'TLS / HTTPS', sub: 'Encrypt in transit', x: 10, y: 35, color: '#34d399' },
        { label: 'Auth (JWT/OAuth)', sub: 'Identify caller', x: 10, y: 85, color: '#818cf8' },
        { label: 'Rate Limiting', sub: 'Block abuse', x: 10, y: 135, color: '#f59e0b' },
        { label: 'Input Validation', sub: 'Block injection', x: 270, y: 35, color: '#f43f5e' },
        { label: 'CORS Policy', sub: 'Lock origins', x: 270, y: 85, color: '#f59e0b' },
        { label: 'WAF / Firewall', sub: 'Layer 7 rules', x: 270, y: 135, color: '#34d399' },
      ].map(({ label, sub, x, y, color }) => (
        <g key={label}>
          <BOX x={x} y={y} w={240} h={40} fill="#14141c" stroke={color} />
          <TXT x={x + 12} y={y + 17} text={label} size={9} fill={color} weight="bold" anchor="start" />
          <TXT x={x + 12} y={y + 30} text={sub} size={7} fill="#94a3b8" anchor="start" />
        </g>
      ))}

      <TXT x={10} y={192} text="OWASP API Top 10: Broken Auth · Excessive Data · Lack of Resources · BFLA · BOLA · SSRF · Injection" size={6.5} fill="#64748b" anchor="start" />
    </SVGWrap>
  );
}

// ─── Webhooks Diagram ─────────────────────────────────────────────────────────
export function WebhooksDiagram() {
  return (
    <SVGWrap w={520} h={200}>
      <TXT x={260} y={18} text="Webhooks vs Polling" size={9} fill="#818cf8" weight="bold" />

      {/* Polling */}
      <TXT x={130} y={38} text="POLLING (pull)" size={8} fill="#f43f5e" weight="bold" />
      <BOX x={10} y={45} w={70} h={35} fill="#1d1d35" stroke="#f43f5e" />
      <TXT x={45} y={67} text="Your App" size={8} fill="#94a3b8" />
      {[0,1,2,3].map(i => (
        <g key={i}>
          <ARROW x1={80} y1={55 + i*8} x2={155} y2={55 + i*8} />
          <DARR x1={155} y1={57 + i*8} x2={80} y2={57 + i*8} color="#64748b" />
        </g>
      ))}
      <BOX x={155} y={45} w={70} h={35} fill="#1d1d35" stroke="#64748b" />
      <TXT x={190} y={67} text="3rd Party" size={8} fill="#94a3b8" />
      <TXT x={130} y={97} text="❌ Wasted requests — mostly &quot;no new events&quot;" size={7} fill="#f43f5e" />

      {/* Webhooks */}
      <TXT x={130} y={120} text="WEBHOOKS (push)" size={8} fill="#34d399" weight="bold" />
      <BOX x={10} y={127} w={70} h={35} fill="#1d1d35" stroke="#34d399" />
      <TXT x={45} y={149} text="Your App" size={8} fill="#94a3b8" />
      <BOX x={155} y={127} w={70} h={35} fill="#1d1d35" stroke="#f59e0b" />
      <TXT x={190} y={143} text="3rd Party" size={8} fill="#94a3b8" />
      <TXT x={190} y={155} text="(Stripe etc.)" size={7} fill="#64748b" />

      {/* Event fires once */}
      <DARR x1={155} y1={142} x2={80} y2={142} color="#34d399" />
      <TXT x={117} y={135} text="POST /webhook" size={7} fill="#34d399" />
      <TXT x={117} y={150} text="on event only" size={7} fill="#34d399" />

      {/* HMAC */}
      <BOX x={260} y={127} w={250} h={60} fill="#14141c" stroke="#818cf8" />
      <TXT x={385} y={147} text="HMAC Signature Verification" size={8} fill="#818cf8" weight="bold" />
      <TXT x={270} y={163} text="X-Signature: sha256=HMAC(secret, body)" size={7} fill="#94a3b8" anchor="start" />
      <TXT x={270} y={178} text="Recompute on receipt → compare → accept/reject" size={7} fill="#94a3b8" anchor="start" />
    </SVGWrap>
  );
}

// ─── Error Handling Diagram ────────────────────────────────────────────────────
export function ErrorHandlingDiagram() {
  return (
    <SVGWrap w={520} h={200}>
      <TXT x={260} y={18} text="HTTP Status Code Map" size={9} fill="#818cf8" weight="bold" />

      {[
        { range: '2xx', label: 'SUCCESS', codes: ['200 OK','201 Created','204 No Content'], color: '#34d399', x: 10 },
        { range: '3xx', label: 'REDIRECT', codes: ['301 Moved','302 Found','304 Not Modified'], color: '#fbbf24', x: 140 },
        { range: '4xx', label: 'CLIENT ERR', codes: ['400 Bad Req','401 Unauth','404 Not Found'], color: '#f59e0b', x: 270 },
        { range: '5xx', label: 'SERVER ERR', codes: ['500 Internal','502 Bad GW','503 Unavail'], color: '#f43f5e', x: 400 },
      ].map(({ range, label, codes, color, x }) => (
        <g key={range}>
          <BOX x={x} y={30} w={112} h={130} fill="#14141c" stroke={color} />
          <TXT x={x + 56} y={50} text={range} size={14} fill={color} weight="bold" />
          <TXT x={x + 56} y={65} text={label} size={7} fill="#94a3b8" />
          {codes.map((c, i) => (
            <TXT key={c} x={x + 8} y={85 + i * 18} text={c} size={7} fill={color} anchor="start" />
          ))}
        </g>
      ))}

      <BOX x={10} y={172} w={495} h={22} fill="#14141c" stroke="#334155" />
      <TXT x={258} y={186} text='RFC 7807 Problem Details: { "type": "https://…", "title": "Bad Request", "status": 400, "detail": "…" }' size={6.5} fill="#94a3b8" />
    </SVGWrap>
  );
}

// ─── Selector: pick diagram by slug ──────────────────────────────────────────
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
    <div className="glass-card p-5 border-amber-500/20 animate-slide-up">
      <div className="text-[10px] font-pixel text-amber-400 mb-3 flex items-center gap-1.5">
        <span>⬡</span> ARCHITECTURE DIAGRAM
      </div>
      <Diagram />
    </div>
  );
}
