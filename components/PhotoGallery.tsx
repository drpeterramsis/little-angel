import React from 'react';
import { Image, X, ZoomIn } from 'lucide-react';

interface PhotoGalleryProps {
  selectedPhoto: number | null;
  onSelectPhoto: (id: number | null) => void;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ selectedPhoto, onSelectPhoto }) => {
  // Generate array of 61 image indices
  const photos = Array.from({ length: 61 }, (_, i) => i + 1);

  // Function to build image source path
  const getPhotoSrc = (index: number) => `choir (${index}).webp`;

  return (
    <div className="w-full max-w-6xl mx-auto p-4 pb-24 animate-fade-in">
      
      {/* Header */}
      <div className="mb-8 text-center bg-white/20 dark:bg-black/20 backdrop-blur-lg rounded-3xl p-6 border border-white/20 dark:border-white/5 inline-block w-full">
        <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-2 drop-shadow-sm flex items-center justify-center gap-3">
           <Image className="text-yellow-400" />
           <span>صور الكورال</span>
        </h2>
        <div className="h-1.5 w-16 bg-yellow-500 mx-auto rounded-full opacity-80"></div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {photos.map((index) => (
          <div 
            key={index}
            onClick={() => onSelectPhoto(index)}
            className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer border border-white/10 bg-white/5 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:z-10"
          >
            {/* Image */}
            <img 
              src={getPhotoSrc(index)} 
              alt={`Choir ${index}`} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.classList.add('flex', 'items-center', 'justify-center', 'bg-zinc-800');
                e.currentTarget.parentElement!.innerHTML = '<span class="text-xs text-zinc-500">Image not found</span>';
              }}
            />
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 p-2 rounded-full backdrop-blur-sm border border-white/20">
                 <ZoomIn className="text-white w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto !== null && (
        <div 
          className="fixed inset-0 z-[150] bg-black flex items-center justify-center animate-fade-in"
          onClick={() => onSelectPhoto(null)}
        >
          {/* Close Button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onSelectPhoto(null);
            }}
            className="absolute top-4 right-4 p-3 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors border border-white/20 z-[160]"
          >
            <X size={28} />
          </button>

          {/* Image Container - Fit Screen, No Scroll */}
          <div 
            className="relative w-full h-full p-4 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image area
          >
            <img 
              src={getPhotoSrc(selectedPhoto)} 
              alt={`Choir Full ${selectedPhoto}`} 
              className="max-w-full max-h-full object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      )}

    </div>
  );
};