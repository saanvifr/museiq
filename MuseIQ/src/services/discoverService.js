import api from './api';

const getRecommendations = () => {
    return api.get('/api/discover');
};

const discoverService = {
    getRecommendations
};

export default discoverService;
