-- Create difficulty enum
DO $$ BEGIN
    CREATE TYPE public.problem_difficulty AS ENUM ('easy', 'medium', 'hard');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create problems table
CREATE TABLE public.problems (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    difficulty public.problem_difficulty DEFAULT 'easy' NOT NULL,
    starter_code JSONB DEFAULT '{}'::jsonb NOT NULL,
    examples JSONB DEFAULT '[]'::jsonb NOT NULL,
    constraints JSONB DEFAULT '[]'::jsonb NOT NULL,
    creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create contest_problems table
CREATE TABLE public.contest_problems (
    contest_id UUID REFERENCES public.contests(id) ON DELETE CASCADE NOT NULL,
    problem_id UUID REFERENCES public.problems(id) ON DELETE CASCADE NOT NULL,
    order_index INTEGER DEFAULT 0 NOT NULL,
    PRIMARY KEY (contest_id, problem_id)
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contest_problems ENABLE ROW LEVEL SECURITY;

-- Problems Policies
CREATE POLICY "Creators can manage their own problems"
    ON public.problems
    USING (auth.uid() = creator_id);

CREATE POLICY "Problems are viewable if they belong to a visible contest"
    ON public.problems FOR SELECT
    USING (
        EXISTS (
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
        OR auth.uid() = creator_id
    );

-- Contest Problems Policies
CREATE POLICY "Contest creators can manage contest problems"
    ON public.contest_problems
    USING (
        EXISTS (
            SELECT 1 FROM public.contests
            WHERE id = public.contest_problems.contest_id
            AND creator_id = auth.uid()
        )
    );

CREATE POLICY "Contest problems are viewable if contest is visible"
    ON public.contest_problems FOR SELECT
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

-- Function to update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
    new.updated_at = timezone('utc'::text, now());
    RETURN new;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_problem_updated
    BEFORE UPDATE ON public.problems
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Indexes for performance
CREATE INDEX idx_problems_creator_id ON public.problems(creator_id);
CREATE INDEX idx_problems_slug ON public.problems(slug);
CREATE INDEX idx_contest_problems_contest_id ON public.contest_problems(contest_id);
CREATE INDEX idx_contest_problems_problem_id ON public.contest_problems(problem_id);
