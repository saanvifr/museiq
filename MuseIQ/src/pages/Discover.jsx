import React, { useState, useEffect } from 'react';
import discoverService from '../services/discoverService';
import { useLibrary } from '../contexts/LibraryContext';
import { useToast } from '../contexts/ToastContext';
import { Sparkles, Plus, Check } from 'lucide-react';
import { Button } from '../components/common/Button';
import { AlbumDetailsModal } from '../components/common/AlbumDetailsModal';
import clsx from 'clsx';

const Discover = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const { library, addAlbum } = useLibrary();
    const { showToast } = useToast();

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await discoverService.getRecommendations();
                setRecommendations(response.data);
            } catch (err) {
                console.error("Failed to fetch recommendations:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    const handleSave = (albumData) => {
        const isSaved = library.some(a => a.id === albumData.id);
        if (!isSaved) {
            // Reformat DTO to match what addAlbum expects
            addAlbum({
                id: albumData.id,
                title: albumData.title,
                artist: albumData.artist,
                artwork: albumData.coverUrl,
                genre: albumData.genre,
                releaseDate: albumData.releaseDate,
                trackCount: albumData.trackCount
            });
            showToast(`Added ${albumData.title} to your library!`, 'success');
        }
    };

    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center">
                <Sparkles className="w-12 h-12 text-primary animate-pulse mb-4" />
                <h2 className="text-xl font-medium text-text-secondary animate-pulse">Generating your personalized recommendations...</h2>
            </div>
        );
    }

    if (recommendations.length === 0) {
        return (
            <div className="p-8 h-full">
                <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                    <Sparkles className="text-primary" />
                    Discover New Music
                </h1>
                <div className="bg-bg-secondary border border-border rounded-2xl p-12 text-center">
                    <p className="text-text-secondary text-lg">We couldn't generate any recommendations right now.</p>
                    <p className="text-text-secondary mt-2">Try adding more diverse music to your library!</p>
                </div>
            </div>
        );
    }

    const featured = recommendations[0];
    const others = recommendations.slice(1);

    return (
        <div className="p-6 h-full overflow-y-auto">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <Sparkles className="text-primary" />
                Discover
            </h1>

            {/* Hero / Featured Recommendation */}
            <div 
                className="relative rounded-3xl overflow-hidden bg-bg-secondary border border-border mb-10 shadow-xl group cursor-pointer"
                onClick={() => setSelectedAlbum(featured)}
            >
                {/* Dynamic blur background using cover art */}
                <div 
                    className="absolute inset-0 opacity-20 blur-3xl scale-110 transition-transform duration-1000 group-hover:scale-125"
                    style={{
                        backgroundImage: `url(${featured.coverUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                />
                
                <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center bg-gradient-to-t from-bg-primary via-transparent to-transparent">
                    <div className="w-48 h-48 md:w-64 md:h-64 shrink-0 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10 group-hover:shadow-primary/20 transition-all duration-500">
                        <img src={featured.coverUrl} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4 border border-primary/30 w-fit backdrop-blur-md">
                            <Sparkles size={14} />
                            Top Match
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-2 text-white">{featured.title}</h2>
                        <h3 className="text-xl text-text-secondary mb-4">{featured.artist}</h3>
                        
                        <p className="text-lg text-text-primary mb-8 max-w-2xl bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                            {featured.rationale}
                        </p>
                        
                        <Button 
                            variant={library.some(a => a.id === featured.id) ? 'secondary' : 'primary'} 
                            onClick={(e) => {
                                e.stopPropagation();
                                handleSave(featured);
                            }}
                            disabled={library.some(a => a.id === featured.id)}
                            className="w-fit px-8 py-3 rounded-full text-base font-semibold shadow-soft"
                        >
                            {library.some(a => a.id === featured.id) ? (
                                <><Check className="mr-2" /> Saved in Library</>
                            ) : (
                                <><Plus className="mr-2" /> Add to Library</>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Grid for others */}
            {others.length > 0 && (
                <div>
                    <h3 className="text-xl font-bold mb-6 text-text-secondary">More For You</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {others.map((rec) => {
                            const isSaved = library.some(a => a.id === rec.id);
                            
                            return (
                                <div 
                                    key={rec.id} 
                                    className="bg-bg-secondary border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-colors group flex flex-col h-full cursor-pointer"
                                    onClick={() => setSelectedAlbum(rec)}
                                >
                                    <div className="relative aspect-square overflow-hidden">
                                        <img src={rec.coverUrl} alt={rec.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                            <p className="text-sm font-medium text-white line-clamp-3">{rec.rationale}</p>
                                        </div>
                                    </div>
                                    <div className="p-5 flex flex-col flex-1">
                                        <h4 className="font-bold text-lg line-clamp-1 mb-1">{rec.title}</h4>
                                        <p className="text-text-secondary text-sm mb-4">{rec.artist}</p>
                                        <div className="mt-auto">
                                            <Button 
                                                variant={isSaved ? 'secondary' : 'primary'}
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSave(rec);
                                                }}
                                                disabled={isSaved}
                                                className="w-full"
                                            >
                                                {isSaved ? <><Check className="mr-1.5 h-4 w-4" /> Saved</> : <><Plus className="mr-1.5 h-4 w-4" /> Add to Library</>}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
            
            <AlbumDetailsModal 
                album={selectedAlbum} 
                isOpen={!!selectedAlbum} 
                onClose={() => setSelectedAlbum(null)} 
            />
        </div>
    );
};

export default Discover;
