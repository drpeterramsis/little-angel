import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface IntroPageProps {
  onEnter: () => void;
}

export const IntroPage: React.FC<IntroPageProps> = ({ onEnter }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center animate-fade-in">
       
       <div className="flex flex-col items-center gap-8 max-w-lg w-full bg-white/20 dark:bg-black/20 backdrop-blur-md p-10 rounded-3xl shadow-xl border border-white/30 dark:border-white/10">
          <div className="w-40 h-40 rounded-full bg-white dark:bg-zinc-800 shadow-2xl flex items-center justify-center mb-2 animate-bounce-slow overflow-hidden">
             {/* Main Logo */}
             <img 
               src="./logo.webp"
               alt="شعار كورال الملاك الصغير" 
               className="w-full h-full object-cover"
             />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-zinc-900 dark:text-white drop-shadow-sm font-sans tracking-tight">
              الملاك الصغير
            </h1>
            <p className="text-2xl font-light text-zinc-800 dark:text-zinc-200">
              خدمة الكورال
            </p>
          </div>
          
          <div className="h-1 w-20 bg-zinc-900/10 dark:bg-white/20 rounded-full"></div>

          <p className="text-lg text-zinc-800/90 dark:text-zinc-200/90 leading-relaxed font-medium">
            أهلاً بكم في تطبيق كورال الملاك الصغير
            <br/>
            مجموعة من الترانيم والألحان الروحية
          </p>

          <button 
            onClick={onEnter}
            className="w-full mt-4 group relative px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold text-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
          >
            <span>دخول التطبيق</span>
            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </button>
       </div>
       
       <div className="absolute bottom-6 text-sm text-zinc-600 dark:text-zinc-400 font-medium opacity-60">
         v1.0.1 • كورال الملاك الصغير
       </div>
    </div>
  );
};