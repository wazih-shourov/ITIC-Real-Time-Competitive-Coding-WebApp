-- Create verdict enum
DO $$ BEGIN
    CREATE TYPE public.verdict_type AS ENUM ('pending', 'accepted', 'wrong_answer', 'runtime_error', 'time_limit_exceeded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create submissions table
CREATE TABLE public.submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    contest_id UUID REFERENCES public.contests(id) ON DELETE CASCADE,
    problem_id UUID REFERENCES public.problems(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    language TEXT NOT NULL,
    source_code TEXT NOT NULL,
    verdict public.verdict_type DEFAULT 'pending' NOT NULL,
    execution_time INTEGER, -- in ms
    memory_used INTEGER, -- in KB
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create participant progress table to track solve status and stats per contest
CREATE TABLE public.contest_participant_progress (
    contest_id UUID REFERENCES public.contests(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    problem_id UUID REFERENCES public.problems(id) ON DELETE CASCADE NOT NULL,
    status TEXT CHECK (status IN ('untouched', 'attempted', 'solved')) DEFAULT 'untouched' NOT NULL,
    submission_count INTEGER DEFAULT 0 NOT NULL,
    first_solve_at TIMESTAMP WITH TIME ZONE,
    last_attempt_at TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (contest_id, user_id, problem_id)
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contest_participant_progress ENABLE ROW LEVEL SECURITY;

-- Submissions Policies
-- Users can view their own submissions
CREATE POLICY "submissions_select_own" ON public.submissions
    FOR SELECT
    USING (auth.uid() = user_id);

-- Contest creators can view all submissions in their contest
CREATE POLICY "submissions_select_creator" ON public.submissions
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.contests
            WHERE id = public.submissions.contest_id
            AND creator_id = auth.uid()
        )
    );

-- Users can insert their own submissions if they are in the contest and it's active
CREATE POLICY "submissions_insert_own" ON public.submissions
    FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
        AND (
            contest_id IS NULL -- Allow standalone problem submissions
            OR EXISTS (
                SELECT 1 FROM public.contests c
                JOIN public.contest_participants p ON c.id = p.contest_id
                WHERE c.id = contest_id
                AND p.user_id = auth.uid()
                AND c.status = 'active'
            )
        )
    );

-- Progress Policies
-- Users can view their own progress
CREATE POLICY "progress_select_own" ON public.contest_participant_progress
    FOR SELECT
    USING (auth.uid() = user_id);

-- Everyone can see progress in a contest they are in (for leaderboards later)
CREATE POLICY "progress_select_contest" ON public.contest_participant_progress
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.contest_participants
            WHERE contest_id = public.contest_participant_progress.contest_id
            AND user_id = auth.uid()
        )
    );

-- Grant permissions
GRANT ALL ON TABLE public.submissions TO authenticated, service_role;
GRANT ALL ON TABLE public.contest_participant_progress TO authenticated, service_role;
GRANT SELECT ON TABLE public.submissions TO anon;
GRANT SELECT ON TABLE public.contest_participant_progress TO anon;

-- Function to update participant progress on new submission
CREATE OR REPLACE FUNCTION public.handle_new_submission()
RETURNS trigger AS $$
BEGIN
    -- Only track progress if contest_id is present
    IF new.contest_id IS NOT NULL THEN
        INSERT INTO public.contest_participant_progress (contest_id, user_id, problem_id, status, submission_count, last_attempt_at)
        VALUES (new.contest_id, new.user_id, new.problem_id, 'attempted', 1, new.submitted_at)
        ON CONFLICT (contest_id, user_id, problem_id)
        DO UPDATE SET
            submission_count = contest_participant_progress.submission_count + 1,
            last_attempt_at = new.submitted_at,
            status = CASE 
                WHEN contest_participant_progress.status = 'solved' THEN 'solved'
                ELSE 'attempted'
            END;
    END IF;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_submission_created
    AFTER INSERT ON public.submissions
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_submission();

-- Function to handle verdict update (mark as solved)
CREATE OR REPLACE FUNCTION public.handle_verdict_update()
RETURNS trigger AS $$
BEGIN
    IF new.verdict = 'accepted' AND old.verdict != 'accepted' AND new.contest_id IS NOT NULL THEN
        UPDATE public.contest_participant_progress
        SET 
            status = 'solved',
            first_solve_at = COALESCE(first_solve_at, new.submitted_at)
        WHERE contest_id = new.contest_id
        AND user_id = new.user_id
        AND problem_id = new.problem_id;
    END IF;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_submission_verdict_updated
    AFTER UPDATE OF verdict ON public.submissions
    FOR EACH ROW EXECUTE FUNCTION public.handle_verdict_update();

-- Indexes
CREATE INDEX idx_submissions_user_id ON public.submissions(user_id);
CREATE INDEX idx_submissions_contest_id ON public.submissions(contest_id);
CREATE INDEX idx_submissions_problem_id ON public.submissions(problem_id);
CREATE INDEX idx_progress_contest_user ON public.contest_participant_progress(contest_id, user_id);
