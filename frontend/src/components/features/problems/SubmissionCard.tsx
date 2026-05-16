import React from 'react';
import type { Submission } from '../../../types/submission';
import VerdictBadge from './VerdictBadge';
import { Clock, Cpu, HardDrive } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface SubmissionCardProps {
  submission: Submission;
}

const SubmissionCard: React.FC<SubmissionCardProps> = ({ submission }) => {
  return (
    <div className="bg-[#1e1f22] border border-white/5 rounded-lg p-3 space-y-3 hover:border-white/10 transition-colors">
      <div className="flex items-center justify-between">
        <VerdictBadge verdict={submission.verdict} />
        <span className="text-[10px] text-gray-500 font-medium">
          {formatDistanceToNow(new Date(submission.submitted_at))} ago
        </span>
      </div>

      <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {submission.language}
        </div>
        {submission.verdict !== 'pending' && (
          <>
            <div className="flex items-center gap-1">
              <Cpu className="w-3 h-3" />
              {submission.execution_time}ms
            </div>
            <div className="flex items-center gap-1">
              <HardDrive className="w-3 h-3" />
              {(submission.memory_used! / 1024).toFixed(1)}MB
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SubmissionCard;
