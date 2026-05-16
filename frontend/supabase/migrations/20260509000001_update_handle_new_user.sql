-- Update handle_new_user function to auto-generate username from email
-- Run this in your Supabase SQL Editor to apply the changes

CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
DECLARE
  generated_username TEXT;
BEGIN
  -- Auto-generate username from email (part before @)
  generated_username := split_part(new.email, '@', 1);
  
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'username', generated_username), 
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
