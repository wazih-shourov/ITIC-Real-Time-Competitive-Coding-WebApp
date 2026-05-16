-- Grant SELECT permission on profiles to everyone
-- This is required for joins/embeddings in PostgREST queries
GRANT SELECT ON TABLE public.profiles TO authenticated, anon;

-- Re-verify the public SELECT policy to ensure it exists and is correct
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT 
  USING (true);

-- Ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
