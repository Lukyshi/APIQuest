import { useQuery } from '@tanstack/react-query';
import { leaderboardApi } from './api';
import { useAuthStore } from '../auth/authStore';
import { Trophy, Flame, Star, Loader2, Crown, Zap } from 'lucide-react';

const rankBadge = (rank) => {
  if (rank === 1) return <Crown size={20} className="text-amber-400 fill-amber-400 animate-pulse" />;
  if (rank === 2) return <span className="font-pixel text-amber-300 font-bold text-sm">#2</span>;
  if (rank === 3) return <span className="font-pixel text-orange-400 font-bold text-sm">#3</span>;
  return <span className="font-pixel text-slate-500 text-xs">#{rank}</span>;
};

export default function LeaderboardPage() {
  const { data: leaders, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: leaderboardApi.get,
  });
  const currentUser = useAuthStore((s) => s.user);
  const myRank = leaders?.find((l) => l.userId === currentUser?.id)?.rank;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-10 animate-fade-in text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 pill-yellow mb-3">
          <Trophy size={14} /> HIGH SCORE HALL OF FAME
        </div>
        <h1 className="font-pixel text-3xl sm:text-5xl font-extrabold text-white mb-3">GLOBAL LEADERBOARD</h1>
        <p className="text-slate-300 text-sm">Ranked by total XP points earned across all API realms.</p>
        {myRank && (
          <div className="mt-3 inline-flex items-center gap-2 pill-yellow">
            <Star size={12} className="text-amber-400 fill-amber-400" /> YOUR RANK: #{myRank}
          </div>
        )}
      </div>

      {isLoading && (
        <div className="flex justify-center py-24">
          <Loader2 size={32} className="text-amber-400 animate-spin" />
        </div>
      )}

      {leaders && (
        <div className="space-y-3 animate-slide-up">
          {leaders.map((entry) => {
            const isMe = entry.userId === currentUser?.id;
            return (
              <div
                key={entry.userId}
                className={`glass-card p-5 flex items-center gap-4 transition-all border ${
                  isMe
                    ? 'border-amber-400 bg-amber-500/10 shadow-glow'
                    : 'border-amber-500/20 hover:border-amber-500/40'
                }`}
              >
                {/* Rank */}
                <div className="w-10 flex items-center justify-center flex-shrink-0 font-pixel">
                  {rankBadge(entry.rank)}
                </div>

                {/* Avatar */}
                <div className="w-10 h-10 rounded-lg bg-gradient-gold text-slate-950 font-pixel font-bold flex items-center justify-center text-xs flex-shrink-0 shadow-glow">
                  {entry.username.slice(0, 2).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-pixel text-sm font-bold ${isMe ? 'text-amber-300' : 'text-white'}`}>
                      {entry.username}
                    </span>
                    {isMe && <span className="pill-yellow text-[9px] py-0.5">YOU</span>}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 font-pixel">
                    <span className="flex items-center gap-1 text-amber-400"><Star size={10} /> Level {entry.level}</span>
                    <span className="flex items-center gap-1 text-orange-400"><Flame size={10} className="fill-orange-400" /> {entry.streakCount}d streak</span>
                  </div>
                </div>

                {/* XP */}
                <div className="text-right">
                  <div className="font-pixel text-sm font-bold text-amber-300 flex items-center justify-end gap-1">
                    <Zap size={12} className="text-amber-400 fill-amber-400" />
                    {entry.xpTotal.toLocaleString()}
                  </div>
                  <div className="text-[10px] font-pixel text-slate-400">TOTAL XP</div>
                </div>
              </div>
            );
          })}

          {leaders.length === 0 && (
            <div className="glass-card p-12 text-center text-slate-400 font-pixel">
              No players on the leaderboard yet. Complete quests to claim #1 spot!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
