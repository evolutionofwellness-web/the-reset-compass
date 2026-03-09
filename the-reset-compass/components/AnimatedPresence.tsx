
import React, { useEffect, useState } from 'react';

interface AnimatedPresenceProps {
  isVisible: boolean;
  children: React.ReactNode;
  mode?: 'modal' | 'view'; // 'modal' adds fixed wrapper, 'view' allows flow
}

const AnimatedPresence: React.FC<AnimatedPresenceProps> = ({ isVisible, children, mode = 'modal' }) => {
  const [shouldRender, setShouldRender] = useState(isVisible);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      setIsExiting(false);
    } else {
      setIsExiting(true);
      // Wait for animation to finish before unmounting
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsExiting(false);
      }, 400); // Matches longest exit animation duration in CSS
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!shouldRender) return null;

  // For modals, we use a fixed wrapper that fades the backdrop.
  // For views, we use a standard div.
  const wrapperClass = mode === 'modal' 
    ? `fixed inset-0 z-50 transition-all duration-300 ${isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'}`
    : `w-full transition-all duration-300 ${isExiting ? 'opacity-0 scale-[0.98]' : 'animate-fade-in'}`;

  // If we are exiting a modal, we want the *content* inside to also potentially scale out, 
  // but fading the parent fixed div handles the visual exit gracefully enough for high performance.
  
  // Note: For 'modal' mode, the children usually contain "fixed inset-0". 
  // We wrap them in a div that controls opacity. 
  // Since 'children' often has its own positioning, our wrapper mainly serves to enforce the opacity transition.
  
  return (
    <div className={wrapperClass} style={mode === 'modal' ? { pointerEvents: isExiting ? 'none' : 'auto' } : {}}>
      {children}
    </div>
  );
};

export default AnimatedPresence;
