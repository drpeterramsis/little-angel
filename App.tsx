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
  const [showIntro, setShowIntro] = useState(true);
  
  // Navigation State
  const [view, setView] = useState<ViewState>('menu');

  // Hymn Data State
  const [searchTerm, setSearchTerm] = useState('');
  const [currentHymn, setCurrentHymn] = useState<Hymn | null>(null);

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
    <div className="min-h-screen font-sans relative text-white flex flex-col">
      
      {/* --- GLOBAL ANIMATED BACKGROUND --- */}
      {/* This sits behind all other content thanks to z-[-1] */}
      <div className="fixed inset-0 z-[-1] select-none pointer-events-none overflow-hidden bg-black">
        {/* Poster Image with Slow Pan Animation */}
        <div className="relative w-full h-[120%] -top-[10%]">
          <img 
            src="poster.webp" 
            alt="Background" 
            className="w-full h-full object-cover object-top opacity-40 animate-slow-pan transition-opacity duration-1000" 
          />
        </div>
        
        {/* Dark Mode Gradient Overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.85) 100%)'
          }}
        />
        
        {/* Global Grain/Noise Texture */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
        />
      </div>

      <Header 
        onBack={handleBack}
        showBack={view !== 'menu'}
      />

      <main className="relative z-10 flex-1">
        {renderContent()}
      </main>
      
      {/* Footer */}
      <footer className="w-full py-8 text-center text-[11px] text-zinc-500 font-sans z-10 relative mt-auto border-t border-white/5 bg-black/40 backdrop-blur-md">
         <p>Carlos Peter Ramsis © 2026 | v1.0.17 All Rights Reserved.</p>
      </footer>

      <ScrollToTop hasBottomNav={isDetailView} />
    </div>
  );
}

export default App;