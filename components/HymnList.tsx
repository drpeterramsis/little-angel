import React from 'react';
import { Search, ChevronLeft } from 'lucide-react';
import { Hymn } from '../types';

interface HymnListProps {
  hymns: Hymn[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSelectHymn: (hymn: Hymn) => void;
}

export const HymnList: React.FC<HymnListProps> = ({ hymns, searchTerm, onSearchChange, onSelectHymn }) => {
  
  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    
    // Build flexible Arabic regex pattern
    let pattern = '';
    for (const char of highlight) {
      if (['ا', 'أ', 'إ', 'آ'].includes(char)) {
        pattern += '[اأإآ]';
      } else if (['ي', 'ى'].includes(char)) {
        pattern += '[يى]';
      } else {
        pattern += char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }
    }
    
    try {
      const regex = new RegExp(`(${pattern})`, 'gi');
      const parts = text.split(regex);
      
      return (
        <>
          {parts.map((part, i) => 
            i % 2 === 1 ? (
              <span key={i} className="bg-yellow-300/60 dark:bg-yellow-600/60 text-black dark:text-white rounded px-1 box-decoration-clone">
                {part}
              </span>
            ) : (
              part
            )
          )}
        </>
      );
    } catch (e) {
      return text;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 pb-20">
      
      {/* Search Bar - Sticky under header */}
      <div className="sticky top-20 z-40 mb-8">
        <div className="relative group">
          <div className="absolute inset-0 bg-white/20 dark:bg-black/20 rounded-2xl blur-md -z-10"></div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ابحث عن ترنيمة أو كلمات..."
            className="w-full px-12 py-4 bg-white/30 dark:bg-black/30 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-white/10 focus:border-primary/50 focus:bg-white/50 dark:focus:bg-black/50 outline-none transition-all duration-300 text-lg placeholder:text-zinc-500 dark:placeholder:text-zinc-400 text-zinc-900 dark:text-white shadow-lg"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400 w-6 h-6 pointer-events-none" />
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col gap-4">
        {hymns.length === 0 ? (
          <div className="text-center py-10">
            <div className="bg-white/20 dark:bg-black/20 backdrop-blur-lg rounded-2xl p-8 inline-block">
               <p className="text-lg font-medium text-zinc-600 dark:text-zinc-300">لا توجد نتائج مطابقة</p>
            </div>
          </div>
        ) : (
          hymns.map((hymn) => (
            <div
              key={hymn.id}
              onClick={() => onSelectHymn(hymn)}
              className="group relative bg-white/30 dark:bg-black/40 backdrop-blur-lg p-6 rounded-3xl border border-white/40 dark:border-white/5 shadow-sm hover:shadow-xl hover:bg-white/50 dark:hover:bg-black/60 hover:scale-[1.01] cursor-pointer transition-all duration-300"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white/40 dark:bg-white/10 text-primary dark:text-blue-400 font-bold text-lg font-sans shadow-inner border border-white/20">
                    {hymn.id}
                  </span>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                    {highlightText(hymn.title, searchTerm)}
                  </h3>
                </div>
                <div className="p-2 rounded-full bg-white/20 dark:bg-white/5 group-hover:bg-primary/20 dark:group-hover:bg-primary/20 transition-colors">
                   <ChevronLeft className="text-zinc-500 dark:text-zinc-400 group-hover:text-primary transition-colors" size={20} />
                </div>
              </div>
              
              {/* Show snippet if lyrics matched */}
              {searchTerm && (
                 (function() {
                    let pattern = '';
                    for (const char of searchTerm) {
                      if (['ا', 'أ', 'إ', 'آ'].includes(char)) pattern += '[اأإآ]';
                      else if (['ي', 'ى'].includes(char)) pattern += '[يى]';
                      else pattern += char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    }
                    const regex = new RegExp(pattern, 'i');
                    return regex.test(hymn.lyrics);
                 })()
              ) && (
                <div className="mt-4 mr-14 p-3 rounded-xl bg-white/20 dark:bg-black/20 text-sm text-zinc-700 dark:text-zinc-300 line-clamp-2 leading-relaxed border border-white/10">
                  {highlightText(
                     hymn.lyrics,
                     searchTerm
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};