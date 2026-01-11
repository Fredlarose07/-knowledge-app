// frontend/src/components/ui/LoadingSkeleton.tsx

import React from 'react';
import { Sidebar } from '../layout/Sidebar';
import { PageHeader } from '../layout/PageHeader';

interface LoadingSkeletonProps {
  variant?: 'note-editor' | 'note-list';
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  variant = 'note-editor' 
}) => {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="ml-[240px]">
        <PageHeader breadcrumbItems={[]} />
        
        {variant === 'note-editor' && (
          <div className="px-32 py-8 animate-pulse">
            {/* Skeleton Titre */}
            <div className="h-8 bg-neutral-800 rounded-lg w-1/3 mb-2"></div>
            
            {/* Skeleton Date */}
            <div className="h-4 bg-neutral-850 rounded w-24 mb-6"></div>
            
            {/* Skeleton Contenu */}
            <div className="space-y-3">
              <div className="h-4 bg-neutral-850 rounded w-full"></div>
              <div className="h-4 bg-neutral-850 rounded w-5/6"></div>
              <div className="h-4 bg-neutral-850 rounded w-4/6"></div>
            </div>
          </div>
        )}
        
        {variant === 'note-list' && (
          <div className="px-32 py-8 animate-pulse">
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 bg-neutral-850 rounded-lg w-full"></div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};