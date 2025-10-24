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

export function useAuth(): UseAuthReturn {
  const { user, session, loading } = useStore(authStore);
  const [dbUserData, setDbUserData] = useState<DbUserData>({
    isAdmin: false,
    permissionGranted: false,
  });

  // Fetch user permissions from database
  useEffect(() => {
    if (user) {
      fetch('/api/user/me')
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            setDbUserData({
              isAdmin: data.isAdmin || false,
              permissionGranted: data.permissionGranted || false,
            });
          }
        })
        .catch(err => {
          console.error('Error fetching user permissions:', err);
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

