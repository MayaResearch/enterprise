import { d as defineMiddleware, s as sequence } from './chunks/index_DqPD9qJE.mjs';
import { createClient } from '@supabase/supabase-js';
import 'es-module-lexer';
import './chunks/astro-designed-error-pages_DwUr6A-2.mjs';
import './chunks/astro/server_BiwHnAGj.mjs';
import 'clsx';
import 'cookie';

const supabaseUrl = "https://nxwuhwavvyjppmzyfybh.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54d3Vod2F2dnlqcHBtenlmeWJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNDM1MzQsImV4cCI6MjA3NjgxOTUzNH0.djJYNNsQ9ZfZ_q7z9jbd31TTuUWowiHllZ3cdujq5Io";
const onRequest$1 = defineMiddleware(async ({ request, locals, cookies }, next) => {
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      detectSessionInUrl: false,
      persistSession: false,
      autoRefreshToken: false
    },
    global: {
      headers: {
        // Forward the authorization header from the request
        Authorization: request.headers.get("Authorization") || ""
      }
    }
  });
  locals.supabase = supabase;
  const accessToken = cookies.get("sb-access-token")?.value;
  const refreshToken = cookies.get("sb-refresh-token")?.value;
  if (accessToken && refreshToken) {
    try {
      const { data: { session }, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      });
      if (!error && session?.user) {
        locals.user = {
          id: session.user.id,
          email: session.user.email,
          fullName: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
          avatarUrl: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
          isAdmin: session.user.user_metadata?.is_admin || false
        };
        console.log("✅ Server-side auth: User authenticated", locals.user.email);
      } else {
        locals.user = null;
        if (error) {
          console.log("⚠️ Session validation error:", error.message);
        }
      }
    } catch (error) {
      console.error("❌ Error validating session:", error);
      locals.user = null;
    }
  } else {
    const authHeader = request.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (!error && user) {
          locals.user = {
            id: user.id,
            email: user.email,
            fullName: user.user_metadata?.full_name || user.user_metadata?.name,
            avatarUrl: user.user_metadata?.avatar_url || user.user_metadata?.picture,
            isAdmin: user.user_metadata?.is_admin || false
          };
          console.log("✅ Server-side auth: User authenticated via Bearer token", locals.user.email);
        } else {
          locals.user = null;
        }
      } catch (error) {
        console.error("❌ Error validating Bearer token:", error);
        locals.user = null;
      }
    } else {
      locals.user = null;
      console.log("ℹ️ No authentication found in request");
    }
  }
  return next();
});

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };
