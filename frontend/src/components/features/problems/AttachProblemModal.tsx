import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { problemService } from '../../../lib/problems';
import { X, Search, Plus, Check } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../../../utils/cn';

interface AttachProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  contestId: string;
  existingProblemIds: string[];
}

const AttachProblemModal: React.FC<AttachProblemModalProps> = ({ 
  isOpen, 
  onClose, 
  contestId,
  existingProblemIds 
}) => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  const { data: problems, isLoading } = useQuery({
    queryKey: ['problems'],
    queryFn: () => problemService.getProblems(),
  });

  const attachMutation = useMutation({
    mutationFn: ({ problemId, orderIndex }: { problemId: string, orderIndex: number }) => 
      problemService.attachProblemToContest(contestId, problemId, orderIndex),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contest-problems', contestId] });
      toast.success('Problem attached to contest');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to attach problem');
    },
  });

  if (!isOpen) return null;

  const filteredProblems = problems?.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleAttach = (problemId: string) => {
    const orderIndex = existingProblemIds.length;
    attachMutation.mutate({ problemId, orderIndex });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#2b2d31] w-full max-w-2xl max-h-[80vh] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-white/10 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-[#313338]">
          <h2 className="text-xl font-bold text-white">Attach Problem</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-white/5 bg-[#2b2d31]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search problems..."
              className="w-full bg-[#1e1f22] border border-white/5 rounded-md pl-10 pr-4 py-2 text-sm text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Problem List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredProblems?.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No problems found
            </div>
          ) : (
            filteredProblems?.map((problem) => {
              const isAttached = existingProblemIds.includes(problem.id);
              return (
                <div
                  key={problem.id}
                  className="flex items-center justify-between p-4 bg-[#1e1f22] rounded-lg border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="space-y-1">
                    <h4 className="font-semibold text-gray-200">{problem.title}</h4>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded",
                        problem.difficulty === 'easy' && "bg-emerald-500/10 text-emerald-400",
                        problem.difficulty === 'medium' && "bg-amber-500/10 text-amber-400",
                        problem.difficulty === 'hard' && "bg-rose-500/10 text-rose-400"
                      )}>
                        {problem.difficulty}
                      </span>
                      <span className="text-[10px] text-gray-500 uppercase">
                        By {problem.creator_id.slice(0, 8)}...
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => !isAttached && handleAttach(problem.id)}
                    disabled={isAttached || attachMutation.isPending}
                    className={cn(
                      "p-2 rounded-lg transition-all",
                      isAttached 
                        ? "bg-emerald-500/10 text-emerald-400 cursor-default"
                        : "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white"
                    )}
                  >
                    {isAttached ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#313338] border-t border-white/5 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-md transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttachProblemModal;
