import React from 'react';
import { Link } from 'react-router-dom';
import type { Problem } from '../../../types/problem';
import type { ParticipantProblemStatus } from '../../../types/submission';
import { ChevronRight, User, CheckCircle2, Circle } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface ProblemCardProps {
  problem: Problem;
  index?: number;
  showCreator?: boolean;
  isLocked?: boolean;
  status?: ParticipantProblemStatus;
}

const ProblemCard: React.FC<ProblemCardProps> = ({ 
  problem, 
  index, 
  showCreator = true,
  isLocked = false,
  status = 'untouched'
}) => {
  const content = (
    <div className={cn(
      "flex items-center justify-between",
      isLocked && "opacity-50"
    )}>
      <div className="flex items-center gap-4">
        {index !== undefined && (
          <span className="text-xl font-black text-white/10 group-hover:text-white/20 transition-colors">
            {String.fromCharCode(65 + index)}
          </span>
        )}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {status === 'solved' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            ) : status === 'attempted' ? (
              <Circle className="w-4 h-4 text-amber-500 fill-amber-500/20" />
            ) : null}
            <h3 className="font-bold text-gray-200 group-hover:text-white transition-colors">
              {problem.title}
            </h3>
            {isLocked && <div className="w-1.5 h-1.5 rounded-full bg-white/20" />}
          </div>
          <div className="flex items-center gap-3">
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded",
              problem.difficulty === 'easy' && "bg-emerald-500/10 text-emerald-400",
              problem.difficulty === 'medium' && "bg-amber-500/10 text-amber-400",
              problem.difficulty === 'hard' && "bg-rose-500/10 text-rose-400"
            )}>
              {problem.difficulty}
            </span>
            {showCreator && (
              <div className="flex items-center gap-1 text-[10px] text-gray-500 font-medium">
                <User className="w-3 h-3" />
                <span>{problem.creator_id.slice(0, 8)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      {isLocked ? (
        <div className="bg-white/5 p-1.5 rounded-lg">
          <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
      ) : (
        <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
      )}
    </div>
  );

  if (isLocked) {
    return (
      <div className="group block bg-[#2b2d31]/50 border border-white/5 rounded-xl p-4 cursor-not-allowed">
        {content}
      </div>
    );
  }

  return (
    <Link
      to={`/problems/${problem.slug}`}
      className={cn(
        "group block border rounded-xl p-4 transition-all duration-200",
        status === 'solved' 
            ? "bg-emerald-500/5 border-emerald-500/10 hover:border-emerald-500/30" 
            : "bg-[#2b2d31] hover:bg-[#313338] border-white/5 hover:border-white/10"
      )}
    >
      {content}
    </Link>
  );
};

export default ProblemCard;
