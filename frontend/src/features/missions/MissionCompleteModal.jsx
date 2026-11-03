import { Link } from 'react-router-dom';
import { CheckCircle2, Zap, Coins, Trophy, ArrowRight, Sword } from 'lucide-react';
import {
  PixelFirstBlood, PixelLink, PixelScroll, PixelBolt,
  PixelCentury, PixelTrophy,
} from '../../components/PixelIcons';

const BADGE_META = {
  first_blood:  { icon: PixelFirstBlood, label: 'First Blood' },
  rest_rookie:  { icon: PixelLink,       label: 'REST Rookie' },
  soap_slinger: { icon: PixelScroll,     label: 'SOAP Slinger' },
  graphql_guru: { icon: PixelBolt,       label: 'GraphQL Guru' },
  century:      { icon: PixelCentury,    label: 'Century' },
  legend:       { icon: PixelTrophy,     label: 'Legend' },
};

/**
 * Full-screen mission complete overlay with XP pop animation.
 *
 * Props:
 *   result      – the submit response data object
 *   mission     – the mission record
 *   onClose     – callback to dismiss
 */
export default function MissionCompleteModal({ result, mission, onClose }) {
  if (!result) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      {/* Pixel confetti dots (CSS animated) */}
      <div className="mission-confetti" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, i) => (
          <span key={i} className="confetti-pixel" style={{ '--i': i }} />
        ))}
      </div>

      <div className="glass-card max-w-md w-full p-8 border-2 border-emerald-500/60 shadow-[0_0_60px_rgba(52,211,153,0.3)] relative overflow-hidden">
        {/* Glow sweep */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-amber-500/10 pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-6 relative">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 mb-4 shadow-[0_0_24px_rgba(52,211,153,0.5)]">
            <CheckCircle2 size={32} className="text-emerald-400" />
          </div>

          {mission?.type === 'DEBUGGER' ? (
            <>
              <div className="font-pixel text-xs text-rose-300 uppercase tracking-widest mb-1">Bug Fixed!</div>
              <h2 className="font-pixel text-2xl font-extrabold text-white">DEBUGGER VICTORY</h2>
            </>
          ) : mission?.type === 'EXPERIMENT' ? (
            <>
              <div className="font-pixel text-xs text-blue-300 uppercase tracking-widest mb-1">Experiment Complete!</div>
              <h2 className="font-pixel text-2xl font-extrabold text-white">DISCOVERY MADE</h2>
            </>
          ) : (
            <>
              <div className="font-pixel text-xs text-amber-400 uppercase tracking-widest mb-1">Mission Accomplished!</div>
              <h2 className="font-pixel text-2xl font-extrabold text-white">MISSION COMPLETE</h2>
            </>
          )}
          <p className="text-xs text-slate-400 mt-2 font-pixel">{mission?.title}</p>
        </div>

        {/* Rewards */}
        <div className="space-y-3 mb-6">
          {/* XP */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <div className="flex items-center gap-2 font-pixel text-xs text-amber-300">
              <Zap size={16} className="text-amber-400 fill-amber-400" />
              XP EARNED
            </div>
            <div className="font-pixel text-xl font-extrabold text-amber-300 mission-xp-pop">
              +{result.xpAwarded}
            </div>
          </div>

          {/* Coins */}
          {result.coinReward > 0 && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
              <div className="flex items-center gap-2 font-pixel text-xs text-yellow-300">
                <Coins size={16} className="text-yellow-400" />
                COINS
              </div>
              <div className="font-pixel text-xl font-extrabold text-yellow-300">
                +{result.coinReward}
              </div>
            </div>
          )}

          {/* New Badges */}
          {result.newBadges?.length > 0 && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-pixel mb-2">
                <Trophy size={13} /> NEW BADGE UNLOCKED!
              </div>
              <div className="flex flex-wrap gap-2">
                {result.newBadges.map((code) => {
                  const meta = BADGE_META[code];
                  const IconComponent = meta?.icon || PixelTrophy;
                  return (
                    <span key={code} className="pill-yellow text-xs flex items-center gap-1.5">
                      <IconComponent size={12} /> {meta?.label || code}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* XP bar animation */}
        {result.progress && (
          <div className="mb-6">
            <div className="flex justify-between text-[10px] font-pixel text-slate-400 mb-1.5">
              <span className="flex items-center gap-1">
                <Zap size={10} className="text-amber-400" />
                {result.progress.xpTotal} XP TOTAL
              </span>
              <span>Level {result.progress.level}</span>
            </div>
            <div className="xp-bar">
              <div
                className="xp-bar-fill"
                style={{ width: `${(result.progress.xpTotal % 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            to="/missions"
            className="btn-ghost flex-1 text-xs font-pixel text-center py-2.5"
            onClick={onClose}
          >
            <Sword size={13} /> ALL MISSIONS
          </Link>
          <Link
            to="/dashboard"
            className="btn-primary flex-1 text-xs font-pixel text-center py-2.5"
            onClick={onClose}
          >
            VIEW HUD <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
