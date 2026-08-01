import React, { useState, useEffect } from 'react';
import { usePlayer } from '../../contexts/PlayerContext';
import { useLibrary } from '../../contexts/LibraryContext';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Music, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const GlobalPlayer = () => {
  const { 
    currentTrack, 
    currentAlbum, 
    isPlaying, 
    progress, 
    duration, 
    volume, 
    togglePlayPause, 
    seek, 
    setVolume 
  } = usePlayer();

  const { library, addAlbum, deleteAlbum } = useLibrary();

  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(0.8);

  // If no track has been played yet, don't show the player
  if (!currentTrack) return null;

  const isAlbumSaved = currentAlbum && library.some(a => String(a.id) === String(currentAlbum.id));

  const toggleFavorite = async () => {
    if (!currentAlbum) return;
    if (isAlbumSaved) {
      // Find the database ID (which might be the iTunes ID) 
      // deleteAlbum takes the iTunes ID (album.id)
      await deleteAlbum(currentAlbum.id);
    } else {
      await addAlbum(currentAlbum);
    }
  };

  const handleVolumeToggle = () => {
    if (isMuted) {
      setVolume(prevVolume);
      setIsMuted(false);
    } else {
      setPrevVolume(volume);
      setVolume(0);
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val === 0) setIsMuted(true);
    else setIsMuted(false);
  };

  const handleSeek = (e) => {
    const val = parseFloat(e.target.value);
    seek(val);
  };

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return "0:00";
    const m = Math.floor(timeInSeconds / 60);
    const s = Math.floor(timeInSeconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const coverUrl = currentAlbum?.coverUrl || currentAlbum?.artwork || null;

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 h-20 md:h-24 bg-bg-secondary/90 backdrop-blur-xl border-t border-border z-50 flex items-center justify-between px-3 md:px-6 shadow-2xl"
    >
      {/* Left: Track Info & Favorite */}
      <div className="flex items-center w-[45%] md:w-1/3 min-w-0 pr-2">
        {coverUrl ? (
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-md overflow-hidden mr-3 shadow-md bg-bg-primary shrink-0">
            <img src={coverUrl} alt="Album Art" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-md bg-bg-primary flex items-center justify-center mr-3 shrink-0 text-text-secondary">
             <Music size={20} className="md:w-6 md:h-6" />
          </div>
        )}
        <div className="flex flex-col truncate min-w-0">
          <span className="text-white font-semibold text-sm md:text-base truncate hover:underline cursor-pointer">
            {currentTrack.trackName}
          </span>
          <span className="text-xs text-text-secondary truncate hover:underline cursor-pointer">
            {currentTrack.artistName}
          </span>
        </div>
        <button 
          onClick={toggleFavorite}
          className="ml-3 sm:ml-4 text-text-secondary hover:text-primary transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-1"
          title={isAlbumSaved ? "Remove album from library" : "Save album to library"}
        >
          <Heart size={20} className={isAlbumSaved ? "fill-primary text-primary" : ""} />
        </button>
      </div>

      {/* Center: Controls & Progress */}
      <div className="flex flex-col items-center justify-center w-[55%] md:w-1/3 md:max-w-[600px] px-1 md:px-4">
        <div className="flex items-center gap-4 md:gap-6 mb-1 md:mb-2">
          <button className="hidden sm:block text-text-secondary hover:text-white transition-colors" disabled>
            <SkipBack size={18} className="md:w-5 md:h-5" />
          </button>
          
          <button 
            onClick={togglePlayPause}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isPlaying ? (
              <Pause size={18} className="fill-current md:w-5 md:h-5" />
            ) : (
              <Play size={18} className="fill-current ml-1 md:w-5 md:h-5" />
            )}
          </button>
          
          <button className="hidden sm:block text-text-secondary hover:text-white transition-colors" disabled>
            <SkipForward size={18} className="md:w-5 md:h-5" />
          </button>
        </div>
        
        <div className="flex items-center w-full gap-2 md:gap-3 text-xs text-text-secondary font-medium">
          <span className="hidden sm:inline-block w-8 md:w-10 text-right">{formatTime(progress)}</span>
          <input 
            type="range" 
            min="0" 
            max={duration || 30} 
            step="0.1"
            value={progress || 0} 
            onChange={handleSeek}
            className="flex-1 h-1 bg-border rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:bg-primary"
            style={{
              background: `linear-gradient(to right, #00C6FF ${(progress / (duration || 30)) * 100}%, rgba(255,255,255,0.1) ${(progress / (duration || 30)) * 100}%)`
            }}
          />
          <span className="hidden sm:inline-block w-8 md:w-10">{formatTime(duration || 30)}</span>
        </div>
      </div>

      {/* Right: Extra Controls (Volume) */}
      <div className="hidden md:flex items-center justify-end w-1/3 gap-3">
        <button onClick={handleVolumeToggle} className="text-text-secondary hover:text-white transition-colors">
          {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01"
          value={isMuted ? 0 : volume} 
          onChange={handleVolumeChange}
          className="w-24 h-1 bg-border rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:bg-primary"
          style={{
            background: `linear-gradient(to right, #00C6FF ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.1) ${(isMuted ? 0 : volume) * 100}%)`
          }}
        />
      </div>
    </motion.div>
  );
};
