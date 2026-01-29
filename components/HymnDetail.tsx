import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, ChevronUp, ChevronDown, ChevronRight, ChevronLeft, Minus, Plus } from 'lucide-react';
import { Hymn } from '../types';

interface HymnDetailProps {
  hymn: Hymn;
  onBack: () => void;
  onNext: () => void;
  onPrev: () => void;
  canNext: boolean;
  canPrev: boolean;
}

export const HymnDetail: React.FC<HymnDetailProps> = ({ 
  hymn, 
  onBack,
  onNext,
  onPrev,
  canNext,
  canPrev
}) => {
  const [localSearch, setLocalSearch] = useState('');
  const [matchCount, setMatchCount] = useState(0);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(-1);
  const [fontSize, setFontSize] = useState(24); 
  
  const matchRefs = useRef<(HTMLElement | null)[]>([]);
  const highlightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lines = hymn.lyrics.split('\n');

  useEffect(() => {
    const savedSize = localStorage.getItem('hymn-font-size');
    if (savedSize) {
      setFontSize(parseInt(savedSize, 10));
    }
  }, []);

  const updateFontSize = (newSize: number) => {
    const clamped = Math.max(16, Math.min(64, newSize));
    setFontSize(clamped);
    localStorage.setItem('hymn-font-size', clamped.toString());
  };

  const handleNavigation = useCallback((index: number) => {
    if (matchCount === 0) return;
    
    const safeIndex = (index + matchCount) % matchCount; 
    setCurrentMatchIndex(safeIndex);

    const targetRef = matchRefs.current[safeIndex];
    if (targetRef) {
      targetRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
      targetRef.classList.add('highlight-active');
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }
      highlightTimeoutRef.current = setTimeout(() => {
        targetRef.classList.remove('highlight-active');
      }, 5000); 
    }
  }, [matchCount]);

  const getFlexibleRegex = (term: string) => {
    let pattern = '';
    for (const char of term) {
      if (['ا', 'أ', 'إ', 'آ'].includes(char)) {
        pattern += '[اأإآ]';
      } else if (['ي', 'ى'].includes(char)) {
        pattern += '[يى]';
      } else {
        pattern += char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }
    }
    return new RegExp(pattern, 'gi');
  };

  useEffect(() => {
    matchRefs.current = []; 
    const term = localSearch.trim();
    if (!term) {
      setMatchCount(0);
      setCurrentMatchIndex(-1);
      return;
    }

    try {
      const regex = getFlexibleRegex(term);
      const matches = hymn.lyrics.match(regex);
      const count = matches ? matches.length : 0;
      setMatchCount(count);
      if (count > 0) {
        setTimeout(() => handleNavigation(0), 100);
      } else {
        setCurrentMatchIndex(-1);
      }
    } catch(e) {
      console.error(e);
      setMatchCount(0);
    }
  }, [localSearch, hymn.lyrics, handleNavigation]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
  };

  const renderLineWithHighlights = (line: string) => {
    const term = localSearch.trim();
    if (!term) return line;

    try {
      const patternString = getFlexibleRegex(term).source;
      const regex = new RegExp(`(${patternString})`, 'gi');
      const parts = line.split(regex);
      
      return parts.map((part, i) => {
        if (i % 2 === 1) {
          return (
            <span
              key={i}
              className="highlight-mark"
              data-search-match="true"
            >
              {part}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      });
    } catch (e) {
      return line;
    }
  };

  useEffect(() => {
    const term = localSearch.trim();
    if (!term) return;
    const elements = document.querySelectorAll('[data-search-match="true"]');
    matchRefs.current = Array.from(elements) as HTMLElement[];
  }, [localSearch, lines]);

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] pb-64">
      
      {/* Glass Sticky Controls - Updated top to top-20 (80px) to clear the header */}
      <div className="sticky top-20 z-30 mx-4 mt-2 transition-all duration-300">
        <div className="max-w-3xl mx-auto bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-3xl p-3 shadow-xl">
          <div className="flex flex-col gap-2">
            
            {/* Row 1: Title */}
            <div className="flex items-center justify-center">
              <h2 className="text-lg font-bold truncate text-zinc-900 dark:text-white drop-shadow-sm">{hymn.title}</h2>
            </div>

            {/* Row 2: Tools (Search + MatchNav + Font) */}
            <div className="flex items-center gap-2 w-full">
              
              {/* Flexible Search Container */}
              <div className="relative flex-1 transition-all duration-300">
                <input
                  type="text"
                  value={localSearch}
                  onChange={handleSearchChange}
                  placeholder="بحث..."
                  className="w-full pl-8 pr-3 py-1.5 bg-white/40 dark:bg-black/40 rounded-lg border border-white/30 dark:border-white/10 focus:bg-white/60 dark:focus:bg-black/60 outline-none text-sm dark:text-white transition-all placeholder:text-zinc-500"
                />
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 w-3.5 h-3.5" />
              </div>
              
              {/* Match Navigation (Appears if matches > 0) */}
              {matchCount > 0 && (
                <div className="flex items-center gap-1 animate-fade-in bg-white/30 dark:bg-black/30 rounded-lg p-0.5 border border-white/20 flex-shrink-0">
                  <span className="text-[10px] text-zinc-600 dark:text-zinc-300 w-8 text-center font-mono font-bold">
                    {`${currentMatchIndex + 1}/${matchCount}`}
                  </span>
                  <button 
                    onClick={() => handleNavigation(currentMatchIndex - 1)}
                    className="p-1 hover:bg-white/50 dark:hover:bg-white/20 rounded text-zinc-700 dark:text-zinc-200"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button 
                    onClick={() => handleNavigation(currentMatchIndex + 1)}
                    className="p-1 hover:bg-white/50 dark:hover:bg-white/20 rounded text-zinc-700 dark:text-zinc-200"
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>
              )}

               {/* Font Controls - Beside Search */}
               <div className="flex items-center gap-1 bg-white/30 dark:bg-white/10 rounded-lg p-0.5 border border-white/20 flex-shrink-0">
                <button 
                  onClick={() => updateFontSize(fontSize - 2)}
                  className="p-1.5 hover:bg-white/50 dark:hover:bg-white/20 rounded text-zinc-700 dark:text-zinc-200 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <button 
                  onClick={() => updateFontSize(fontSize + 2)}
                  className="p-1.5 hover:bg-white/50 dark:hover:bg-white/20 rounded text-zinc-700 dark:text-zinc-200 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Lyrics Content */}
      <div className="flex-1 w-full max-w-3xl mx-auto p-6 mt-4">
        <div className="space-y-6 text-center bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-[32px] p-8 border border-white/20 dark:border-white/5 shadow-lg">
          {lines.map((line, index) => (
            <p 
              key={index} 
              className="font-bold leading-loose text-zinc-800 dark:text-zinc-100 font-sans transition-[font-size] duration-200 drop-shadow-sm"
              style={{ fontSize: `${fontSize}px` }}
            >
              {renderLineWithHighlights(line)}
            </p>
          ))}
        </div>
      </div>

      {/* Sticky Bottom Navigation - Moved UP (bottom-10) to clear footer */}
      <div className="fixed bottom-10 left-0 right-0 p-4 z-50">
         <div className="max-w-3xl mx-auto flex items-center justify-between gap-4 bg-white/60 dark:bg-black/60 backdrop-blur-2xl border border-white/30 dark:border-white/10 rounded-2xl p-2 shadow-2xl">
            <button
              onClick={onPrev}
              disabled={!canPrev}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
                canPrev 
                ? 'bg-white/40 dark:bg-white/10 text-zinc-900 dark:text-white hover:bg-white/60 dark:hover:bg-white/20 border border-white/20' 
                : 'bg-transparent text-zinc-400 dark:text-zinc-600 cursor-not-allowed'
              }`}
            >
              <ChevronRight size={20} />
              <span>السابق</span>
            </button>
            
            <button
              onClick={onNext}
              disabled={!canNext}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
                canNext 
                ? 'bg-primary/90 text-white hover:bg-primary shadow-lg shadow-primary/30 border border-white/20' 
                : 'bg-transparent text-zinc-400 dark:text-zinc-600 cursor-not-allowed'
              }`}
            >
              <span>التالي</span>
              <ChevronLeft size={20} />
            </button>
         </div>
      </div>

    </div>
  );
};