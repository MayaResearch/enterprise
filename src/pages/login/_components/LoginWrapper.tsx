import React, { useEffect, type JSX, type ReactNode } from 'react';
import { useAuth } from '../../../lib/hooks/useAuth';

interface LoginWrapperProps {
  children: ReactNode;
  errorParam: string | null;
  errorMessages: Record<string, string>;
}

export function LoginWrapper({ children, errorParam, errorMessages }: LoginWrapperProps): JSX.Element {
  const { loading, isAuthenticated } = useAuth();

  useEffect(() => {
    // Redirect to dashboard if already authenticated
    if (!loading && isAuthenticated) {
      window.location.href = '/dashboard';
    }
  }, [loading, isAuthenticated]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
          <p className="mt-4 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    // Will redirect via useEffect
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-sm text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

