import { supabase } from './supabase';
import type { Problem, CreateProblemData, ContestProblem } from '../types/problem';

export const problemService = {
  async getProblems(): Promise<Problem[]> {
    const { data, error } = await supabase
      .from('problems')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Problem[];
  },

  async getProblemById(id: string): Promise<Problem | null> {
    const { data, error } = await supabase
      .from('problems')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data as Problem;
  },

  async getProblemBySlug(slug: string): Promise<Problem | null> {
    const { data, error } = await supabase
      .from('problems')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data as Problem;
  },

  async createProblem(creatorId: string, problemData: CreateProblemData): Promise<Problem> {
    const slug = problemData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const { data, error } = await supabase
      .from('problems')
      .insert({
        ...problemData,
        slug,
        creator_id: creatorId,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Problem;
  },

  async updateProblem(id: string, problemData: Partial<CreateProblemData>): Promise<Problem> {
    const updateData: any = { ...problemData };
    if (problemData.title) {
      updateData.slug = problemData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    const { data, error } = await supabase
      .from('problems')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Problem;
  },

  async getContestProblems(contestId: string): Promise<ContestProblem[]> {
    const { data, error } = await supabase
      .from('contest_problems')
      .select(`
        *,
        problem:problems(*)
      `)
      .eq('contest_id', contestId)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data as any[];
  },

  async attachProblemToContest(contestId: string, problemId: string, orderIndex: number): Promise<void> {
    const { error } = await supabase
      .from('contest_problems')
      .insert({
        contest_id: contestId,
        problem_id: problemId,
        order_index: orderIndex,
      });

    if (error) throw error;
  },

  async detachProblemFromContest(contestId: string, problemId: string): Promise<void> {
    const { error } = await supabase
      .from('contest_problems')
      .delete()
      .eq('contest_id', contestId)
      .eq('problem_id', problemId);

    if (error) throw error;
  },

  async updateContestProblemOrder(contestId: string, problemId: string, orderIndex: number): Promise<void> {
    const { error } = await supabase
      .from('contest_problems')
      .update({ order_index: orderIndex })
      .eq('contest_id', contestId)
      .eq('problem_id', problemId);

    if (error) throw error;
  }
};
