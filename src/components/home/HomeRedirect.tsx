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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 256 256"
          height={32}
          width={32}
          className="animate-spin mx-auto"
          style={{ color: '#262626' }}
        >
          <path d="M146.498 47C146.498 56.9411 138.439 65 128.498 65C118.557 65 110.498 56.9411 110.498 47C110.498 37.0589 118.557 29 128.498 29C138.439 29 146.498 37.0589 146.498 47Z" />
          <path d="M203.831 91.9468C196.059 98.145 184.734 96.8689 178.535 89.0967C172.337 81.3244 173.613 69.9991 181.386 63.8009C189.158 57.6027 200.483 58.8787 206.681 66.651C212.88 74.4233 211.603 85.7486 203.831 91.9468Z" />
          <path d="M204.437 164.795C194.745 162.583 188.681 152.933 190.894 143.241C193.106 133.549 202.756 127.486 212.448 129.698C222.14 131.91 228.203 141.56 225.991 151.252C223.779 160.944 214.129 167.008 204.437 164.795Z" />
          <path d="M147.859 210.689C143.546 201.733 147.31 190.975 156.267 186.662C165.223 182.349 175.981 186.113 180.294 195.07C184.607 204.026 180.843 214.784 171.887 219.097C162.93 223.41 152.172 219.646 147.859 210.689Z" />
          <path d="M76.7023 195.07C81.0156 186.113 91.773 182.349 100.73 186.662C109.686 190.975 113.45 201.733 109.137 210.689C104.824 219.646 94.0665 223.41 85.1098 219.097C76.1532 214.784 72.389 204.026 76.7023 195.07Z" />
          <path d="M44.5487 129.698C54.2406 127.486 63.8907 133.549 66.1028 143.241C68.3149 152.933 62.2514 162.583 52.5595 164.795C42.8676 167.008 33.2175 160.944 31.0054 151.252C28.7933 141.56 34.8568 131.91 44.5487 129.698Z" />
          <path d="M75.6108 63.8009C83.3831 69.9991 84.6592 81.3244 78.461 89.0967C72.2628 96.8689 60.9375 98.145 53.1652 91.9468C45.3929 85.7486 44.1168 74.4233 50.315 66.651C56.5132 58.8787 67.8385 57.6027 75.6108 63.8009Z" />
        </svg>
      </div>
    </div>
  );
}

