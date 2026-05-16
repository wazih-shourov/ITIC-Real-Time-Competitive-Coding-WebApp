export type ContestVisibility = 'public' | 'private';
export type ContestStatus = 'waiting' | 'active' | 'ended';

export interface Contest {
  id: string;
  invite_code: string;
  name: string;
  description: string | null;
  visibility: ContestVisibility;
  status: ContestStatus;
  max_participants: number;
  duration_minutes: number;
  creator_id: string;
  started_at: string | null;
  ended_at: string | null;
  created_at: string;
  updated_at: string;
  creator?: {
    username: string;
    avatar_url: string | null;
  };
}

export interface ContestParticipant {
  contest_id: string;
  user_id: string;
  role: 'creator' | 'participant';
  joined_at: string;
  profile?: {
    username: string;
    avatar_url: string | null;
    rating: number;
  };
}

export interface CreateContestData {
  name: string;
  description?: string;
  visibility: ContestVisibility;
  max_participants: number;
}
