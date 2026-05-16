import React from 'react';
import CodeEditor from '@components/core/CodeEditor';
import type { Verdict } from '@types/submission';
import { CheckCircle2, XCircle, AlertCircle, Clock, Trash2 } from 'lucide-react';
import { cn } from '@utils/cn';

interface CodeReviewViewerProps {
  code: string;
  language: string;
  verdict: Verdict;
  onVerdictChange: (verdict: Verdict) => void;
  isUpdating?: boolean;
}

const CodeReviewViewer: React.FC<CodeReviewViewerProps> = ({
  code,
  language,
  verdict,
  onVerdictChange,
  isUpdating
}) => {
  const verdictOptions: { label: string; value: Verdict; icon: any; color: string; hover: string }[] = [
    { label: 'Accepted', value: 'accepted', icon: CheckCircle2, color: 'text-emerald-500', hover: 'hover:bg-emerald-500/10' },
    { label: 'Wrong Answer', value: 'wrong_answer', icon: XCircle, color: 'text-rose-500', hover: 'hover:bg-rose-500/10' },
    { label: 'Rejected', value: 'rejected', icon: Trash2, color: 'text-gray-400', hover: 'hover:bg-gray-400/10' },
  ];

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-white/5 rounded-lg text-xs font-mono text-gray-400 border border-white/5 uppercase">
            {language}
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className={cn(
            "flex items-center gap-2 font-bold text-sm",
            verdict === 'accepted' ? "text-emerald-400" :
            verdict === 'wrong_answer' ? "text-rose-400" :
            verdict === 'rejected' ? "text-gray-400" : "text-amber-400"
          )}>
            {verdict === 'accepted' && <CheckCircle2 size={16} />}
            {verdict === 'wrong_answer' && <XCircle size={16} />}
            {verdict === 'rejected' && <Trash2 size={16} />}
            {verdict === 'pending' && <Clock size={16} />}
            {verdict.replace('_', ' ').toUpperCase()}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {verdictOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onVerdictChange(option.value)}
              disabled={isUpdating || verdict === option.value}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                verdict === option.value 
                  ? "bg-white/10 border-white/20 text-white" 
                  : cn("border-transparent text-gray-400", option.hover)
              )}
            >
              <option.icon size={14} className={option.color} />
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-0 relative">
        <CodeEditor
          value={code}
          language={language.toLowerCase()}
          options={{
            readOnly: true,
            domReadOnly: true,
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            minimap: { enabled: true },
            padding: { top: 20, bottom: 20 }
          }}
          height="100%"
        />
        {isUpdating && (
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center z-10">
            <div className="bg-[#2b2d31] px-4 py-2 rounded-lg border border-white/10 shadow-xl flex items-center gap-3">
              <div className="w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-bold text-white">Updating Verdict...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeReviewViewer;
