import React from 'react';
import type { Problem } from '../../../types/problem';
import type { ParticipantProgress } from '../../../types/submission';
import ProblemCard from './ProblemCard';

interface ProblemListProps {
  problems: Problem[];
  showIndex?: boolean;
  isLocked?: boolean;
  progress?: ParticipantProgress[];
}

const ProblemList: React.FC<ProblemListProps> = ({ 
  problems, 
  showIndex = false,
  isLocked = false,
  progress = []
}) => {
  if (problems.length === 0) {
    return (
      <div className="text-center py-12 bg-[#2b2d31] rounded-xl border border-white/5 border-dashed">
        <p className="text-gray-500">No problems available yet.</p>
      </div>
    );
  }

  const getStatus = (problemId: string) => {
    return progress.find(p => p.problem_id === problemId)?.status || 'untouched';
  };

  return (
    <div className="grid gap-3">
      {problems.map((problem, index) => (
        <ProblemCard
          key={problem.id}
          problem={problem}
          index={showIndex ? index : undefined}
          isLocked={isLocked}
          status={getStatus(problem.id)}
        />
      ))}
    </div>
  );
};

export default ProblemList;
