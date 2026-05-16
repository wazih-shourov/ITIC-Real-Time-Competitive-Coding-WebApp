import React from 'react';
import { usePresenceStore, type UserStatus } from '../../../store/usePresenceStore';
import type { ContestParticipant } from '@types/contest';
import { Circle, Terminal, Eye, Coffee } from 'lucide-react';
import { cn } from '@utils/cn';

interface ParticipantPresencePanelProps {
  participants: ContestParticipant[];
}

const ParticipantPresencePanel: React.FC<ParticipantPresencePanelProps> = ({ participants }) => {
  const presence = usePresenceStore((state) => state.participants);

  const getStatusIcon = (status: UserStatus | undefined) => {
    switch (status) {
      case 'coding': return <Terminal size={12} className="text-indigo-400" />;
      case 'viewing_problem': return <Eye size={12} className="text-blue-400" />;
      case 'idle': return <Coffee size={12} className="text-amber-400" />;
      case 'online': return <Circle size={10} fill="currentColor" className="text-emerald-500" />;
      case 'offline': return <Circle size={10} className="text-gray-600" />;
      default: return <Circle size={10} className="text-gray-600" />;
    }
  };

  const getStatusText = (status: UserStatus | undefined) => {
    switch (status) {
      case 'coding': return 'Coding';
      case 'viewing_problem': return 'Viewing Problem';
      case 'idle': return 'Idle';
      case 'online': return 'Online';
      case 'offline': return 'Offline';
      default: return 'Offline';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1f22]/50 rounded-xl border border-white/5 overflow-hidden">
      <div className="px-4 py-3 border-b border-white/5 bg-white/5">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center justify-between">
          <span>Participants</span>
          <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] text-gray-300">
            {participants.length}
          </span>
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
        {participants.map((p) => {
          const userPresence = presence[p.user_id];
          const status = userPresence?.status || 'offline';
          
          return (
            <div 
              key={p.user_id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group cursor-default"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400 border border-indigo-500/20">
                  {p.profile?.username.slice(0, 2).toUpperCase()}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#1e1f22] rounded-full flex items-center justify-center">
                  {getStatusIcon(status)}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-gray-300 group-hover:text-white truncate">
                    {p.profile?.username}
                  </span>
                  {p.role === 'creator' && (
                    <span className="text-[10px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter">
                      Host
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-gray-500 font-medium">
                  {getStatusText(status)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ParticipantPresencePanel;
