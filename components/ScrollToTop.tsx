import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down just 50px
      // This ensures it appears almost immediately when the user starts scrolling
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

  return (
    <button
      onClick={scrollToTop}
      // Fixed position at bottom-24 (approx 6rem above bottom) to avoid overlap with sticky bottom nav
      // z-[100] ensures it is strictly above the Header (z-50) and HymnDetail Footer (z-50)
      className={`fixed bottom-24 right-6 p-3 rounded-full bg-primary text-white shadow-xl shadow-primary/30 z-[100] border border-white/20 transition-all duration-300 transform ${
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