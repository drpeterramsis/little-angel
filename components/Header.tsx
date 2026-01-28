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
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-white/20 dark:border-zinc-800 shadow-sm transition-colors duration-300">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        
        <div className="flex items-center gap-3">
          {/* Back Button */}
          {showBack && (
            <button 
              onClick={onBack}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-200 transition-colors"
              aria-label="رجوع"
            >
              {/* ArrowRight points to the right, which in RTL layout acts as "Back" direction visually for many users, or we can use ArrowLeft if strictly following LTR icons. 
                  However, usually in RTL apps, the back arrow points Right (->). */}
              <ArrowRight size={24} />
            </button>
          )}

          {/* Logo and Name Area */}
          <div 
            className="flex items-center gap-3 select-none" 
          >
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20 bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm">
               <img 
                src="logo.webp" 
                alt="شعار الملاك الصغير" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'; 
                }}
               />
            </div>
            
            <div className="flex flex-col items-start -space-y-1">
              <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white font-sans">Little angel</h1>
              <span className="text-xs font-bold text-primary dark:text-secondary">حفل نغمة أجيال</span>
            </div>
          </div>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2.5 rounded-full bg-white/50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700 transition-all focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
          aria-label="تبديل الوضع الداكن"
        >
          {darkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>
    </header>
  );
};