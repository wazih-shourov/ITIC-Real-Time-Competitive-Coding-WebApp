-- Fix RLS policies for contest_problems to allow INSERT and improve SELECT
DROP POLICY IF EXISTS "Contest creators can manage contest problems" ON public.contest_problems;
DROP POLICY IF EXISTS "Contest problems are viewable if contest is visible" ON public.contest_problems;

-- Allow contest creators to manage (SELECT, INSERT, UPDATE, DELETE) problems in their contests
CREATE POLICY "Contest creators can manage contest problems"
    ON public.contest_problems
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.contests
            WHERE id = public.contest_problems.contest_id
            AND creator_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.contests
            WHERE id = public.contest_problems.contest_id
            AND creator_id = auth.uid()
        )
    );

-- Allow participants to view problems in their joined contests
CREATE POLICY "Participants can view contest problems"
    ON public.contest_problems
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.contests c
            WHERE c.id = public.contest_problems.contest_id
            AND (
                c.visibility = 'public'
                OR EXISTS (
                    SELECT 1 FROM public.contest_participants p
                    WHERE p.contest_id = c.id
                    AND p.user_id = auth.uid()
                )
            )
        )
    );
