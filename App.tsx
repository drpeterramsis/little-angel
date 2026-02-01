import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HymnList } from './components/HymnList';
import { HymnDetail } from './components/HymnDetail';
import { IntroPage } from './components/IntroPage';
import { MenuPage } from './components/MenuPage';
import { ChoirMembers } from './components/ChoirMembers';
import { VideoList } from './components/VideoList';
import { PhotoGallery } from './components/PhotoGallery';
import { ScrollToTop } from './components/ScrollToTop';
import { Hymn, ChoirVideo } from './types';
import { HYMNS, CHOIR_VIDEOS } from './data';

type ViewState = 'menu' | 'members' | 'hymns' | 'videos' | 'photos';

// Create a sorted copy of HYMNS based on ID to ensure correct order (1, 2, 3...)
// This fixes issues where data might be entered out of numerical order in data.ts
const SORTED_HYMNS = [...HYMNS].sort((a, b) => a.id - b.id);

function App() {
  const [showIntro, setShowIntro] = useState(true);
  
  // Navigation State
  const [view, setView] = useState<ViewState>('menu');

  // Header State
  const [headerTitle, setHeaderTitle] = useState<string | null>(null);

  // Content State
  const [searchTerm, setSearchTerm] = useState('');
  const [currentHymn, setCurrentHymn] = useState<Hymn | null>(null);
  const [lastViewedHymnId, setLastViewedHymnId] = useState<number | null>(null); // New state for highlighting
  const [selectedVideo, setSelectedVideo] = useState<ChoirVideo | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  // Handle Browser Back Button (PopState)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // Reset header title on navigation
      setHeaderTitle(null);

      // If we are showing intro, ignore history changes or just stay there
      if (showIntro) return;

      const state = event.state;
      
      // Reset content states
      setCurrentHymn(null);
      setSelectedVideo(null);
      setSelectedPhoto(null);

      if (!state || state.view === 'menu') {
        setView('menu');
        setLastViewedHymnId(null); // Reset highlight when back to menu
      } else if (state.view === 'members') {
        setView('members');
      } else if (state.view === 'hymns') {
        setView('hymns');
        // Note: We do NOT reset lastViewedHymnId here, so the list stays highlighted
      } else if (state.view === 'videos') {
        setView('videos');
        if (state.videoId) {
           const video = CHOIR_VIDEOS.find(v => v.id === state.videoId);
           if (video) setSelectedVideo(video);
        }
      } else if (state.view === 'photos') {
        setView('photos');
        if (state.photoId) {
           setSelectedPhoto(state.photoId);
        }
      } else if (state.view === 'detail') {
        setView('hymns');
        // Find hymn from sorted list (though find works regardless of order)
        const hymn = SORTED_HYMNS.find(h => h.id === state.hymnId);
        if (hymn) {
          setCurrentHymn(hymn);
          setLastViewedHymnId(hymn.id); // Ensure ID is tracked if we navigated forward somehow
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [showIntro]);

  const handleEnterApp = () => {
    setShowIntro(false);
    setView('menu');
    setLastViewedHymnId(null);
    window.history.replaceState({ view: 'menu' }, '');
  };

  // Back Button Logic (UI Button or Logo Click)
  const handleBack = useCallback(() => {
    setHeaderTitle(null);
    if (view === 'menu') return;
    window.history.back();
  }, [view]);

  // Navigation Handlers
  const goToMembers = () => {
    setView('members');
    window.history.pushState({ view: 'members' }, '');
  };

  const goToHymns = () => {
    setView('hymns');
    // We can clear highlight here if we want "fresh" entry from menu, 
    // but handlePopState handles the 'menu' case which covers back navigation.
    // If entering fresh from menu button, we might want to clear it too.
    setLastViewedHymnId(null); 
    window.history.pushState({ view: 'hymns' }, '');
  };

  const goToVideos = () => {
    setView('videos');
    window.history.pushState({ view: 'videos' }, '');
  };

  const goToPhotos = () => {
    setView('photos');
    window.history.pushState({ view: 'photos' }, '');
  };

  // --- HYMNS LOGIC ---
  const filteredHymns = useMemo(() => {
    const term = searchTerm.trim();
    if (!term) return SORTED_HYMNS; // Return sorted list by default

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

    try {
      const regex = new RegExp(pattern, 'i');
      return SORTED_HYMNS.filter(hymn => 
        regex.test(hymn.title) || 
        regex.test(hymn.lyrics)
      );
    } catch (e) {
      const lowerTerm = term.toLowerCase();
      return SORTED_HYMNS.filter(hymn => 
        hymn.title.toLowerCase().includes(lowerTerm) || 
        hymn.lyrics.toLowerCase().includes(lowerTerm)
      );
    }
  }, [searchTerm]);

  const currentIndex = useMemo(() => {
    if (!currentHymn) return -1;
    return SORTED_HYMNS.findIndex(h => h.id === currentHymn.id);
  }, [currentHymn]);

  const handleSelectHymn = (hymn: Hymn) => {
    setCurrentHymn(hymn);
    setLastViewedHymnId(hymn.id); // Track viewed hymn
    window.history.pushState({ view: 'detail', hymnId: hymn.id }, '');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleNextHymn = () => {
    // Navigation now respects the sorted order (ID order)
    if (currentIndex !== -1 && currentIndex < SORTED_HYMNS.length - 1) {
      const nextHymn = SORTED_HYMNS[currentIndex + 1];
      setCurrentHymn(nextHymn);
      setLastViewedHymnId(nextHymn.id);
      window.history.replaceState({ view: 'detail', hymnId: nextHymn.id }, '');
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const handlePrevHymn = () => {
    // Navigation now respects the sorted order (ID order)
    if (currentIndex > 0) {
      const prevHymn = SORTED_HYMNS[currentIndex - 1];
      setCurrentHymn(prevHymn);
      setLastViewedHymnId(prevHymn.id);
      window.history.replaceState({ view: 'detail', hymnId: prevHymn.id }, '');
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  // --- VIDEOS LOGIC ---
  const handleSelectVideo = (video: ChoirVideo | null) => {
    setSelectedVideo(video);
    if (video) {
      window.history.pushState({ view: 'videos', videoId: video.id }, '');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- PHOTOS LOGIC ---
  const handleSelectPhoto = (photoId: number | null) => {
    if (photoId === null) {
      // Closing the gallery detail view -> Go back in history
      // This ensures consistent behavior with the browser back button
      window.history.back();
    } else {
      const isAlreadyOpen = selectedPhoto !== null;
      setSelectedPhoto(photoId);
      
      if (isAlreadyOpen) {
        // Swiping between photos: Replace state to avoid cluttering history
        window.history.replaceState({ view: 'photos', photoId: photoId }, '');
      } else {
        // Opening photo from grid: Push state
        window.history.pushState({ view: 'photos', photoId: photoId }, '');
      }
    }
  };

  const isDetailView = view === 'hymns' && currentHymn !== null;

  const getBackgroundImage = () => {
    if (view === 'hymns') {
      if (currentHymn) return 'empty.webp';
      return 'music.webp';
    }
    if (view === 'videos' || view === 'photos') {
      return 'music.webp'; 
    }
    return 'background2.webp';
  };

  if (showIntro) {
    return <IntroPage onEnter={handleEnterApp} />;
  }

  const renderContent = () => {
    if (view === 'menu') {
      return (
        <MenuPage 
          onSelectLittleAngel={goToMembers} 
          onSelectHymns={goToHymns}
          onSelectVideos={goToVideos}
          onSelectPhotos={goToPhotos}
        />
      );
    }

    if (view === 'members') {
      return <ChoirMembers />;
    }

    if (view === 'videos') {
      return (
        <VideoList 
          videos={CHOIR_VIDEOS} 
          selectedVideo={selectedVideo}
          onSelectVideo={handleSelectVideo}
        />
      );
    }

    if (view === 'photos') {
      return (
        <PhotoGallery 
          selectedPhoto={selectedPhoto}
          onSelectPhoto={handleSelectPhoto}
        />
      );
    }

    if (view === 'hymns') {
      if (currentHymn) {
        return (
          <HymnDetail 
            key={currentHymn.id}
            hymn={currentHymn} 
            onBack={handleBack}
            onNext={handleNextHymn}
            onPrev={handlePrevHymn}
            canNext={currentIndex < SORTED_HYMNS.length - 1}
            canPrev={currentIndex > 0}
            onSetHeaderTitle={setHeaderTitle}
          />
        );
      }
      return (
        <HymnList 
          hymns={filteredHymns}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSelectHymn={handleSelectHymn}
          lastViewedHymnId={lastViewedHymnId} // Pass prop
        />
      );
    }
  };

  return (
    <div className="min-h-screen font-sans relative text-white flex flex-col">
      <div className="fixed inset-0 z-[-1] select-none pointer-events-none overflow-hidden bg-black">
        <div className="relative w-full h-full">
          <img 
            src={getBackgroundImage()} 
            alt="Background" 
            className="w-full h-full object-cover opacity-60 transition-all duration-500" 
          />
        </div>
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.85) 100%)'
          }}
        />
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
        />
      </div>

      <Header 
        onBack={handleBack}
        showBack={view !== 'menu'}
        customTitle={headerTitle}
      />

      <main className="relative z-10 flex-1">
        {renderContent()}
      </main>

      <Footer />

      <ScrollToTop hasBottomNav={isDetailView} />
    </div>
  );
}

export default App;