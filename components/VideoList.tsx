import React from 'react';
import { PlayCircle, Film, ArrowRight } from 'lucide-react';
import { ChoirVideo } from '../types';

interface VideoListProps {
  videos: ChoirVideo[];
  selectedVideo: ChoirVideo | null;
  onSelectVideo: (video: ChoirVideo | null) => void;
}

export const VideoList: React.FC<VideoListProps> = ({ videos, selectedVideo, onSelectVideo }) => {

  // Helper to extract YouTube ID
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // --- PLAYER VIEW ---
  if (selectedVideo) {
    const videoId = getYoutubeId(selectedVideo.link);
    
    return (
      <div className="w-full max-w-5xl mx-auto p-4 pb-20 animate-fade-in flex flex-col h-[calc(100vh-100px)]">
         {/* Internal Back Button for Clarity (Browser back also works) */}
         <div className="mb-4">
            <button 
              onClick={() => onSelectVideo(null)}
              className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors bg-black/40 px-4 py-2 rounded-full border border-white/10"
            >
              <ArrowRight size={18} />
              <span>عودة للقائمة</span>
            </button>
         </div>

         {/* Player Container - Fill available space */}
         <div className="w-full flex-1 bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative">
            {videoId ? (
              <iframe 
                // Added vq=large for 480p preference
                src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&vq=large`}
                title={selectedVideo.title}
                className="w-full h-full absolute inset-0"
                frameBorder="0"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                <p className="text-zinc-500">فشل تحميل الفيديو</p>
              </div>
            )}
         </div>

         {/* Video Info */}
         <div className="mt-4 p-4 bg-white/10 dark:bg-black/40 backdrop-blur-md rounded-2xl border border-white/5">
            <h2 className="text-xl sm:text-2xl font-bold text-white">{selectedVideo.title}</h2>
         </div>
      </div>
    );
  }

  // --- LIST VIEW ---
  return (
    <div className="w-full max-w-4xl mx-auto p-4 pb-24 animate-fade-in">
      
      {/* Header */}
      <div className="text-center bg-white/20 dark:bg-black/20 backdrop-blur-lg rounded-3xl p-6 mb-8 border border-white/20 dark:border-white/5 w-full">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white mb-2 drop-shadow-sm flex items-center justify-center gap-2">
          <Film size={28} className="text-primary" />
          <span>ترانيم الكورال</span>
        </h2>
        <div className="h-1.5 w-16 bg-primary mx-auto rounded-full opacity-80"></div>
      </div>

      {/* Grid of Thumbnails */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {videos.map((video) => {
          const videoId = getYoutubeId(video.link);
          const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : 'logo.png';

          return (
            <button 
              key={video.id}
              onClick={() => onSelectVideo(video)}
              className="group flex flex-col bg-white/10 dark:bg-black/40 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
            >
              {/* Thumbnail */}
              <div className="relative w-full aspect-video bg-black/50 overflow-hidden">
                <img 
                  src={thumbnailUrl} 
                  alt={video.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                  loading="lazy"
                />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-lg group-hover:scale-110 group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                    <PlayCircle className="text-white fill-white/20" size={32} />
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="p-4 text-right w-full">
                <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors line-clamp-2 leading-relaxed">
                  {video.title}
                </h3>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};