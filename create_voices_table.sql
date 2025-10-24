-- ============================================================================
-- CREATE VOICES TABLE FOR ADMIN VOICE MANAGEMENT
-- Run this in your Supabase SQL Editor
-- ============================================================================

-- Create voices table
CREATE TABLE IF NOT EXISTS public.voices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voice_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  voice_description TEXT,
  voice_text TEXT,
  image_url TEXT,
  preview_url TEXT,
  is_public BOOLEAN DEFAULT false,
  created_by_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_voices_voice_id ON public.voices(voice_id);
CREATE INDEX IF NOT EXISTS idx_voices_is_public ON public.voices(is_public);
CREATE INDEX IF NOT EXISTS idx_voices_created_by ON public.voices(created_by_id);

-- Enable RLS (Row Level Security)
ALTER TABLE public.voices ENABLE ROW LEVEL SECURITY;

-- Policy: Allow admins to do everything
CREATE POLICY "Admins can manage voices"
  ON public.voices
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );

-- Policy: Everyone can view public voices
CREATE POLICY "Anyone can view public voices"
  ON public.voices
  FOR SELECT
  TO authenticated
  USING (is_public = true);

-- ============================================================================
-- EXAMPLE: Insert a test voice
-- ============================================================================
-- INSERT INTO public.voices (
--   voice_id,
--   name,
--   description,
--   is_public
-- ) VALUES (
--   'test_voice_001',
--   'Test Voice',
--   'A test voice for demonstration',
--   true
-- );

