import { create } from 'zustand';
import type { Submission } from '../types/submission';

interface SubmissionState {
  isSubmitting: boolean;
  latestSubmission: Submission | null;
  
  setIsSubmitting: (isSubmitting: boolean) => void;
  setLatestSubmission: (submission: Submission | null) => void;
}

export const useSubmissionStore = create<SubmissionState>((set) => ({
  isSubmitting: false,
  latestSubmission: null,

  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
  setLatestSubmission: (submission) => set({ latestSubmission: submission }),
}));
