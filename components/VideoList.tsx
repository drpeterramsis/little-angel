import React from 'react';
import { PlayCircle } from 'lucide-react';
import { ChoirVideo } from '../types';

interface VideoListProps {
  videos: ChoirVideo[];
}

export const VideoList: React.FC<VideoListProps> = ({ videos }) => {
  
  // Helper to extract YouTube ID
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 pb-20 animate-fade-in">
      <div className="mb-8 text-center bg-white/20 dark:bg-black/20 backdrop-blur-lg rounded-3xl p-6 border border-white/20 dark:border-white/5 inline-block w-full">
        <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-2 drop-shadow-sm">ترانيم الكورال</h2>
        <div className="h-1.5 w-16 bg-primary mx-auto rounded-full opacity-80"></div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {videos.map((video) => {
          const videoId = getYoutubeId(video.link);
          const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : 'logo.webp';

          return (
            <a 
              key={video.id}
              href={video.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col sm:flex-row items-center gap-4 bg-white/30 dark:bg-black/40 backdrop-blur-xl p-4 rounded-3xl border border-white/40 dark:border-white/10 shadow-sm hover:shadow-xl hover:bg-white/40 dark:hover:bg-black/50 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
            >
              {/* Thumbnail Container */}
              <div className="relative w-full sm:w-40 h-48 sm:h-28 rounded-2xl overflow-hidden flex-shrink-0 bg-black/20 border border-white/10">
                {/* Fallback/Loader Background using logo.webp */}
                <div className="absolute inset-0 flex items-center justify-center bg-black">
                   <img src="logo.webp" alt="Loading..." className="w-full h-full object-cover opacity-50 blur-sm" />
                </div>
                
                {/* Actual Thumbnail */}
                <img 
                  src={thumbnailUrl} 
                  alt={video.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    // If YouTube thumb fails, keep showing the fallback or explicitly set to logo
                    e.currentTarget.style.opacity = '0';
                  }}
                />
                
                {/* Play Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-lg group-hover:scale-110 transition-transform">
                    <PlayCircle className="text-white fill-white/20" size={24} />
                  </div>
                </div>
              </div>

              {/* Text Info */}
              <div className="flex-1 text-center sm:text-right w-full">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-primary transition-colors leading-relaxed line-clamp-2">
                  {video.title}
                </h3>
                <span className="inline-block mt-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 bg-white/20 dark:bg-white/5 px-2 py-1 rounded-lg">
                  فتح في يوتيوب
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};