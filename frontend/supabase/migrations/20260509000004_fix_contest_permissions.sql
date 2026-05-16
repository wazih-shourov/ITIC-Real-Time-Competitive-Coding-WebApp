-- 1. Grant explicit table permissions to the authenticated and service_role
-- This ensures the database-level permissions are in sync with RLS
GRANT ALL ON TABLE public.contests TO authenticated, service_role;
GRANT ALL ON TABLE public.contest_participants TO authenticated, service_role;

-- 2. Grant execute permissions on all helper functions
-- Required for generate_invite_code() to work during INSERT
GRANT EXECUTE ON FUNCTION public.generate_invite_code() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.check_is_contest_participant(UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.check_is_contest_creator(UUID) TO authenticated, service_role;

-- 3. Re-verify Contests Policies
DROP POLICY IF EXISTS "contests_insert_own" ON public.contests;
CREATE POLICY "contests_insert_own" ON public.contests
  FOR INSERT 
  WITH CHECK (auth.uid() = creator_id);

DROP POLICY IF EXISTS "contests_select_all" ON public.contests;
CREATE POLICY "contests_select_all" ON public.contests
  FOR SELECT 
  USING (true);

-- 4. Re-verify Participant Policies
DROP POLICY IF EXISTS "participants_insert_own" ON public.contest_participants;
CREATE POLICY "participants_insert_own" ON public.contest_participants
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
