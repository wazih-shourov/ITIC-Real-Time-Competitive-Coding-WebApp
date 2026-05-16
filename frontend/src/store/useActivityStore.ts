import { create } from 'zustand';

export interface ActivityEvent {
  id: string;
  type: 'submission' | 'solve' | 'contest_start' | 'contest_end' | 'join';
  userId: string;
  username: string;
  problemId?: string;
  problemTitle?: string;
  timestamp: string;
}

interface ActivityState {
  events: ActivityEvent[];
  addEvent: (event: Omit<ActivityEvent, 'id'>) => void;
  clearEvents: () => void;
}

export const useActivityStore = create<ActivityState>((set) => ({
  events: [],
  addEvent: (event) => set((state) => ({
    events: [
      { ...event, id: Math.random().toString(36).substring(7) },
      ...state.events.slice(0, 49) // Keep last 50 events
    ]
  })),
  clearEvents: () => set({ events: [] }),
}));
