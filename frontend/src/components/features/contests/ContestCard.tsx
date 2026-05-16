import React from 'react';
import { Trophy, Users, Globe, Lock, ArrowRight, Timer } from 'lucide-react';
import type { Contest } from '@/types/contest';
import UserAvatar from '@components/core/UserAvatar';
import { cn } from '@utils/cn';


interface ContestCardProps {
  contest: Contest;
  onJoin?: (id: string) => void;
  isJoined?: boolean;
}

const ContestCard: React.FC<ContestCardProps> = ({ contest, onJoin, isJoined }) => {
  return (
    <div className="bg-background-secondary rounded-sm p-6 border border-white/5 shadow-premium group hover:border-brand/30 transition-all cursor-pointer flex flex-col h-full relative overflow-hidden">
      {/* Accent Background Glow */}
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-brand/5 blur-3xl rounded-full group-hover:bg-brand/10 transition-colors" />

      <div className="flex justify-between items-start mb-6">
        <div className="bg-white/5 p-3 rounded-md border border-white/5 text-brand shadow-accent group-hover:border-brand/20 transition-all">
          <Trophy size={20} strokeWidth={2.5} />
        </div>
        <div className="flex gap-2">
          {contest.visibility === 'public' ? (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-sm">
              <div className="w-1 h-1 rounded-full bg-emerald-500" />
              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Public</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded-sm">
              <Lock size={10} className="text-amber-500" />
              <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Private</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <h3 className="text-lg font-black text-white group-hover:text-brand transition-colors line-clamp-1 tracking-tight">
          {contest.name}
        </h3>
        <p className="text-surface-500 text-[13px] leading-relaxed line-clamp-2 h-10">
          {contest.description || 'Join this elite competition and prove your coding prowess on the global stage.'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/[0.02] border border-white/5 rounded-sm p-2 flex items-center gap-2.5">
          <div className="p-1.5 bg-white/5 rounded-sm text-surface-400">
            <Users size={14} />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-surface-600 uppercase tracking-widest">Capacity</span>
            <span className="text-[11px] font-bold text-white">{contest.max_participants} Pilots</span>
          </div>
        </div>
        <div className="bg-white/[0.02] border border-white/5 rounded-sm p-2 flex items-center gap-2.5">
          <div className="p-1.5 bg-white/5 rounded-sm text-surface-400">
            <Timer size={14} />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-surface-600 uppercase tracking-widest">Duration</span>
            <span className="text-[11px] font-bold text-white">{contest.duration_minutes}m</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto pt-5 border-t border-white/5">
        <div className="flex items-center gap-3">
          <UserAvatar 
            username={contest.creator?.username || 'System'} 
            src={contest.creator?.avatar_url || undefined}
            size="sm"
            className="rounded-sm ring-1 ring-white/10"
          />
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-surface-600 uppercase tracking-widest leading-none mb-1">Creator</span>
            <span className="text-[11px] font-bold text-surface-300 leading-none">{contest.creator?.username}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isJoined ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 text-surface-400 rounded-sm text-[10px] font-black uppercase tracking-widest border border-white/5">
              Joined
            </div>
          ) : (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onJoin?.(contest.id);
              }}
              className="bg-brand hover:bg-brand-hover text-white px-5 py-2 rounded-sm text-[10px] font-black uppercase tracking-[0.15em] transition-all flex items-center gap-2 shadow-sm active:scale-[0.98] group/btn"
            >
              Enter Arena
              <ArrowRight size={14} strokeWidth={3} className="group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContestCard;
