import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

interface ScrollToTopProps {
  hasBottomNav?: boolean;
}

export const ScrollToTop: React.FC<ScrollToTopProps> = ({ hasBottomNav = false }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down just 50px
      if (window.scrollY > 50) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Determine bottom position based on whether the sticky nav exists
  // bottom-6 (24px) for normal pages
  // bottom-32 (128px) for Hymn Detail to clear the footer buttons (~80-90px height) safely
  const positionClass = hasBottomNav ? 'bottom-32' : 'bottom-6';

  return (
    <button
      onClick={scrollToTop}
      className={`fixed ${positionClass} right-6 p-3 rounded-full bg-primary text-white shadow-xl shadow-primary/30 z-[100] border border-white/20 transition-all duration-300 transform ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-10 scale-90 pointer-events-none'
      }`}
      aria-label="العودة للأعلى"
    >
      <ArrowUp size={24} />
    </button>
  );
};