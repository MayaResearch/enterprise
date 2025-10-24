import React, { useEffect, useState } from 'react';
import { LoadingBar } from '../ui/loading-bar';

export const PageProgress: React.FC = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Astro ViewTransitions events
    const handleAstroBeforeSwap = () => {
      setLoading(true);
    };

    const handleAstroAfterSwap = () => {
      setLoading(false);
    };

    const handleAstroPageLoad = () => {
      setLoading(false);
    };

    // Listen for link clicks
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.href && !link.target && link.href.startsWith(window.location.origin)) {
        const currentPath = window.location.pathname;
        const targetPath = new URL(link.href).pathname;
        
        // Only show loading if navigating to a different page
        if (currentPath !== targetPath) {
          setLoading(true);
        }
      }
    };

    // Traditional navigation
    const handleBeforeUnload = () => {
      setLoading(true);
    };

    // Astro ViewTransitions events
    document.addEventListener('astro:before-preparation', handleAstroBeforeSwap as any);
    document.addEventListener('astro:after-swap', handleAstroAfterSwap as any);
    document.addEventListener('astro:page-load', handleAstroPageLoad as any);
    
    // Regular navigation
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('click', handleLinkClick);
    
    // Custom events for manual control
    window.addEventListener('start-loading' as any, () => setLoading(true));
    window.addEventListener('stop-loading' as any, () => setLoading(false));

    return () => {
      document.removeEventListener('astro:before-preparation', handleAstroBeforeSwap as any);
      document.removeEventListener('astro:after-swap', handleAstroAfterSwap as any);
      document.removeEventListener('astro:page-load', handleAstroPageLoad as any);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('click', handleLinkClick);
      window.removeEventListener('start-loading' as any, () => setLoading(true));
      window.removeEventListener('stop-loading' as any, () => setLoading(false));
    };
  }, []);

  return <LoadingBar loading={loading} />;
};

export default PageProgress;

