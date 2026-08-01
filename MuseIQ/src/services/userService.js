import api from './api';

const uploadAvatar = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post(`/api/users/me/avatar`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

const updateProfile = (data) => {
    return api.put('/api/users/me', data);
};

const getCurrentUser = () => {
    return api.get('/api/users/me');
};

const userService = {
    uploadAvatar,
    updateProfile,
    getCurrentUser
};

export default userService;
