import React, { useState, useEffect } from 'react';
import { X, Play, Pause, Clock, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { usePlayer } from '../../contexts/PlayerContext';

export const AlbumDetailsModal = ({ album, isOpen, onClose }) => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  useEffect(() => {
    if (isOpen && album) {
      const fetchTracks = async () => {
        setLoading(true);
        try {
          // Fallback tracklist fetch using iTunes API
          const term = encodeURIComponent(`${album.title} ${album.artist}`);
          const res = await axios.get(`https://itunes.apple.com/search?term=${term}&entity=song&limit=15`);
          // Filter to try to match the actual album closely
          const matchedTracks = res.data.results.filter(
            t => t.collectionName && t.collectionName.toLowerCase().includes(album.title.toLowerCase())
          );
          // If no perfect match, just use the top results
          setTracks(matchedTracks.length > 0 ? matchedTracks : res.data.results.slice(0, 10));
        } catch (error) {
          console.error("Failed to fetch tracks", error);
        } finally {
          setLoading(false);
        }
      };
      fetchTracks();
    }
  }, [isOpen, album]);

  if (!isOpen || !album) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-bg-secondary rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-border"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Left Side: Artwork & Info */}
          <div className="w-full md:w-2/5 bg-sidebar-bg p-8 flex flex-col items-center justify-center text-center border-r border-border/10">
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-xl overflow-hidden shadow-2xl mb-6">
              <img src={album.coverUrl || album.artwork} alt={album.title} className="w-full h-full object-cover" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{album.title}</h2>
            <p className="text-gray-400 text-lg mb-4">{album.artist}</p>
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-bg-secondary/5 px-4 py-2 rounded-full">
              <span>{album.releaseYear || (album.releaseDate && new Date(album.releaseDate).getFullYear())}</span>
              <span>•</span>
              <span>{album.genre}</span>
            </div>
          </div>

          {/* Right Side: Tracklist */}
          <div className="w-full md:w-3/5 flex flex-col h-[50vh] md:h-auto">
            <div className="p-6 border-b border-border bg-bg-primary/50">
              <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                <Music className="h-5 w-5 text-primary" />
                Tracklist
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : tracks.length > 0 ? (
                <div className="space-y-1 p-2">
                  {tracks.map((track, idx) => (
                    <div 
                      key={track.trackId || idx}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-primary/5 group transition-colors"
                    >
                      <div className="flex items-center gap-4 overflow-hidden">
                        <span className="text-text-secondary font-medium w-6 text-right group-hover:hidden">
                          {idx + 1}
                        </span>
                        {track.previewUrl ? (
                          <button 
                            onClick={() => playTrack(track, album)}
                            className="hidden group-hover:flex w-6 h-6 items-center justify-center text-primary"
                          >
                            {(currentTrack?.trackId === track.trackId && isPlaying) ? (
                              <Pause className="h-4 w-4 fill-current" />
                            ) : (
                              <Play className="h-4 w-4 fill-current ml-0.5" />
                            )}
                          </button>
                        ) : (
                          <span className="hidden group-hover:flex w-6 text-xs text-text-tertiary">N/A</span>
                        )}
                        <div className="flex flex-col truncate">
                          <span className="text-text-primary font-medium truncate">{track.trackName}</span>
                          <span className="text-text-secondary text-xs truncate">{track.artistName}</span>
                        </div>
                      </div>
                      <div className="text-text-secondary text-sm font-medium flex items-center gap-1 shrink-0">
                        {Math.floor(track.trackTimeMillis / 60000)}:
                        {((track.trackTimeMillis % 60000) / 1000).toFixed(0).padStart(2, '0')}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-text-secondary">
                  <p>No tracks found for this album.</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
