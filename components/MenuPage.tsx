import React from 'react';
import { PlaySquare } from 'lucide-react'; // Importing icon for videos

interface MenuPageProps {
  onSelectLittleAngel: () => void;
  onSelectHymns: () => void;
  onSelectVideos: () => void; // Added new prop
}

export const MenuPage: React.FC<MenuPageProps> = ({ onSelectLittleAngel, onSelectHymns, onSelectVideos }) => {
  return (
    // Fixed height, overflow-hidden to prevent scrolling
    <div className="relative flex flex-col items-center justify-center h-[calc(100vh-100px)] w-full overflow-hidden">
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 p-6 w-full animate-fade-in max-w-lg mx-auto">
        
        {/* Button 1: Little Angel (Members) - HIDDEN as requested */}
        {/* 
        <button 
          onClick={onSelectLittleAngel}
          className="w-full group relative bg-gradient-to-b from-yellow-500/40 via-yellow-500/20 via-60% to-black/95 backdrop-blur-2xl border border-white/20 rounded-[40px] p-8 shadow-2xl hover:shadow-yellow-500/20 transition-all duration-500 transform hover:-translate-y-1 overflow-hidden"
        >
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-70" />
          
          <div className="relative flex flex-row-reverse items-center justify-between gap-4 sm:gap-6">
             <div className="flex flex-col items-end">
               <span className="text-3xl font-black text-white font-sans tracking-tight drop-shadow-lg">Little Angel</span>
               <span className="text-sm font-bold text-zinc-300 mt-1">فريق الكورال</span>
             </div>
             <div className="w-24 h-24 rounded-full bg-white/10 border border-white/20 shadow-2xl flex-shrink-0 overflow-hidden p-1 backdrop-blur-sm">
               <img src="logo.webp" alt="Little Angel Logo" className="w-full h-full object-cover rounded-full" />
             </div>
          </div>
        </button>
        */}

        {/* Button 2: Choir Hymns */}
        <button 
          onClick={onSelectHymns}
           // Decreased transparency: Increased alpha
          className="w-full group relative bg-gradient-to-b from-yellow-500/40 via-yellow-500/20 via-60% to-black/95 backdrop-blur-2xl border border-white/20 rounded-[40px] p-8 shadow-2xl hover:shadow-yellow-500/20 transition-all duration-500 transform hover:-translate-y-1 overflow-hidden"
        >
           {/* Glass Gloss Effect */}
           <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-70" />
          
          <div className="relative flex flex-row-reverse items-center justify-between gap-4 sm:gap-6">
             <div className="flex flex-col items-end">
               <span className="text-3xl font-black text-white font-sans tracking-tight drop-shadow-lg">نغمة أجيال</span>
               <span className="text-sm font-bold text-zinc-300 mt-1">كلمات ترانيم الحفلة</span>
             </div>
             <div className="w-24 h-24 rounded-full bg-white/10 border border-white/20 shadow-2xl flex-shrink-0 flex items-center justify-center p-1 backdrop-blur-sm overflow-hidden">
               <img 
                 src="logo2.webp" 
                 alt="Naghamat" 
                 className="w-full h-full object-cover rounded-full" 
                 onError={(e) => {
                   e.currentTarget.style.display = 'none';
                 }}
               />
             </div>
          </div>
        </button>

        {/* Button 3: Videos (New) */}
        <button 
          onClick={onSelectVideos}
          className="w-full group relative bg-gradient-to-b from-blue-600/40 via-blue-600/20 via-60% to-black/95 backdrop-blur-2xl border border-white/20 rounded-[40px] p-8 shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 transform hover:-translate-y-1 overflow-hidden"
        >
           {/* Glass Gloss Effect */}
           <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-70" />
          
          <div className="relative flex flex-row-reverse items-center justify-between gap-4 sm:gap-6">
             <div className="flex flex-col items-end">
               <span className="text-3xl font-black text-white font-sans tracking-tight drop-shadow-lg">ترانيم الكورال</span>
               <span className="text-sm font-bold text-zinc-300 mt-1">فيديوهات الحفلات</span>
             </div>
             <div className="w-24 h-24 rounded-full bg-white/10 border border-white/20 shadow-2xl flex-shrink-0 flex items-center justify-center p-1 backdrop-blur-sm overflow-hidden">
               {/* Using Play icon as placeholder or logo */}
               <div className="w-full h-full bg-black/40 rounded-full flex items-center justify-center">
                  <PlaySquare size={40} className="text-white/80" />
               </div>
             </div>
          </div>
        </button>

      </div>
    </div>
  );
};