import { useEffect, type JSX } from 'react';
import { supabase } from '../../lib/config/supabase';

export function HomeRedirect(): JSX.Element {
  useEffect(() => {
    const handleRedirect = async () => {
      console.log('🔄 Processing redirect...');
      
      // Wait a moment for Supabase to process any OAuth callback
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check authentication status (Supabase handles code exchange automatically)
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('❌ Error getting session:', error);
        window.location.href = '/login?error=auth_failed';
        return;
      }
      
      if (session) {
        console.log('✅ Session found, saving cookies and redirecting to dashboard');
        
        // Save tokens to cookies for server-side authentication
        document.cookie = `sb-access-token=${session.access_token}; path=/; max-age=604800; SameSite=Lax`;
        document.cookie = `sb-refresh-token=${session.refresh_token}; path=/; max-age=604800; SameSite=Lax`;
        
        // Redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        console.log('ℹ️ No session found, redirecting to login');
        window.location.href = '/login';
      }
    };
    
    handleRedirect();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
        <p className="mt-4 text-sm text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

