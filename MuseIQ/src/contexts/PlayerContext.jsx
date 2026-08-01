import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentAlbum, setCurrentAlbum] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [error, setError] = useState(null);

  const audioRef = useRef(new Audio());

  useEffect(() => {
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    const handleError = (e) => {
      console.error("Audio error:", e);
      setError("Failed to play track");
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  const playTrack = (track, album) => {
    if (!track.previewUrl) {
      setError("No audio preview available for this track");
      return;
    }

    if (currentTrack?.trackId === track.trackId) {
      // Toggle if clicking the same track
      togglePlayPause();
      return;
    }

    const audio = audioRef.current;
    audio.src = track.previewUrl;
    audio.play().then(() => {
      setCurrentTrack(track);
      setCurrentAlbum(album);
      setIsPlaying(true);
      setError(null);
      
      // Log to history asynchronously
      if (album && localStorage.getItem('token')) {
         import('../services/historyService').then(module => {
             const historyService = module.default;
             // Ensure we format the payload correctly
             historyService.addToHistory(album.toBackendPayload ? album.toBackendPayload() : album);
         }).catch(err => console.error("Could not load historyService", err));
      }
    }).catch(err => {
      console.error("Playback failed:", err);
      setError("Playback failed");
    });
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (audio.src) {
        audio.play().then(() => setIsPlaying(true)).catch(err => console.error(err));
      }
    }
  };

  const seek = (time) => {
    audioRef.current.currentTime = time;
    setProgress(time);
  };

  const setAudioVolume = (vol) => {
    // vol is 0.0 to 1.0
    setVolume(vol);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        currentAlbum,
        isPlaying,
        progress,
        duration,
        volume,
        error,
        playTrack,
        togglePlayPause,
        seek,
        setVolume: setAudioVolume,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
