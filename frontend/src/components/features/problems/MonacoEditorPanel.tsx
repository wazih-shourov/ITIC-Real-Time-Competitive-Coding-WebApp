import React, { useEffect } from 'react';
import { useProblemStore } from '../../../store/useProblemStore';
import { useSubmissionStore } from '../../../store/useSubmissionStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { submissionService } from '../../../lib/submissions';
import CodeEditor from '../../core/CodeEditor';
import { RotateCcw, Settings, ChevronDown, Play, Send } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSocket } from '../../../hooks/useSocket';
import { toast } from 'sonner';

const LANGUAGES = [
  { id: 'javascript', name: 'JavaScript' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'python', name: 'Python' },
  { id: 'java', name: 'Java' },
  { id: 'cpp', name: 'C++' },
];

interface MonacoEditorPanelProps {
  problemId: string;
  contestId?: string;
}

const MonacoEditorPanel: React.FC<MonacoEditorPanelProps> = ({ problemId, contestId }) => {
  const queryClient = useQueryClient();
  const { user, profile } = useAuthStore();
  const { socket } = useSocket();
  const { 
    selectedLanguage, 
    setSelectedLanguage, 
    editorValue, 
    setEditorValue, 
    resetEditor,
    currentProblem
  } = useProblemStore();
  
  const { setIsSubmitting, isSubmitting } = useSubmissionStore();

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('You must be logged in to submit.');
      const username = profile?.username || user.email?.split('@')[0] || 'Anonymous';

      const submission = await submissionService.submitCode(user.id, username, {
        problem_id: problemId,
        contest_id: contestId,
        language: selectedLanguage,
        source_code: editorValue,
      });

      // Emit socket event for the feed
      if (socket && contestId) {
        socket.emit('submission:created', {
          contestId,
          problemId,
          userId: user.id,
          username,
          problemTitle: currentProblem?.title || 'Problem'
        });
      }

      return submission;
    },

    onMutate: () => setIsSubmitting(true),
    onSuccess: () => {
      toast.success('Code submitted! Judging in progress...');
      queryClient.invalidateQueries({ queryKey: ['submissions', user?.id, problemId] });
      queryClient.invalidateQueries({ queryKey: ['progress', user?.id, contestId] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit code');
    },
    onSettled: () => setIsSubmitting(false),
  });

  // Handle coding status
  useEffect(() => {
    if (!socket || !contestId || !editorValue.trim()) return;

    const timer = setTimeout(() => {
      socket.emit('participant:status', { contestId, status: 'coding' });
    }, 1000);

    return () => clearTimeout(timer);
  }, [editorValue, socket, contestId]);

  return (
    <div className="flex flex-col h-full bg-[#1e1f22]">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-[#2b2d31]">
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="appearance-none bg-[#1e1f22] text-sm text-gray-300 px-3 py-1.5 pr-8 rounded border border-white/10 hover:border-white/20 focus:outline-none transition-colors cursor-pointer"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetEditor}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors"
            title="Reset Code"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors"
            title="Editor Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-hidden">
        <CodeEditor
          height="100%"
          language={selectedLanguage}
          value={editorValue}
          onChange={(value) => setEditorValue(value || '')}
          options={{
            fontSize: 14,
            fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
            fontLigatures: true,
            lineHeight: 22,
          }}
        />
      </div>

      {/* Editor Footer */}
      <div className="px-4 py-2 border-t border-white/5 bg-[#2b2d31] flex justify-end gap-3">
        <button className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-gray-400 hover:text-white transition-colors">
          <Play size={14} />
          Run
        </button>
        <button 
          onClick={() => submitMutation.mutate()}
          disabled={isSubmitting || !editorValue.trim()}
          className="flex items-center gap-2 px-6 py-1.5 text-sm font-bold bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded transition-all shadow-lg shadow-indigo-500/20"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <Send size={14} />
          )}
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </div>
  );
};

export default MonacoEditorPanel;
