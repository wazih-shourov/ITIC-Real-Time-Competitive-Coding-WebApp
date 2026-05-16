-- Add contest status and timing columns
DO $$ BEGIN
    CREATE TYPE public.contest_status AS ENUM ('waiting', 'active', 'ended');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

ALTER TABLE public.contests 
ADD COLUMN IF NOT EXISTS status public.contest_status DEFAULT 'waiting' NOT NULL,
ADD COLUMN IF NOT EXISTS started_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS ended_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 60 NOT NULL;

-- Update RLS for problems to be stricter: only accessible if contest is active
-- or if the user is the creator of the problem.
DROP POLICY IF EXISTS "problems_select_viewable" ON public.problems;

CREATE POLICY "problems_select_viewable" ON public.problems
    FOR SELECT
    USING (
        auth.uid() = creator_id
        OR EXISTS (
            SELECT 1 FROM public.contest_problems cp
            JOIN public.contests c ON cp.contest_id = c.id
            WHERE cp.problem_id = public.problems.id
            AND (
                -- Host can always see
                c.creator_id = auth.uid()
                OR (
                    -- Participants see only if active
                    c.status = 'active'
                    AND EXISTS (
                        SELECT 1 FROM public.contest_participants p
                        WHERE p.contest_id = c.id
                        AND p.user_id = auth.uid()
                    )
                )
            )
        )
    );
