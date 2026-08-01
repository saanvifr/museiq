import React, { useState, useEffect } from 'react';
import { usePlaylists } from '../../contexts/PlaylistContext';
import { X } from 'lucide-react';

const PlaylistModal = ({ isOpen, onClose, playlistToEdit }) => {
    const { createPlaylist, updatePlaylist } = usePlaylists();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (playlistToEdit) {
            setName(playlistToEdit.name);
            setDescription(playlistToEdit.description || '');
        } else {
            setName('');
            setDescription('');
        }
    }, [playlistToEdit, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (playlistToEdit) {
                await updatePlaylist(playlistToEdit.id, { name, description });
            } else {
                await createPlaylist({ name, description });
            }
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-bg-secondary w-full max-w-md rounded-2xl shadow-xl border border-border overflow-hidden animate-fade-in-up">
                <div className="flex justify-between items-center p-6 border-b border-border">
                    <h2 className="text-xl font-bold">{playlistToEdit ? 'Edit Playlist' : 'Create Playlist'}</h2>
                    <button onClick={onClose} className="text-text-secondary hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm">
                            {error}
                        </div>
                    )}
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Name</label>
                            <input 
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-bg-primary border border-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors"
                                placeholder="My Awesome Playlist"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Description (Optional)</label>
                            <textarea 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className="w-full bg-bg-primary border border-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors resize-none"
                                placeholder="What is this playlist about?"
                            />
                        </div>
                    </div>
                    
                    <div className="mt-8 flex justify-end gap-3">
                        <button 
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-lg font-medium text-text-secondary hover:bg-bg-primary transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={loading || !name.trim()}
                            className="px-5 py-2.5 rounded-lg font-medium bg-primary text-white hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-soft"
                        >
                            {loading ? 'Saving...' : 'Save Playlist'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PlaylistModal;
