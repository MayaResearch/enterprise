import { useEffect, type JSX } from 'react';
import { initializeAuth } from '../../lib/store/authStore';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  useEffect(() => {
    // Initialize auth when app mounts
    initializeAuth();
  }, []);

  return <>{children}</>;
}

