# Google OAuth Setup Guide

## Error: redirect_uri_mismatch

This error means the redirect URI in Google Cloud Console doesn't match what Supabase is sending.

## 🔧 Step-by-Step Fix

### Step 1: Get Your Supabase Callback URL

Your Supabase callback URL is:
```
https://nxwuhwavvyjppmzyfybh.supabase.co/auth/v1/callback
```

This is the **exact** URL you need to add to Google Cloud Console.

---

### Step 2: Configure Google Cloud Console

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Select or Create a Project**
   - If you don't have a project, create one
   - Name it something like "Enterprise Maya"

3. **Enable Google+ API** (or Google Identity Services)
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" or "Google Identity"
   - Click "Enable"

4. **Configure OAuth Consent Screen** (if not done)
   - Go to "APIs & Services" → "OAuth consent screen"
   - Select "External" user type
   - Fill in required fields:
     - App name: `Enterprise Maya`
     - User support email: `charan@mayaresearch.ai`
     - Developer contact: `charan@mayaresearch.ai`
   - Add scopes: `email`, `profile`, `openid`
   - Add test users: `charan@mayaresearch.ai`
   - Save and continue

5. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - Application type: **Web application**
   - Name: `Enterprise Maya Web Client`

6. **Add Authorized JavaScript Origins**
   ```
   http://localhost:4321
   https://nxwuhwavvyjppmzyfybh.supabase.co
   ```

7. **Add Authorized Redirect URIs** ⚠️ **IMPORTANT**
   ```
   https://nxwuhwavvyjppmzyfybh.supabase.co/auth/v1/callback
   http://localhost:4321/auth/callback
   ```

8. **Save and Copy Credentials**
   - Copy the **Client ID**
   - Copy the **Client Secret**
   - Keep these safe!

---

### Step 3: Configure Supabase

1. **Go to Supabase Dashboard**
   - Visit: https://app.supabase.com/project/nxwuhwavvyjppmzyfybh

2. **Navigate to Authentication**
   - Click "Authentication" in the sidebar
   - Click "Providers"

3. **Enable Google Provider**
   - Find "Google" in the list
   - Toggle it to **Enabled**

4. **Add Google Credentials**
   - Paste your **Client ID** from Google
   - Paste your **Client Secret** from Google

5. **Configure Site URL**
   - Site URL: `http://localhost:4321` (for development)
   - You can add production URL later

6. **Configure Redirect URLs**
   - Add: `http://localhost:4321/auth/callback`
   - This is for your application callback

7. **Save Configuration**

---

### Step 4: Verify Everything

Double-check these match **exactly**:

#### In Google Cloud Console:
- ✅ Authorized redirect URI: `https://nxwuhwavvyjppmzyfybh.supabase.co/auth/v1/callback`
- ✅ Authorized JavaScript origin: `http://localhost:4321`

#### In Supabase Dashboard:
- ✅ Google provider is enabled
- ✅ Client ID from Google is added
- ✅ Client Secret from Google is added
- ✅ Site URL is set to `http://localhost:4321`

---

### Step 5: Test Again

1. Clear your browser cache or use incognito mode
2. Go to `http://localhost:4321`
3. Click "Continue with Google"
4. You should now be able to sign in!

---

## 🔍 Common Issues

### Issue: Still getting redirect_uri_mismatch

**Solution**: Make sure the URIs are **EXACTLY** the same, including:
- `https://` vs `http://`
- Trailing slashes or no trailing slashes
- Port numbers

### Issue: OAuth consent screen error

**Solution**: Add yourself as a test user in Google Cloud Console:
- Go to OAuth consent screen
- Scroll to "Test users"
- Add: `charan@mayaresearch.ai`

### Issue: "This app isn't verified"

**Solution**: This is normal for development. Click "Advanced" → "Go to Enterprise Maya (unsafe)"

---

## 📝 Quick Reference

**Supabase Project ID**: `nxwuhwavvyjppmzyfybh`

**Your Supabase URLs**:
- Dashboard: `https://app.supabase.com/project/nxwuhwavvyjppmzyfybh`
- API URL: `https://nxwuhwavvyjppmzyfybh.supabase.co`
- Callback URL: `https://nxwuhwavvyjppmzyfybh.supabase.co/auth/v1/callback`

**Your App URLs**:
- Development: `http://localhost:4321`
- Callback: `http://localhost:4321/auth/callback`

**Email to use**: `charan@mayaresearch.ai`

---

## 🎯 The Key Point

The most important thing: In Google Cloud Console, the authorized redirect URI **MUST** be:

```
https://nxwuhwavvyjppmzyfybh.supabase.co/auth/v1/callback
```

NOT your app's callback URL (`/auth/callback`).

Google redirects to Supabase, then Supabase redirects to your app.

