import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HymnList from './components/HymnList';
import HymnReader from './components/HymnReader';
import { Hymn } from './types';

// Fallback data in case fetch fails
const FALLBACK_HYMNS: Hymn[] = [
  {
    id: "error-1",
    title: "مرحباً بكم - Welcome",
    category: "System",
    lyrics: [
      "أهلاً بكم في تطبيق الملاك الصغير",
      "Welcome to Little Angel App",
      "",
      "إذا كنت ترى هذه الرسالة،",
      "If you see this message,",
      "فقد تعذر تحميل ملف الترانيم",
      "the hymns file could not be loaded."
    ]
  }
];

const App: React.FC = () => {
  const [hymns, setHymns] = useState<Hymn[]>([]);
  const [selectedHymnId, setSelectedHymnId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search State moved here to share between List and Reader
  const [searchTerm, setSearchTerm] = useState('');
  
  // Theme State
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply Theme Side Effect
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  useEffect(() => {
    const fetchHymns = async () => {
      try {
        setLoading(true);
        const response = await fetch('./hymns.json');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (Array.isArray(data)) {
          setHymns(data);
        } else {
          throw new Error("Format error: JSON must be an array");
        }
      } catch (err: any) {
        console.error("Failed to load hymns:", err);
        setError("تعذر تحميل الترانيم. يرجى المحاولة لاحقاً.");
        if (window.location.protocol === 'file:') {
             setError("Cannot load JSON via 'file://' protocol. Please use a local server.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHymns();
  }, []);

  const handleSelectHymn = (id: string) => {
    setSelectedHymnId(id);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setSelectedHymnId(null);
  };

  const selectedHymn = hymns.find(h => h.id === selectedHymnId);

  return (
    <div className={`min-h-screen flex flex-col font-sans text-right transition-colors duration-300 ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-900'}`} dir="rtl">
      <Header onHomeClick={handleBack} isDark={isDark} toggleTheme={toggleTheme} />

      <main className="flex-1 container mx-auto px-2 md:px-4 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400 dark:text-slate-500">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-current mb-4"></div>
            <p className="text-lg font-bold">جاري تحميل الترانيم...</p>
            <p className="text-sm opacity-75">Loading Hymns...</p>
          </div>
        ) : error ? (
           <div className="text-center py-12 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/50 p-6 mx-4">
            <p className="text-red-600 dark:text-red-400 font-bold text-xl mb-2">عذراً</p>
            <p className="text-slate-600 dark:text-slate-300">{error}</p>
          </div>
        ) : selectedHymn ? (
          <HymnReader 
            hymn={selectedHymn} 
            onBack={handleBack}
            initialSearchTerm={searchTerm}
          />
        ) : (
          <HymnList 
            hymns={hymns} 
            onSelectHymn={handleSelectHymn}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        )}
      </main>
    </div>
  );
};

export default App;