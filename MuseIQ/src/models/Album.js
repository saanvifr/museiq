export class Album {
  constructor(data = {}) {
    // Normalizing iTunes Search API properties to internal properties
    this.id = String(data.id || data.collectionId || '');
    this.title = data.title || data.collectionName || 'Unknown Title';
    this.artist = data.artist || data.artistName || 'Unknown Artist';
    this.genre = data.genre || data.primaryGenreName || 'Unknown Genre';
    this.releaseDate = data.releaseDate || (data.releaseYear ? `${data.releaseYear}-01-01T00:00:00Z` : new Date().toISOString());
    this.trackCount = data.trackCount || 0;
    
    // Get high-res artwork if from iTunes. If from backend, use coverUrl
    this.artwork = data.artwork || data.coverUrl || (data.artworkUrl100 ? data.artworkUrl100.replace('100x100bb', '600x600bb') : '');
    
    this.rating = data.rating || 0;
    this.notes = data.notes || '';
    this.price = data.price || data.collectionPrice || null;
    this.dbId = data.dbId || null;
  }

  // Convert to backend entity format
  toBackendPayload() {
    return {
      id: this.id,
      title: this.title,
      artist: this.artist,
      coverUrl: this.artwork,
      releaseYear: new Date(this.releaseDate).getFullYear() || 2024,
      genre: this.genre,
      trackCount: this.trackCount,
      rating: this.rating,
      notes: this.notes
    };
  }
}
