-- ============================================================================
-- ADD voice_description AND voice_text COLUMNS TO VOICES TABLE
-- Run this if you already created the voices table without these columns
-- ============================================================================

-- Add voice_description column (voice characteristics used for generation)
ALTER TABLE public.voices 
ADD COLUMN IF NOT EXISTS voice_description TEXT;

-- Add voice_text column (test text used for generation)
ALTER TABLE public.voices 
ADD COLUMN IF NOT EXISTS voice_text TEXT;

-- Verify the columns were added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'voices'
ORDER BY ordinal_position;

