import React, { useState } from 'react';
import { useLibrary } from '../contexts/LibraryContext';
import { LibraryAlbumCard } from '../components/library/LibraryAlbumCard';
import { EmptyState } from '../components/common/EmptyState';
import { Skeleton } from '../components/common/Skeleton';
import { AlbumDetailsModal } from '../components/common/AlbumDetailsModal';
import { Library as LibraryIcon, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Library = () => {
  const { library, loading, error } = useLibrary();
  const [sortBy, setSortBy] = useState('newest');
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const navigate = useNavigate();

  const sortedLibrary = [...library].sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.releaseDate) - new Date(b.releaseDate);
      case 'artist':
        return a.artist.localeCompare(b.artist);
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'newest':
      default:
        return new Date(b.releaseDate) - new Date(a.releaseDate);
    }
  });

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-text-primary mb-2">My Library</h2>
          <p className="text-text-secondary text-lg">
            Manage your saved albums and ratings.
          </p>
        </div>

        {library.length > 0 && (
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-text-secondary">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-bg-secondary border border-border text-text-primary text-sm rounded-lg focus:ring-primary focus:border-primary block p-2 outline-none shadow-sm"
            >
              <option value="newest">Newest Release</option>
              <option value="oldest">Oldest Release</option>
              <option value="artist">Artist Name</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        )}
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-xl border border-border p-4 bg-bg-secondary flex flex-col h-64 gap-4">
               <div className="flex gap-4">
                  <Skeleton className="w-24 h-24 rounded-md" />
                  <div className="flex-1 flex flex-col gap-2 justify-center">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
               </div>
               <Skeleton className="h-20 w-full mt-auto" />
            </div>
          ))}
        </div>
      )}

      {error && !loading && (
        <EmptyState 
          icon={AlertCircle}
          title="Failed to load library"
          description={error}
        />
      )}

      {!loading && !error && library.length === 0 && (
        <EmptyState 
          icon={LibraryIcon}
          title="Your library is empty"
          description="Start searching for your favorite albums to build your collection."
          actionLabel="Discover Music"
          onAction={() => navigate('/search')}
        />
      )}

      {!loading && !error && library.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
          {sortedLibrary.map(album => (
            <LibraryAlbumCard key={album.id} album={album} onClick={() => setSelectedAlbum(album)} />
          ))}
        </div>
      )}

      <AlbumDetailsModal 
        album={selectedAlbum} 
        isOpen={!!selectedAlbum} 
        onClose={() => setSelectedAlbum(null)} 
      />
    </div>
  );
};

export default Library;
