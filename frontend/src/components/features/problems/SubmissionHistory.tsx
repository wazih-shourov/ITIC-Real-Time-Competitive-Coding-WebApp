import React from 'react';
import type { Submission } from '../../../types/submission';
import SubmissionCard from './SubmissionCard';
import { History } from 'lucide-react';

interface SubmissionHistoryProps {
  submissions: Submission[];
  isLoading: boolean;
}

const SubmissionHistory: React.FC<SubmissionHistoryProps> = ({ submissions, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3 text-gray-500">
        <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-bold uppercase tracking-widest">Loading History...</span>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3 text-gray-500">
        <History className="w-8 h-8 opacity-20" />
        <span className="text-xs font-bold uppercase tracking-widest">No Submissions Yet</span>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4">
      {submissions.map((submission) => (
        <SubmissionCard key={submission.id} submission={submission} />
      ))}
    </div>
  );
};

export default SubmissionHistory;
