import api from './api';
import { Album } from '../models/Album';

const isNetworkError = (error) => error.code === 'ERR_NETWORK' || !error.response;

let mockLibrary = [];

export const libraryService = {
  getLibrary: async () => {
    try {
      const response = await api.get('/api/library');
      return response.data.map(item => new Album(item));
    } catch (error) {
      if (isNetworkError(error)) {
        console.warn('Backend unavailable. Using mock library.');
        return new Promise(resolve => setTimeout(() => resolve(mockLibrary.map(i => new Album(i))), 500));
      }
      throw error;
    }
  },

  addAlbum: async (albumData) => {
    try {
      // Map to backend payload
      const backendPayload = new Album(albumData).toBackendPayload();
      const response = await api.post('/api/library', backendPayload);
      return new Album(response.data);
    } catch (error) {
      if (isNetworkError(error)) {
        return new Promise(resolve => {
          setTimeout(() => {
            const newAlbum = new Album(albumData);
            if (!mockLibrary.find(a => a.id === newAlbum.id)) {
              mockLibrary.unshift(newAlbum);
            }
            resolve(newAlbum);
          }, 300);
        });
      }
      throw error;
    }
  },

  updateAlbum: async (id, updateData) => {
    try {
      const response = await api.put(`/api/library/${id}`, updateData);
      return new Album(response.data);
    } catch (error) {
      if (isNetworkError(error)) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            const index = mockLibrary.findIndex(a => a.id === id);
            if (index > -1) {
              mockLibrary[index] = { ...mockLibrary[index], ...updateData };
              resolve(new Album(mockLibrary[index]));
            } else {
              reject(new Error('Album not found'));
            }
          }, 300);
        });
      }
      throw error;
    }
  },

  deleteAlbum: async (id) => {
    try {
      await api.delete(`/api/library/${id}`);
      return true;
    } catch (error) {
      if (isNetworkError(error)) {
        return new Promise(resolve => {
          setTimeout(() => {
            mockLibrary = mockLibrary.filter(a => a.id !== id);
            resolve(true);
          }, 300);
        });
      }
      throw error;
    }
  }
};
