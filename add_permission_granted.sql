-- ============================================================================
-- ADD PERMISSION_GRANTED COLUMN TO USERS TABLE
-- Run this script in your Supabase SQL Editor
-- ============================================================================

-- Add permission_granted column to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS permission_granted BOOLEAN NOT NULL DEFAULT false;

-- Update the trigger function to include permission_granted
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    full_name,
    avatar_url,
    provider,
    is_admin,
    permission_granted,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture'),
    NEW.raw_app_meta_data->>'provider',
    COALESCE((NEW.raw_user_meta_data->>'is_admin')::boolean, false),
    COALESCE((NEW.raw_user_meta_data->>'permission_granted')::boolean, false),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    is_admin = EXCLUDED.is_admin,
    permission_granted = EXCLUDED.permission_granted,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- FIRST TIME SETUP: MAKE YOURSELF AN ADMIN
-- ============================================================================
-- Step 1: Update the database (replace with your email)
UPDATE public.users 
SET is_admin = true, permission_granted = true 
WHERE email = 'your-email@example.com';

-- Step 2: MANUALLY update Supabase Auth metadata (REQUIRED for first admin):
--   Go to: Supabase Dashboard → Authentication → Users
--   Find your user → Click to expand → Edit User Metadata
--   Add this JSON to user_metadata:
--   {
--     "is_admin": true,
--     "permission_granted": true
--   }
--   Save and log out/log in again

-- Step 3: After logging back in, you can access /dashboard/admin

-- ============================================================================
-- GRANT PERMISSION TO OTHER USERS (via Admin Panel)
-- ============================================================================
-- After you're an admin, use the Admin Management page at /dashboard/admin
-- to grant permissions to other users. This will:
-- 1. Update public.users table
-- 2. Update in-memory cache for fast access
-- 3. User needs to log out/log in to see changes (trigger syncs metadata)

-- OR manually via SQL:
-- UPDATE public.users 
-- SET permission_granted = true 
-- WHERE email = 'another-user@example.com';
-- (User needs to log out/log in for the trigger to sync metadata)

