import React from 'react';

interface HeaderProps {
  onHomeClick: () => void;
  isDark: boolean;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHomeClick, isDark, toggleTheme }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Toggle Theme Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
          aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? (
            // Sun Icon
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            // Moon Icon
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        {/* Logo and Title */}
        <button 
          onClick={onHomeClick}
          className="flex items-center gap-3 transition-transform active:scale-95 focus:outline-none"
          aria-label="العودة للرئيسية"
        >
          <div className="text-right flex flex-col items-end">
            <span className="text-xl md:text-2xl font-black text-blue-600 dark:text-blue-400 tracking-wider">
              Little Angel
            </span>
          </div>
          {/* Logo with Fallback Logic */}
          <img 
            src="./logo.png" 
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null; 
              // Fallback to online image if local is missing to prevent broken icon
              target.src = "https://play-lh.googleusercontent.com/wFjG_B6d6XfRUXMKyD1wdqLsu5G-oKDbXIDtO99Kx0yFm2YvG0QyJzXqC8X5JzZ8zQ=w240-h480-rw";
            }}
            alt="Little Angel Logo" 
            className="w-12 h-12 md:w-16 md:h-16 rounded-full shadow-sm border-2 border-slate-100 dark:border-slate-700 object-cover"
          />
        </button>
      </div>
    </header>
  );
};

export default Header;