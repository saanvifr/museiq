import React, { useState } from 'react';
import { usePlaylists } from '../contexts/PlaylistContext';
import { Plus, Music, Trash2, Edit2 } from 'lucide-react';
import PlaylistModal from '../components/playlists/PlaylistModal';

const Playlists = () => {
    const { playlists, deletePlaylist, removeAlbumFromPlaylist } = usePlaylists();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlaylist, setEditingPlaylist] = useState(null);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);

    const handleCreate = () => {
        setEditingPlaylist(null);
        setIsModalOpen(true);
    };

    const handleEdit = (e, playlist) => {
        e.stopPropagation();
        setEditingPlaylist(playlist);
        setIsModalOpen(true);
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this playlist?')) {
            try {
                await deletePlaylist(id);
                if (selectedPlaylist?.id === id) setSelectedPlaylist(null);
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleRemoveAlbum = async (playlistId, albumId) => {
        if (window.confirm('Remove this album from the playlist?')) {
            try {
                await removeAlbumFromPlaylist(playlistId, albumId);
                // The selected playlist state will need to refresh from the context since we mutated the array
                // but the context update will cause a re-render
                // We'll just rely on the re-render to pick up the updated selected playlist from context
                setSelectedPlaylist(playlists.find(p => p.id === playlistId));
            } catch (err) {
                console.error(err);
            }
        }
    };

    // Keep selected playlist in sync with context updates
    const activePlaylist = selectedPlaylist ? playlists.find(p => p.id === selectedPlaylist.id) : null;

    return (
        <div className="p-6 h-full flex flex-col md:flex-row gap-6">
            {/* Playlists Sidebar */}
            <div className="w-full md:w-1/3 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Your Playlists</h1>
                    <button 
                        onClick={handleCreate}
                        className="p-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-all shadow-soft"
                    >
                        <Plus size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                    {playlists.length === 0 ? (
                        <div className="text-text-secondary text-center py-8">
                            No playlists yet. Create one!
                        </div>
                    ) : (
                        playlists.map(playlist => (
                            <div 
                                key={playlist.id}
                                onClick={() => setSelectedPlaylist(playlist)}
                                className={`p-4 rounded-xl cursor-pointer transition-all border ${activePlaylist?.id === playlist.id ? 'bg-bg-primary border-primary shadow-soft' : 'bg-bg-secondary border-transparent hover:border-border'}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-semibold text-lg line-clamp-1">{playlist.name}</h3>
                                    <div className="flex gap-2">
                                        <button onClick={(e) => handleEdit(e, playlist)} className="text-text-secondary hover:text-white transition-colors">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={(e) => handleDelete(e, playlist.id)} className="text-text-secondary hover:text-red-500 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-sm text-text-secondary line-clamp-2">{playlist.description}</p>
                                <div className="mt-3 flex items-center gap-2 text-xs text-text-secondary font-medium">
                                    <Music size={12} />
                                    <span>{playlist.albums?.length || 0} Albums</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Playlist Contents */}
            <div className="w-full md:w-2/3 bg-bg-secondary rounded-2xl border border-border p-6 flex flex-col h-full overflow-hidden">
                {activePlaylist ? (
                    <>
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold mb-2">{activePlaylist.name}</h2>
                            <p className="text-text-secondary">{activePlaylist.description}</p>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto pr-2">
                            {(!activePlaylist.albums || activePlaylist.albums.length === 0) ? (
                                <div className="h-full flex flex-col items-center justify-center text-text-secondary opacity-70">
                                    <Music size={48} className="mb-4" />
                                    <p>This playlist is empty.</p>
                                    <p className="text-sm mt-2">Go to Search or Library to add some albums!</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {activePlaylist.albums.map(album => (
                                        <div key={album.id} className="group relative bg-bg-primary rounded-xl p-3 border border-border hover:border-primary transition-all">
                                            <div className="aspect-square w-full rounded-lg overflow-hidden mb-3">
                                                <img 
                                                    src={album.coverUrl || 'https://via.placeholder.com/300?text=No+Cover'} 
                                                    alt={album.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <h4 className="font-semibold text-sm line-clamp-1">{album.title}</h4>
                                            <p className="text-xs text-text-secondary line-clamp-1">{album.artist}</p>
                                            
                                            <button 
                                                onClick={() => handleRemoveAlbum(activePlaylist.id, album.id)}
                                                className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md"
                                                title="Remove from playlist"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-text-secondary">
                        <Music size={64} className="mb-4 opacity-50" />
                        <h3 className="text-xl font-medium mb-2">Select a Playlist</h3>
                        <p>Click on a playlist from the sidebar to view its albums.</p>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <PlaylistModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    playlistToEdit={editingPlaylist}
                />
            )}
        </div>
    );
};

export default Playlists;
