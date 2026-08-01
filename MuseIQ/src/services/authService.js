import api from './api';
import { User } from '../models/User';

const isNetworkError = (error) => error.code === 'ERR_NETWORK' || !error.response;

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return new User(response.data);
    } catch (error) {
      if (isNetworkError(error)) {
        console.warn('Backend unavailable. Using mock login.');
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            // We'll allow any login for dev purposes when backend is down
            resolve(new User({
              id: '1',
              name: 'Test User',
              email,
              token: 'mock-jwt-token-12345'
            }));
          }, 800);
        });
      }
      throw error;
    }
  },
  
  register: async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      return new User(response.data);
    } catch (error) {
      if (isNetworkError(error)) {
        console.warn('Backend unavailable. Using mock register.');
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(new User({
              id: '2',
              name,
              email,
              token: 'mock-jwt-token-67890'
            }));
          }, 800);
        });
      }
      throw error;
    }
  }
};
