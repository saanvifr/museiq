export class Analytics {
  constructor(data = {}) {
    this.totalAlbums = data.totalAlbums || 0;
    this.uniqueArtists = data.uniqueArtists || 0;
    this.totalGenres = data.totalGenres || 0;
    this.averageRating = data.averageRating || 0;
    
    // Arrays for charts
    this.genreDistribution = data.genreDistribution || [];
    this.albumsByYear = data.albumsByYear || [];
    this.ratingDistribution = data.ratingDistribution || [];
    this.topArtists = data.topArtists || [];
    this.timeline = data.timeline || [];
  }
}
