import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-[40] w-full p-2 bg-gradient-to-t from-black/90 to-transparent pointer-events-none flex flex-col items-center justify-end">
      <div className="flex flex-col items-center text-[9px] text-zinc-400 font-sans leading-tight opacity-70 mb-1 drop-shadow-md">
        <span>Carlos Peter Ramsis © 2026</span>
        <span>v1.0.20 All Rights Reserved</span>
      </div>
    </footer>
  );
};