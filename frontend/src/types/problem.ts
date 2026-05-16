export type ProblemDifficulty = 'easy' | 'medium' | 'hard';

export interface ProblemExample {
  id: string;
  input: string;
  output: string;
  explanation?: string;
}

export interface ProblemConstraint {
  id: string;
  text: string;
}

export interface Problem {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: ProblemDifficulty;
  starter_code: Record<string, string>;
  examples: ProblemExample[];
  constraints: ProblemConstraint[];
  creator_id: string;
  created_at: string;
  updated_at: string;
}

export interface ContestProblem {
  contest_id: string;
  problem_id: string;
  order_index: number;
  problem?: Problem;
}

export interface CreateProblemData {
  title: string;
  description: string;
  difficulty: ProblemDifficulty;
  starter_code: Record<string, string>;
  examples: ProblemExample[];
  constraints: ProblemConstraint[];
}
