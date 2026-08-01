import api from './api';

const historyService = {
  addToHistory: async (album) => {
    try {
      const response = await api.post('/api/history', album);
      return response.data;
    } catch (error) {
      console.error('Failed to log history', error);
      return null;
    }
  },

  getHistory: async () => {
    try {
      const response = await api.get('/api/history');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch history', error);
      return [];
    }
  }
};

export default historyService;
