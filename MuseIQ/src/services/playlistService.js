import api from './api';

const getPlaylists = () => {
    return api.get('/api/playlists');
};

const createPlaylist = (playlist) => {
    return api.post('/api/playlists', playlist);
};

const updatePlaylist = (id, playlist) => {
    return api.put(`/api/playlists/${id}`, playlist);
};

const deletePlaylist = (id) => {
    return api.delete(`/api/playlists/${id}`);
};

const addAlbumToPlaylist = (playlistId, albumId) => {
    return api.post(`/api/playlists/${playlistId}/albums/${albumId}`);
};

const removeAlbumFromPlaylist = (playlistId, albumId) => {
    return api.delete(`/api/playlists/${playlistId}/albums/${albumId}`);
};

const playlistService = {
    getPlaylists,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addAlbumToPlaylist,
    removeAlbumFromPlaylist
};

export default playlistService;
