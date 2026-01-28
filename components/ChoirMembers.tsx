import React from 'react';
import { User } from 'lucide-react';
import { CHOIR_MEMBERS } from '../data';

export const ChoirMembers: React.FC = () => {
  return (
    <div className="w-full max-w-3xl mx-auto p-4 pb-20 animate-fade-in">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">أعضاء الفريق</h2>
        <div className="h-1 w-16 bg-primary mx-auto rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CHOIR_MEMBERS.map((member) => (
          <div 
            key={member.id}
            className="flex items-center gap-4 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm p-4 rounded-2xl border border-white/40 dark:border-zinc-800 shadow-sm hover:bg-white/80 dark:hover:bg-zinc-800 transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <User size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{member.name}</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};