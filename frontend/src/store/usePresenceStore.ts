import { create } from 'zustand';

export type UserStatus = 'online' | 'offline' | 'coding' | 'idle' | 'viewing_problem';

interface PresenceState {
  participants: Record<string, {
    status: UserStatus;
    lastSeen: string;
  }>;
  updateParticipant: (userId: string, status: UserStatus) => void;
  setParticipants: (participants: Record<string, { status: UserStatus; lastSeen: string }>) => void;
}

export const usePresenceStore = create<PresenceState>((set) => ({
  participants: {},
  updateParticipant: (userId, status) => set((state) => ({
    participants: {
      ...state.participants,
      [userId]: { status, lastSeen: new Date().toISOString() }
    }
  })),
  setParticipants: (participants) => set({ participants }),
}));
