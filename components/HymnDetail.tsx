import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, ChevronUp, ChevronDown, ChevronRight, ChevronLeft, Minus, Plus, Type, Maximize, Minimize } from 'lucide-react';
import { Hymn } from '../types';

interface HymnDetailProps {
  hymn: Hymn;
  onBack: () => void;
  onNext: () => void;
  onPrev: () => void;
  canNext: boolean;
  canPrev: boolean;
  onSetHeaderTitle?: (title: string | null) => void; // Added prop for changing header title
}

const FONTS = ['Cairo', 'Amiri', 'Tajawal'];

export const HymnDetail: React.FC<HymnDetailProps> = ({ 
  hymn, 
  onBack,
  onNext,
  onPrev,
  canNext,
  canPrev,
  onSetHeaderTitle
}) => {
  const [localSearch, setLocalSearch] = useState('');
  const [matchCount, setMatchCount] = useState(0);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(-1);
  const [fontSize, setFontSize] = useState(24); 
  const [fontIndex, setFontIndex] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  
  const matchRefs = useRef<(HTMLElement | null)[]>([]);
  const highlightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Refs for Swipe Gesture
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const lines = hymn.lyrics.split('\n');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Load Preferences
  useEffect(() => {
    const savedSize = localStorage.getItem('hymn-font-size');
    if (savedSize) setFontSize(parseInt(savedSize, 10));
    
    const savedFont = localStorage.getItem('hymn-font-index');
    if (savedFont) setFontIndex(parseInt(savedFont, 10));
  }, []);

  const updateFontSize = (newSize: number) => {
    const clamped = Math.max(16, Math.min(64, newSize));
    setFontSize(clamped);
    localStorage.setItem('hymn-font-size', clamped.toString());
  };

  const cycleFont = () => {
    const next = (fontIndex + 1) % FONTS.length;
    setFontIndex(next);
    localStorage.setItem('hymn-font-index', next.toString());
  };

  // Scroll Handler Logic
  useEffect(() => {
    const handleScroll = () => {
      // Hide controls on scroll
      setShowControls(false);
    };

    // Attach listener to appropriate container
    const target = isFullScreen ? scrollContainerRef.current : window;
    
    if (target) {
      target.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      if (target) {
        target.removeEventListener('scroll', handleScroll);
      }
    };
  }, [isFullScreen]);

  // Handle Header Title Change based on ShowControls
  useEffect(() => {
    if (onSetHeaderTitle) {
      if (!showControls) {
        // Controls hidden -> Show Hymn Title in Header
        onSetHeaderTitle(hymn.title);
      } else {
        // Controls visible -> Reset Header (Little Angel)
        onSetHeaderTitle(null);
      }
    }
  }, [showControls, hymn.title, onSetHeaderTitle]);

  // Cleanup header title on unmount
  useEffect(() => {
    return () => {
      if (onSetHeaderTitle) onSetHeaderTitle(null);
    };
  }, [onSetHeaderTitle]);

  // Click handler for text area to show controls
  const handleContentClick = () => {
    setShowControls(true);
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

  // Swipe Handlers
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchStartY.current = e.targetTouches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const diffX = touchStartX.current - touchEndX;
    const diffY = touchStartY.current - touchEndY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
       if (Math.abs(diffX) > 50) {
         // ARABIC BOOK REVERSE LOGIC
         // diffX < 0 means Swipe Right (Left to Right) -> NEXT
         // diffX > 0 means Swipe Left (Right to Left) -> PREV
         if (diffX < 0 && canNext) onNext();
         if (diffX > 0 && canPrev) onPrev();
       }
    }
    
    touchStartX.current = null;
    touchStartY.current = null;
  };

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
      setMatchCount(0);
    }
  }, [localSearch, hymn.lyrics, handleNavigation]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
  };

  const renderLineWithHighlights = (line: string) => {
    const cleanLine = line.replace(/^\s*\*\*/, '').replace(/\*\*\s*$/, '');
    const term = localSearch.trim();
    if (!term) return cleanLine;

    try {
      const patternString = getFlexibleRegex(term).source;
      const regex = new RegExp(`(${patternString})`, 'gi');
      const parts = cleanLine.split(regex);
      
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
      return cleanLine;
    }
  };

  useEffect(() => {
    const term = localSearch.trim();
    if (!term) return;
    const elements = document.querySelectorAll('[data-search-match="true"]');
    matchRefs.current = Array.from(elements) as HTMLElement[];
  }, [localSearch, lines]);

  const getLineInfo = (line: string) => {
    let content = line;
    let manualTag = null;
    const tagMatch = line.match(/^\[([RYBEP])\]/);
    if (tagMatch) {
      manualTag = tagMatch[1];
      content = line.substring(tagMatch[0].length).trim();
    }
    const isSpacer = manualTag === 'P';
    const isEnglish = manualTag === 'E' || (manualTag === null && /[a-zA-Z]{3,}/.test(content));
    const isChorusLabel = manualTag === 'R' || (manualTag === null && /^\s*(القرار|قرار|\(ق\))/.test(content));
    const isChorusText = manualTag === 'Y' || (manualTag === null && (/^\s*\*\*/.test(content) || /^\s*القرار/.test(content)));
    const isVerse = manualTag === 'B' || (manualTag === null && /^\s*\(?\d+[\u0660-\u0669]?\)?[\-\.]/.test(content));
    return { isEnglish, isChorusLabel, isChorusText, isVerse, isSpacer, content };
  };

  const rootClasses = isFullScreen 
    ? "fixed inset-0 z-[200] bg-black overflow-y-auto pb-20 transition-all duration-300"
    : "flex flex-col min-h-[calc(100vh-80px)] pb-64 transition-all duration-300";

  return (
    <div 
      ref={scrollContainerRef}
      className={rootClasses}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      
      {/* Sticky Controls Container with Fade Transition */}
      <div 
        className={`sticky z-30 mx-4 mt-2 transition-all duration-500 transform ${
          showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        } ${isFullScreen ? 'top-4' : 'top-20'}`}
      >
        <div className="max-w-3xl mx-auto bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-3xl p-3 shadow-xl">
          <div className="flex flex-col gap-2">
            
            <div className="flex items-center justify-center py-2 relative">
               {/* Hymn Number Badge */}
               <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center border border-white/10 text-white font-bold font-mono text-sm">
                 {hymn.id}
               </div>
               
               <h2 className="text-2xl sm:text-3xl font-black truncate text-blue-400 drop-shadow-md tracking-wide px-10">
                 {hymn.title}
               </h2>
            </div>

            <div className="flex items-center gap-2 w-full">
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

              <div className="flex items-center gap-1 bg-white/30 dark:bg-white/10 rounded-lg p-0.5 border border-white/20 flex-shrink-0">
                <button 
                  onClick={cycleFont}
                  className="p-1.5 hover:bg-white/50 dark:hover:bg-white/20 rounded text-zinc-700 dark:text-zinc-200 transition-colors border-l border-white/10 ml-0.5"
                  title="تغيير الخط"
                >
                  <Type size={14} />
                </button>

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
                
                <button 
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className="p-1.5 hover:bg-white/50 dark:hover:bg-white/20 rounded text-zinc-700 dark:text-zinc-200 transition-colors border-r border-white/10 mr-0.5"
                  title={isFullScreen ? "خروج من ملء الشاشة" : "ملء الشاشة"}
                >
                  {isFullScreen ? <Minimize size={14} /> : <Maximize size={14} />}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows with Fade */}
      <div className={`transition-opacity duration-500 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {canPrev && (
          <button
            onClick={onPrev}
            className="fixed right-2 top-1/2 -translate-y-1/2 z-[60] p-4 rounded-full bg-black/20 hover:bg-black/50 text-white backdrop-blur-md transition-all border border-white/10 shadow-lg hover:scale-110 active:scale-95"
            aria-label="السابق"
          >
            <ChevronRight size={28} />
          </button>
        )}

        {canNext && (
          <button
            onClick={onNext}
            className="fixed left-2 top-1/2 -translate-y-1/2 z-[60] p-4 rounded-full bg-black/20 hover:bg-black/50 text-white backdrop-blur-md transition-all border border-white/10 shadow-lg hover:scale-110 active:scale-95"
            aria-label="التالي"
          >
            <ChevronLeft size={28} />
          </button>
        )}
      </div>

      {/* Lyrics Content */}
      <div 
         className={`flex-1 w-full max-w-3xl mx-auto p-6 ${isFullScreen ? 'pt-6' : 'mt-4'}`}
         onClick={handleContentClick} // Add click listener to show controls
      >
        <div className={`space-y-6 text-center rounded-[32px] p-8 border shadow-lg transition-all duration-500 ${
          isFullScreen 
            ? 'bg-transparent border-transparent shadow-none' 
            : 'bg-white/20 dark:bg-black/20 backdrop-blur-md border-white/20 dark:border-white/5'
        }`}>
          {lines.map((line, index) => {
             const { isEnglish, isChorusLabel, isChorusText, isVerse, isSpacer, content } = getLineInfo(line);
             
             if (isSpacer) return <div key={index} className="h-8 w-full" aria-hidden="true" />;
             if (!content.trim()) return <div key={index} className="h-6 w-full" aria-hidden="true" />;

             let textColorClass = "text-zinc-800 dark:text-zinc-100";
             if (isChorusLabel) textColorClass = "text-red-500 dark:text-red-400 font-black text-xl mt-6 mb-2";
             else if (isChorusText) textColorClass = "text-amber-600 dark:text-amber-400 font-extrabold";
             else if (isVerse) textColorClass = "text-blue-600 dark:text-blue-300 font-bold mt-4";
             else if (isEnglish) textColorClass = "text-zinc-200 font-medium";

             const alignClass = isEnglish ? "text-left" : "text-center";
             const dir = isEnglish ? "ltr" : "rtl";
             
             const fontFamilyStyle = {
                fontFamily: FONTS[fontIndex],
                fontSize: isChorusLabel ? `${fontSize + 2}px` : `${fontSize}px`
             };

             return (
              <p 
                key={index} 
                dir={dir}
                className={`${textColorClass} ${alignClass} leading-loose transition-[font-size] duration-200 drop-shadow-sm`}
                style={fontFamilyStyle}
              >
                {renderLineWithHighlights(content)}
              </p>
             );
          })}
        </div>
      </div>

    </div>
  );
};