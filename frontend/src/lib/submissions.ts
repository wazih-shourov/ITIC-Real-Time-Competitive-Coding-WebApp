import { supabase } from './supabase';
import { socket } from './socket';
import type { Submission, CreateSubmissionData, ParticipantProgress, Verdict } from '../types/submission';

export const submissionService = {
  async getSubmissions(userId: string, problemId?: string, contestId?: string): Promise<Submission[]> {
    let query = supabase
      .from('submissions')
      .select('*')
      .eq('user_id', userId)
      .order('submitted_at', { ascending: false });

    if (problemId) query = query.eq('problem_id', problemId);
    if (contestId) query = query.eq('contest_id', contestId);

    const { data, error } = await query;
    if (error) throw error;
    return data as Submission[];
  },

  async getParticipantProgress(contestId: string, userId: string): Promise<ParticipantProgress[]> {
    const { data, error } = await supabase
      .from('contest_participant_progress')
      .select('*')
      .eq('contest_id', contestId)
      .eq('user_id', userId);

    if (error) throw error;
    return data as ParticipantProgress[];
  },

  async getContestSubmissions(contestId: string): Promise<Submission[]> {
    const { data, error } = await supabase
      .from('submissions')
      .select(`
        *,
        profile:profiles(username, avatar_url),
        problem:problems(title)
      `)
      .eq('contest_id', contestId)
      .order('submitted_at', { ascending: false });

    if (error) throw error;
    return data as any[];
  },

  async updateSubmissionVerdict(submissionId: string, verdict: Verdict, contestId: string, userId: string, username: string, problemTitle: string, problemId: string): Promise<void> {
    const { error } = await supabase
      .from('submissions')
      .update({ verdict })
      .eq('id', submissionId);

    if (error) throw error;

    // Emit socket event to notify everyone
    socket.emit('submission:judged', {
      contestId,
      problemId,
      userId,
      verdict,
      username,
      problemTitle
    });
  },

  async submitCode(userId: string, username: string, data: CreateSubmissionData): Promise<Submission> {
    // 1. Create the pending submission
    const { data: submission, error } = await supabase
      .from('submissions')
      .insert({
        ...data,
        user_id: userId,
        verdict: 'pending',
      })
      .select()
      .single();

    if (error) throw error;

    // 2. Trigger simulated judging (async)
    this.simulateJudging(submission.id, userId, username);

    return submission as Submission;
  },

  async simulateJudging(submissionId: string, userId: string, username: string): Promise<void> {
    // Artificial delay for realism (1.5s to 4s)
    const delay = Math.floor(Math.random() * 2500) + 1500;
    
    setTimeout(async () => {
      const verdicts: Verdict[] = ['accepted', 'accepted', 'accepted', 'wrong_answer', 'runtime_error', 'time_limit_exceeded'];
      const finalVerdict = verdicts[Math.floor(Math.random() * verdicts.length)];
      
      const executionTime = Math.floor(Math.random() * 800) + 50;
      const memoryUsed = Math.floor(Math.random() * 32000) + 1024;

      const { data: updated, error } = await supabase
        .from('submissions')
        .update({
          verdict: finalVerdict,
          execution_time: executionTime,
          memory_used: memoryUsed,
        })
        .eq('id', submissionId)
        .select(`
          *,
          problem:problems(title)
        `)
        .single();

      if (!error && updated && updated.contest_id) {
        // Emit judged event via socket
        socket.emit('submission:judged', {
          contestId: updated.contest_id,
          problemId: updated.problem_id,
          userId,
          verdict: finalVerdict,
          username,
          problemTitle: (updated as any).problem?.title || 'Problem'
        });
      }
        
    }, delay);
  }
};
