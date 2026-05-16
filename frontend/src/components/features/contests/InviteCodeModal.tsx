import React from 'react';
import { X, Share2, Rocket } from 'lucide-react';
import { toast } from 'sonner';

interface InviteCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  inviteCode: string;
  contestName: string;
}

const InviteCodeModal: React.FC<InviteCodeModalProps> = ({ isOpen, onClose, inviteCode, contestName }) => {
  if (!isOpen) return null;

  const copyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    toast.success('Invite code copied!');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-background-secondary w-full max-w-sm rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-brand/20 rounded-2xl flex items-center justify-center text-brand mx-auto mb-6 shadow-lg shadow-brand/10">
            <Rocket size={40} className="animate-bounce" />
          </div>
          
          <h2 className="text-2xl font-bold mb-2">Contest Created!</h2>
          <p className="text-gray-400 text-sm mb-8">
            Your contest <span className="text-gray-100 font-bold">"{contestName}"</span> is ready. Share this code with others to join.
          </p>

          <div className="bg-background-primary border border-white/10 rounded-2xl p-6 mb-8 relative group">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-background-secondary px-3 py-0.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest border border-white/10 rounded-full">
              Invite Code
            </span>
            <div className="text-4xl font-mono font-bold text-brand tracking-[0.2em] mb-4">
              {inviteCode}
            </div>
            <button 
              onClick={copyCode}
              className="flex items-center gap-2 mx-auto text-gray-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-wider"
            >
              <Share2 size={16} />
              Copy Code
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-white text-black hover:bg-gray-200 font-bold py-4 rounded-2xl transition-all shadow-xl shadow-white/5 active:scale-95"
          >
            Enter Lobby
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteCodeModal;
