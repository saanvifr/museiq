import React, { useState, useRef, useEffect } from 'react';
import { usePlaylists } from '../../contexts/PlaylistContext';
import { PlusCircle, Loader2 } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

export const AddToPlaylistDropdown = ({ album }) => {
    const { playlists, addAlbumToPlaylist } = usePlaylists();
    const { showToast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [loadingId, setLoadingId] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = async (e, playlist) => {
        e.stopPropagation();
        setLoadingId(playlist.id);
        try {
            await addAlbumToPlaylist(playlist.id, album.id);
            showToast('Added to playlist!', 'success');
            setIsOpen(false);
        } catch (err) {
            showToast(err.message || 'Failed to add to playlist', 'error');
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
                className="h-8 px-2 bg-bg-primary hover:bg-bg-secondary rounded flex items-center justify-center text-text-secondary hover:text-white transition-colors"
                title="Add to Playlist"
            >
                <PlusCircle size={16} />
            </button>

            {isOpen && (
                <div className="absolute right-0 bottom-full mb-1 w-48 bg-bg-secondary border border-border rounded-lg shadow-xl overflow-hidden z-50">
                    <div className="p-2 border-b border-border bg-bg-primary font-medium text-xs text-text-secondary uppercase tracking-wider">
                        Add to Playlist
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                        {playlists.length === 0 ? (
                            <div className="p-3 text-sm text-text-secondary text-center">No playlists found</div>
                        ) : (
                            playlists.map(p => (
                                <button
                                    key={p.id}
                                    onClick={(e) => handleSelect(e, p)}
                                    disabled={loadingId === p.id}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-primary hover:text-white transition-colors flex items-center justify-between"
                                >
                                    <span className="line-clamp-1">{p.name}</span>
                                    {loadingId === p.id && <Loader2 size={12} className="animate-spin" />}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
