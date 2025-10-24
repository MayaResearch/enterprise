-- ============================================================================
-- FIX STORAGE ACCESS - Make voice-assets fully public
-- Run this in Supabase SQL Editor to fix ERR_BLOCKED_BY_CLIENT
-- ============================================================================

-- Step 1: Make bucket public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'voice-assets';

-- Step 2: Remove old restrictive policies
DROP POLICY IF EXISTS "Admins can upload voice assets" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update voice assets" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete voice assets" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view voice assets" ON storage.objects;

-- Step 3: Add simple, working policies
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'voice-assets');

CREATE POLICY "Authenticated upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'voice-assets');

CREATE POLICY "Authenticated update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'voice-assets');

CREATE POLICY "Authenticated delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'voice-assets');

-- Step 4: Verify the setup
SELECT 
  id, 
  name, 
  public as is_public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets 
WHERE id = 'voice-assets';

-- You should see: is_public = true

