import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { contestService } from '@lib/contests';
import { useLeaderboardStore } from '@store/useLeaderboardStore';
import { Trophy, Clock, CheckCircle2, XCircle, Minus, Target, Hash } from 'lucide-react';
import { cn } from '@utils/cn';
import { motion, AnimatePresence } from 'framer-motion';
import UserAvatar from '@components/core/UserAvatar';

interface LiveLeaderboardProps {
  contestId: string;
  problemIds: string[];
}

const LiveLeaderboard: React.FC<LiveLeaderboardProps> = ({ contestId, problemIds }) => {
  const { entries, setEntries } = useLeaderboardStore();

  const { isLoading } = useQuery({
    queryKey: ['leaderboard', contestId],
    queryFn: async () => {
      const data = await contestService.getLeaderboard(contestId);
      setEntries(data);
      return data;
    },
    refetchInterval: 30000,
  });

  if (isLoading && entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <div className="w-8 h-8 border-2 border-brand/20 border-t-brand rounded-full animate-spin" />
        <p className="text-[10px] font-black text-surface-500 uppercase tracking-[0.2em] animate-pulse">Synchronizing Standings</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto custom-scrollbar bg-background-secondary rounded-sm border border-white/5">
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left border-b border-white/5 bg-white/[0.02]">
            <th className="px-6 py-4 text-[10px] font-black text-surface-500 uppercase tracking-[0.2em] w-20 text-center">Rank</th>
            <th className="px-6 py-4 text-[10px] font-black text-surface-500 uppercase tracking-[0.2em] min-w-[240px]">Participant</th>
            <th className="px-6 py-4 text-[10px] font-black text-surface-500 uppercase tracking-[0.2em] text-center w-24">Solved</th>
            <th className="px-6 py-4 text-[10px] font-black text-surface-500 uppercase tracking-[0.2em] text-center w-28">Penalty</th>
            {problemIds.map((pid, index) => (
              <th key={pid} className="px-3 py-4 text-[10px] font-black text-surface-500 uppercase tracking-[0.2em] text-center w-20 border-l border-white/5">
                {String.fromCharCode(65 + index)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          <AnimatePresence mode="popLayout">
            {entries.map((entry, index) => (
              <motion.tr
                key={entry.userId}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2, delay: index * 0.02 }}
                className={cn(
                  "hover:bg-white/[0.03] transition-colors group relative",
                  index === 0 ? "bg-brand/[0.02]" : ""
                )}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center">
                    {index < 3 ? (
                      <div className={cn(
                        "w-8 h-8 rounded-sm flex items-center justify-center border font-black text-xs shadow-sm",
                        index === 0 ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : 
                        index === 1 ? "bg-slate-300/10 border-slate-300/20 text-slate-300" : 
                        "bg-orange-600/10 border-orange-600/20 text-orange-600"
                      )}>
                        {index + 1}
                      </div>
                    ) : (
                      <span className="text-xs font-black text-surface-500 font-mono">{index + 1}</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <UserAvatar 
                      username={entry.username} 
                      src={entry.avatar_url} 
                      size="sm" 
                      className="rounded-sm ring-1 ring-white/10"
                    />
                    <span className="text-sm font-bold text-surface-200 group-hover:text-white transition-colors tracking-tight">
                      {entry.username}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand/10 border border-brand/20 rounded-sm">
                    <Target size={12} className="text-brand" />
                    <span className="text-xs font-black text-brand font-mono">
                      {entry.solvedCount}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-xs text-surface-500 font-mono">
                    <Clock size={12} />
                    {entry.penalty}
                  </div>
                </td>
                {problemIds.map((pid) => {
                  const prob = entry.problems[pid];
                  return (
                    <td key={pid} className="px-3 py-4 border-l border-white/5">
                      <div className="flex flex-col items-center justify-center">
                        {!prob || prob.status === 'untouched' ? (
                          <div className="w-5 h-0.5 bg-white/5 rounded-full" />
                        ) : prob.status === 'solved' ? (
                          <div className="flex flex-col items-center gap-1">
                            <div className="w-8 h-8 rounded-sm bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                               <CheckCircle2 size={14} className="text-emerald-500" />
                            </div>
                            {prob.attempts > 1 && (
                               <span className="text-[10px] text-emerald-500/60 font-black font-mono">
                                 +{prob.attempts - 1}
                               </span>
                            )}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-1">
                            <div className="w-8 h-8 rounded-sm bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
                               <XCircle size={14} />
                            </div>
                            <span className="text-[10px] text-rose-500/60 font-black font-mono">
                               -{prob.attempts}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
};

export default LiveLeaderboard;
