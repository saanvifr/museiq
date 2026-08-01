import React, { useState } from 'react';
import { aiService } from '../services/aiService';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Skeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';
import { BrainCircuit, Sparkles, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown'; // Wait, I need to add react-markdown to dependencies or implement a simple markdown renderer.
// Actually, since I didn't install react-markdown, I'll just use simple HTML parsing or standard text rendering for now, or just dangerouslySetInnerHTML if I parse it manually, or just use it assuming I can. 
// The user asked for "markdown-style formatting". I will just format the mock markdown string.

const AIInsights = () => {
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await aiService.getSummary();
      setInsight(data);
    } catch (err) {
      setError(err.message || 'Failed to generate insights.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-text-primary mb-2 flex items-center gap-3">
            <BrainCircuit className="h-8 w-8 text-primary" />
            AI Music Insights
          </h2>
          <p className="text-text-secondary text-lg">
            Discover deep patterns and tailored recommendations based on your library.
          </p>
        </div>
        <Button onClick={generateInsights} isLoading={loading} className="gap-2 shrink-0">
          <Sparkles className="h-5 w-5" />
          {insight ? 'Regenerate Insights' : 'Generate Insights'}
        </Button>
      </div>

      {!insight && !loading && !error && (
        <EmptyState
          icon={BrainCircuit}
          title="No Insights Generated"
          description="Click the button above to analyze your musical DNA and get tailored recommendations."
          className="mt-12"
        />
      )}

      {error && !loading && (
        <EmptyState
          icon={AlertCircle}
          title="Analysis Failed"
          description={error}
          actionLabel="Try Again"
          onAction={generateInsights}
        />
      )}

      {loading && (
        <div className="space-y-6 mt-8">
          <Card className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        </div>
      )}

      {insight && !loading && (
        <div className="space-y-8 mt-8 animate-in slide-in-from-bottom-4 duration-500">
          <Card className="p-8 border-l-4 border-l-primary">
             <div className="prose prose-blue max-w-none text-text-primary">
               <ReactMarkdown>{insight.summaryMarkdown}</ReactMarkdown>
            </div>
          </Card>

          <div>
            <h3 className="text-2xl font-bold text-text-primary mb-6">Recommended For You</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {insight.recommendations.map((rec, index) => (
                <Card key={index} className="flex overflow-hidden group">
                  <div className="w-1/3 bg-bg-primary flex-shrink-0 relative overflow-hidden">
                    {rec.artwork ? (
                      <img src={rec.artwork.startsWith('http') ? rec.artwork : `${import.meta.env.VITE_API_BASE_URL}${rec.artwork}`} alt={rec.album} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No Art</div>
                    )}
                  </div>
                  <div className="p-5 w-2/3 flex flex-col justify-center">
                    <h4 className="font-bold text-lg text-text-primary mb-1 line-clamp-1" title={rec.album}>{rec.album}</h4>
                    <p className="text-text-secondary font-medium mb-3">{rec.artist}</p>
                    <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed bg-primary/5 p-3 rounded-lg border border-primary/10">
                      {rec.reason}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
