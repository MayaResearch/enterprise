# Environment Variables Setup

## Required Environment Variables

Add these to your `.env` file:

```env
# Supabase Configuration
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Supabase Service Role Key (REQUIRED for file uploads)
# ⚠️ IMPORTANT: Never commit this to git or expose it to the client
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Database Configuration
DATABASE_URL=postgresql://postgres.your-project:password@aws-0-region.pooler.supabase.com:6543/postgres
```

## How to Get Your Service Role Key

1. Go to your **Supabase Dashboard**: https://app.supabase.com
2. Select your project
3. Click **Settings** (⚙️) in the left sidebar
4. Click **API** under "Configuration"
5. Scroll down to **"Project API keys"**
6. Copy the **`service_role`** key (not the `anon` key)
7. Add it to your `.env` file:
   ```
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## Why Do We Need the Service Role Key?

- The **anon key** respects Row Level Security (RLS) policies
- The **service role key** bypasses RLS for server-side operations
- We use it for file uploads because:
  - We already check admin permissions in the API code
  - It simplifies the upload process
  - Public reads are still controlled by RLS policies

## Security Notes

⚠️ **NEVER expose the service role key to the client!**
- Only use it in server-side code (API routes, middleware)
- Keep it in `.env` (which is gitignored)
- Don't log it or include it in error messages
- Rotate it immediately if compromised

## Restart Dev Server

After adding the service role key, restart your development server:

```bash
npm run dev
```

## Verify Setup

Try creating a voice in the Voice Management page. If you see:
- ✅ "Voice saved successfully!" - Setup complete!
- ❌ "Failed to upload image" - Check your service role key

## Production Deployment

For Vercel/Netlify/etc., add the service role key to your environment variables in the platform's dashboard.

