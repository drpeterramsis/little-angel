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
    
    // Split by the search term (case insensitive)
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={i} className="bg-yellow-200 dark:bg-yellow-700/50 text-black dark:text-white rounded px-1 box-decoration-clone">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 pb-20">
      
      {/* Search Bar - Sticky under header */}
      <div className="sticky top-20 z-40 mb-6">
        <div className="relative shadow-xl rounded-2xl">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ابحث عن ترنيمة أو كلمات..."
            className="w-full px-12 py-4 bg-white/90 dark:bg-zinc-800/90 backdrop-blur rounded-2xl border-2 border-white/50 dark:border-zinc-700 focus:border-primary outline-none transition-all text-lg placeholder:text-zinc-400 dark:text-white"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 w-6 h-6" />
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col gap-4">
        {hymns.length === 0 ? (
          <div className="text-center py-10 text-zinc-600 dark:text-zinc-300">
            <p className="text-lg font-medium">لا توجد نتائج مطابقة</p>
          </div>
        ) : (
          hymns.map((hymn) => (
            <div
              key={hymn.id}
              onClick={() => onSelectHymn(hymn)}
              className="group bg-white/60 dark:bg-zinc-900/80 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-white/40 dark:border-zinc-800 hover:bg-white/80 dark:hover:bg-zinc-900 hover:border-primary/50 dark:hover:border-primary/50 cursor-pointer transition-all hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-lg font-sans">
                    {hymn.id}
                  </span>
                  <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">
                    {highlightText(hymn.title, searchTerm)}
                  </h3>
                </div>
                <ChevronLeft className="text-zinc-400 dark:text-zinc-600 group-hover:text-primary transition-colors" />
              </div>
              
              {/* Show snippet if lyrics matched */}
              {searchTerm && hymn.lyrics.toLowerCase().includes(searchTerm.toLowerCase()) && (
                <div className="mt-3 mr-14 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                  {highlightText(
                     hymn.lyrics.substring(
                       Math.max(0, hymn.lyrics.toLowerCase().indexOf(searchTerm.toLowerCase()) - 20),
                       Math.min(hymn.lyrics.length, hymn.lyrics.toLowerCase().indexOf(searchTerm.toLowerCase()) + 80)
                     ) + "...", 
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