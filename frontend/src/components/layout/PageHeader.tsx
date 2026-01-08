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
  breadcrumbItems?: BreadcrumbItem[];  // Maintenant optionnel
  action?: {
    label: string;
    onClick: () => void;
  };
  children?: React.ReactNode;  // Ajout du support children
}

export const PageHeader: React.FC<PageHeaderProps> = ({ breadcrumbItems, action, children }) => {
  return (
    <header 
      className="px-32 py-6 mt-8 flex items-start justify-between"
      style={{ borderColor: 'rgba(44, 47, 52, 0.4)' }}
    >
      {/* Si children existe, l'afficher, sinon afficher le breadcrumb */}
      {children ? children : breadcrumbItems && <Breadcrumb items={breadcrumbItems} />}

      {/* Action (bouton optionnel) */}
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </header>
  );
};