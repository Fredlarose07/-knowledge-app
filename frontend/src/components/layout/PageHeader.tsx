/**
 * PageHeader - Header de page avec breadcrumb
 * Utilisé sur toutes les pages pour garantir la cohérence
 */

import React from 'react';
import { Breadcrumb } from '../ui/Breadcrumb';
import { Button } from '../ui/Button';

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface PageHeaderProps {
  breadcrumbItems: BreadcrumbItem[];
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const PageHeader: React.FC<PageHeaderProps> = ({ breadcrumbItems, action }) => {
  return (
    <header 
      className="px-32 py-6 mt-8 flex items-start justify-between"
      style={{ borderColor: 'rgba(44, 47, 52, 0.4)' }}
    >
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Action (bouton optionnel) */}
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </header>
  );
};