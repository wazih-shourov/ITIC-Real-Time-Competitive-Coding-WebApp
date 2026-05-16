import React from 'react';
import { useActivityStore } from '@store/useActivityStore';
import { MessageSquare, Trophy, Send, Users, Timer, Target, Zap, ShieldCheck } from 'lucide-react';
import { cn } from '@utils/cn';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

const LiveSolveFeed: React.FC = () => {
  const { events } = useActivityStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'solve': return <Trophy size={14} className="text-brand" />;
      case 'submission': return <Send size={14} className="text-surface-400" />;
      case 'join': return <Users size={14} className="text-emerald-500" />;
      case 'contest_start': return <Zap size={14} className="text-amber-500" />;
      case 'contest_end': return <ShieldCheck size={14} className="text-rose-500" />;
      default: return <MessageSquare size={14} className="text-surface-500" />;
    }
  };

  const getMessage = (event: any) => {
    switch (event.type) {
      case 'solve':
        return (
          <p className="text-[11px] text-surface-300 leading-relaxed">
            <span className="font-black text-white">{event.username}</span> solved{' '}
            <span className="text-brand font-black italic">{event.problemTitle}</span>
          </p>
        );
      case 'submission':
        return (
          <p className="text-[11px] text-surface-400 leading-relaxed">
            <span className="font-bold text-surface-200">{event.username}</span> pushed to{' '}
            <span className="text-surface-200 font-bold">{event.problemTitle}</span>
          </p>
        );
      case 'join':
        return (
          <p className="text-[11px] text-surface-400 leading-relaxed">
            <span className="font-bold text-surface-200">{event.username}</span> deployed to arena
          </p>
        );
      case 'contest_start':
        return <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.15em]">System initialized: Contest Live</p>;
      case 'contest_end':
        return <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.15em]">System offline: Contest Ended</p>;
      default:
        return <p className="text-[11px] text-surface-500">{event.message}</p>;
    }
  };

  return (
    <div className="flex flex-col h-full bg-background-secondary rounded-sm border border-white/5 overflow-hidden shadow-premium">
      <div className="px-4 py-3 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
        <h3 className="text-[10px] font-black text-surface-500 uppercase tracking-[0.2em] flex items-center gap-2">
          <Activity size={14} strokeWidth={2.5} className="text-brand" />
          Live Activity
        </h3>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-black text-emerald-500/80 uppercase tracking-widest">Live</span>
          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
        <AnimatePresence initial={false}>
          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-3 opacity-30">
              <Activity size={32} strokeWidth={1} className="text-surface-600" />
              <p className="text-[10px] font-black text-surface-600 uppercase tracking-widest">Monitoring Arena...</p>
            </div>
          ) : (
            events.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex gap-3 items-start p-2 rounded-sm hover:bg-white/[0.02] transition-colors group"
              >
                <div className="mt-0.5 w-7 h-7 rounded-sm bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:border-brand/20 transition-colors shadow-sm">
                  {getIcon(event.type)}
                </div>
                <div className="flex-1 min-w-0">
                  {getMessage(event)}
                  <span className="text-[9px] text-surface-600 font-black uppercase tracking-tight mt-1 block">
                    {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

import { Activity } from 'lucide-react';

export default LiveSolveFeed;
