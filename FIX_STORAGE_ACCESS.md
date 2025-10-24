# Fix Storage Access Issues (ERR_BLOCKED_BY_CLIENT)

## Issue
Images/audio from Supabase Storage are blocked by browser (ERR_BLOCKED_BY_CLIENT)

## Solutions (Try in order)

### 1. Check Ad Blocker (Quick Test)
- **Disable ad blocker** temporarily
- Refresh the page
- If images load, ad blocker is the issue

### 2. Make Bucket Fully Public (REQUIRED)

Go to **Supabase Dashboard**:

1. Navigate to **Storage** → **voice-assets** bucket
2. Click **Settings** (gear icon)
3. Make sure **"Public bucket"** is **CHECKED** ✅
4. Click **Save**

### 3. Configure CORS (IMPORTANT)

The bucket needs proper CORS configuration:

#### Option A: Via Supabase Dashboard (Recommended)
1. Go to **Storage** → **Configuration**
2. Add CORS policy:

```json
{
  "allowedOrigins": ["*"],
  "allowedMethods": ["GET", "HEAD"],
  "allowedHeaders": ["*"],
  "maxAge": 3600
}
```

#### Option B: Via SQL
Run this in **SQL Editor**:

```sql
-- Update storage bucket to be public
UPDATE storage.buckets
SET public = true
WHERE id = 'voice-assets';

-- Verify
SELECT id, name, public FROM storage.buckets WHERE id = 'voice-assets';
```

### 4. Check Storage Policies

Make sure you have the public read policy:

```sql
-- Allow anyone to view files
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'voice-assets');
```

### 5. Verify File Upload Location

Check in **Storage** → **voice-assets** → **Files**:
- You should see: `voices/{userId}/{voiceId}/avatar.jpg`
- You should see: `voices/{userId}/{voiceId}/preview.mp3`

### 6. Test Direct URL

Copy the image URL from the network tab and:
1. Open it in a **new incognito/private window**
2. If it loads → browser extension issue
3. If it doesn't load → storage configuration issue

### 7. Alternative: Try Different Bucket Settings

If nothing works, try recreating the bucket:

1. **Create new bucket** named `voice-assets-v2`
2. Settings:
   - **Public bucket**: ✅ YES
   - **File size limit**: 50 MB
   - **Allowed MIME types**: Leave empty OR `image/*,audio/*`
3. Update code to use `voice-assets-v2`

### 8. Check Supabase URL Format

The URL should look like:
```
https://[project-id].supabase.co/storage/v1/object/public/voice-assets/voices/...
```

Make sure it includes `/public/` in the path.

## Quick Fix Script

Run this in Supabase SQL Editor to ensure everything is public:

```sql
-- Make bucket public
UPDATE storage.buckets SET public = true WHERE id = 'voice-assets';

-- Remove all restrictive policies
DROP POLICY IF EXISTS "Admins can upload voice assets" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update voice assets" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete voice assets" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view voice assets" ON storage.objects;

-- Add simple public access policies
CREATE POLICY "Anyone can view"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'voice-assets');

CREATE POLICY "Authenticated can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'voice-assets');

CREATE POLICY "Authenticated can update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'voice-assets');

CREATE POLICY "Authenticated can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'voice-assets');
```

## Verify Setup

After changes:
1. Go to Storage → voice-assets
2. Upload a test image manually
3. Click on it and copy the URL
4. Open URL in new incognito tab
5. Should load without login

## Still Not Working?

Check:
- Browser console for exact error
- Network tab → Click on failed request → Response tab
- Supabase project logs

