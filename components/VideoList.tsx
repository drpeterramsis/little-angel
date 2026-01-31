import React, { useState, useEffect } from 'react';
import { PlayCircle, PauseCircle, Film } from 'lucide-react';
import { ChoirVideo } from '../types';

interface VideoListProps {
  videos: ChoirVideo[];
}

export const VideoList: React.FC<VideoListProps> = ({ videos }) => {
  // State to track the currently playing video
  const [currentVideo, setCurrentVideo] = useState<ChoirVideo>(videos[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  // Helper to extract YouTube ID
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const currentVideoId = getYoutubeId(currentVideo.link);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 pb-24 animate-fade-in flex flex-col gap-6">
      
      {/* Header */}
      <div className="text-center bg-white/20 dark:bg-black/20 backdrop-blur-lg rounded-3xl p-4 border border-white/20 dark:border-white/5 w-full">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white mb-1 drop-shadow-sm flex items-center justify-center gap-2">
          <Film size={28} className="text-primary" />
          <span>ترانيم الكورال</span>
        </h2>
        <div className="h-1 w-16 bg-primary mx-auto rounded-full opacity-80"></div>
      </div>

      {/* Embedded Player Section */}
      <div className="w-full bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 aspect-video relative group">
        {currentVideoId ? (
          <iframe 
            src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1&rel=0`}
            title={currentVideo.title}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-900">
             <p className="text-zinc-500">فشل تحميل الفيديو</p>
          </div>
        )}
      </div>

      {/* Current Video Title Info */}
      <div className="px-2">
        <h3 className="text-xl font-bold text-white leading-relaxed">
          {currentVideo.title}
        </h3>
        <p className="text-sm text-zinc-400 mt-1">
          يتم العرض الآن
        </p>
      </div>

      {/* Playlist Divider */}
      <div className="h-px bg-white/10 w-full"></div>

      {/* Video Playlist */}
      <div className="flex flex-col gap-3">
        {videos.map((video) => {
          const videoId = getYoutubeId(video.link);
          const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : 'logo.webp';
          const isActive = currentVideo.id === video.id;

          return (
            <button 
              key={video.id}
              onClick={() => {
                setCurrentVideo(video);
                setIsPlaying(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`group flex flex-row items-center gap-3 p-3 rounded-2xl border transition-all duration-300 text-right w-full
                ${isActive 
                  ? 'bg-primary/20 border-primary/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                  : 'bg-white/10 dark:bg-black/40 border-white/10 hover:bg-white/20'
                }
              `}
            >
              {/* Thumbnail Container */}
              <div className="relative w-24 h-16 sm:w-32 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-black/50 border border-white/5">
                <img 
                  src={thumbnailUrl} 
                  alt={video.title} 
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ${isActive ? 'scale-110 opacity-60' : 'group-hover:scale-110'}`}
                  loading="lazy"
                />
                
                {/* Playing Indicator Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {isActive ? (
                     <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center animate-pulse">
                       <PlayCircle size={20} fill="currentColor" />
                     </div>
                  ) : (
                     <div className="w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <PlayCircle size={20} />
                     </div>
                  )}
                </div>
              </div>

              {/* Text Info */}
              <div className="flex-1">
                <h4 className={`text-sm sm:text-base font-bold leading-snug line-clamp-2 ${isActive ? 'text-primary' : 'text-zinc-200 group-hover:text-white'}`}>
                  {video.title}
                </h4>
                {isActive && <span className="text-[10px] text-primary/80 font-medium mt-1 inline-block">جاري التشغيل...</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};