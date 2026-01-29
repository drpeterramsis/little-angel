import React from 'react';

interface MenuPageProps {
  onSelectLittleAngel: () => void;
  onSelectHymns: () => void;
}

export const MenuPage: React.FC<MenuPageProps> = ({ onSelectLittleAngel, onSelectHymns }) => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-140px)] w-full overflow-hidden">
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 p-6 w-full animate-fade-in max-w-lg mx-auto">
        
        {/* Button 1: Little Angel */}
        <button 
          onClick={onSelectLittleAngel}
          className="w-full group relative bg-gradient-to-b from-yellow-500/20 via-yellow-500/5 via-60% to-black/90 backdrop-blur-xl border border-white/10 rounded-[40px] p-8 shadow-2xl hover:shadow-yellow-500/10 transition-all duration-500 transform hover:-translate-y-1 overflow-hidden"
        >
          {/* Glass Gloss Effect */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50" />
          
          <div className="relative flex flex-row-reverse items-center justify-between gap-4 sm:gap-6">
             <div className="flex flex-col items-end">
               <span className="text-3xl font-black text-white font-sans tracking-tight drop-shadow-lg">Little Angel</span>
               <span className="text-sm font-bold text-zinc-400 mt-1">فريق الكورال</span>
             </div>
             <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 shadow-2xl flex-shrink-0 overflow-hidden p-1 backdrop-blur-sm">
               <img src="logo.webp" alt="Little Angel Logo" className="w-full h-full object-cover rounded-full" />
             </div>
          </div>
        </button>

        {/* Button 2: Choir Hymns */}
        <button 
          onClick={onSelectHymns}
          className="w-full group relative bg-gradient-to-b from-yellow-500/20 via-yellow-500/5 via-60% to-black/90 backdrop-blur-xl border border-white/10 rounded-[40px] p-8 shadow-2xl hover:shadow-yellow-500/10 transition-all duration-500 transform hover:-translate-y-1 overflow-hidden"
        >
           {/* Glass Gloss Effect */}
           <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50" />
          
          <div className="relative flex flex-row-reverse items-center justify-between gap-4 sm:gap-6">
             <div className="flex flex-col items-end">
               <span className="text-3xl font-black text-white font-sans tracking-tight drop-shadow-lg">نغمة أجيال</span>
               <span className="text-sm font-bold text-zinc-400 mt-1">كلمات ترانيم الحفلة</span>
             </div>
             <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 shadow-2xl flex-shrink-0 flex items-center justify-center p-1 backdrop-blur-sm overflow-hidden">
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

      </div>
    </div>
  );
};