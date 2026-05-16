import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { submissionService } from '@lib/submissions';
import { useSocket } from '@hooks/useSocket';
import type { SubmissionWithContext } from '@types/submission';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle2, XCircle, Clock, Trash2, ShieldCheck, ExternalLink, Filter, Terminal } from 'lucide-react';
import { cn } from '@utils/cn';
import UserAvatar from '@components/core/UserAvatar';
import SubmissionReviewModal from '../problems/SubmissionReviewModal';
import { motion, AnimatePresence } from 'framer-motion';

interface HostSubmissionSidebarProps {
  contestId: string;
}

const HostSubmissionSidebar: React.FC<HostSubmissionSidebarProps> = ({ contestId }) => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionWithContext | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted'>('all');

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ['contest-submissions', contestId],
    queryFn: () => submissionService.getContestSubmissions(contestId),
    enabled: !!contestId,
    refetchInterval: 30000,
  });

  useEffect(() => {
    if (!socket || !contestId) return;

    const handleUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ['contest-submissions', contestId] });
    };

    socket.on('feed:event', (event: any) => {
      if (event.type === 'submission') handleUpdate();
    });
    
    socket.on('submission:updated', handleUpdate);

    return () => {
      socket.off('feed:event');
      socket.off('submission:updated');
    };
  }, [socket, contestId, queryClient]);

  const filteredSubmissions = submissions.filter(s => {
    if (filter === 'all') return true;
    if (filter === 'pending') return s.verdict === 'pending';
    if (filter === 'accepted') return s.verdict === 'accepted';
    return true;
  });

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case 'accepted': return <CheckCircle2 size={12} className="text-emerald-500" />;
      case 'wrong_answer': return <XCircle size={12} className="text-rose-500" />;
      case 'rejected': return <Trash2 size={12} className="text-surface-500" />;
      default: return <Clock size={12} className="text-amber-500 animate-pulse" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-background-secondary rounded-sm border border-white/5 overflow-hidden shadow-premium">
      <div className="px-4 py-3 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
        <h3 className="text-[10px] font-black text-surface-500 uppercase tracking-[0.2em] flex items-center gap-2">
          <Terminal size={14} strokeWidth={2.5} className="text-brand" />
          Review Command
        </h3>
        <div className="flex items-center gap-1 bg-white/5 p-0.5 rounded-sm">
          <button 
            onClick={() => setFilter('all')}
            className={cn("px-2 py-0.5 rounded-sm text-[9px] font-black uppercase tracking-widest transition-all", filter === 'all' ? "bg-brand text-white shadow-sm" : "text-surface-500 hover:text-white")}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('pending')}
            className={cn("px-2 py-0.5 rounded-sm text-[9px] font-black uppercase tracking-widest transition-all", filter === 'pending' ? "bg-amber-500 text-white shadow-sm" : "text-surface-500 hover:text-white")}
          >
            Pending
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full py-12 space-y-3 opacity-30">
            <div className="w-6 h-6 border-2 border-brand/20 border-t-brand rounded-full animate-spin" />
            <p className="text-[9px] text-surface-500 font-black uppercase tracking-widest">Polling Submissions</p>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12 text-center space-y-3 opacity-30">
            <Terminal size={32} strokeWidth={1} className="text-surface-600" />
            <p className="text-[10px] font-black text-surface-600 uppercase tracking-widest">No review required</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {filteredSubmissions.map((s) => (
              <motion.button
                key={s.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedSubmission(s)}
                className="w-full p-2.5 rounded-sm bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-brand/30 transition-all group flex flex-col gap-2.5 text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserAvatar username={s.profile.username} src={s.profile.avatar_url} size="xs" className="rounded-sm" />
                    <span className="text-[11px] font-bold text-white truncate max-w-[100px]">{s.profile.username}</span>
                  </div>
                  <span className="text-[9px] text-surface-600 font-black uppercase tracking-tight">
                    {formatDistanceToNow(new Date(s.submitted_at), { addSuffix: true })}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-black/20 p-2 rounded-sm border border-white/5 group-hover:border-brand/10 transition-colors">
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-surface-300 truncate tracking-tight">{s.problem.title}</p>
                    <p className="text-[9px] text-surface-500 font-mono mt-0.5 uppercase tracking-tighter">{s.language}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {getVerdictIcon(s.verdict)}
                    <ExternalLink size={12} className="text-surface-600 group-hover:text-brand transition-colors" />
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        )}
      </div>

      {selectedSubmission && (
        <SubmissionReviewModal
          isOpen={!!selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          submission={selectedSubmission}
          allSubmissions={submissions}
        />
      )}
    </div>
  );
};

export default HostSubmissionSidebar;
