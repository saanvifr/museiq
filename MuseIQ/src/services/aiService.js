import api from './api';
import { AIInsight } from '../models/AIInsight';

const isNetworkError = (error) => error.code === 'ERR_NETWORK' || !error.response;

export const aiService = {
  getSummary: async () => {
    try {
      const response = await api.post('/api/ai/summary');
      return new AIInsight(response.data);
    } catch (error) {
      if (isNetworkError(error)) {
        console.warn('Backend unavailable. Using mock AI insights.');
        return new Promise(resolve => setTimeout(() => resolve(new AIInsight({
          id: 'insight-1',
          summaryMarkdown: `### Your Musical DNA\nBased on your collection, you exhibit a strong preference for **contemporary pop** and **electronic** genres, mixed with a noticeable streak of critically acclaimed hip-hop. Your average rating of 4.2 indicates you are highly selective about what makes it into your library.\n\n#### Key Observations\n* **Era Bias:** You lean heavily into the post-2020 musical landscape.\n* **Diversity:** While your artists are varied, you tend to stick to safe, well-established genres rather than exploring obscure sub-genres.\n* **Rating Pattern:** You tend to rate concept albums slightly higher than compilation or pop-centric albums.`,
          recommendations: [
            {
              album: 'Random Access Memories',
              artist: 'Daft Punk',
              artwork: 'https://upload.wikimedia.org/wikipedia/en/a/a7/Random_Access_Memories.jpg',
              reason: 'Since you enjoy Electronic music and rate highly rated albums well, this is a must-have.'
            },
            {
              album: 'To Pimp a Butterfly',
              artist: 'Kendrick Lamar',
              artwork: 'https://upload.wikimedia.org/wikipedia/en/f/f6/Kendrick_Lamar_-_To_Pimp_a_Butterfly.png',
              reason: 'Aligns perfectly with your appreciation for critically acclaimed hip-hop.'
            }
          ]
        })), 1200));
      }
      throw error;
    }
  }
};
