import React, { useState, useEffect } from 'react';
import { Input } from '../common/Input';
import { Search, X } from 'lucide-react';

export const SearchBar = ({ onSearch, isSearching }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(query);
    }, 500);

    return () => clearTimeout(handler);
  }, [query, onSearch]);

  const handleClear = () => {
    setQuery('');
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-10">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
          <Search className="h-6 w-6" />
        </div>
        <input
          type="text"
          className="w-full bg-bg-secondary border border-border rounded-full py-4 pl-12 pr-12 text-lg text-text-primary placeholder:text-text-secondary shadow-soft focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          placeholder="Search albums, artists..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};
