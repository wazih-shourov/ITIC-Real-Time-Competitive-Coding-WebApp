import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { problemService } from '../../../lib/problems';
import { useAuthStore } from '../../../store/useAuthStore';
import { X, Plus, Trash2, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { ProblemDifficulty, ProblemExample, ProblemConstraint } from '../../../types/problem';

interface CreateProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateProblemModal: React.FC<CreateProblemModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState<ProblemDifficulty>('easy');
  const [description, setDescription] = useState('');
  const [examples, setExamples] = useState<ProblemExample[]>([]);
  const [constraints, setConstraints] = useState<ProblemConstraint[]>([]);

  const createMutation = useMutation({
    mutationFn: (data: any) => problemService.createProblem(user!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problems'] });
      toast.success('Problem created successfully!');
      onClose();
      // Reset form
      setTitle('');
      setDifficulty('easy');
      setDescription('');
      setExamples([]);
      setConstraints([]);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create problem');
    },
  });

  if (!isOpen) return null;

  const addExample = () => {
    setExamples([...examples, { id: crypto.randomUUID(), input: '', output: '', explanation: '' }]);
  };

  const removeExample = (id: string) => {
    setExamples(examples.filter(e => e.id !== id));
  };

  const updateExample = (id: string, field: keyof ProblemExample, value: string) => {
    setExamples(examples.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const addConstraint = () => {
    setConstraints([...constraints, { id: crypto.randomUUID(), text: '' }]);
  };

  const removeConstraint = (id: string) => {
    setConstraints(constraints.filter(c => c.id !== id));
  };

  const updateConstraint = (id: string, text: string) => {
    setConstraints(constraints.map(c => c.id === id ? { ...c, text } : c));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    createMutation.mutate({
      title,
      difficulty,
      description,
      examples,
      constraints,
      starter_code: {
        javascript: '// Write your code here\nfunction solution() {\n\n}',
        python: '# Write your code here\ndef solution():\n    pass',
        cpp: '// Write your code here\n#include <iostream>\n\nint main() {\n    return 0;\n}',
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#2b2d31] w-full max-w-3xl max-h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-white/10 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-[#313338]">
          <h2 className="text-xl font-bold text-white">Create New Problem</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Problem Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Two Sum"
                className="w-full bg-[#1e1f22] border border-white/5 rounded-md px-4 py-2.5 text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as ProblemDifficulty)}
                className="w-full bg-[#1e1f22] border border-white/5 rounded-md px-4 py-2.5 text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Description</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the problem, input format, and output format..."
              rows={6}
              className="w-full bg-[#1e1f22] border border-white/5 rounded-md px-4 py-3 text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            />
          </div>

          {/* Examples */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Examples</label>
              <button
                type="button"
                onClick={addExample}
                className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Example
              </button>
            </div>
            <div className="space-y-4">
              {examples.map((example, index) => (
                <div key={example.id} className="p-4 bg-[#1e1f22] rounded-lg border border-white/5 relative group">
                  <button
                    type="button"
                    onClick={() => removeExample(example.id)}
                    className="absolute top-2 right-2 p-1.5 text-gray-500 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">Input</span>
                      <input
                        type="text"
                        value={example.input}
                        onChange={(e) => updateExample(example.id, 'input', e.target.value)}
                        className="w-full bg-[#2b2d31] border border-white/5 rounded px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">Output</span>
                      <input
                        type="text"
                        value={example.output}
                        onChange={(e) => updateExample(example.id, 'output', e.target.value)}
                        className="w-full bg-[#2b2d31] border border-white/5 rounded px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Explanation (Optional)</span>
                    <input
                      type="text"
                      value={example.explanation}
                      onChange={(e) => updateExample(example.id, 'explanation', e.target.value)}
                      className="w-full bg-[#2b2d31] border border-white/5 rounded px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Constraints */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Constraints</label>
              <button
                type="button"
                onClick={addConstraint}
                className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Constraint
              </button>
            </div>
            <div className="space-y-2">
              {constraints.map((constraint) => (
                <div key={constraint.id} className="flex gap-2">
                  <input
                    type="text"
                    value={constraint.text}
                    onChange={(e) => updateConstraint(constraint.id, e.target.value)}
                    placeholder="e.g. 1 <= nums.length <= 10^4"
                    className="flex-1 bg-[#1e1f22] border border-white/5 rounded px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeConstraint(constraint.id)}
                    className="p-2 text-gray-500 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#313338] border-t border-white/5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={createMutation.isPending}
            className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-md shadow-lg shadow-indigo-500/20 transition-all"
          >
            {createMutation.isPending ? 'Creating...' : 'Create Problem'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProblemModal;
