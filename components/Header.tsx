import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeaderProps {
  onBack: () => void;
  showBack: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onBack, showBack }) => {
  return (
    // Updated Glass Header: More transparent (bg-white/5), lighter border
    <header className="sticky top-0 z-50 w-full bg-white/5 backdrop-blur-3xl border-b border-white/5 shadow-2xl rounded-b-[40px] transition-all duration-300">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        
        <div className="flex items-center gap-4 w-full">
          {/* Back Button */}
          {showBack ? (
            <button 
              onClick={onBack}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-md border border-white/10"
              aria-label="رجوع"
            >
              <ArrowRight size={22} />
            </button>
          ) : (
            // Copyright info in the header (Replacing footer) - Visible when no back button
            <div className="flex flex-col text-[8px] text-zinc-400 font-sans leading-tight opacity-70">
              <span>Carlos Peter Ramsis © 2026</span>
              <span>v1.0.19 All Rights Reserved</span>
            </div>
          )}

          {/* Logo and Name Area */}
          <div 
            className="flex items-center gap-3 select-none flex-1 justify-end" 
          >
            <div className="flex flex-col items-end -space-y-0.5">
              <h1 className="text-xl font-black tracking-tight text-white font-sans drop-shadow-md">Little angel</h1>
              <span className="text-[11px] font-bold text-amber-400 opacity-90 tracking-wide">حفل نغمة أجيال</span>
              
              {/* If back button is shown, we squeeze version info here nicely */}
              {showBack && (
                 <span className="text-[8px] text-zinc-500 mt-0.5">v1.0.19</span>
              )}
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