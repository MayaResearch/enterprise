# Setup Instructions

## ⚠️ IMPORTANT: Create Environment File

You need to manually create a `.env` file in the project root. This file is required for the application to work.

### Step 1: Create `.env` file

In the root directory (`enterprise_maya/`), create a file named `.env`:

```bash
# On macOS/Linux
touch .env

# On Windows (PowerShell)
New-Item .env
```

### Step 2: Add Your Credentials

Open the `.env` file and paste the following content with your actual Supabase credentials:

```env
# Supabase Configuration
PUBLIC_SUPABASE_URL=https://nxwuhwavvyjppmzyfybh.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54d3Vod2F2dnlqcHBtenlmeWJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNDM1MzQsImV4cCI6MjA3NjgxOTUzNH0.djJYNNsQ9ZfZ_q7z9jbd31TTuUWowiHllZ3cdujq5Io
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54d3Vod2F2dnlqcHBtenlmeWJoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTI0MzUzNCwiZXhwIjoyMDc2ODE5NTM0fQ.tgzRAZWnKprkrfX4KG8Mp0eTOJlCf_20IS7UZnDQ-oA

# Database Configuration
DATABASE_URL=postgresql://postgres:enterprise@db.nxwuhwavvyjppmzyfybh.supabase.co:5432/postgres
```

### Step 3: Restart Dev Server

If the dev server is running, stop it (Ctrl+C) and start it again:

```bash
npm run dev
```

## Configure Google OAuth in Supabase

Before you can use Google login, you need to configure it in your Supabase dashboard:

### 1. Go to Supabase Dashboard
Visit: https://app.supabase.com/project/nxwuhwavvyjppmzyfybh

### 2. Enable Google Provider
- Navigate to **Authentication** → **Providers**
- Find **Google** and click to enable it
- You'll need to add Google OAuth credentials

### 3. Get Google OAuth Credentials

Go to [Google Cloud Console](https://console.cloud.google.com):

1. Create a new project or select existing project
2. Enable **Google+ API** (or **Google Identity Services**)
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen if prompted
6. For Application type, select **Web application**
7. Add authorized JavaScript origins:
   - `http://localhost:4321`
   - `https://nxwuhwavvyjppmzyfybh.supabase.co`
8. Add authorized redirect URIs:
   - Copy the redirect URL from your Supabase Google provider settings
   - It should look like: `https://nxwuhwavvyjppmzyfybh.supabase.co/auth/v1/callback`
9. Click **Create** and copy the **Client ID** and **Client Secret**

### 4. Add Credentials to Supabase

Back in your Supabase dashboard:
- Paste the **Client ID** from Google
- Paste the **Client Secret** from Google
- Add your site URL: `http://localhost:4321` for development
- Add redirect URL: `http://localhost:4321/auth/callback`
- Click **Save**

## Test the Application

1. Make sure your `.env` file is created with the correct values
2. Restart your dev server: `npm run dev`
3. Visit `http://localhost:4321`
4. Click "Continue with Google"
5. Authorize with your Google account
6. You should be redirected to the dashboard

## Troubleshooting

### Still getting "Missing Supabase environment variables"?

1. Double-check that `.env` file exists in the root directory
2. Verify the file is named exactly `.env` (not `.env.txt`)
3. Make sure there are no spaces around the `=` signs
4. Restart the dev server completely (stop and start)

### Google OAuth not working?

1. Verify Google provider is enabled in Supabase
2. Check that Client ID and Secret are correct
3. Ensure redirect URIs match exactly in both places
4. Try in an incognito/private browser window

### Need help?

Check the full README.md for more detailed documentation.

