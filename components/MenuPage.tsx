import React from 'react';

interface MenuPageProps {
  onSelectLittleAngel: () => void;
  onSelectHymns: () => void;
}

export const MenuPage: React.FC<MenuPageProps> = ({ onSelectLittleAngel, onSelectHymns }) => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-80px)] w-full overflow-hidden">
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 p-6 w-full animate-fade-in max-w-lg mx-auto">
        
        {/* Button 1: Little Angel */}
        <button 
          onClick={onSelectLittleAngel}
          className="w-full group relative bg-white/30 dark:bg-black/40 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-[32px] p-6 shadow-lg shadow-black/5 hover:shadow-2xl hover:bg-white/40 dark:hover:bg-black/50 transition-all duration-500 transform hover:-translate-y-1 overflow-hidden"
        >
          {/* Glass Reflection Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative flex flex-row-reverse items-center justify-between gap-4 sm:gap-6">
             <div className="flex flex-col items-end">
               <span className="text-2xl sm:text-3xl font-black text-zinc-800 dark:text-white font-sans tracking-tight drop-shadow-sm">Little Angel</span>
               <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 mt-1">فريق الكورال</span>
             </div>
             <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/20 dark:bg-white/5 border border-white/30 shadow-inner flex-shrink-0 overflow-hidden p-1 backdrop-blur-sm">
               <img src="logo.webp" alt="Little Angel Logo" className="w-full h-full object-cover rounded-full" />
             </div>
          </div>
        </button>

        {/* Button 2: Choir Hymns */}
        <button 
          onClick={onSelectHymns}
          className="w-full group relative bg-white/30 dark:bg-black/40 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-[32px] p-6 shadow-lg shadow-black/5 hover:shadow-2xl hover:bg-white/40 dark:hover:bg-black/50 transition-all duration-500 transform hover:-translate-y-1 overflow-hidden"
        >
          {/* Glass Reflection Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative flex flex-row-reverse items-center justify-between gap-4 sm:gap-6">
             <div className="flex flex-col items-end">
               <span className="text-2xl sm:text-3xl font-black text-zinc-800 dark:text-white font-sans tracking-tight drop-shadow-sm">نغمة أجيال</span>
               <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 mt-1">كلمات ترانيم الحفلة</span>
             </div>
             <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/20 dark:bg-white/5 border border-white/30 shadow-inner flex-shrink-0 flex items-center justify-center p-1 backdrop-blur-sm overflow-hidden">
               {/* Updated to use logo2.webp instead of Music Icon */}
               <img 
                 src="logo2.webp" 
                 alt="Naghamat" 
                 className="w-full h-full object-cover rounded-full" 
                 onError={(e) => {
                   // Fallback if image not found, hide image and show text or empty
                   e.currentTarget.style.display = 'none';
                 }}
               />
             </div>
          </div>
        </button>

      </div>
    </div>
  );
};