import React from 'react';
import { User } from 'lucide-react';
import { CHOIR_MEMBERS } from '../data';

export const ChoirMembers: React.FC = () => {
  return (
    <div className="w-full max-w-3xl mx-auto p-4 pb-20 animate-fade-in">
      <div className="mb-8 text-center bg-white/20 dark:bg-black/20 backdrop-blur-lg rounded-3xl p-6 border border-white/20 dark:border-white/5 inline-block w-full">
        <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-2 drop-shadow-sm">أعضاء الفريق</h2>
        <div className="h-1.5 w-16 bg-primary mx-auto rounded-full opacity-80"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CHOIR_MEMBERS.map((member) => (
          <div 
            key={member.id}
            className="group flex items-center gap-4 bg-white/30 dark:bg-black/40 backdrop-blur-xl p-5 rounded-2xl border border-white/40 dark:border-white/10 shadow-sm hover:shadow-xl hover:bg-white/40 dark:hover:bg-black/50 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-white/60 to-white/20 dark:from-white/10 dark:to-transparent border border-white/40 flex items-center justify-center flex-shrink-0 shadow-inner">
              <User size={26} className="text-zinc-700 dark:text-zinc-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-primary transition-colors">{member.name}</h3>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};