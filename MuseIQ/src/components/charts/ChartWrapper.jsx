import React from 'react';
import { Card } from '../common/Card';
import { Skeleton } from '../common/Skeleton';
import { EmptyState } from '../common/EmptyState';
import { AlertCircle } from 'lucide-react';

export const ChartWrapper = ({ title, loading, error, hasData, children, className }) => {
  return (
    <Card className={`p-6 flex flex-col h-[400px] ${className || ''}`}>
      <h3 className="text-lg font-semibold text-text-primary mb-6">{title}</h3>
      
      <div className="flex-1 w-full h-full min-h-[250px] relative">
        {loading && (
          <div className="absolute inset-0 flex items-end justify-between gap-2 px-4 pb-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton 
                key={i} 
                className="w-full bg-bg-primary" 
                style={{ height: `${Math.max(20, Math.random() * 100)}%` }} 
              />
            ))}
          </div>
        )}
        
        {error && !loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <EmptyState 
              icon={AlertCircle}
              title="Failed to load chart"
              description={error}
              className="border-none bg-transparent"
            />
          </div>
        )}

        {!loading && !error && !hasData && (
          <div className="absolute inset-0 flex items-center justify-center">
            <EmptyState 
              title="No Data Available"
              description="Add more albums to your library to see insights here."
              className="border-none bg-transparent"
            />
          </div>
        )}

        {!loading && !error && hasData && (
          <div className="w-full h-full">
            {children}
          </div>
        )}
      </div>
    </Card>
  );
};
