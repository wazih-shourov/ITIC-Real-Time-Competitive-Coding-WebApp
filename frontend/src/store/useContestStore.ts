import { create } from 'zustand';
import type { Contest } from '../types/contest';

interface ContestState {
  currentContest: Contest | null;
  myContests: Contest[];
  setCurrentContest: (contest: Contest | null) => void;
  setMyContests: (contests: Contest[]) => void;
}

export const useContestStore = create<ContestState>((set) => ({
  currentContest: null,
  myContests: [],
  setCurrentContest: (contest) => set({ currentContest: contest }),
  setMyContests: (contests) => set({ myContests: contests }),
}));
