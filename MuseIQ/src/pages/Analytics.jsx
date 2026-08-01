import React, { useState, useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';
import { StatCard } from '../components/dashboard/StatCard';
import { ChartWrapper } from '../components/charts/ChartWrapper';
import { GenrePieChart } from '../components/charts/GenrePieChart';
import { ReleasesBarChart } from '../components/charts/ReleasesBarChart';
import { RatingHistogram } from '../components/charts/RatingHistogram';
import { ArtistsBarChart } from '../components/charts/ArtistsBarChart';
import { TimelineChart } from '../components/charts/TimelineChart';
import { Library, Mic2, Disc, Star } from 'lucide-react';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const result = await analyticsService.getAnalytics();
        setData(result);
      } catch (err) {
        setError(err.message || 'Failed to load analytics.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-text-primary mb-2">Analytics Dashboard</h2>
        <p className="text-text-secondary text-lg">
          Insights and statistics about your music collection.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Albums" 
          value={loading ? '-' : data?.totalAlbums} 
          icon={Library}
        />
        <StatCard 
          title="Unique Artists" 
          value={loading ? '-' : data?.uniqueArtists} 
          icon={Mic2}
        />
        <StatCard 
          title="Genres" 
          value={loading ? '-' : data?.totalGenres} 
          icon={Disc}
        />
        <StatCard 
          title="Average Rating" 
          value={loading ? '-' : data?.averageRating} 
          icon={Star}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartWrapper 
          title="Genre Distribution" 
          loading={loading} 
          error={error} 
          hasData={!!data?.genreDistribution?.length}
        >
          {data && <GenrePieChart data={data.genreDistribution} />}
        </ChartWrapper>

        <ChartWrapper 
          title="Albums by Release Year" 
          loading={loading} 
          error={error} 
          hasData={!!data?.albumsByYear?.length}
        >
          {data && <ReleasesBarChart data={data.albumsByYear} />}
        </ChartWrapper>

        <ChartWrapper 
          title="Rating Distribution" 
          loading={loading} 
          error={error} 
          hasData={!!data?.ratingDistribution?.length}
        >
          {data && <RatingHistogram data={data.ratingDistribution} />}
        </ChartWrapper>

        <ChartWrapper 
          title="Top Artists" 
          loading={loading} 
          error={error} 
          hasData={!!data?.topArtists?.length}
        >
          {data && <ArtistsBarChart data={data.topArtists} />}
        </ChartWrapper>

        <ChartWrapper 
          title="Albums Added Over Time" 
          loading={loading} 
          error={error} 
          hasData={!!data?.timeline?.length}
          className="lg:col-span-2"
        >
          {data && <TimelineChart data={data.timeline} />}
        </ChartWrapper>
      </div>
    </div>
  );
};

export default Analytics;
