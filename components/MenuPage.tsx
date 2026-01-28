import React from 'react';
import { Music } from 'lucide-react';

interface MenuPageProps {
  onSelectLittleAngel: () => void;
  onSelectHymns: () => void;
}

export const MenuPage: React.FC<MenuPageProps> = ({ onSelectLittleAngel, onSelectHymns }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-6 gap-6 animate-fade-in">
      
      {/* Button 1: Little Angel */}
      <button 
        onClick={onSelectLittleAngel}
        className="w-full max-w-md group relative bg-white/20 dark:bg-black/30 backdrop-blur-md border border-white/40 dark:border-white/10 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative flex flex-row-reverse items-center justify-between gap-4 sm:gap-6">
           <div className="flex flex-col items-end">
             {/* Responsive text size: xl on mobile, 3xl on larger screens */}
             <span className="text-xl sm:text-3xl font-black text-zinc-900 dark:text-white font-sans tracking-tight">Little Angel</span>
             <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mt-1">فريق الكورال</span>
           </div>
           <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white dark:bg-zinc-800 shadow-lg border-2 border-white/50 flex-shrink-0 overflow-hidden p-1">
             <img src="logo.webp" alt="Little Angel Logo" className="w-full h-full object-cover rounded-full" />
           </div>
        </div>
      </button>

      {/* Button 2: Choir Hymns */}
      <button 
        onClick={onSelectHymns}
        className="w-full max-w-md group relative bg-white/20 dark:bg-black/30 backdrop-blur-md border border-white/40 dark:border-white/10 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative flex flex-row-reverse items-center justify-between gap-4 sm:gap-6">
           <div className="flex flex-col items-end">
             {/* Responsive text size: xl on mobile, 3xl on larger screens */}
             <span className="text-xl sm:text-3xl font-black text-zinc-900 dark:text-white font-sans tracking-tight">ترانيم الكورال</span>
             <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mt-1">كلمات و ألحان</span>
           </div>
           <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-amber-300 to-orange-400 shadow-lg border-2 border-white/50 flex-shrink-0 flex items-center justify-center text-white">
             <Music size={40} className="sm:w-12 sm:h-12" />
           </div>
        </div>
      </button>

    </div>
  );
};