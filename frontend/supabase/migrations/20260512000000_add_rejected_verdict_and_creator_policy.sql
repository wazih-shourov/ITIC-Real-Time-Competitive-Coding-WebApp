-- Add 'rejected' to verdict_type enum
ALTER TYPE public.verdict_type ADD VALUE IF NOT EXISTS 'rejected';

-- Add policy to allow contest creators to update submissions in their contests
CREATE POLICY "submissions_update_creator" ON public.submissions
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.contests
            WHERE id = public.submissions.contest_id
            AND creator_id = auth.uid()
        )
    );
