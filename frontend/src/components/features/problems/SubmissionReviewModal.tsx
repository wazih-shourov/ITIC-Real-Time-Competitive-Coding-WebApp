import React, { useState } from 'react';
import { X, User, Code, Clock, CheckCircle2, XCircle, Trash2, ChevronRight } from 'lucide-react';
import type { SubmissionWithContext, Verdict } from '@types/submission';
import CodeReviewViewer from './CodeReviewViewer';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@utils/cn';
import UserAvatar from '@components/core/UserAvatar';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submissionService } from '@lib/submissions';
import { toast } from 'sonner';

interface SubmissionReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: SubmissionWithContext;
  allSubmissions?: SubmissionWithContext[];
}

const SubmissionReviewModal: React.FC<SubmissionReviewModalProps> = ({
  isOpen,
  onClose,
  submission: initialSubmission,
  allSubmissions = []
}) => {
  const queryClient = useQueryClient();
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionWithContext>(initialSubmission);

  // Filter submissions by the same user to show in side list
  const userSubmissions = allSubmissions.filter(s => s.user_id === selectedSubmission.user_id);

  const verdictMutation = useMutation({
    mutationFn: ({ verdict }: { verdict: Verdict }) => 
      submissionService.updateSubmissionVerdict(
        selectedSubmission.id,
        verdict,
        selectedSubmission.contest_id!,
        selectedSubmission.user_id,
        selectedSubmission.profile.username,
        selectedSubmission.problem.title,
        selectedSubmission.problem_id
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contest-submissions'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      
      // Update local state if needed
      setSelectedSubmission(prev => ({ ...prev, verdict: variables.verdict }));
      toast.success(`Verdict updated to ${variables.verdict.replace('_', ' ')}`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update verdict');
    }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 p-4 lg:p-8">
      <div className="bg-[#2b2d31] w-full max-w-7xl h-full max-h-[900px] rounded-2xl shadow-2xl border border-white/10 overflow-hidden flex flex-col animate-in zoom-in duration-200">
        {/* Header */}
        <div className="h-16 border-b border-white/5 px-6 flex items-center justify-between shrink-0 bg-white/5">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-brand/10 rounded-lg">
              <Code className="text-brand" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">Code Review</h3>
              <p className="text-xs text-gray-400">Reviewing submission from {selectedSubmission.profile.username}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Left Sidebar: Submission History */}
          <div className="w-80 border-r border-white/5 flex flex-col bg-black/20 overflow-hidden">
            <div className="p-4 border-b border-white/5">
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Clock size={12} />
                Participant Submissions
              </h4>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
              {userSubmissions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSubmission(s)}
                  className={cn(
                    "w-full p-3 rounded-xl transition-all flex flex-col gap-1 text-left border",
                    selectedSubmission.id === s.id 
                      ? "bg-brand/10 border-brand/30 ring-1 ring-brand/20" 
                      : "bg-transparent border-transparent hover:bg-white/5"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate max-w-[140px]">{s.problem.title}</span>
                    <span className={cn(
                      "text-[10px] font-black uppercase",
                      s.verdict === 'accepted' ? "text-emerald-500" :
                      s.verdict === 'wrong_answer' ? "text-rose-500" :
                      s.verdict === 'rejected' ? "text-gray-500" : "text-amber-500"
                    )}>
                      {s.verdict === 'accepted' ? 'AC' : 
                       s.verdict === 'wrong_answer' ? 'WA' : 
                       s.verdict === 'rejected' ? 'REJ' : 'PND'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-gray-500 font-mono">{s.language}</span>
                    <span className="text-[10px] text-gray-500">
                      {formatDistanceToNow(new Date(s.submitted_at), { addSuffix: true })}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <div className="p-4 bg-white/5 border-t border-white/5 flex items-center gap-3">
              <UserAvatar username={selectedSubmission.profile.username} src={selectedSubmission.profile.avatar_url} size="sm" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{selectedSubmission.profile.username}</p>
                <p className="text-[10px] text-gray-500">Total: {userSubmissions.length}</p>
              </div>
            </div>
          </div>

          {/* Main Content: Viewer */}
          <div className="flex-1 p-6 bg-black/40">
            <CodeReviewViewer
              code={selectedSubmission.source_code}
              language={selectedSubmission.language}
              verdict={selectedSubmission.verdict}
              onVerdictChange={(verdict) => verdictMutation.mutate({ verdict })}
              isUpdating={verdictMutation.isPending}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionReviewModal;
