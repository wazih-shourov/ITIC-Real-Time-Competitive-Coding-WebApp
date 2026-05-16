-- 1. Ensure RLS is enabled
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contest_problems ENABLE ROW LEVEL SECURITY;

-- 2. Grant explicit table permissions to authenticated and service_role
-- This is a critical step in Supabase to sync database-level permissions with PostgREST
GRANT ALL ON TABLE public.problems TO authenticated, service_role;
GRANT ALL ON TABLE public.contest_problems TO authenticated, service_role;
GRANT SELECT ON TABLE public.problems TO anon;
GRANT SELECT ON TABLE public.contest_problems TO anon;

-- 3. Drop all existing policies to ensure a clean state
DROP POLICY IF EXISTS "Creators can manage their own problems" ON public.problems;
DROP POLICY IF EXISTS "Problems are viewable if they belong to a visible contest" ON public.problems;
DROP POLICY IF EXISTS "Contest creators can manage contest problems" ON public.contest_problems;
DROP POLICY IF EXISTS "Contest problems are viewable if contest is visible" ON public.contest_problems;
DROP POLICY IF EXISTS "Participants can view contest problems" ON public.contest_problems;

-- 4. Problems Policies
-- Creators have full control over their own problems
CREATE POLICY "problems_manage_own" ON public.problems
    FOR ALL 
    TO authenticated
    USING (auth.uid() = creator_id)
    WITH CHECK (auth.uid() = creator_id);

-- Problems are viewable if they are part of a contest you can see
CREATE POLICY "problems_select_viewable" ON public.problems
    FOR SELECT
    USING (
        auth.uid() = creator_id
        OR EXISTS (
            SELECT 1 FROM public.contest_problems cp
            JOIN public.contests c ON cp.contest_id = c.id
            WHERE cp.problem_id = public.problems.id
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

-- 5. Contest Problems Policies
-- Contest creators can add/remove/reorder problems in their contests
CREATE POLICY "contest_problems_manage_creator" ON public.contest_problems
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

-- Anyone can see which problems belong to which contest (access to actual problem data is handled by problems table RLS)
CREATE POLICY "contest_problems_select_all" ON public.contest_problems
    FOR SELECT
    USING (true);
