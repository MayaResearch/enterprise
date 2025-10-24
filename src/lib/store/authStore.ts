import { atom } from 'nanostores';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../config/supabase';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

// Create reactive store
export const authStore = atom<AuthState>({
  user: null,
  session: null,
  loading: true,
});

// Helper to save session tokens in cookies for server-side access
const saveSessionToCookies = (session: Session | null): void => {
  if (session) {
    // Set cookies with 7 day expiry (matching Supabase default)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);
    
    document.cookie = `sb-access-token=${session.access_token}; path=/; expires=${expiryDate.toUTCString()}; SameSite=Lax`;
    document.cookie = `sb-refresh-token=${session.refresh_token}; path=/; expires=${expiryDate.toUTCString()}; SameSite=Lax`;
  } else {
    // Clear cookies on sign out
    document.cookie = 'sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'sb-refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
};

// Initialize auth on app load
export const initializeAuth = async (): Promise<void> => {
  try {
    console.log('🔄 Initializing auth...');
    
    // Get existing session (from localStorage or URL callback)
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Error getting session:', error);
    }
    
    if (session) {
      console.log('✅ Session found!', session.user.email);
      // Save tokens to cookies for server-side access
      saveSessionToCookies(session);
    } else {
      console.log('ℹ️ No active session');
      saveSessionToCookies(null);
    }
    
    // Update store
    authStore.set({
      user: session?.user ?? null,
      session: session ?? null,
      loading: false,
    });

    // Listen for auth state changes
    supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔔 Auth state changed:', event, session?.user?.email);
      
      // Update cookies when session changes
      saveSessionToCookies(session);
      
      authStore.set({
        user: session?.user ?? null,
        session: session ?? null,
        loading: false,
      });
    });
  } catch (error) {
    console.error('❌ Error initializing auth:', error);
    authStore.set({
      user: null,
      session: null,
      loading: false,
    });
  }
};

// Sign in with Google OAuth
export const signInWithGoogle = async (): Promise<void> => {
  console.log('🔐 Initiating Google Sign In...');
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/dashboard',  // Redirect to dashboard after sign-in
    },
  });

  if (error) {
    console.error('❌ Sign in error:', error);
    throw error;
  }
  
  if (data?.url) {
    console.log('✅ Redirecting to Google...');
    // Browser will redirect automatically
  }
};

// Sign out
export const signOut = async (): Promise<void> => {
  console.log('🔄 Signing out...');
  
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('❌ Error signing out:', error);
    throw error;
  }
  
  console.log('✅ Signed out successfully');
  
  // Redirect to login
  window.location.href = '/login';
};

