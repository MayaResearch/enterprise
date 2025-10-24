# Debugging Google OAuth Login

## What to Check

Please tell me what you're seeing:

### 1. **What happens when you click "Continue with Google"?**
   - [ ] Google login page appears
   - [ ] You can select your Google account
   - [ ] You authorize the app
   - [ ] You get redirected back
   - [ ] You see the dashboard
   - [ ] Something else (describe below)

### 2. **Where does it get stuck?**
   - [ ] Stays on login page
   - [ ] Stuck at `/auth/callback` showing blank page
   - [ ] Redirects to login with error message
   - [ ] Other (describe below)

### 3. **Check Your Browser Console**
   Open browser DevTools (F12 or Cmd+Option+I) and check the Console tab.
   
   **Look for:**
   - Any red error messages
   - Network errors
   - CORS errors
   
   Copy any errors you see here:
   ```
   [Paste errors here]
   ```

### 4. **Check Your Terminal/Server Logs**
   Look at the terminal where `npm run dev` is running.
   
   You should see logs starting with 🔵 and 🔴 emojis after clicking login.
   
   Copy the logs here:
   ```
   [Paste server logs here]
   ```

### 5. **Check Network Tab**
   In browser DevTools, go to Network tab:
   - Click "Continue with Google"
   - Watch the network requests
   - Look for `/auth/callback` request
   - Click on it and check:
     - Status code (should be 302 or 200)
     - Response
   
   What status code do you see?
   ```
   [Write status code here]
   ```

### 6. **Verify Supabase Configuration**

   Go to: https://app.supabase.com/project/nxwuhwavvyjppmzyfybh/auth/providers
   
   Check:
   - [ ] Google provider is enabled (toggle should be ON/green)
   - [ ] Client ID is filled in
   - [ ] Client Secret is filled in
   - [ ] Site URL is set to: `http://localhost:4321`
   
   Screenshot what you see or describe the configuration.

### 7. **Verify Google Cloud Console**

   Go to: https://console.cloud.google.com/apis/credentials
   
   Check your OAuth 2.0 Client:
   - [ ] Has Client ID and Secret
   - [ ] Authorized redirect URIs includes: 
     - `https://nxwuhwavvyjppmzyfybh.supabase.co/auth/v1/callback`
   - [ ] Authorized JavaScript origins includes:
     - `http://localhost:4321`

### 8. **Try These Steps**

   1. **Clear browser cache completely**
      - Chrome: Cmd+Shift+Delete (Mac) or Ctrl+Shift+Delete (Windows)
      - Select "All time"
      - Clear cookies and cache

   2. **Try incognito/private mode**
      - Chrome: Cmd+Shift+N (Mac) or Ctrl+Shift+N (Windows)
      - Go to http://localhost:4321
      - Try to login

   3. **Check if you're a test user**
      - Go to Google Cloud Console → OAuth consent screen
      - Scroll to "Test users" section
      - Make sure `charan@mayaresearch.ai` is listed
      - If not, add it

   4. **Restart dev server**
      ```bash
      # Stop current server (Ctrl+C)
      npm run dev
      ```

## Common Error Messages and Solutions

### "redirect_uri_mismatch"
- **Cause**: Google redirect URI doesn't match
- **Fix**: In Google Cloud Console, add exact URI:
  `https://nxwuhwavvyjppmzyfybh.supabase.co/auth/v1/callback`

### "Access blocked: This app's request is invalid"
- **Cause**: OAuth configuration issue
- **Fix**: 
  1. Check OAuth consent screen is configured
  2. Add yourself as test user
  3. Verify redirect URIs are correct

### Stays on login page / Nothing happens
- **Cause**: Supabase provider not configured
- **Fix**: Enable Google in Supabase and add Client ID/Secret

### "Error exchanging code for session"
- **Cause**: Invalid OAuth credentials or expired code
- **Fix**: 
  1. Verify Client ID and Secret are correct in Supabase
  2. Make sure credentials match Google Cloud Console
  3. Try login again (codes expire quickly)

### Network error / CORS error
- **Cause**: Site URL or allowed origins misconfigured
- **Fix**: In Supabase, set Site URL to `http://localhost:4321`

## Still Not Working?

Please provide the following information:

1. **What you see in browser console** (any errors)
2. **What you see in terminal logs** (the 🔵/🔴 emoji logs)
3. **What step you get stuck at** (describe the exact behavior)
4. **Screenshot of the issue** (if possible)

I'll help you debug from there!

