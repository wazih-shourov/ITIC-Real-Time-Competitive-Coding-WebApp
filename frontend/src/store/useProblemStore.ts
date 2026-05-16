import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Problem } from '../types/problem';

interface ProblemState {
  currentProblem: Problem | null;
  selectedLanguage: string;
  editorValue: string;
  // Map of problemId -> language -> code
  persistedCode: Record<string, Record<string, string>>;
  
  setCurrentProblem: (problem: Problem | null) => void;
  setSelectedLanguage: (language: string) => void;
  setEditorValue: (value: string) => void;
  resetEditor: () => void;
  clearPersistedCode: () => void;
}

export const useProblemStore = create<ProblemState>()(
  persist(
    (set, get) => ({
      currentProblem: null,
      selectedLanguage: 'javascript',
      editorValue: '',
      persistedCode: {},

      setCurrentProblem: (problem) => {
        if (!problem) {
          set({ currentProblem: null, editorValue: '' });
          return;
        }

        const { selectedLanguage, persistedCode, currentProblem: prevProblem } = get();
        
        // If it's the same problem, don't reset unless necessary
        if (prevProblem?.id === problem.id) {
          set({ currentProblem: problem });
          return;
        }

        const savedCode = persistedCode[problem.id]?.[selectedLanguage];
        
        set({ 
          currentProblem: problem,
          editorValue: savedCode || problem.starter_code[selectedLanguage] || ''
        });
      },

      setSelectedLanguage: (language) => {
        const { currentProblem, persistedCode, editorValue, selectedLanguage: prevLanguage } = get();
        
        // Save current code before switching
        const newPersistedCode = { ...persistedCode };
        if (currentProblem) {
          if (!newPersistedCode[currentProblem.id]) {
            newPersistedCode[currentProblem.id] = {};
          }
          newPersistedCode[currentProblem.id][prevLanguage] = editorValue;
        }

        const savedCodeForNewLang = currentProblem ? newPersistedCode[currentProblem.id]?.[language] : undefined;

        set({ 
          selectedLanguage: language,
          persistedCode: newPersistedCode,
          editorValue: savedCodeForNewLang || currentProblem?.starter_code[language] || ''
        });
      },

      setEditorValue: (value) => {
        const { currentProblem, selectedLanguage, persistedCode } = get();
        
        // Update both the current value and the persisted map for fast recovery
        const newPersistedCode = { ...persistedCode };
        if (currentProblem) {
          if (!newPersistedCode[currentProblem.id]) {
            newPersistedCode[currentProblem.id] = {};
          }
          newPersistedCode[currentProblem.id][selectedLanguage] = value;
        }

        set({ 
          editorValue: value,
          persistedCode: newPersistedCode
        });
      },

      resetEditor: () => {
        const { currentProblem, selectedLanguage, persistedCode } = get();
        if (!currentProblem) return;

        const newPersistedCode = { ...persistedCode };
        if (newPersistedCode[currentProblem.id]) {
          delete newPersistedCode[currentProblem.id][selectedLanguage];
        }

        set({ 
          editorValue: currentProblem.starter_code[selectedLanguage] || '',
          persistedCode: newPersistedCode
        });
      },

      clearPersistedCode: () => set({ persistedCode: {} }),
    }),
    {
      name: 'itic-problem-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        persistedCode: state.persistedCode,
        selectedLanguage: state.selectedLanguage 
      }),
    }
  )
);
