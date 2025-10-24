# Schema Update Summary

## Overview
Updated the Drizzle ORM schema and API endpoints to match the actual Supabase database schema for API keys management.

## Changes Made

### 1. Database Schema (`src/lib/db/schema.ts`)

Updated the `apiKeys` table definition to match your actual database:

```typescript
export const apiKeys = pgTable('api_keys', {
  id: uuid('id').primaryKey().defaultRandom(),
  keyHash: text('key_hash').notNull().unique(),           // Changed from 'key'
  label: text('label').notNull(),                         // Changed from 'name'
  userId: text('user_id'),                                 // Changed from UUID to TEXT
  rateLimit: integer('rate_limit').default(60),            // New field
  credits: numeric('credits', { precision: 10, scale: 2 }).default('0.00'), // New field
  isActive: boolean('is_active').default(true),            // Changed from 'enabled'
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  lastUsedAt: timestamp('last_used_at', { withTimezone: true }),  // New field
  expiresAt: timestamp('expires_at', { withTimezone: true }),      // New field
});
```

**Key Changes:**
- `name` → `label`
- `key` → `keyHash` (now stores SHA-256 hash)
- `enabled` → `isActive`
- `keyPreview` removed (generated on-the-fly from hash)
- `updatedAt` removed
- Added: `rateLimit`, `credits`, `lastUsedAt`, `expiresAt`
- `userId` is now TEXT instead of UUID

### 2. API Endpoints

#### `/api/keys/index.ts` (GET & POST)

**GET** - List API Keys:
- Returns all fields including `keyHash`, `label`, `isActive`, `rateLimit`, `credits`, timestamps
- Adds `keyPreview` (last 4 chars of hash) dynamically for display

**POST** - Create API Key:
- Accepts `label` instead of `name`
- Generates full API key: `maya_` + 64 random hex characters
- Stores SHA-256 hash of the key in `keyHash` field
- Returns full key only once during creation
- Sets default `rateLimit: 60` and `credits: '0.00'`

#### `/api/keys/[id].ts` (PATCH & DELETE)

**PATCH** - Update API Key:
- Now supports updating: `isActive`, `credits`, `rateLimit`
- Flexible: only updates fields provided in request
- Returns updated key with `keyPreview` added

**DELETE** - Delete API Key:
- No changes to functionality
- Uses updated field names

### 3. Frontend Component (`DevelopersPage.tsx`)

Updated the React component to use new field names:

```typescript
interface ApiKey {
  id: string;
  label: string;              // Changed from 'name'
  key?: string;
  keyPreview: string;
  keyHash: string;            // New field
  rateLimit?: number;         // New field
  credits?: string;           // New field
  createdAt: Date | string;
  lastUsedAt?: Date | string; // New field
  expiresAt?: Date | string;  // New field
  isActive: boolean;          // Changed from 'enabled'
}
```

**Updated References:**
- `name` → `label` in display and API calls
- `enabled` → `isActive` in toggle functionality
- `keyName` → `keyLabel` in dialogs
- POST request now sends `{ label: ... }` instead of `{ name: ... }`
- PATCH request now sends `{ isActive: ... }` instead of `{ enabled: ... }`

### 4. Users Table (`is_admin` column)

Added `is_admin` column to track admin users:

```sql
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT false;
```

**To make a user an admin**, run this SQL in Supabase SQL Editor:
```sql
-- Option 1: Update directly in users table
UPDATE public.users SET is_admin = true WHERE email = 'admin@example.com';

-- Option 2: Update in auth.users metadata
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"is_admin": true}'::jsonb
WHERE email = 'admin@example.com';
```

The trigger function in `supabase_trigger.sql` has been updated to sync `is_admin` from user metadata.

## Database Migration Steps

Since Drizzle push isn't working due to network/DNS issues with your Supabase instance, **run this SQL in your Supabase SQL Editor**:

```sql
-- Add is_admin column to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT false;

-- Update the trigger function to include is_admin
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
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    is_admin = EXCLUDED.is_admin,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## How It Works

### API Key Creation Flow:
1. User enters a label for the new key
2. Backend generates: `maya_` + 64 hex characters
3. Backend creates SHA-256 hash of the full key
4. Hash is stored in `keyHash` field
5. Full key is returned **once** to user
6. Future requests show only `keyPreview` (last 4 chars of hash)

### API Key Authentication (Future Use):
1. User provides full API key in request
2. Backend hashes the provided key using SHA-256
3. Backend looks up the hash in `keyHash` field
4. If match found and `isActive = true`, request is authorized

## Files Changed
- ✅ `src/lib/db/schema.ts` - Updated schema definition
- ✅ `src/pages/api/keys/index.ts` - Updated GET/POST endpoints
- ✅ `src/pages/api/keys/[id].ts` - Updated PATCH/DELETE endpoints
- ✅ `src/pages/dashboard/api-keys/_components/DevelopersPage.tsx` - Updated UI component
- ✅ `supabase_trigger.sql` - Added `is_admin` support

## Testing Checklist
- [ ] Run the SQL migration in Supabase SQL Editor
- [ ] Test creating a new API key
- [ ] Verify full key is shown only once
- [ ] Test toggling API key active/inactive status
- [ ] Test deleting an API key
- [ ] Verify key preview displays correctly in table
- [ ] Confirm user authentication still works
- [ ] Make a test user an admin and verify `locals.user.isAdmin` is set

## Security Notes
- API keys are now hashed with SHA-256 before storage
- Full keys are never stored in the database
- Keys are only shown once upon creation
- Preview shows last 4 characters of the hash (not the actual key)
- All API operations require authentication via middleware
- API keys are scoped to user ID for security

