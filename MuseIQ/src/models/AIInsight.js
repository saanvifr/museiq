export class AIInsight {
  constructor(data = {}) {
    this.id = data.id || null;
    this.summaryMarkdown = data.summaryMarkdown || '';
    this.recommendations = (data.recommendations || []).map(rec => ({
      album: rec.album || rec.title || 'Unknown',
      artist: rec.artist || 'Unknown',
      artwork: rec.artwork || rec.coverUrl || '',
      reason: rec.reason || rec.rationale || ''
    }));
  }
}
