import React from 'react';

/**
 * CharacterStage — Cohesive Full-Screen Gaming Character Showcase
 * 
 * Displays the warrior character (character.png) centered in its column,
 * closely harmonized with the authentication form to create a unified composition.
 */
export default function CharacterStage({ className = '' }) {
  return (
    <div
      className={`
        relative w-full h-full flex items-end justify-center select-none pointer-events-none
        ${className}
      `}
    >
      {/* ── Radiant Temple Auras centered behind character ── */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-72 sm:w-88 lg:w-[420px] h-72 sm:h-88 lg:h-[420px] rounded-full bg-emerald-300/25 blur-[90px]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 w-64 sm:w-76 lg:w-[360px] h-64 sm:h-76 lg:h-[360px] rounded-full bg-amber-400/15 blur-[85px]" />

      {/* ── Subtle geometric facet highlight behind character ── */}
      <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-12 w-60 lg:w-72 h-60 lg:h-72 bg-white/10 rotate-12 rounded-3xl blur-2xl" />

      {/* ── Ground Contact Shadow beneath character rock pedestal ── */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-60 sm:w-72 lg:w-[360px] h-8 bg-black/45 rounded-full blur-xl" />

      {/* ── Character Cutout Illustration ── */}
      <div className="relative z-10 w-full flex items-end justify-center">
        <img
          src="/character.png"
          alt="API Quest Character"
          className="w-auto h-[340px] sm:h-[440px] md:h-[500px] lg:h-[76vh] xl:h-[82vh] max-h-[760px] xl:max-h-[820px] max-w-full object-contain object-bottom pointer-events-none drop-shadow-[0_22px_32px_rgba(5,20,5,0.42)] transition-transform duration-300 hover:scale-[1.01]"
          loading="eager"
        />
      </div>
    </div>
  );
}
