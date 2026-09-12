/**
 * Pixel-Art SVG Icons Suite for API Quest — Jungle Temple Edition
 * Crisp 8-bit stepped geometry rendered using SVG paths & shape-rendering: crispEdges
 */

// Common props helper
const baseSvgProps = (size = 20, className = '') => ({
  width: size,
  height: size,
  viewBox: '0 0 16 16',
  fill: 'currentColor',
  xmlns: 'http://www.w3.org/2000/svg',
  style: { shapeRendering: 'crispEdges' },
  className,
});

/** ⚡ REST Realm: Pixel Lightning Bolt */
export function PixelBolt({ size = 20, className = 'text-amber-400' }) {
  return (
    <svg {...baseSvgProps(size, className)}>
      <path d="M9 1h3v2h-2v2h2v2h-2v2h2v2h-3v-2H7v2H5v-2h2v-2H5V7h2V5H5V3h4V1z" />
      <path d="M8 3h2v2H8V3zm-1 4h2v2H7V7zm-1 4h2v2H6v-2z" fill="#fde68a" />
    </svg>
  );
}

/** 🔮 GraphQL Realm: Pixel Crystal Orb / Node Graph */
export function PixelCrystal({ size = 20, className = 'text-emerald-400' }) {
  return (
    <svg {...baseSvgProps(size, className)}>
      <path d="M6 1h4v1H6V1zm-3 2h2v1H3V3zm8 0h2v1h-2V3zM2 5h1v6H2V5zm11 0h1v6h-1V5zm-2 7h2v1h-2v-1zM3 12h2v1H3v-1zm3 2h4v1H6v-1z" fill="currentColor" />
      <path d="M6 3h4v2H6V3zM4 5h8v6H4V5zm2 7h4v1H6v-1z" fill="#10b981" />
      <path d="M5 6h2v2H5V6zm4 2h2v2H9V8z" fill="#6ee7b7" />
    </svg>
  );
}

/** 📜 SOAP Citadel: Pixel Scroll / XML Envelope */
export function PixelScroll({ size = 20, className = 'text-amber-400' }) {
  return (
    <svg {...baseSvgProps(size, className)}>
      <path d="M3 2h10v1H3V2zm-1 2h1v9H2V4zm12 0h1v9h-1V4zM3 13h10v1H3v-1z" fill="currentColor" />
      <path d="M3 3h10v10H3V3z" fill="#f59e0b" />
      <path d="M5 5h6v1H5V5zm0 3h6v1H5V8zm0 3h4v1H5v-1z" fill="#0e1c12" />
      <path d="M2 3h2v2H2V3zm10 8h2v2h-2v-2z" fill="#fde68a" />
    </svg>
  );
}

/** 🔐 Auth Fortress / Lock State */
export function PixelLock({ size = 20, locked = true, className = '' }) {
  const colorClass = className || (locked ? 'text-slate-500' : 'text-emerald-400');
  return (
    <svg {...baseSvgProps(size, colorClass)}>
      {locked ? (
        <path d="M5 2h6v1H5V2zM4 3h2v3H4V3zm6 0h2v3h-2V3z" fill="currentColor" />
      ) : (
        <path d="M5 1h6v1H5V1zM4 2h2v4H4V2zm6 2h2v2h-2V4z" fill="currentColor" />
      )}
      <path d="M2 6h12v1H2V6zm0 8h12v1H2v-1zm-1-7h1v7H1V7zm13 0h1v7h-1V7z" fill="currentColor" />
      <path d="M2 7h12v7H2V7z" fill={locked ? '#334155' : '#10b981'} />
      <path d="M7 9h2v2H7V9zm0 2h2v2H7v-2z" fill="#060d08" />
    </svg>
  );
}

/** 🛡️ Security Vault: Pixel Shield */
export function PixelShield({ size = 20, className = 'text-emerald-400' }) {
  return (
    <svg {...baseSvgProps(size, className)}>
      <path d="M2 1h12v2H2V1zm-1 2h2v6H1V3zm13 0h2v6h-2V3zm-2 6h2v3h-2V9zm-2 3h2v2h-2v-2zm-2 2h2v1H8v-1zm-2 0H6v-1h2v1zm-2-2H4v-2h2v2zm-2-3H2V9h2v3z" fill="currentColor" />
      <path d="M3 3h10v5H3V3zm1 5h8v2H4V8zm1 2h6v2H5v-2zm2 2h2v1H7v-1z" fill="#10b981" />
      <path d="M5 4h2v3H5V4zm4 0h2v3H9V4z" fill="#6ee7b7" />
    </svg>
  );
}

/** 📡 Webhook Outpost: Pixel Satellite / Antenna */
export function PixelSatellite({ size = 20, className = 'text-emerald-400' }) {
  return (
    <svg {...baseSvgProps(size, className)}>
      <path d="M7 1h2v2H7V1zm-3 2h2v2H4V3zm8 0h2v2h-2V3zM2 6h2v2H2V6zm10 0h2v2h-2V6zm-5 1h2v5H7V7zm-2 5h6v1H5v-1zm-2 2h10v1H3v-1z" fill="currentColor" />
      <path d="M7 2h2v2H7V2zm-2 3h6v2H5V5z" fill="#6ee7b7" />
      <path d="M4 12h8v2H4v-2z" fill="#10b981" />
    </svg>
  );
}

/** 🏆 Trophy: Pixel Gold / Silver / Bronze Trophy */
export function PixelTrophy({ size = 20, rank = 1, className = '' }) {
  const rankColors = {
    1: { primary: '#fbbf24', highlight: '#fef08a', text: 'text-amber-400' },
    2: { primary: '#94a3b8', highlight: '#f1f5f9', text: 'text-slate-300' },
    3: { primary: '#10b981', highlight: '#6ee7b7', text: 'text-emerald-400' },
  };
  const conf = rankColors[rank] || rankColors[1];

  return (
    <svg {...baseSvgProps(size, className || conf.text)}>
      <path d="M3 2h10v1H3V2zm-1 1h1v4H2V3zm12 0h1v4h-1V3zm-2 4h1v2h-1V7zm-8 0h1v2H4V7zm2 2h4v1H6V9zm1 1h2v2H7v-2zm-2 2h4v1H5v-1zm-1 1h6v1H4v-1z" fill="currentColor" />
      <path d="M3 3h10v4H3V3zm1 4h8v2H4V7zm2 2h4v1H6V9zm1 1h2v2H7v-2zm-2 2h4v1H5v-1z" fill={conf.primary} />
      <path d="M4 3h2v4H4V3zm1 4h2v2H5V7z" fill={conf.highlight} />
    </svg>
  );
}

/** 🩸 Badge: First Blood */
export function PixelFirstBlood({ size = 20, className = 'text-rose-400' }) {
  return (
    <svg {...baseSvgProps(size, className)}>
      <path d="M7 1h2v2H7V1zm-1 2h4v2H6V3zm-2 2h8v3H4V5zm1 3h6v4H5V8zm2 4h2v3H7v-3z" fill="currentColor" />
      <path d="M7 3h2v2H7V3zm-1 2h4v3H6V5zm1 3h2v3H7V8z" fill="#f43f5e" />
      <path d="M7 5h1v2H7V5z" fill="#fecdd3" />
    </svg>
  );
}

/** 🔗 Badge: Link / REST Rookie */
export function PixelLink({ size = 20, className = 'text-emerald-400' }) {
  return (
    <svg {...baseSvgProps(size, className)}>
      <path d="M2 5h5v2H2V5zm0 4h5v2H2V9zm7-4h5v2H9V5zm0 4h5v2H9V9z" fill="currentColor" />
      <path d="M5 7h6v2H5V7z" fill="#10b981" />
      <path d="M6 7h4v2H6V7z" fill="#34d399" />
    </svg>
  );
}

/** 💯 Badge: Century (100 XP) */
export function PixelCentury({ size = 20, className = 'text-amber-400' }) {
  return (
    <svg {...baseSvgProps(size, className)}>
      <path d="M2 2h12v12H2V2zm1 1v10h10V3H3z" fill="currentColor" />
      <path d="M4 4h8v8H4V4z" fill="#f59e0b" />
      <path d="M6 5h4v1H6V5zm-1 2h6v2H5V7zm1 3h4v1H6v-1z" fill="#fde68a" />
    </svg>
  );
}

/** 🧭 Dynamic Topic Pixel Icon */
export function TopicPixelIcon({ topic, size = 20, className = '' }) {
  const key = (topic || '').toLowerCase();
  if (key.includes('graphql')) return <PixelCrystal size={size} className={className || 'text-emerald-400'} />;
  if (key.includes('soap')) return <PixelScroll size={size} className={className || 'text-amber-400'} />;
  if (key.includes('auth')) return <PixelLock size={size} locked={false} className={className || 'text-emerald-400'} />;
  if (key.includes('sec')) return <PixelShield size={size} className={className || 'text-emerald-400'} />;
  if (key.includes('hook')) return <PixelSatellite size={size} className={className || 'text-emerald-400'} />;
  if (key.includes('pag')) return <PixelLink size={size} className={className || 'text-emerald-400'} />;
  if (key.includes('rate')) return <PixelCentury size={size} className={className || 'text-amber-400'} />;
  return <PixelBolt size={size} className={className || 'text-amber-400'} />;
}
