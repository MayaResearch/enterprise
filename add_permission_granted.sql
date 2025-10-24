-- ============================================================================
-- ADD PERMISSION_GRANTED COLUMN TO USERS TABLE
-- Run this script in your Supabase SQL Editor
-- ============================================================================

-- Add permission_granted column to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS permission_granted BOOLEAN NOT NULL DEFAULT false;

-- Update the trigger function to include permission_granted
-- Note: ON CONFLICT DO NOTHING ensures we only create the user once
-- After that, public.users is the source of truth for permissions
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
  ON CONFLICT (id) DO NOTHING;  -- Don't overwrite existing users!
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger to only fire on INSERT (not UPDATE)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- FIRST TIME SETUP: MAKE YOURSELF AN ADMIN
-- ============================================================================
-- Simply update the database (replace with your email)
UPDATE public.users 
SET is_admin = true, permission_granted = true 
WHERE email = 'your-email@example.com';

-- That's it! Log out and log back in to see the changes.
-- The middleware will read from public.users and give you admin access.

-- ============================================================================
-- GRANT PERMISSION TO OTHER USERS
-- ============================================================================
-- Option 1: Use the Admin Management page at /dashboard/admin (recommended)
-- - Visual interface to toggle permissions
-- - Automatically updates database and cache
-- - User just needs to log out/log in

-- Option 2: Manually via SQL
UPDATE public.users 
SET permission_granted = true 
WHERE email = 'another-user@example.com';
-- User needs to log out/log in to see changes

-- ============================================================================
-- HOW IT WORKS
-- ============================================================================
-- 1. Trigger only fires on INSERT (new user signup)
--    - Creates user in public.users with default permissions
-- 2. Admin updates permissions in public.users (via /dashboard/admin or SQL)
-- 3. Middleware reads from public.users for permission checks
-- 4. public.users is the source of truth for permissions
-- 5. No more auth.users metadata overwrites!

