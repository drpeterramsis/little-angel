import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeaderProps {
  onBack: () => void;
  showBack: boolean;
  customTitle?: string | null; // Added optional custom title
}

export const Header: React.FC<HeaderProps> = ({ onBack, showBack, customTitle }) => {
  return (
    // Updated: Added bg-black/30, backdrop-blur-lg, and border-b to blur content behind header
    <header className="sticky top-0 z-50 w-full bg-black/30 backdrop-blur-lg border-b border-white/5 transition-all duration-300">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        
        <div className="flex items-center gap-4 w-full">
          {/* Back Button */}
          {showBack && (
            <button 
              onClick={onBack}
              className="p-3 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors backdrop-blur-md border border-white/10"
              aria-label="رجوع"
            >
              <ArrowRight size={22} />
            </button>
          )}

          {/* Logo and Name Area - Aligned to end */}
          <div 
            className="flex items-center gap-3 select-none flex-1 justify-end" 
          >
            <div className="flex flex-col items-end -space-y-0.5">
              {/* Dynamic Title: Shows customTitle if provided, otherwise defaults to Little angel */}
              <h1 className={`font-black tracking-tight text-white font-sans drop-shadow-md transition-all duration-300 ${customTitle ? 'text-lg sm:text-xl text-amber-400' : 'text-xl'}`}>
                {customTitle || "Little angel"}
              </h1>
              
              {/* Subtitle - Hide if custom title is active to save space/reduce clutter, or keep based on preference. Keeping for now but slightly fading if custom. */}
              <span className={`text-[11px] font-bold opacity-90 tracking-wide transition-opacity duration-300 ${customTitle ? 'text-zinc-400' : 'text-amber-400'}`}>
                {customTitle ? "الملاك الصغير" : "حفل نغمة أجيال"}
              </span>
            </div>

            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/20 bg-white/5 flex items-center justify-center shadow-lg backdrop-blur-md">
               <img 
                src="logo.webp" 
                alt="شعار الملاك الصغير" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'; 
                }}
               />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};