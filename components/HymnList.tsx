import React from 'react';
import { Hymn } from '../types';

interface HymnListProps {
  hymns: Hymn[];
  onSelectHymn: (id: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const HymnList: React.FC<HymnListProps> = ({ hymns, onSelectHymn, searchTerm, onSearchChange }) => {
  const filteredHymns = hymns.filter(hymn => 
    hymn.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hymn.lyrics.some(line => line.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      {/* Search Box - Big and Clear */}
      <div className="relative">
        <input
          type="text"
          placeholder="ابحث عن ترنيمة..."
          className="w-full p-4 pr-12 text-lg rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 outline-none transition-all placeholder:text-slate-400"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Grid of Hymns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredHymns.map((hymn) => (
          <button
            key={hymn.id}
            onClick={() => onSelectHymn(hymn.id)}
            className="group relative bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 text-right active:scale-98"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 text-xs font-bold px-2 py-1 rounded-full">
                {hymn.category || 'ترنيمة'}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors" dir="auto">
              {hymn.title}
            </h3>
            {/* Updated text color for better readability in light mode */}
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 line-clamp-1" dir="auto">
              {hymn.lyrics[0]}
            </p>
          </button>
        ))}
      </div>

      {filteredHymns.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-slate-400">لا توجد ترانيم بهذا الاسم</p>
        </div>
      )}
    </div>
  );
};

export default HymnList;