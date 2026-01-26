import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Hymn } from '../types';

interface HymnReaderProps {
  hymn: Hymn;
  onBack: () => void;
  initialSearchTerm?: string;
}

const HymnReader: React.FC<HymnReaderProps> = ({ hymn, onBack, initialSearchTerm = '' }) => {
  const topRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(24); // Base font size
  
  // Search State
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  // Initial load and auto-highlight logic
  useEffect(() => {
    // Always scroll to top when hymn changes
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
    setCurrentMatchIndex(0);

    // If we have an initial search term from the home screen
    if (initialSearchTerm && initialSearchTerm.trim() !== '') {
      setSearchQuery(initialSearchTerm);
      setShowSearch(true);

      // Set timer to clear the highlight after 5 seconds
      const timer = setTimeout(() => {
        setSearchQuery(prev => {
          // Only clear if the user hasn't actively changed the query
          if (prev === initialSearchTerm) {
            setShowSearch(false);
            return '';
          }
          return prev;
        });
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      setSearchQuery('');
      setShowSearch(false);
    }
  }, [hymn.id, initialSearchTerm]);

  // Calculate Matches
  const matches = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const results: { lineIndex: number }[] = [];
    hymn.lyrics.forEach((line, index) => {
      if (line.toLowerCase().includes(searchQuery.toLowerCase())) {
        results.push({ lineIndex: index });
      }
    });
    return results;
  }, [searchQuery, hymn.lyrics]);

  // Reset match index when query changes
  useEffect(() => {
    setCurrentMatchIndex(0);
  }, [searchQuery]);

  // Scroll to match
  useEffect(() => {
    if (matches.length > 0) {
      const lineIndex = matches[currentMatchIndex].lineIndex;
      const element = document.getElementById(`line-${lineIndex}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentMatchIndex, matches]);

  const handleNextMatch = () => {
    setCurrentMatchIndex((prev) => (prev + 1) % matches.length);
  };

  const handlePrevMatch = () => {
    setCurrentMatchIndex((prev) => (prev - 1 + matches.length) % matches.length);
  };

  // Helper to highlight text
  const renderLine = (text: string) => {
    if (!searchQuery.trim()) return text;
    
    // Split by query (case insensitive)
    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === searchQuery.toLowerCase() ? 
        <span key={i} className="bg-yellow-400 text-black rounded px-0.5 shadow-sm transition-opacity duration-500">{part}</span> : part
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white dark:bg-slate-900 min-h-[calc(100vh-80px)] shadow-xl relative pb-20 rounded-b-2xl transition-colors duration-300">
      <div ref={topRef} />
      
      {/* Sticky Toolbar inside the Reader */}
      <div className="sticky top-[73px] z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-3 py-2 shadow-sm transition-colors duration-300">
        
        {/* Top Row: Navigation & Title & Tools */}
        <div className="flex items-center justify-between gap-2 mb-2">
           <button 
            onClick={onBack}
            className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 p-2 rounded-full transition-colors focus:outline-none"
            aria-label="Back to list"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <h2 className="flex-1 text-center text-lg md:text-xl font-bold text-blue-900 dark:text-blue-300 truncate px-2" dir="auto">
            {hymn.title}
          </h2>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
             <button 
               onClick={() => setFontSize(prev => Math.max(16, prev - 2))}
               className="p-2 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-all font-bold text-sm w-8"
               title="Decrease Font Size"
             >
               A-
             </button>
             <button 
               onClick={() => setFontSize(prev => Math.min(60, prev + 2))}
               className="p-2 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-all font-bold text-lg w-8"
               title="Increase Font Size"
             >
               A+
             </button>
          </div>

          <button 
            onClick={() => {
              setShowSearch(!showSearch);
              if (!showSearch) setSearchQuery('');
            }}
            className={`p-2 rounded-full transition-colors ${showSearch ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* Search Bar Row (Conditional) */}
        {showSearch && (
          <div className="flex items-center gap-2 animate-fadeIn bg-slate-50 dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
             <input
               type="text"
               placeholder="ابحث في النص..."
               className="flex-1 p-2 text-sm rounded-md border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white outline-none focus:border-blue-400"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               autoFocus
             />
             <span className="text-xs text-slate-400 whitespace-nowrap">
               {matches.length > 0 ? `${currentMatchIndex + 1}/${matches.length}` : '0/0'}
             </span>
             <button 
               onClick={handleNextMatch}
               disabled={matches.length === 0}
               className="p-1.5 bg-white dark:bg-slate-800 rounded shadow-sm disabled:opacity-50 hover:bg-blue-50 dark:hover:bg-slate-700"
             >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
               </svg>
             </button>
             <button 
               onClick={handlePrevMatch}
               disabled={matches.length === 0}
               className="p-1.5 bg-white dark:bg-slate-800 rounded shadow-sm disabled:opacity-50 hover:bg-blue-50 dark:hover:bg-slate-700"
             >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
               </svg>
             </button>
          </div>
        )}
      </div>

      {/* Lyrics Content */}
      <div className="p-4 md:p-8 space-y-6">
        {hymn.lyrics.map((line, index) => {
          // Empty lines act as stanza breaks
          if (!line.trim()) {
            return <div key={index} className="h-6" aria-hidden="true" />;
          }

          // Check if this line is the current match
          const isCurrentMatch = matches.length > 0 && matches[currentMatchIndex].lineIndex === index;

          return (
            <div 
              key={index}
              id={`line-${index}`}
              style={{ fontSize: `${fontSize}px` }}
              className={`bidi-isolate font-medium leading-relaxed transition-colors py-1 px-2 rounded-lg 
                ${isCurrentMatch ? 'bg-blue-100 dark:bg-blue-900/50 ring-2 ring-blue-400 dark:ring-blue-500' : 'text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}
              `}
            >
              {renderLine(line)}
            </div>
          );
        })}
      </div>

      {/* Mobile Floating Back Button */}
      <button
        onClick={onBack}
        className="fixed bottom-6 left-6 bg-blue-600 text-white p-4 rounded-full shadow-lg shadow-blue-600/30 hover:bg-blue-700 active:scale-90 transition-all z-50 md:hidden"
        aria-label="العودة"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default HymnReader;