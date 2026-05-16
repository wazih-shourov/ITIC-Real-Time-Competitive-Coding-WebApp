import React from 'react';
import { Users, Crown, Star } from 'lucide-react';
import type { ContestParticipant } from '@/types/contest';
import { UserAvatar } from '@components/core/UserAvatar';

interface ParticipantListProps {
  participants: ContestParticipant[];
  maxParticipants: number;
}

const ParticipantList: React.FC<ParticipantListProps> = ({ participants, maxParticipants }) => {
  return (
    <div className="bg-background-secondary rounded-2xl border border-white/5 overflow-hidden flex flex-col h-full">
      <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={18} className="text-brand" />
          <h3 className="font-bold">Participants</h3>
        </div>
        <span className="text-xs font-bold text-gray-500 bg-black/20 px-2 py-1 rounded-md uppercase tracking-tighter">
          {participants.length} / {maxParticipants}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {participants.map((participant) => (
          <div 
            key={participant.user_id}
            className="flex items-center justify-between p-3 rounded-xl bg-background-primary/50 border border-white/5 hover:border-white/10 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <UserAvatar 
                  username={participant.profile?.username || 'User'} 
                  src={participant.profile?.avatar_url || undefined}
                  size="sm"
                />
                {participant.role === 'creator' && (
                  <div className="absolute -top-1 -right-1 bg-amber-500 text-white p-0.5 rounded-full border-2 border-background-secondary shadow-lg">
                    <Crown size={8} />
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors">
                    {participant.profile?.username}
                  </span>
                  {participant.role === 'creator' && (
                    <span className="text-[8px] font-bold text-amber-500 uppercase bg-amber-500/10 px-1.5 py-0.5 rounded">Host</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                   <Star size={10} className="text-yellow-500 fill-yellow-500" />
                   <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{participant.profile?.rating || 1200} Rating</span>
                </div>
              </div>
            </div>

            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
          </div>
        ))}

        {Array.from({ length: Math.max(0, 3 - participants.length) }).map((_, i) => (
          <div key={`empty-${i}`} className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-white/5 opacity-30">
             <div className="w-8 h-8 rounded-full bg-white/5"></div>
             <div className="space-y-1.5">
                <div className="h-2 w-20 bg-white/5 rounded"></div>
                <div className="h-1.5 w-12 bg-white/5 rounded"></div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParticipantList;
