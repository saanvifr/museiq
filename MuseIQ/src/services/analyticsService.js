import api from './api';
import { Analytics } from '../models/Analytics';

const isNetworkError = (error) => error.code === 'ERR_NETWORK' || !error.response;

export const analyticsService = {
  getAnalytics: async () => {
    try {
      const response = await api.get('/api/analytics');
      return new Analytics(response.data);
    } catch (error) {
      if (isNetworkError(error)) {
        console.warn('Backend unavailable. Using mock analytics.');
        return new Promise(resolve => setTimeout(() => resolve(new Analytics({
          totalAlbums: 42,
          uniqueArtists: 28,
          totalGenres: 12,
          averageRating: 4.2,
          genreDistribution: [
            { name: 'Pop', value: 400 },
            { name: 'Rock', value: 300 },
            { name: 'Hip-Hop', value: 300 },
            { name: 'Electronic', value: 200 }
          ],
          albumsByYear: [
            { year: '2019', count: 5 },
            { year: '2020', count: 8 },
            { year: '2021', count: 12 },
            { year: '2022', count: 6 },
            { year: '2023', count: 11 }
          ],
          ratingDistribution: [
            { rating: '5 Stars', count: 15 },
            { rating: '4 Stars', count: 12 },
            { rating: '3 Stars', count: 8 },
            { rating: '2 Stars', count: 4 },
            { rating: '1 Star', count: 3 }
          ],
          topArtists: [
            { name: 'The Weeknd', albums: 4 },
            { name: 'Taylor Swift', albums: 3 },
            { name: 'Daft Punk', albums: 2 },
            { name: 'Kendrick Lamar', albums: 2 }
          ],
          timeline: [
            { month: 'Jan', added: 4 },
            { month: 'Feb', added: 7 },
            { month: 'Mar', added: 2 },
            { month: 'Apr', added: 10 },
            { month: 'May', added: 5 },
            { month: 'Jun', added: 14 }
          ]
        })), 800));
      }
      throw error;
    }
  }
};
