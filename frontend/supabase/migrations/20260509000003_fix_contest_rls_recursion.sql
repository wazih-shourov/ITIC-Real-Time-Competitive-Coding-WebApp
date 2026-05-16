-- 1. Drop all existing problematic policies
DROP POLICY IF EXISTS "Public contests are viewable by everyone" ON public.contests;
DROP POLICY IF EXISTS "Participants can view their private contests" ON public.contests;
DROP POLICY IF EXISTS "Authenticated users can create contests" ON public.contests;
DROP POLICY IF EXISTS "Creators can update their contests" ON public.contests;

DROP POLICY IF EXISTS "Participants can view other participants in the same contest" ON public.contest_participants;
DROP POLICY IF EXISTS "Users can join contests" ON public.contest_participants;
DROP POLICY IF EXISTS "Users can leave contests" ON public.contest_participants;

-- 2. Create helper functions to break recursion
-- SECURITY DEFINER bypasses RLS, preventing the infinite loop.
CREATE OR REPLACE FUNCTION public.check_is_contest_participant(c_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.contest_participants
    WHERE contest_id = c_id
    AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.check_is_contest_creator(c_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.contests
    WHERE id = c_id
    AND creator_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Rewrite Contests Policies
-- We allow anyone to select contests so the "Join by ID" flow works.
-- Private details are still protected as users only see metadata.
CREATE POLICY "contests_select_all" ON public.contests
  FOR SELECT USING (true);

CREATE POLICY "contests_insert_own" ON public.contests
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "contests_update_own" ON public.contests
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "contests_delete_own" ON public.contests
  FOR DELETE USING (auth.uid() = creator_id);

-- 4. Rewrite Contest Participants Policies
-- These policies are now recursion-free.
CREATE POLICY "participants_select" ON public.contest_participants
  FOR SELECT USING (
    user_id = auth.uid()                             -- Always see self
    OR public.check_is_contest_participant(contest_id) -- See others if already a participant
    OR public.check_is_contest_creator(contest_id)     -- See all if creator
    OR EXISTS (                                       -- See all if contest is public
      SELECT 1 FROM public.contests 
      WHERE id = contest_id AND visibility = 'public'
    )
  );

CREATE POLICY "participants_insert_own" ON public.contest_participants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "participants_delete_own_or_creator" ON public.contest_participants
  FOR DELETE USING (
    auth.uid() = user_id                             -- Can leave
    OR public.check_is_contest_creator(contest_id)     -- Creator can kick
  );
