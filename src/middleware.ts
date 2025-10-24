import { defineMiddleware } from 'astro:middleware';
import { createClient } from '@supabase/supabase-js';
import { db } from './lib/db';
import { users } from './lib/db/schema';
import { eq } from 'drizzle-orm';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// Define the user type for locals
export interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  isAdmin?: boolean;
  permissionGranted?: boolean;
}

// Extend Astro's locals type
declare global {
  namespace App {
    interface Locals {
      user: AuthUser | null;
      supabase: ReturnType<typeof createClient>;
    }
  }
}

export const onRequest = defineMiddleware(async ({ request, locals, cookies, redirect }, next) => {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Create a Supabase client for server-side
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      detectSessionInUrl: false,
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        // Forward the authorization header from the request
        Authorization: request.headers.get('Authorization') || '',
      },
    },
  });

  // Attach supabase client to locals
  locals.supabase = supabase;

  // Try to get the session from the access token in cookies
  const accessToken = cookies.get('sb-access-token')?.value;
  const refreshToken = cookies.get('sb-refresh-token')?.value;

  if (accessToken && refreshToken) {
    try {
      // Set the session using the tokens
      const { data: { session }, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (!error && session?.user) {
        // Fetch user data from public.users (source of truth for permissions)
        try {
          const [dbUser] = await db
            .select({
              id: users.id,
              email: users.email,
              fullName: users.fullName,
              avatarUrl: users.avatarUrl,
              isAdmin: users.isAdmin,
              permissionGranted: users.permissionGranted,
            })
            .from(users)
            .where(eq(users.id, session.user.id))
            .limit(1);

          if (dbUser) {
            locals.user = {
              id: dbUser.id,
              email: dbUser.email,
              fullName: dbUser.fullName || undefined,
              avatarUrl: dbUser.avatarUrl || undefined,
              isAdmin: dbUser.isAdmin,
              permissionGranted: dbUser.permissionGranted,
            };
            console.log('✅ Server-side auth: User authenticated from DB', locals.user.email, 
              `[isAdmin: ${locals.user.isAdmin}, permission: ${locals.user.permissionGranted}]`);
          } else {
            locals.user = null;
            console.log('⚠️ User not found in database:', session.user.email);
          }
        } catch (dbError) {
          console.error('❌ Error fetching user from database:', dbError);
          locals.user = null;
        }
      } else {
        locals.user = null;
        if (error) {
          console.log('⚠️ Session validation error:', error.message);
        }
      }
    } catch (error) {
      console.error('❌ Error validating session:', error);
      locals.user = null;
    }
  } else {
    // Try to get session from Authorization header (for API requests)
    const authHeader = request.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (!error && user) {
          // Fetch user data from public.users (source of truth for permissions)
          try {
            const [dbUser] = await db
              .select({
                id: users.id,
                email: users.email,
                fullName: users.fullName,
                avatarUrl: users.avatarUrl,
                isAdmin: users.isAdmin,
                permissionGranted: users.permissionGranted,
              })
              .from(users)
              .where(eq(users.id, user.id))
              .limit(1);

            if (dbUser) {
              locals.user = {
                id: dbUser.id,
                email: dbUser.email,
                fullName: dbUser.fullName || undefined,
                avatarUrl: dbUser.avatarUrl || undefined,
                isAdmin: dbUser.isAdmin,
                permissionGranted: dbUser.permissionGranted,
              };
              console.log('✅ Server-side auth: User authenticated via Bearer token from DB', locals.user.email);
            } else {
              locals.user = null;
            }
          } catch (dbError) {
            console.error('❌ Error fetching user from database:', dbError);
            locals.user = null;
          }
        } else {
          locals.user = null;
        }
      } catch (error) {
        console.error('❌ Error validating Bearer token:', error);
        locals.user = null;
      }
    } else {
      locals.user = null;
      console.log('ℹ️ No authentication found in request');
    }
  }

  // Don't redirect on API routes or auth callback routes
  const isApiRoute = pathname.startsWith('/api/');
  const isAuthCallback = pathname.includes('/auth/callback') || url.searchParams.has('code') || url.searchParams.has('access_token');
  
  // Skip redirects for API and auth callback routes
  if (isApiRoute || isAuthCallback) {
    return next();
  }

  // Also allow login page to process OAuth callback
  if (pathname === '/login' && url.searchParams.size > 0) {
    return next();
  }

  // Server-side redirects based on authentication
  const isAuthenticated = !!locals.user;

  // Redirect authenticated users from login page to dashboard
  if (isAuthenticated && pathname === '/login') {
    return redirect('/dashboard', 302);
  }

  // Redirect unauthenticated users from dashboard to login
  if (!isAuthenticated && pathname.startsWith('/dashboard')) {
    return redirect('/login', 302);
  }

  // Redirect home page based on authentication
  if (pathname === '/') {
    if (isAuthenticated) {
      return redirect('/dashboard', 302);
    } else {
      return redirect('/login', 302);
    }
  }

  return next();
});

