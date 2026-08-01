import React, { useState } from 'react';
import { useLibrary } from '../../contexts/LibraryContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { RatingStars } from './RatingStars';
import { Edit2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AddToPlaylistDropdown } from '../playlists/AddToPlaylistDropdown';

export const LibraryAlbumCard = ({ album, onClick }) => {
  const { updateAlbum, deleteAlbum } = useLibrary();
  const [isEditing, setIsEditing] = useState(false);
  const [editedNotes, setEditedNotes] = useState(album.notes || '');
  const [editedRating, setEditedRating] = useState(album.rating || 0);

  const handleSave = async (e) => {
    e.stopPropagation();
    await updateAlbum(album.id, { notes: editedNotes, rating: editedRating });
    setIsEditing(false);
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setEditedNotes(album.notes || '');
    setEditedRating(album.rating || 0);
    setIsEditing(false);
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 cursor-pointer" onClick={onClick}>
      <div className="flex gap-4 p-4 border-b border-border bg-bg-primary/50">
        <div className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-border">
          {album.artwork ? (
            <img src={album.artwork} alt={album.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Art</div>
          )}
        </div>
        
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h3 className="font-semibold text-text-primary text-lg truncate" title={album.title}>{album.title}</h3>
          <p className="text-text-secondary text-sm truncate" title={album.artist}>{album.artist}</p>
          <div className="mt-1 flex items-center gap-2 text-xs text-text-secondary">
            <span className="px-1.5 py-0.5 bg-bg-primary rounded text-gray-600 font-medium">
              {album.genre}
            </span>
            <span>{new Date(album.releaseDate).getFullYear()}</span>
            <span>{album.trackCount} Tracks</span>
          </div>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col" onClick={(e) => e.stopPropagation()}>
        <AnimatePresence mode="wait">
          {!isEditing ? (
            <motion.div 
              key="view"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex-1 flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-text-secondary">Rating</span>
                  <RatingStars 
                    rating={album.rating || 0} 
                    onChange={async (newRating) => {
                      setEditedRating(newRating);
                      await updateAlbum(album.id, { notes: album.notes, rating: newRating });
                    }} 
                  />
                </div>
                <div className="flex gap-1">
                  <AddToPlaylistDropdown album={album} />
                  <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setIsEditing(true); }} className="h-8 px-2 text-primary hover:text-primary-hover">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); deleteAlbum(album.id); }} className="h-8 px-2 text-error hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex-1">
                <span className="text-sm font-medium text-text-secondary block mb-1">Notes</span>
                <p className="text-sm text-text-primary whitespace-pre-wrap">
                  {album.notes || <span className="text-gray-400 italic">No notes added yet.</span>}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="edit"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex-1 flex flex-col gap-4"
            >
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Rating</label>
                <RatingStars rating={editedRating} onChange={setEditedRating} />
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-text-primary mb-1.5">Notes</label>
                <textarea
                  className="w-full rounded-md border border-border bg-bg-secondary px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none h-24"
                  value={editedNotes}
                  onChange={(e) => setEditedNotes(e.target.value)}
                  placeholder="Add your thoughts about this album..."
                />
              </div>

              <div className="flex justify-end gap-2 mt-2">
                <Button variant="ghost" size="sm" onClick={handleCancel}>Cancel</Button>
                <Button variant="primary" size="sm" onClick={handleSave}>Save Changes</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
};
