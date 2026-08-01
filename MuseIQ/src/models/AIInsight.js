export class AIInsight {
  constructor(data = {}) {
    this.id = data.id || null;
    this.summaryMarkdown = data.summaryMarkdown || '';
    this.recommendations = (data.recommendations || []).map(rec => ({
      album: rec.album || 'Unknown',
      artist: rec.artist || 'Unknown',
      artwork: rec.artwork || '',
      reason: rec.reason || ''
    }));
  }
}
