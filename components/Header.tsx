import React from 'react';
import { Moon, Sun } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  onLogoClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode, onLogoClick }) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-white/20 dark:border-zinc-800 shadow-sm transition-colors duration-300">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo and Name Area */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none group" 
          onClick={onLogoClick}
        >
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20 bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
             <img 
              src="./logo.webp" 
              alt="شعار الملاك الصغير" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none'; // Simple fallback if image fails, though webp should work
              }}
             />
          </div>
          
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white font-sans">الملاك الصغير</h1>
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