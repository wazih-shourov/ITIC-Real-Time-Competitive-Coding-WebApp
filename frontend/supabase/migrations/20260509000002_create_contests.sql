-- Create visibility enum
DO $$ BEGIN
    CREATE TYPE public.contest_visibility AS ENUM ('public', 'private');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Function to generate a random 6-character alphanumeric string
CREATE OR REPLACE FUNCTION public.generate_invite_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := '';
  i INTEGER := 0;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create contests table
CREATE TABLE public.contests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invite_code TEXT UNIQUE NOT NULL DEFAULT public.generate_invite_code(),
  name TEXT NOT NULL,
  description TEXT,
  visibility public.contest_visibility DEFAULT 'public' NOT NULL,
  max_participants INTEGER DEFAULT 10,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create contest_participants table
CREATE TABLE public.contest_participants (
  contest_id UUID REFERENCES public.contests(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT CHECK (role IN ('creator', 'participant')) DEFAULT 'participant' NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (contest_id, user_id)
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.contests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contest_participants ENABLE ROW LEVEL SECURITY;

-- Contests Policies
CREATE POLICY "Public contests are viewable by everyone" 
  ON public.contests FOR SELECT 
  USING (visibility = 'public');

CREATE POLICY "Participants can view their private contests"
  ON public.contests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.contest_participants
      WHERE contest_id = public.contests.id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can create contests"
  ON public.contests FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their contests"
  ON public.contests FOR UPDATE
  USING (auth.uid() = creator_id);

-- Contest Participants Policies
CREATE POLICY "Participants can view other participants in the same contest"
  ON public.contest_participants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.contest_participants AS self
      WHERE self.contest_id = public.contest_participants.contest_id
      AND self.user_id = auth.uid()
    )
    OR
    EXISTS (
        SELECT 1 FROM public.contests
        WHERE id = public.contest_participants.contest_id
        AND visibility = 'public'
    )
  );

CREATE POLICY "Users can join contests"
  ON public.contest_participants FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave contests"
  ON public.contest_participants FOR DELETE
  USING (auth.uid() = user_id);

-- Function to handle contest creation (auto-add creator as participant)
CREATE OR REPLACE FUNCTION public.handle_new_contest()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.contest_participants (contest_id, user_id, role)
  VALUES (new.id, new.creator_id, 'creator');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_contest_created
  AFTER INSERT ON public.contests
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_contest();

-- Indexes for performance
CREATE INDEX idx_contests_invite_code ON public.contests(invite_code);
CREATE INDEX idx_contest_participants_contest_id ON public.contest_participants(contest_id);
CREATE INDEX idx_contest_participants_user_id ON public.contest_participants(user_id);
