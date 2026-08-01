import React, { useState, useCallback, useRef } from 'react';
import { SearchBar } from '../components/search/SearchBar';
import { AlbumCard } from '../components/search/AlbumCard';
import { searchService } from '../services/searchService';
import { Skeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';
import { AlbumDetailsModal } from '../components/common/AlbumDetailsModal';
import { Search as SearchIcon, AlertCircle } from 'lucide-react';

const Search = () => {
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [recentHistory, setRecentHistory] = useState([]);
  
  const abortControllerRef = useRef(null);

  const loadDefaultAlbums = useCallback(async () => {
    setIsSearching(true);
    try {
      const trendingQueries = ['top hits 2024', 'viral pop', 'billboard 100', 'trending music', 'new releases', 'grammy winners', 'global hits'];
      const randomQuery = trendingQueries[Math.floor(Math.random() * trendingQueries.length)];
      const data = await searchService.searchAlbums(randomQuery);
      
      // Shuffle the results slightly to make it even more dynamic
      const shuffled = data.sort(() => 0.5 - Math.random());
      setResults(shuffled.slice(0, 8));
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  }, []);

  React.useEffect(() => {
    loadDefaultAlbums();
    
    // Fetch history
    if (localStorage.getItem('token')) {
      import('../services/historyService').then(module => {
        module.default.getHistory().then(data => {
          if (data && Array.isArray(data)) {
            // Convert history format to match Album card expectations
            const formattedHistory = data.map(item => ({
               id: item.albumId,
               title: item.title,
               artist: item.artist,
               coverUrl: item.coverUrl,
               artwork: item.coverUrl,
               releaseYear: item.releaseYear,
               genre: item.genre,
               trackCount: item.trackCount
            }));
            setRecentHistory(formattedHistory);
          }
        });
      }).catch(err => console.error("Failed to load history", err));
    }
  }, [loadDefaultAlbums]);

  const performSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setHasSearched(false);
      loadDefaultAlbums();
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setIsSearching(true);
    setError(null);
    setHasSearched(true);

    try {
      const data = await searchService.searchAlbums(query, abortController.signal);
      setResults(data);
    } catch (err) {
      if (err.name === 'CanceledError' || err.message === 'canceled') {
        // Ignored, just a cancellation from typing
      } else {
        setError('Failed to fetch search results. Please try again.');
      }
    } finally {
      if (abortControllerRef.current === abortController) {
        setIsSearching(false);
      }
    }
  }, [loadDefaultAlbums]);

  return (
    <div className="animate-in fade-in duration-300">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-text-primary mb-3">Discover Music</h2>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          Search Apple's music catalog and build your personal collection.
        </p>
      </div>

      <SearchBar onSearch={performSearch} isSearching={isSearching} />

      {error && (
        <EmptyState 
          icon={AlertCircle}
          title="Search Failed"
          description={error}
        />
      )}

      {isSearching && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <Skeleton className="aspect-square w-full rounded-xl" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-8 w-full mt-2" />
            </div>
          ))}
        </div>
      )}

      {!isSearching && !error && hasSearched && results.length === 0 && (
        <EmptyState 
          icon={SearchIcon}
          title="No results found"
          description="Try searching for a different album or artist."
        />
      )}

      {!isSearching && !error && !hasSearched && recentHistory.length > 0 && (
        <div className="mb-10">
          <h3 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
            Recently Played
          </h3>
          <div className="flex overflow-x-auto pb-4 gap-6 no-scrollbar snap-x">
            {recentHistory.map(album => (
              <div key={album.id} className="min-w-[200px] snap-start">
                <AlbumCard album={album} onClick={() => setSelectedAlbum(album)} />
              </div>
            ))}
          </div>
        </div>
      )}

      {!isSearching && !error && !hasSearched && results.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
            Trending Now
          </h3>
        </div>
      )}

      {!isSearching && !error && results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {results.map(album => (
            <AlbumCard key={album.id} album={album} onClick={() => setSelectedAlbum(album)} />
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

export default Search;
