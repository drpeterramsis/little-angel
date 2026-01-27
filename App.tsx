import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { HymnList } from './components/HymnList';
import { HymnDetail } from './components/HymnDetail';
import { Hymn } from './types';
import { HYMNS } from './data';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  
  // Lifted state
  const [searchTerm, setSearchTerm] = useState('');
  const [currentHymn, setCurrentHymn] = useState<Hymn | null>(null);

  // Initialize Dark Mode
  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

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

  // Filter logic for the LIST view
  const filteredHymns = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return HYMNS;

    return HYMNS.filter(hymn => 
      hymn.title.toLowerCase().includes(term) || 
      hymn.lyrics.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  // Index logic for NAVIGATION (uses full list to allow sequential browsing)
  const currentIndex = useMemo(() => {
    if (!currentHymn) return -1;
    return HYMNS.findIndex(h => h.id === currentHymn.id);
  }, [currentHymn]);

  const handleSelectHymn = (hymn: Hymn) => {
    setCurrentHymn(hymn);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBack = () => {
    setCurrentHymn(null);
    // Search term is preserved so list remains filtered
  };

  const handleNextHymn = () => {
    if (currentIndex !== -1 && currentIndex < HYMNS.length - 1) {
      setCurrentHymn(HYMNS[currentIndex + 1]);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const handlePrevHymn = () => {
    if (currentIndex > 0) {
      setCurrentHymn(HYMNS[currentIndex - 1]);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300 font-sans">
      <Header 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode} 
        onLogoClick={handleBack}
      />

      <main>
        {currentHymn ? (
          <HymnDetail 
            key={currentHymn.id}
            hymn={currentHymn} 
            initialSearchTerm={searchTerm}
            onBack={handleBack}
            onNext={handleNextHymn}
            onPrev={handlePrevHymn}
            canNext={currentIndex < HYMNS.length - 1}
            canPrev={currentIndex > 0}
          />
        ) : (
          <HymnList 
            hymns={filteredHymns}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onSelectHymn={handleSelectHymn} 
          />
        )}
      </main>
    </div>
  );
}

export default App;