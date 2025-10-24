import React, { useEffect, type JSX, type ReactNode } from 'react';
import { supabase } from '../../../lib/config/supabase';

interface LoginWrapperProps {
  children: ReactNode;
  errorParam: string | null;
  errorMessages: Record<string, string>;
}

export function LoginWrapper({ children, errorParam, errorMessages }: LoginWrapperProps): JSX.Element {
  useEffect(() => {
    // Handle OAuth callback after redirect from Google
    const handleAuthCallback = async () => {
      // Check if we have OAuth params in URL
      const params = new URLSearchParams(window.location.search);
      const hasOAuthParams = params.has('code') || params.has('access_token');
      
      if (hasOAuthParams) {
        console.log('🔄 OAuth callback detected, processing...');
        
        // Wait a bit for Supabase to process the callback automatically
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if session is now established
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log('✅ Session established, redirecting to dashboard');
          
          // Save tokens to cookies
          document.cookie = `sb-access-token=${session.access_token}; path=/; max-age=604800; SameSite=Lax`;
          document.cookie = `sb-refresh-token=${session.refresh_token}; path=/; max-age=604800; SameSite=Lax`;
          
          // Redirect to dashboard
          window.location.href = '/dashboard';
        } else {
          console.log('⚠️ No session after OAuth callback');
          // Clean up URL params
          window.history.replaceState({}, document.title, '/login');
        }
      }
    };
    
    handleAuthCallback();
  }, []);

  return <>{children}</>;
}

