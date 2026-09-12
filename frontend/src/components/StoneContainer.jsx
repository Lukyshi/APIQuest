import React from 'react';

/**
 * StoneContainer — Jungle Temple Carved Stone Card
 * Features weathered stone borders, corner bolts/rivets, moss flourishes, and dark stone fill.
 */
export default function StoneContainer({
  children,
  className = '',
  withRivets = true,
  withMoss = true,
  hoverGlow = 'emerald', // 'emerald' | 'amber' | 'none'
  onClick,
  as: Component = 'div',
  ...props
}) {
  const glowClasses = {
    emerald: 'hover:border-emerald-400 hover:shadow-[0_0_25px_rgba(52,211,153,0.25)]',
    amber: 'hover:border-amber-400 hover:shadow-[0_0_25px_rgba(251,191,36,0.3)]',
    none: '',
  }[hoverGlow];

  return (
    <Component
      onClick={onClick}
      className={`
        relative group overflow-hidden rounded-xl
        bg-gradient-to-br from-olive-800/90 via-moss-900/95 to-moss-950/95
        border-2 border-emerald-500/25
        backdrop-blur-md
        shadow-[0_8px_25px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-2px_0_rgba(0,0,0,0.5)]
        transition-all duration-300
        ${glowClasses}
        ${className}
      `}
      {...props}
    >
      {/* Subtle stone texture lines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
          backgroundSize: '12px 12px',
        }}
      />

      {/* 4 Corner Rivets / Stone Bolts */}
      {withRivets && (
        <>
          <div className="stone-rivet rivet-tl" />
          <div className="stone-rivet rivet-tr" />
          <div className="stone-rivet rivet-bl" />
          <div className="stone-rivet rivet-br" />
        </>
      )}

      {/* Overgrown Moss Flourishes at corners */}
      {withMoss && (
        <>
          <div className="moss-corner-tl" />
          <div className="moss-corner-br" />
          {/* Subtle top ivy pixel accent */}
          <div className="pointer-events-none absolute top-0 left-8 w-6 h-1 bg-emerald-500/40 rounded-b-sm" />
          <div className="pointer-events-none absolute bottom-0 right-8 w-5 h-1 bg-emerald-600/40 rounded-t-sm" />
        </>
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </Component>
  );
}
