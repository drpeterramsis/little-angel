import React from 'react';
import { Moon, Sun, Music } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  onLogoClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode, onLogoClick }) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors duration-300">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo and Name Area */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none" 
          onClick={onLogoClick}
        >
          {/* Fallback image logic is handled by standard img tag error handling usually, but here we use a placeholder or local file */}
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
             {/* Assuming logo.png is in root, using a resilient display method */}
             <img 
              src="./logo.png" 
              alt="Logo" 
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback icon if image missing
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement?.classList.add('fallback-icon');
              }}
             />
             <Music className="w-6 h-6 text-primary absolute hidden fallback-icon:block" />
          </div>
          
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight text-primary font-sans">Little Angel</h1>
          </div>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Toggle Dark Mode"
        >
          {darkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>
    </header>
  );
};