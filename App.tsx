import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { HymnList } from './components/HymnList';
import { HymnDetail } from './components/HymnDetail';
import { IntroPage } from './components/IntroPage';
import { MenuPage } from './components/MenuPage';
import { ChoirMembers } from './components/ChoirMembers';
import { ScrollToTop } from './components/ScrollToTop';
import { Hymn } from './types';
import { HYMNS } from './data';

type ViewState = 'menu' | 'members' | 'hymns';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  
  // Navigation State
  const [view, setView] = useState<ViewState>('menu');

  // Hymn Data State
  const [searchTerm, setSearchTerm] = useState('');
  const [currentHymn, setCurrentHymn] = useState<Hymn | null>(null);

  // Initialize Dark Mode
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark';
    
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Handle Browser Back Button (PopState)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // If we are showing intro, ignore history changes or just stay there
      if (showIntro) return;

      const state = event.state;
      
      if (!state || state.view === 'menu') {
        setView('menu');
        setCurrentHymn(null);
      } else if (state.view === 'members') {
        setView('members');
        setCurrentHymn(null);
      } else if (state.view === 'hymns') {
        setView('hymns');
        setCurrentHymn(null);
      } else if (state.view === 'detail') {
        setView('hymns');
        const hymn = HYMNS.find(h => h.id === state.hymnId);
        if (hymn) setCurrentHymn(hymn);
        else setCurrentHymn(null); // Fallback
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [showIntro]);

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newMode;
    });
  };

  const handleEnterApp = () => {
    setShowIntro(false);
    setView('menu');
    // Replace the current history entry (Intro) with Menu so we don't go back to Intro
    window.history.replaceState({ view: 'menu' }, '');
  };

  // Back Button Logic (UI Button or Logo Click)
  const handleBack = useCallback(() => {
    if (view === 'menu') return; // Cannot go back from menu within app logic
    
    // Use browser history back, which triggers the popstate listener
    window.history.back();
  }, [view]);

  // Navigation Handlers with History Push
  const goToMembers = () => {
    setView('members');
    window.history.pushState({ view: 'members' }, '');
  };

  const goToHymns = () => {
    setView('hymns');
    window.history.pushState({ view: 'hymns' }, '');
  };

  // Filter logic for the LIST view with flexible Arabic matching
  const filteredHymns = useMemo(() => {
    const term = searchTerm.trim();
    if (!term) return HYMNS;

    // Create a flexible regex pattern for Arabic characters
    let pattern = '';
    for (const char of term) {
      if (['ا', 'أ', 'إ', 'آ'].includes(char)) {
        pattern += '[اأإآ]';
      } else if (['ي', 'ى'].includes(char)) {
        pattern += '[يى]';
      } else {
        // Escape special regex characters
        pattern += char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }
    }

    try {
      const regex = new RegExp(pattern, 'i');
      return HYMNS.filter(hymn => 
        regex.test(hymn.title) || 
        regex.test(hymn.lyrics)
      );
    } catch (e) {
      // Fallback to basic inclusion if regex fails
      const lowerTerm = term.toLowerCase();
      return HYMNS.filter(hymn => 
        hymn.title.toLowerCase().includes(lowerTerm) || 
        hymn.lyrics.toLowerCase().includes(lowerTerm)
      );
    }
  }, [searchTerm]);

  const currentIndex = useMemo(() => {
    if (!currentHymn) return -1;
    return HYMNS.findIndex(h => h.id === currentHymn.id);
  }, [currentHymn]);

  const handleSelectHymn = (hymn: Hymn) => {
    setCurrentHymn(hymn);
    window.history.pushState({ view: 'detail', hymnId: hymn.id }, '');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleNextHymn = () => {
    if (currentIndex !== -1 && currentIndex < HYMNS.length - 1) {
      const nextHymn = HYMNS[currentIndex + 1];
      setCurrentHymn(nextHymn);
      // Replace state instead of push to keep back button logic clean (Back goes to list)
      window.history.replaceState({ view: 'detail', hymnId: nextHymn.id }, '');
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const handlePrevHymn = () => {
    if (currentIndex > 0) {
      const prevHymn = HYMNS[currentIndex - 1];
      setCurrentHymn(prevHymn);
      window.history.replaceState({ view: 'detail', hymnId: prevHymn.id }, '');
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  // Determine if we are currently looking at a single hymn detail page
  const isDetailView = view === 'hymns' && currentHymn !== null;

  if (showIntro) {
    return <IntroPage onEnter={handleEnterApp} />;
  }

  const renderContent = () => {
    if (view === 'menu') {
      return (
        <MenuPage 
          onSelectLittleAngel={goToMembers} 
          onSelectHymns={goToHymns} 
        />
      );
    }

    if (view === 'members') {
      return <ChoirMembers />;
    }

    if (view === 'hymns') {
      if (currentHymn) {
        return (
          <HymnDetail 
            key={currentHymn.id}
            hymn={currentHymn} 
            // Removed initialSearchTerm={searchTerm}
            onBack={handleBack}
            onNext={handleNextHymn}
            onPrev={handlePrevHymn}
            canNext={currentIndex < HYMNS.length - 1}
            canPrev={currentIndex > 0}
          />
        );
      }
      return (
        <HymnList 
          hymns={filteredHymns}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSelectHymn={handleSelectHymn} 
        />
      );
    }
  };

  return (
    <div className="min-h-screen font-sans relative text-zinc-900 dark:text-zinc-100">
      
      {/* --- GLOBAL ANIMATED BACKGROUND --- */}
      {/* This sits behind all other content thanks to z-[-1] */}
      <div className="fixed inset-0 z-[-1] select-none pointer-events-none overflow-hidden bg-zinc-100 dark:bg-black">
        {/* Poster Image with Slow Pan Animation */}
        <div className="relative w-full h-[120%] -top-[10%]">
          <img 
            src="poster.webp" 
            alt="Background" 
            className="w-full h-full object-cover object-top opacity-30 dark:opacity-40 animate-slow-pan transition-opacity duration-1000" 
          />
        </div>
        
        {/* Gradient Overlay for Readability */}
        {/* Top is clearer, bottom is more obscure to help text pop */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.85) 100%)'
          }}
        />
        {/* Dark Mode Overlay */}
        <div 
          className="absolute inset-0 hidden dark:block"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.8) 100%)'
          }}
        />
        
        {/* Global Grain/Noise Texture (optional for glass feel) */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
        />
      </div>

      <Header 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode} 
        onBack={handleBack}
        showBack={view !== 'menu'}
      />

      <main className="relative z-10">
        {renderContent()}
      </main>

      <ScrollToTop hasBottomNav={isDetailView} />
    </div>
  );
}

export default App;