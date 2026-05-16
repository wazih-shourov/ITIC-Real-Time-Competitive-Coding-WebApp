import { supabase } from './supabase';
import type { Contest, CreateContestData, ContestParticipant } from '../types/contest';

export const contestService = {
  async getPublicContests(): Promise<Contest[]> {
    const { data, error } = await supabase
      .from('contests')
      .select(`
        *,
        creator:profiles!creator_id(username, avatar_url)
      `)
      .eq('visibility', 'public')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as any[];
  },

  async getContestByInviteCode(inviteCode: string): Promise<Contest | null> {
    const { data, error } = await supabase
      .from('contests')
      .select(`
        *,
        creator:profiles!creator_id(username, avatar_url)
      `)
      .eq('invite_code', inviteCode.toUpperCase())
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data as any;
  },

  async getContestById(id: string): Promise<Contest | null> {
    const { data, error } = await supabase
      .from('contests')
      .select(`
        *,
        creator:profiles!creator_id(username, avatar_url)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data as any;
  },

  async createContest(creatorId: string, contestData: CreateContestData): Promise<Contest> {
    // Check if user is already in any contest
    const { data: existing, error: checkError } = await supabase
      .from('contest_participants')
      .select('contest_id')
      .eq('user_id', creatorId);

    if (checkError) throw checkError;

    if (existing && existing.length > 0) {
      throw new Error('You are already in an active contest. Please exit first.');
    }

    const { data, error } = await supabase
      .from('contests')
      .insert({
        ...contestData,
        creator_id: creatorId,
      })
      .select()
      .single();

    if (error) throw error;
    return data as any;
  },

  async joinContest(contestId: string, userId: string): Promise<void> {
    // Check if user is already in any contest
    const { data: existing, error: checkError } = await supabase
      .from('contest_participants')
      .select('contest_id')
      .eq('user_id', userId);

    if (checkError) throw checkError;

    if (existing && existing.length > 0) {
      // If already in THIS contest, just return
      if (existing.some(p => p.contest_id === contestId)) return;
      
      throw new Error('You are already in an active contest. Please exit first.');
    }

    const { error } = await supabase
      .from('contest_participants')
      .insert({
        contest_id: contestId,
        user_id: userId,
        role: 'participant',
      });

    if (error) {
      if (error.code === '23505') return; // Already joined (race condition)
      throw error;
    }
  },

  async getContestParticipants(contestId: string): Promise<ContestParticipant[]> {
    const { data, error } = await supabase
      .from('contest_participants')
      .select(`
        *,
        profile:profiles!user_id(username, avatar_url, rating)
      `)
      .eq('contest_id', contestId)
      .order('joined_at', { ascending: true });

    if (error) throw error;
    return data as any[];
  },

  async getMyContests(userId: string): Promise<Contest[]> {
    const { data, error } = await supabase
      .from('contest_participants')
      .select(`
        contest:contests(
          *,
          creator:profiles!creator_id(username, avatar_url)
        )
      `)
      .eq('user_id', userId);

    if (error) throw error;
    return (data as any[]).map(item => item.contest);
  },

  async leaveContest(contest_id: string, user_id: string): Promise<void> {
    const { error } = await supabase
      .from('contest_participants')
      .delete()
      .eq('contest_id', contest_id)
      .eq('user_id', user_id);

    if (error) throw error;
  },

  async startContest(contestId: string): Promise<void> {
    const { error } = await supabase
      .from('contests')
      .update({
        status: 'active',
        started_at: new Date().toISOString(),
      })
      .eq('id', contestId);

    if (error) throw error;
  },

  async endContest(contestId: string): Promise<void> {
    const { error } = await supabase
      .from('contests')
      .update({
        status: 'ended',
        ended_at: new Date().toISOString(),
      })
      .eq('id', contestId);

    if (error) throw error;
  },

  async getLeaderboard(contestId: string): Promise<any[]> {
    const { data, error } = await supabase.rpc('get_contest_leaderboard', {
      p_contest_id: contestId,
    });

    if (error) throw error;

    // Transform data to match LeaderboardEntry type if necessary
    return (data as any[]).map((entry, index) => ({
      userId: entry.user_id,
      username: entry.username,
      avatarUrl: entry.avatar_url,
      solvedCount: parseInt(entry.solved_count),
      penalty: Math.floor(entry.total_penalty),
      lastSolveTime: entry.last_solve_at,
      rank: index + 1,
      problems: entry.problem_stats || {},
    }));
  }
};
