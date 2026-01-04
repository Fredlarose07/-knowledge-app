/**
 * Breadcrumb - Fil d'Ariane
 * Seul le premier item a le background
 */

import React from 'react';

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <div className="flex items-center gap-3">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {/* Premier item avec background */}
          {index === 0 && (
            <nav className="px-2 py-1.5 bg-[#1E2025] border border-[#2A2D33] rounded-[6px]">
              {item.onClick ? (
                <button
                  onClick={item.onClick}
                  className="flex items-center gap-2 text-neutral-300 hover:text-neutral-0 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="font-bold text-12">{item.label}</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 text-neutral-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="font-semibold text-12">{item.label}</span>
                </div>
              )}
            </nav>
          )}

          {/* Séparateur > */}
          {index === 0 && items.length > 1 && (
            <span className="text-neutral-500 text-13">›</span>
          )}

          {/* Items suivants sans background */}
          {index > 0 && (
            <>
              <span className="text-neutral-400 text-13">{item.label}</span>
              {index < items.length - 1 && (
                <span className="text-neutral-500 text-13">›</span>
              )}
            </>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};