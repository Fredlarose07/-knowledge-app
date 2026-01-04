/**
 * Sidebar - Menu de navigation principal
 * Gradient background #08090A → #101011
 * Border stroke #2C2F34 à 40% opacité
 */

import React from 'react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  const menuItems: MenuItem[] = [
    {
      id: 'notes',
      label: 'Notes',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      id: 'mocs',
      label: 'Mocs',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      ),
    },
    {
      id: 'schemas',
      label: 'Schemas',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="w-[240px] bg-gradient-to-b from-[#08090A] to-[#101011] border-r flex flex-col" 
      style={{ borderColor: 'rgba(44, 47, 52, 0.4)' }}>
      
 

      {/* Menu Items */}
      <nav className="flex-1 mt-12  flex flex-col items-center">
        {menuItems.map((item) => {
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-[85%] flex items-center gap-3 px-4 py-2 text-13 font-medium transition-colors rounded-md ${
                isActive
                  ? 'bg-neutral-900 text-neutral-0'
                  : 'text-[#9BA0AB] hover:text-neutral-0'
              }`}
            >
              <span className={isActive ? 'text-neutral-0' : 'text-[#9BA0AB]'}>
                {item.icon}
              </span>
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};