import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { submissionService } from '../../../lib/submissions';
import { useAuthStore } from '../../../store/useAuthStore';
import SubmissionHistory from './SubmissionHistory';
import { History, Layout } from 'lucide-react';
import { cn } from '@utils/cn';

interface SubmissionPanelProps {
  problemId: string;
  contestId?: string;
}

const SubmissionPanel: React.FC<SubmissionPanelProps> = ({ problemId, contestId }) => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = React.useState<'history' | 'status'>('history');

  const { data: submissions, isLoading } = useQuery({
    queryKey: ['submissions', user?.id, problemId, contestId],
    queryFn: () => submissionService.getSubmissions(user!.id, problemId, contestId),
    enabled: !!user,
    refetchInterval: (query) => {
        // If there are pending submissions, refetch frequently
        const hasPending = query.state.data?.some(s => s.verdict === 'pending');
        return hasPending ? 2000 : false;
    }
  });

  return (
    <div className="flex flex-col h-full bg-[#2b2d31] border-l border-white/5">
      {/* Tabs */}
      <div className="flex border-b border-white/5 bg-[#1e1f22]/50">
        <button
          onClick={() => setActiveTab('history')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-wider transition-all",
            activeTab === 'history' ? "text-indigo-400 bg-white/5" : "text-gray-500 hover:text-gray-300"
          )}
        >
          <History size={14} />
          History
        </button>
        <button
          onClick={() => setActiveTab('status')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-wider transition-all",
            activeTab === 'status' ? "text-indigo-400 bg-white/5" : "text-gray-500 hover:text-gray-300"
          )}
        >
          <Layout size={14} />
          Stats
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeTab === 'history' ? (
          <SubmissionHistory submissions={submissions || []} isLoading={isLoading} />
        ) : (
          <div className="p-8 text-center space-y-4">
             <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-gray-600">
                <Layout size={32} />
             </div>
             <div className="space-y-1">
                <h4 className="text-sm font-bold text-gray-300 uppercase">Analysis Platform</h4>
                <p className="text-xs text-gray-500 leading-relaxed">Detailed runtime and memory performance metrics will appear here after successful submissions.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionPanel;
