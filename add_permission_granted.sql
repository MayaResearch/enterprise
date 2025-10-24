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
-- GRANT PERMISSION TO AN EXISTING USER (EXAMPLE)
-- ============================================================================
-- Replace 'user@example.com' with the actual user's email
-- UPDATE public.users 
-- SET permission_granted = true 
-- WHERE email = 'user@example.com';

-- ============================================================================
-- MAKE A USER AN ADMIN (EXAMPLE)
-- ============================================================================
-- Replace 'admin@example.com' with the actual admin's email
-- UPDATE public.users 
-- SET is_admin = true, permission_granted = true 
-- WHERE email = 'admin@example.com';

-- Also update in Supabase Auth (required for metadata sync):
-- Go to Authentication > Users in Supabase Dashboard
-- Select the user and add to user_metadata:
-- {
--   "is_admin": true,
--   "permission_granted": true
-- }

