import React from 'react';
import { Moon, Sun, ArrowRight } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  onBack: () => void;
  showBack: boolean;
}

export const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode, onBack, showBack }) => {
  return (
    // iOS Glass Header: High blur, low opacity background, subtle border
    <header className="sticky top-0 z-50 w-full bg-white/40 dark:bg-black/40 backdrop-blur-2xl border-b border-white/20 dark:border-white/5 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        
        <div className="flex items-center gap-3">
          {/* Back Button */}
          {showBack && (
            <button 
              onClick={onBack}
              className="p-2.5 rounded-full bg-white/20 dark:bg-white/10 hover:bg-white/40 dark:hover:bg-white/20 text-zinc-800 dark:text-zinc-100 transition-colors backdrop-blur-md"
              aria-label="رجوع"
            >
              <ArrowRight size={22} />
            </button>
          )}

          {/* Logo and Name Area */}
          <div 
            className="flex items-center gap-3 select-none" 
          >
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/40 dark:border-white/20 bg-white/20 dark:bg-white/5 flex items-center justify-center shadow-inner backdrop-blur-md">
               <img 
                src="logo.webp" 
                alt="شعار الملاك الصغير" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'; 
                }}
               />
            </div>
            
            <div className="flex flex-col items-start -space-y-0.5">
              <h1 className="text-lg font-extrabold tracking-tight text-zinc-900 dark:text-white font-sans drop-shadow-sm">Little angel</h1>
              <span className="text-[10px] font-bold text-primary dark:text-amber-400 opacity-90">حفل نغمة أجيال</span>
            </div>
          </div>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2.5 rounded-full bg-white/20 dark:bg-black/30 text-zinc-700 dark:text-zinc-200 hover:bg-white/50 dark:hover:bg-white/10 transition-all backdrop-blur-md border border-white/20 dark:border-white/10 shadow-sm"
          aria-label="تبديل الوضع الداكن"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
};