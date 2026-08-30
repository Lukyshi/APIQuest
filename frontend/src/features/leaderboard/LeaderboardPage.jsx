import { useQuery } from '@tanstack/react-query';
import { leaderboardApi } from './api';
import { useAuthStore } from '../auth/authStore';
import { Trophy, Flame, Star, Loader2, Crown } from 'lucide-react';

const rankBadge = (rank) => {
  if (rank === 1) return <Crown size={16} className="text-amber-400" />;
  if (rank === 2) return <span className="text-slate-300 font-bold text-sm">2</span>;
  if (rank === 3) return <span className="text-amber-700 font-bold text-sm">3</span>;
  return <span className="text-slate-500 text-sm font-semibold">{rank}</span>;
};

export default function LeaderboardPage() {
  const { data: leaders, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: leaderboardApi.get,
  });
  const currentUser = useAuthStore((s) => s.user);
  const myRank = leaders?.find((l) => l.userId === currentUser?.id)?.rank;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-2 text-violet-400 text-sm font-semibold mb-3">
          <Trophy size={14} /> Global Leaderboard
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Top Learners</h1>
        <p className="text-slate-400">Ranked by total XP earned — keep completing challenges to climb the board.</p>
        {myRank && (
          <div className="mt-3 inline-flex items-center gap-2 pill-brand">
            <Star size={11} /> Your rank: #{myRank}
          </div>
        )}
      </div>

      {isLoading && (
        <div className="flex justify-center py-24">
          <Loader2 size={32} className="text-brand-400 animate-spin" />
        </div>
      )}

      {leaders && (
        <div className="space-y-3 animate-slide-up">
          {leaders.map((entry) => {
            const isMe = entry.userId === currentUser?.id;
            return (
              <div
                key={entry.userId}
                className={`glass-card px-5 py-4 flex items-center gap-4 transition-all ${
                  isMe ? 'border-brand-400/50 bg-brand-500/5' : 'hover:border-brand-500/25'
                }`}
              >
                {/* Rank */}
                <div className="w-8 flex items-center justify-center flex-shrink-0">
                  {rankBadge(entry.rank)}
                </div>

                {/* Avatar */}
                <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {entry.username.slice(0, 2).toUpperCase()}
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold text-sm ${isMe ? 'text-brand-300' : 'text-white'}`}>
                      {entry.username}
                    </span>
                    {isMe && <span className="pill-brand text-xs py-0.5">You</span>}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                    <span className="flex items-center gap-1"><Star size={10} /> Level {entry.level}</span>
                    <span className="flex items-center gap-1"><Flame size={10} /> {entry.streakCount}d streak</span>
                  </div>
                </div>

                {/* XP */}
                <div className="text-right">
                  <div className="font-bold text-brand-300 text-sm">{entry.xpTotal.toLocaleString()}</div>
                  <div className="text-xs text-slate-500">XP</div>
                </div>
              </div>
            );
          })}

          {leaders.length === 0 && (
            <div className="glass-card p-12 text-center text-slate-400">
              No one on the leaderboard yet. Be the first to earn XP!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
