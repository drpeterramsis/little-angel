import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface IntroPageProps {
  onEnter: () => void;
}

export const IntroPage: React.FC<IntroPageProps> = ({ onEnter }) => {
  // Animation Stages:
  // 0: Initial (Logo Visible, BG Blurred)
  // 1: Transition (Logo Fades Out, BG Unblurs)
  // 2: Final (Bottom UI Reveal)
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Sequence Timers
    const t1 = setTimeout(() => setStage(1), 2500); // Wait 2.5s before clearing blur
    const t2 = setTimeout(() => setStage(2), 3500); // 1s after blur clears, show UI

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black font-sans">
      
      {/* 1. Background Poster Image */}
      <div className="absolute inset-0 z-0">
        <div 
          className={`w-full h-full transition-all duration-[1500ms] ease-in-out transform ${
            stage === 0 ? 'scale-110 blur-xl' : 'scale-100 blur-0'
          }`}
        >
          {/* Note: Ensure 'poster.webp' is in the root folder */}
          <img 
            src="poster.webp" 
            alt="Event Poster" 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.style.backgroundColor = '#333';
            }}
          />
        </div>
      </div>

      {/* 2. Center Chorale Logo (Initial State) */}
      <div 
        className={`absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-1000 ease-out ${
          stage === 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full flex items-center justify-center drop-shadow-2xl animate-fade-in">
           {/* Note: Uses existing logo.webp */}
           <img 
             src="logo.webp" 
             alt="Little Angel Logo" 
             className="w-full h-full object-contain" 
           />
        </div>
      </div>

      {/* 3. Bottom UI Overlay (Final State) */}
      <div 
        className={`absolute bottom-0 left-0 right-0 z-20 flex flex-col items-center justify-end pb-8 pt-32 px-6 bg-gradient-to-t from-white via-white/95 to-transparent transition-all duration-1000 transform ${
          stage === 2 ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
        }`}
      >
         <div className="flex flex-col items-center gap-6 w-full max-w-md">
            
            {/* Naghamat Ajyal Logo */}
            <div className="w-32 h-auto">
              {/* Note: Ensure 'naghamat.webp' is in the root folder */}
              <img 
                src="naghamat.webp" 
                alt="Naghamat Ajyal" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>

            {/* Enter Button */}
            <button 
              onClick={onEnter}
              className="w-full group relative px-8 py-4 bg-zinc-900 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-zinc-800 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
            >
              <span>دخول التطبيق</span>
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </button>

            {/* Version Number */}
            <div className="text-[10px] text-zinc-400 font-medium">
              v1.0.37
            </div>
         </div>
      </div>
    </div>
  );
};