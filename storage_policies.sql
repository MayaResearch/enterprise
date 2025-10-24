-- ============================================================================
-- SUPABASE STORAGE POLICIES FOR voice-assets BUCKET
-- Run this in your Supabase SQL Editor after creating the voice-assets bucket
-- ============================================================================

-- Option 1: Simple policies - Allow any authenticated user (Quick setup)
-- Uncomment these if you want quick setup for testing:

-- CREATE POLICY "Allow authenticated uploads"
-- ON storage.objects FOR INSERT
-- TO authenticated
-- WITH CHECK (bucket_id = 'voice-assets');

-- CREATE POLICY "Allow authenticated updates"
-- ON storage.objects FOR UPDATE
-- TO authenticated
-- USING (bucket_id = 'voice-assets');

-- CREATE POLICY "Allow authenticated deletes"
-- ON storage.objects FOR DELETE
-- TO authenticated
-- USING (bucket_id = 'voice-assets');

-- CREATE POLICY "Allow public reads"
-- ON storage.objects FOR SELECT
-- TO public
-- USING (bucket_id = 'voice-assets');


-- ============================================================================
-- Option 2: Admin-only policies (RECOMMENDED - Uncomment these)
-- ============================================================================

-- Allow admins to upload files
CREATE POLICY "Admins can upload voice assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'voice-assets' 
  AND EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.is_admin = true
  )
);

-- Allow admins to update files
CREATE POLICY "Admins can update voice assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'voice-assets' 
  AND EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.is_admin = true
  )
);

-- Allow admins to delete files
CREATE POLICY "Admins can delete voice assets"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'voice-assets' 
  AND EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.is_admin = true
  )
);

-- Allow everyone to view/download files (for public voices)
CREATE POLICY "Anyone can view voice assets"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'voice-assets');

-- ============================================================================
-- VERIFY POLICIES
-- ============================================================================
-- After running, verify by checking:
-- Storage → voice-assets → Policies tab
-- You should see 4 policies listed

