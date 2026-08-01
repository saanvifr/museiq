import api from './api';
import { Album } from '../models/Album';
import axios from 'axios';

const isNetworkError = (error) => error.code === 'ERR_NETWORK' || !error.response;

export const searchService = {
  searchAlbums: async (query, signal) => {
    try {
      const response = await api.get(`/api/search?query=${encodeURIComponent(query)}&type=album`, { signal });
      const results = Array.isArray(response.data) ? response.data : (response.data.results || []);
      return results.map(item => new Album(item));
    } catch (error) {
      if (axios.isCancel(error)) throw error;
      
      if (isNetworkError(error)) {
        console.warn('Backend unavailable. Proxying to iTunes Search directly.');
        const itunesUrl = import.meta.env.VITE_ITUNES_BASE_URL || 'https://itunes.apple.com';
        const response = await axios.get(`${itunesUrl}/search?term=${encodeURIComponent(query)}&entity=album&limit=20`, { signal });
        return (response.data.results || []).map(item => new Album(item));
      }
      throw new Error('Failed to fetch search results.');
    }
  }
};
