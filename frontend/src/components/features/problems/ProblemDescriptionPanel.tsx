import React from 'react';
import type { Problem } from '../../../types/problem';
import { cn } from '../../../utils/cn';

interface ProblemDescriptionPanelProps {
  problem: Problem;
}

const ProblemDescriptionPanel: React.FC<ProblemDescriptionPanelProps> = ({ problem }) => {
  return (
    <div className="flex flex-col h-full bg-[#2b2d31] overflow-y-auto custom-scrollbar">
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">{problem.title}</h1>
            <span className={cn(
              "px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider",
              problem.difficulty === 'easy' && "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
              problem.difficulty === 'medium' && "bg-amber-500/10 text-amber-400 border border-amber-500/20",
              problem.difficulty === 'hard' && "bg-rose-500/10 text-rose-400 border border-rose-500/20"
            )}>
              {problem.difficulty}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="prose prose-invert max-w-none">
          <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
            {problem.description}
          </div>
        </div>

        {/* Examples */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Examples</h3>
          <div className="space-y-6">
            {problem.examples.map((example, index) => (
              <div key={example.id || index} className="space-y-3">
                <p className="text-sm font-medium text-gray-400">Example {index + 1}:</p>
                <div className="bg-[#1e1f22] rounded-lg border border-white/5 p-4 space-y-3 font-mono text-sm">
                  <div className="space-y-1">
                    <span className="text-gray-500 block">Input:</span>
                    <code className="text-indigo-400">{example.input}</code>
                  </div>
                  <div className="space-y-1">
                    <span className="text-gray-500 block">Output:</span>
                    <code className="text-emerald-400">{example.output}</code>
                  </div>
                  {example.explanation && (
                    <div className="space-y-1">
                      <span className="text-gray-500 block">Explanation:</span>
                      <p className="text-gray-300 font-sans italic">{example.explanation}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Constraints */}
        {problem.constraints && problem.constraints.length > 0 && (
          <div className="space-y-4 pb-8">
            <h3 className="text-lg font-semibold text-white">Constraints</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-300 text-sm marker:text-indigo-500">
              {problem.constraints.map((constraint, index) => (
                <li key={constraint.id || index} className="pl-2">
                  {constraint.text}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemDescriptionPanel;
