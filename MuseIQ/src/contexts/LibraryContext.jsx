import React, { createContext, useContext, useState, useEffect } from 'react';
import { libraryService } from '../services/libraryService';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';

const LibraryContext = createContext();

export const useLibrary = () => useContext(LibraryContext);

export const LibraryProvider = ({ children }) => {
  const auth = useAuth();
  const user = auth ? auth.user : null;
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  const fetchLibrary = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await libraryService.getLibrary();
      setLibrary(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch library.');
      showToast('error', 'Failed to fetch library.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchLibrary();
    } else {
      setLibrary([]);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const addAlbum = async (album) => {
    try {
      const newAlbum = await libraryService.addAlbum(album);
      setLibrary((prev) => [newAlbum, ...prev.filter(a => a.id !== newAlbum.id)]);
      showToast('success', 'Album added to library.');
    } catch (err) {
      showToast('error', 'Failed to add album.');
      throw err;
    }
  };

  const updateAlbum = async (id, data) => {
    try {
      const updatedAlbum = await libraryService.updateAlbum(id, data);
      setLibrary((prev) => prev.map(a => a.id === id ? updatedAlbum : a));
      showToast('success', 'Album updated.');
    } catch (err) {
      showToast('error', 'Failed to update album.');
      throw err;
    }
  };

  const deleteAlbum = async (id) => {
    try {
      await libraryService.deleteAlbum(id);
      setLibrary((prev) => prev.filter(a => a.id !== id));
      showToast('success', 'Album removed.');
    } catch (err) {
      showToast('error', 'Failed to delete album.');
      throw err;
    }
  };

  return (
    <LibraryContext.Provider value={{ library, loading, error, fetchLibrary, addAlbum, updateAlbum, deleteAlbum }}>
      {children}
    </LibraryContext.Provider>
  );
};
