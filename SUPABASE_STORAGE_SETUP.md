# Supabase Storage Setup for Voice Assets

## Create Storage Bucket

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Navigate to **Storage** in the left sidebar
4. Click **"New bucket"**
5. Enter bucket details:
   - **Name**: `voice-assets`
   - **Public bucket**: ✅ **YES** (check this box)
   - **File size limit**: 50 MB (recommended)
   - **Allowed MIME types**: Leave empty or add: `image/jpeg, image/png, image/webp, audio/mpeg, audio/wav, audio/mp3`

6. Click **"Create bucket"**

## Fix RLS Policy Error (REQUIRED)

If you see "new row violates row-level security policy", you need to add storage policies.

### Option 1: Quick Fix - Disable RLS (Easy, for testing)

1. Go to **Storage** → **voice-assets**
2. Click **"Policies"** tab
3. Click **"New Policy"**
4. Select **"For full customization"**
5. Paste this policy:

```sql
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'voice-assets');

CREATE POLICY "Allow authenticated updates"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'voice-assets');

CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'voice-assets');

CREATE POLICY "Allow public reads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'voice-assets');
```

### Option 2: Admin-Only Policies (Recommended for production)

For better security, restrict uploads to admins only:

```sql
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

CREATE POLICY "Anyone can view voice assets"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'voice-assets');
```

## Verify Setup

After creating the bucket, verify it works:

1. Go to **Storage** → **voice-assets**
2. Try uploading a test image manually
3. If you can see it and get a public URL, you're good to go!

## Folder Structure

The app will automatically organize files like this:
```
voice-assets/
  └── voices/
      └── {userId}/
          └── {voiceId}/
              ├── avatar.jpg
              └── preview.mp3
```

## Next Steps

Once the bucket is created:
1. Try creating a voice in the Voice Management page
2. Check the Storage tab to see the uploaded files
3. The public URLs will be stored in the database

## Troubleshooting

**Error: "Bucket not found"**
- Make sure the bucket name is exactly `voice-assets`
- Ensure the bucket is marked as **Public**

**Error: "Access denied"**
- Check your RLS policies
- For testing, you can temporarily disable RLS on the bucket
- Go to Storage → voice-assets → Policies → Disable RLS (not recommended for production)

**Files not appearing**
- Check the Network tab in browser DevTools
- Verify the Supabase URL and Anon Key in your `.env` file
- Make sure you're logged in as an admin user

