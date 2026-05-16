import React, { useState } from 'react';
import { X, Trophy, Users, Globe, Lock } from 'lucide-react';
import { useAuthStore } from '@store/useAuthStore';
import { contestService } from '@lib/contests';
import { toast } from 'sonner';
import type { Contest, ContestVisibility } from '@/types/contest';

interface CreateContestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (contest: Contest) => void;
}

const CreateContestModal: React.FC<CreateContestModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuthStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<ContestVisibility>('public');
  const [maxParticipants, setMaxParticipants] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!name.trim()) {
      toast.error('Contest name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const contest = await contestService.createContest(user.id, {
        name,
        description,
        visibility,
        max_participants: maxParticipants,
      });
      toast.success('Contest created successfully!');
      onSuccess(contest);
      onClose();
    } catch (error: any) {
      console.error('[CreateContest] Error:', error);
      toast.error(error.message || 'Failed to create contest');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-background-secondary w-full max-w-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-2">
            <Trophy className="text-brand" size={20} />
            <h2 className="text-lg font-bold">Create New Contest</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contest Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Epic Code Challenge"
              className="w-full bg-background-primary border border-white/10 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:border-brand/50 transition-colors"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the rules and goals..."
              rows={3}
              className="w-full bg-background-primary border border-white/10 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:border-brand/50 transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Visibility</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setVisibility('public')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border transition-all ${
                    visibility === 'public'
                      ? 'bg-brand/10 border-brand text-brand'
                      : 'bg-background-primary border-white/10 text-gray-400 hover:bg-white/5'
                  }`}
                >
                  <Globe size={16} />
                  <span className="text-sm font-medium">Public</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVisibility('private')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border transition-all ${
                    visibility === 'private'
                      ? 'bg-brand/10 border-brand text-brand'
                      : 'bg-background-primary border-white/10 text-gray-400 hover:bg-white/5'
                  }`}
                >
                  <Lock size={16} />
                  <span className="text-sm font-medium">Private</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Max Participants</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type="number"
                  min="2"
                  max="100"
                  value={maxParticipants}
                  onChange={(e) => setMaxParticipants(parseInt(e.target.value))}
                  className="w-full bg-background-primary border border-white/10 rounded-lg pl-10 pr-4 py-2 text-gray-100 focus:outline-none focus:border-brand/50 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg font-bold text-gray-400 hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-[2] bg-brand hover:bg-brand-hover text-white font-bold py-2.5 rounded-lg transition-all shadow-lg shadow-brand/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Contest'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateContestModal;
