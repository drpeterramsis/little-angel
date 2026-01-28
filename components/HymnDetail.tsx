import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, ChevronUp, ChevronDown, ChevronRight, ChevronLeft, Minus, Plus, Type } from 'lucide-react';
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
  // Initialize with empty string so search is cleared when entering
  const [localSearch, setLocalSearch] = useState('');
  const [matchCount, setMatchCount] = useState(0);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(-1);
  const [fontSize, setFontSize] = useState(24); // Default 24px
  
  // Refs for managing scrolling and highlighting
  const matchRefs = useRef<(HTMLElement | null)[]>([]);
  const highlightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Parse lyrics into lines for rendering
  const lines = hymn.lyrics.split('\n');

  // Load font size from local storage on mount
  useEffect(() => {
    const savedSize = localStorage.getItem('hymn-font-size');
    if (savedSize) {
      setFontSize(parseInt(savedSize, 10));
    }
  }, []);

  // Save font size when changed
  const updateFontSize = (newSize: number) => {
    // Limits: 16px to 64px
    const clamped = Math.max(16, Math.min(64, newSize));
    setFontSize(clamped);
    localStorage.setItem('hymn-font-size', clamped.toString());
  };

  // Logic to find matches and scroll to them
  const handleNavigation = useCallback((index: number) => {
    if (matchCount === 0) return;
    
    const safeIndex = (index + matchCount) % matchCount; // Handle wrap-around
    setCurrentMatchIndex(safeIndex);

    const targetRef = matchRefs.current[safeIndex];
    if (targetRef) {
      // 1. Scroll into view centrally
      targetRef.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // 2. Add Active Class
      targetRef.classList.add('highlight-active');

      // 3. Clear existing timeout to prevent premature fading if user clicks fast
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }

      // 4. Set timeout to remove class (fade out)
      highlightTimeoutRef.current = setTimeout(() => {
        targetRef.classList.remove('highlight-active');
      }, 5000); // 5 seconds
    }
  }, [matchCount]);

  // Effect: Reset refs and calculate matches when search changes
  useEffect(() => {
    matchRefs.current = []; // Reset refs
    
    const term = localSearch.trim().toLowerCase();
    if (!term) {
      setMatchCount(0);
      setCurrentMatchIndex(-1);
      return;
    }

    const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = hymn.lyrics.match(regex);
    const count = matches ? matches.length : 0;
    
    setMatchCount(count);
    
    if (count > 0) {
      setTimeout(() => handleNavigation(0), 100);
    } else {
      setCurrentMatchIndex(-1);
    }
  }, [localSearch, hymn.lyrics, handleNavigation]);

  // Handle Search Input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
  };

  // Helper to render text with highlighted spans that attach to refs
  const renderLineWithHighlights = (line: string) => {
    if (!localSearch.trim()) return line;

    const term = localSearch.toLowerCase();
    const parts = line.split(new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    
    return parts.map((part, i) => {
      if (part.toLowerCase() === term) {
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
  };

  // More robust ref collection using querySelector after render
  useEffect(() => {
    const term = localSearch.trim();
    if (!term) return;

    const elements = document.querySelectorAll('[data-search-match="true"]');
    matchRefs.current = Array.from(elements) as HTMLElement[];
  }, [localSearch, lines]);

  return (
    // Increased padding-bottom to pb-64 to allow scrolling well past the sticky footer/buttons
    <div className="flex flex-col min-h-[calc(100vh-80px)] pb-64">
      
      {/* Detail Header / Nav */}
      <div className="sticky top-[73px] z-30 bg-white/90 dark:bg-zinc-950/90 backdrop-blur border-b border-white/20 dark:border-zinc-800 px-4 py-3 shadow-sm">
        <div className="max-w-3xl mx-auto flex flex-col gap-3">
          
          {/* Top Row: Title and Font Controls */}
          <div className="flex items-center justify-between">
            {/* Title only */}
            <h2 className="text-xl font-bold truncate text-primary">{hymn.title}</h2>
            
            {/* Font Controls */}
            <div className="flex items-center gap-1 bg-zinc-100/80 dark:bg-zinc-800 rounded-lg p-1">
              <button 
                onClick={() => updateFontSize(fontSize - 2)}
                className="p-1.5 hover:bg-white dark:hover:bg-zinc-700 rounded-md text-zinc-600 dark:text-zinc-300 transition-colors"
                aria-label="تصغير الخط"
              >
                <Minus size={16} />
              </button>
              <Type size={16} className="text-zinc-400" />
              <button 
                onClick={() => updateFontSize(fontSize + 2)}
                className="p-1.5 hover:bg-white dark:hover:bg-zinc-700 rounded-md text-zinc-600 dark:text-zinc-300 transition-colors"
                aria-label="تكبير الخط"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Internal Search Bar */}
          <div className="flex items-center gap-2 w-full">
            <div className="relative flex-1">
              <input
                type="text"
                value={localSearch}
                onChange={handleSearchChange}
                placeholder="بحث داخل الكلمات..."
                className="w-full pl-10 pr-4 py-2 bg-white/80 dark:bg-zinc-900 rounded-lg border border-zinc-300 dark:border-zinc-700 focus:border-primary outline-none text-sm dark:text-white transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
            </div>
            
            {/* Search Navigation Buttons - Conditionally Rendered to save space when not in use */}
            {matchCount > 0 && (
              <div className="flex items-center gap-1 animate-fade-in">
                <span className="text-xs text-zinc-500 whitespace-nowrap mx-1 font-mono">
                  {`${currentMatchIndex + 1}/${matchCount}`}
                </span>
                <button 
                  onClick={() => handleNavigation(currentMatchIndex - 1)}
                  className="p-2 bg-white/80 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 shadow-sm"
                >
                  <ChevronUp size={16} />
                </button>
                <button 
                  onClick={() => handleNavigation(currentMatchIndex + 1)}
                  className="p-2 bg-white/80 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 shadow-sm"
                >
                  <ChevronDown size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lyrics Content */}
      <div className="flex-1 w-full max-w-3xl mx-auto p-6">
        <div className="space-y-6 text-center">
          {lines.map((line, index) => (
            <p 
              key={index} 
              className="font-semibold leading-loose text-zinc-800 dark:text-zinc-200 font-sans transition-[font-size] duration-200"
              style={{ fontSize: `${fontSize}px` }}
            >
              {renderLineWithHighlights(line)}
            </p>
          ))}
        </div>
      </div>

      {/* Sticky Bottom Navigation for Hymns */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-zinc-950/90 backdrop-blur border-t border-zinc-200 dark:border-zinc-800 z-50">
         <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
            <button
              onClick={onPrev}
              disabled={!canPrev}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
                canPrev 
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 active:scale-[0.98]' 
                : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-300 dark:text-zinc-700 cursor-not-allowed'
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
                ? 'bg-primary text-white hover:bg-blue-600 shadow-lg shadow-blue-500/20 active:scale-[0.98]' 
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-300 dark:text-zinc-700 cursor-not-allowed'
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