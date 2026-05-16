import React, { useState } from 'react';
import { X, Hash, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@store/useAuthStore';
import { contestService } from '@lib/contests';
import { toast } from 'sonner';

interface JoinContestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (contestId: string) => void;
}

const JoinContestModal: React.FC<JoinContestModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuthStore();
  const [inviteCode, setInviteCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!inviteCode.trim()) {
      toast.error('Invite code is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const contest = await contestService.getContestByInviteCode(inviteCode);
      
      if (!contest) {
        toast.error('Invalid Invite Code', {
            description: 'Please check the code and try again.'
        });
        return;
      }

      await contestService.joinContest(contest.id, user.id);
      toast.success('Joined contest successfully!');
      onSuccess(contest.id);
      onClose();
    } catch (error: any) {
      console.error('[JoinContest] Error:', error);
      toast.error(error.message || 'Failed to join contest');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-background-secondary w-full max-w-sm rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-2">
            <Hash className="text-brand" size={20} />
            <h2 className="text-lg font-bold">Join Contest</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Invite Code</label>
            <div className="relative">
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                placeholder="E.G. A1B2C3"
                className="w-full bg-background-primary border border-white/10 rounded-lg px-4 py-3 text-center text-xl font-mono font-bold tracking-widest text-brand focus:outline-none focus:border-brand/50 transition-colors placeholder:text-gray-600 placeholder:font-sans placeholder:text-sm placeholder:tracking-normal"
                maxLength={6}
                autoFocus
              />
            </div>
            <p className="text-[10px] text-gray-500 text-center uppercase font-bold tracking-tight">Enter the 6-character code provided by the creator</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || inviteCode.length < 6}
            className="w-full flex items-center justify-center gap-2 bg-brand hover:bg-brand-hover text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-brand/20 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isSubmitting ? 'Joining...' : (
              <>
                Join Contest
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinContestModal;
