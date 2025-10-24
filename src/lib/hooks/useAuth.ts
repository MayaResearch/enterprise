import { useStore } from '@nanostores/react';
import { authStore, signInWithGoogle, signOut } from '../store/authStore';
import type { User, Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

interface DbUserData {
  isAdmin: boolean;
  permissionGranted: boolean;
}

interface UseAuthReturn {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  permissionGranted: boolean;
}

// Extend window to include user data
declare global {
  interface Window {
    __USER_DATA__?: {
      id: string;
      email: string;
      fullName?: string;
      avatarUrl?: string;
      isAdmin?: boolean;
      permissionGranted?: boolean;
    } | null;
  }
}

export function useAuth(): UseAuthReturn {
  const { user, session, loading } = useStore(authStore);
  const [dbUserData, setDbUserData] = useState<DbUserData>({
    isAdmin: false,
    permissionGranted: false,
  });

  // Get user permissions from global data (set by server)
  useEffect(() => {
    if (user && typeof window !== 'undefined' && window.__USER_DATA__) {
      setDbUserData({
        isAdmin: window.__USER_DATA__.isAdmin || false,
        permissionGranted: window.__USER_DATA__.permissionGranted || false,
      });
    } else {
      // Reset when logged out
      setDbUserData({
        isAdmin: false,
        permissionGranted: false,
      });
    }
  }, [user]);

  return {
    user,
    session,
    loading,
    signInWithGoogle,
    signOut,
    isAuthenticated: !!user,
    isAdmin: dbUserData.isAdmin,
    permissionGranted: dbUserData.permissionGranted,
  };
}

