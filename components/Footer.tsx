import React from 'react';

export const Footer: React.FC = () => {
  return (
    // Updated: Added background color and blur to hide content. 
    // Layout: changed to single line (flex-row).
    // Font: Increased size.
    <footer className="fixed bottom-0 left-0 right-0 z-[40] w-full py-3 px-4 bg-black/60 backdrop-blur-md border-t border-white/5 pointer-events-none flex items-center justify-center">
      <div className="flex flex-row items-center gap-3 text-xs sm:text-sm text-zinc-300 font-sans font-medium drop-shadow-md opacity-90">
        <span>Carlos Peter Ramsis © 2026</span>
        <span className="text-zinc-500">•</span>
        <span>v1.0.41 All Rights Reserved</span>
      </div>
    </footer>
  );
};