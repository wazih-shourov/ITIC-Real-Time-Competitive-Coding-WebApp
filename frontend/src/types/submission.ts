export type Verdict = 'pending' | 'accepted' | 'wrong_answer' | 'runtime_error' | 'time_limit_exceeded' | 'rejected';

export interface Submission {
  id: string;
  contest_id: string | null;
  problem_id: string;
  user_id: string;
  language: string;
  source_code: string;
  verdict: Verdict;
  execution_time: number | null;
  memory_used: number | null;
  submitted_at: string;
  created_at: string;
}

export interface SubmissionWithContext extends Submission {
  profile: {
    username: string;
    avatar_url: string | null;
  };
  problem: {
    title: string;
  };
}

export type ParticipantProblemStatus = 'untouched' | 'attempted' | 'solved';

export interface ParticipantProgress {
  contest_id: string;
  user_id: string;
  problem_id: string;
  status: ParticipantProblemStatus;
  submission_count: number;
  first_solve_at: string | null;
  last_attempt_at: string | null;
}

export interface CreateSubmissionData {
  contest_id?: string;
  problem_id: string;
  language: string;
  source_code: string;
}
