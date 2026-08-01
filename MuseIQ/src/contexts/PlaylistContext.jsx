import React, { createContext, useContext, useState, useEffect } from 'react';
import playlistService from '../services/playlistService';
import { useAuth } from './AuthContext';

const PlaylistContext = createContext();

export const usePlaylists = () => useContext(PlaylistContext);

export const PlaylistProvider = ({ children }) => {
    const auth = useAuth();
    const user = auth ? auth.user : null;
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            fetchPlaylists();
        } else {
            setPlaylists([]);
        }
    }, [user]);

    const fetchPlaylists = async () => {
        setLoading(true);
        try {
            const response = await playlistService.getPlaylists();
            setPlaylists(response.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch playlists');
        } finally {
            setLoading(false);
        }
    };

    const createPlaylist = async (playlistData) => {
        try {
            const response = await playlistService.createPlaylist(playlistData);
            setPlaylists(prev => [...prev, response.data]);
            return response.data;
        } catch (err) {
            throw new Error(err.response?.data?.message || 'Failed to create playlist');
        }
    };

    const updatePlaylist = async (id, playlistData) => {
        try {
            const response = await playlistService.updatePlaylist(id, playlistData);
            setPlaylists(prev => prev.map(p => p.id === id ? response.data : p));
            return response.data;
        } catch (err) {
            throw new Error(err.response?.data?.message || 'Failed to update playlist');
        }
    };

    const deletePlaylist = async (id) => {
        try {
            await playlistService.deletePlaylist(id);
            setPlaylists(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            throw new Error(err.response?.data?.message || 'Failed to delete playlist');
        }
    };

    const addAlbumToPlaylist = async (playlistId, albumId) => {
        try {
            const response = await playlistService.addAlbumToPlaylist(playlistId, albumId);
            setPlaylists(prev => prev.map(p => p.id === playlistId ? response.data : p));
            return response.data;
        } catch (err) {
            throw new Error(err.response?.data?.message || 'Failed to add album to playlist');
        }
    };

    const removeAlbumFromPlaylist = async (playlistId, albumId) => {
        try {
            const response = await playlistService.removeAlbumFromPlaylist(playlistId, albumId);
            setPlaylists(prev => prev.map(p => p.id === playlistId ? response.data : p));
            return response.data;
        } catch (err) {
            throw new Error(err.response?.data?.message || 'Failed to remove album from playlist');
        }
    };

    return (
        <PlaylistContext.Provider value={{
            playlists,
            loading,
            error,
            fetchPlaylists,
            createPlaylist,
            updatePlaylist,
            deletePlaylist,
            addAlbumToPlaylist,
            removeAlbumFromPlaylist
        }}>
            {children}
        </PlaylistContext.Provider>
    );
};
