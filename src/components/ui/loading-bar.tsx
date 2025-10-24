import React, { useEffect, useState } from 'react';

interface LoadingBarProps {
  loading?: boolean;
}

export const LoadingBar: React.FC<LoadingBarProps> = ({ loading = false }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (loading) {
      setIsVisible(true);
      setProgress(0);
      
      // Simulate progress
      const timer1 = setTimeout(() => setProgress(30), 100);
      const timer2 = setTimeout(() => setProgress(60), 300);
      const timer3 = setTimeout(() => setProgress(80), 600);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    } else if (isVisible) {
      // Complete the progress
      setProgress(100);
      
      // Hide after animation completes
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
        setProgress(0);
      }, 400);
      
      return () => clearTimeout(hideTimer);
    }
  }, [loading, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-gray-100/30">
      <div
        className="h-full bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 transition-all duration-300 ease-out relative"
        style={{
          width: `${progress}%`,
          boxShadow: progress < 100 
            ? '0 0 20px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.5)' 
            : 'none',
        }}
      >
        {/* Highlight shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </div>
    </div>
  );
};

export default LoadingBar;

