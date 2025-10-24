import React, { useState, type JSX } from 'react';
import { signInWithGoogle } from '../../../lib/store/authStore';

export function GoogleLoginButton(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // Call the sign-in function from the store
      await signInWithGoogle();
      
      // Browser will redirect to Google OAuth automatically
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="box-border inline-flex items-center justify-center gap-1.5 border transition cursor-pointer [&_*]:cursor-[inherit] focus:outline-none focus-visible:ring disabled:cursor-not-allowed disabled:opacity-70 [&_svg]:opacity-60 ![&_svg]:pointer-events-none data-[icon-only]:shrink-0 rounded-full grow-0 no-underline h-10 px-5 data-[icon-only]:w-10 data-[icon-only]:px-0 [&_svg]:size-5 border-border-input bg-white hover:bg-gray-50 focus-visible:focus-visible:border-border-input-focus focus-visible:bg-white focus-visible:ring-neutral-200/40 font-mono text-sm font-normal uppercase [&_svg]:[opacity:1.0!important]"
        data-dd-action-name="Sign in with Google"
        type="button"
      >
        <span className="inline-grid place-content-center select-none">
          <span className={`[grid-area:1_/_1] ${loading ? 'opacity-100' : 'opacity-0'} inline-flex items-center justify-center gap-1.5 pointer-events-none select-none`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 256 256"
              height={16}
              width={16}
              className="animate-spin text-inherit"
            >
              <path d="M146.498 47C146.498 56.9411 138.439 65 128.498 65C118.557 65 110.498 56.9411 110.498 47C110.498 37.0589 118.557 29 128.498 29C138.439 29 146.498 37.0589 146.498 47Z" />
              <path d="M203.831 91.9468C196.059 98.145 184.734 96.8689 178.535 89.0967C172.337 81.3244 173.613 69.9991 181.386 63.8009C189.158 57.6027 200.483 58.8787 206.681 66.651C212.88 74.4233 211.603 85.7486 203.831 91.9468Z" />
              <path d="M204.437 164.795C194.745 162.583 188.681 152.933 190.894 143.241C193.106 133.549 202.756 127.486 212.448 129.698C222.14 131.91 228.203 141.56 225.991 151.252C223.779 160.944 214.129 167.008 204.437 164.795Z" />
              <path d="M147.859 210.689C143.546 201.733 147.31 190.975 156.267 186.662C165.223 182.349 175.981 186.113 180.294 195.07C184.607 204.026 180.843 214.784 171.887 219.097C162.93 223.41 152.172 219.646 147.859 210.689Z" />
              <path d="M76.7023 195.07C81.0156 186.113 91.773 182.349 100.73 186.662C109.686 190.975 113.45 201.733 109.137 210.689C104.824 219.646 94.0665 223.41 85.1098 219.097C76.1532 214.784 72.389 204.026 76.7023 195.07Z" />
              <path d="M44.5487 129.698C54.2406 127.486 63.8907 133.549 66.1028 143.241C68.3149 152.933 62.2514 162.583 52.5595 164.795C42.8676 167.008 33.2175 160.944 31.0054 151.252C28.7933 141.56 34.8568 131.91 44.5487 129.698Z" />
              <path d="M75.6108 63.8009C83.3831 69.9991 84.6592 81.3244 78.461 89.0967C72.2628 96.8689 60.9375 98.145 53.1652 91.9468C45.3929 85.7486 44.1168 74.4233 50.315 66.651C56.5132 58.8787 67.8385 57.6027 75.6108 63.8009Z" />
            </svg>
          </span>
          <span className={`[grid-area:1_/_1] ${loading ? 'opacity-0' : 'opacity-100'} inline-flex items-center justify-center gap-1.5 pointer-events-none`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid"
              viewBox="-24 0 310 262"
              fill="none"
              height={16}
              width={16}
              className="-mx-0.5"
              strokeWidth="1.5"
            >
              <path
                d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                fill="#4285F4"
              />
              <path
                d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                fill="#34A853"
              />
              <path
                d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                fill="#FBBC05"
              />
              <path
                d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                fill="#EB4335"
              />
            </svg>
            Sign in with Google
          </span>
        </span>
      </button>

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}
    </div>
  );
}

