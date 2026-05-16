import React, { useState } from 'react';
import { Trophy, Globe, Lock, Share2, LogOut, AlertTriangle, X } from 'lucide-react';
import type { Contest } from '@/types/contest';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { contestService } from '@lib/contests';
import { useAuthStore } from '@store/useAuthStore';
import { useQueryClient } from '@tanstack/react-query';

interface ContestHeaderProps {
  contest: Contest;
}

const ContestHeader: React.FC<ContestHeaderProps> = ({ contest }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const copyInviteCode = () => {
    navigator.clipboard.writeText(contest.invite_code);
    toast.success('Invite code copied to clipboard!', {
      description: `Code: ${contest.invite_code}`
    });
  };

  const handleExit = async () => {
    if (!user) return;
    setIsExiting(true);
    try {
      await contestService.leaveContest(contest.id, user.id);
      
      // Invalidate all contest related queries to ensure UI is in sync
      await queryClient.invalidateQueries({ queryKey: ['myContests', user.id] });
      await queryClient.invalidateQueries({ queryKey: ['publicContests'] });
      
      toast.success('Exited contest successfully');
      navigate('/contests');
    } catch (error: any) {
      toast.error('Failed to exit contest');
      console.error(error);
    } finally {
      setIsExiting(false);
      setShowExitConfirm(false);
    }
  };

  return (
    <div className="bg-background-secondary border-b border-white/5 p-6">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={() => setShowExitConfirm(true)}
          className="flex items-center gap-2 text-gray-400 hover:text-red-400 mb-6 transition-colors group"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-wider">Exit Contest</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="bg-brand/10 p-4 rounded-2xl text-brand shadow-lg shadow-brand/5">
              <Trophy size={32} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-gray-100">{contest.name}</h1>
                <div className="flex gap-2">
                  {contest.visibility === 'public' ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      <Globe size={10} /> Public
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      <Lock size={10} /> Private
                    </span>
                  )}
                </div>
              </div>
              <p className="text-gray-400 max-w-2xl">{contest.description || 'No description provided for this contest.'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="bg-background-primary border border-white/10 rounded-xl p-3 flex flex-col items-center min-w-[120px]">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Invite Code</span>
                <button 
                  onClick={copyInviteCode}
                  className="flex items-center gap-2 group"
                >
                  <span className="text-xl font-mono font-bold text-brand tracking-widest">{contest.invite_code}</span>
                  <Share2 size={14} className="text-gray-500 group-hover:text-brand transition-colors" />
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-background-secondary w-full max-w-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={32} />
              </div>
              <h2 className="text-2xl font-bold mb-2">Exit Contest</h2>
              <p className="text-gray-400 mb-8">
                Are you sure you want to exit this contest? You will need an invite code to rejoin if it's private.
              </p>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setShowExitConfirm(false)}
                  disabled={isExiting}
                  className="flex-1 px-6 py-3 rounded-xl font-bold text-gray-300 hover:bg-white/5 transition-colors border border-white/5"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExit}
                  disabled={isExiting}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-red-500/20 disabled:opacity-50"
                >
                  {isExiting ? 'Exiting...' : 'Yes, Exit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContestHeader;
