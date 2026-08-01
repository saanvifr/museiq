import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Library, Check } from 'lucide-react';
import { useLibrary } from '../../contexts/LibraryContext';
import clsx from 'clsx';

export const AlbumCard = ({ album, onClick }) => {
  const { library, addAlbum } = useLibrary();
  
  const isSaved = library.some(a => a.id === album.id);

  const handleSave = (e) => {
    e.stopPropagation();
    if (!isSaved) {
      addAlbum(album);
    }
  };

  return (
    <Card 
      className="group flex flex-col h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer" 
      onClick={onClick}
    >
      <div className="relative aspect-square overflow-hidden bg-bg-primary">
        {album.artwork ? (
          <img 
            src={album.artwork} 
            alt={album.title} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            No Artwork
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-2">
          {album.genre && (
            <span className="px-2 py-1 text-xs font-semibold bg-black/60 text-white backdrop-blur-md rounded-md">
              {album.genre}
            </span>
          )}
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-text-primary text-lg line-clamp-1 mb-1" title={album.title}>
          {album.title}
        </h3>
        <p className="text-text-secondary text-sm mb-3 line-clamp-1" title={album.artist}>
          {album.artist}
        </p>
        
        <div className="mt-auto flex items-center justify-between">
          <div className="text-xs text-text-secondary flex flex-col gap-0.5">
            <span>{new Date(album.releaseDate).getFullYear()}</span>
            <span>{album.trackCount} Tracks</span>
          </div>
          
          <Button 
            variant={isSaved ? 'secondary' : 'primary'} 
            size="sm"
            onClick={handleSave}
            disabled={isSaved}
            className={clsx(
              "shadow-sm", 
              isSaved && "border-success text-success hover:bg-bg-secondary cursor-default"
            )}
          >
            {isSaved ? (
              <>
                <Check className="h-4 w-4 mr-1.5" />
                Saved
              </>
            ) : (
              <>
                <Library className="h-4 w-4 mr-1.5" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};
