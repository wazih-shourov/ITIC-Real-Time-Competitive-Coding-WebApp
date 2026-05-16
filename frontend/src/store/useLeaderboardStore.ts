import { create } from 'zustand';

export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatarUrl?: string;
  solvedCount: number;
  penalty: number;
  lastSolveTime?: string;
  rank: number;
  problems: Record<string, {
    status: 'solved' | 'attempted' | 'untouched';
    attempts: number;
    solveTime?: string;
  }>;
}

interface LeaderboardState {
  entries: LeaderboardEntry[];
  lastUpdated: string | null;
  setEntries: (entries: LeaderboardEntry[]) => void;
  setLastUpdated: (timestamp: string) => void;
}

export const useLeaderboardStore = create<LeaderboardState>((set) => ({
  entries: [],
  lastUpdated: null,
  setEntries: (entries) => set({ entries }),
  setLastUpdated: (lastUpdated) => set({ lastUpdated }),
}));
