/**
 * Breadcrumb - Fil d'Ariane
 * Utilise le composant Button pour le premier item
 */

import React from 'react';
import { Button } from './Button';

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  // Icône de document
  const DocumentIcon = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
      />
    </svg>
  );

  // Icône de chevron (flèche >)
  const ChevronIcon = (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={3} 
        d="M9 5l7 7-7 7" 
      />
    </svg>
  );

  return (
    <div className="flex items-center gap-3">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {/* Premier item avec Button */}
          {index === 0 && (
            <Button
              variant="secondary"
              size="small"
              icon={DocumentIcon}
              iconPosition="left"
              onClick={item.onClick}
            >
              {item.label}
            </Button>
          )}

          {/* Séparateur chevron (icon) */}
          {index === 0 && items.length > 1 && (
            <span className="text-neutral-500">
              {ChevronIcon}
            </span>
          )}

          {/* Items suivants - texte en 12px bold Satochi white */}
          {index > 0 && (
            <>
              <span className="text-12 font-medium text-neutral-0">
                {item.label}
              </span>
              {index < items.length - 1 && (
                <span className="text-neutral-500">
                  {ChevronIcon}
                </span>
              )}
            </>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};