import React, { useEffect, useState, useRef } from 'react';
import { Breadcrumb } from '../ui/Breadcrumb';
import { Button } from '../ui/Button';

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface PageHeaderProps {
  breadcrumbItems?: BreadcrumbItem[];
  action?: {
    label: string;
    onClick: () => void;
  };
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  breadcrumbItems,
  action,
  children,
}) => {
  const [scrollRatio, setScrollRatio] = useState(0);
  const lastScrollY = useRef(0);
  const [isScrollingUp, setIsScrollingUp] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const stickyPoint = 20; 
      const transitionDuration = 100;

      setIsScrollingUp(currentScroll < lastScrollY.current);
      lastScrollY.current = currentScroll;

      let ratio = 0;
      if (currentScroll > stickyPoint) {
        // Le ratio commence à 0 exactement au stickyPoint
        ratio = Math.min((currentScroll - stickyPoint) / transitionDuration, 1);
      } else {
        ratio = 0;
      }

      window.requestAnimationFrame(() => {
        setScrollRatio(ratio);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const visualRatio = isScrollingUp ? Math.pow(scrollRatio, 1.2) : scrollRatio;
  
  // CONFIGURATION DYNAMIQUE
  const currentPaddingX = 128 - (32 * visualRatio);
  const blurValue = visualRatio * 16;
  const targetOpacity = visualRatio * 0.45; // 0 à l'état initial

  return (
    <div 
      className="sticky z-20 w-full" 
      style={{ 
        top: '-60px', 
        height: '106px' 
      }}
    >
      <div className="h-[60px] w-full" />
      
      <header 
        className="relative w-full overflow-hidden"
        style={{ height: '56px' }}
      >
        {/* LE CALQUE DE FOND (Invisible si visualRatio === 0) */}
        <div 
          className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-150"
          style={{
            // On force l'opacité à 0 si on n'a pas scrollé
            opacity: visualRatio > 0 ? 1 : 0,
            background: `linear-gradient(to bottom, 
              rgba(12, 14, 15, ${targetOpacity}) 0%, 
              rgba(12, 14, 15, ${targetOpacity}) 85%, 
              rgba(12, 14, 15, 0) 100%
            )`,
            backdropFilter: `blur(${blurValue}px) saturate(1.8) brightness(1.1)`,
            WebkitBackdropFilter: `blur(${blurValue}px) saturate(1.8) brightness(1.1)`,
            borderBottom: `1px solid rgba(255, 255, 255, ${visualRatio * 0.05})`,
            WebkitMaskImage: `linear-gradient(to bottom, black 80%, transparent 100%)`,
            maskImage: `linear-gradient(to bottom, black 80%, transparent 100%)`,
          }}
        />

        {/* LE CALQUE DE CONTENU (Toujours visible et net) */}
        <div 
          className="relative z-10 flex items-center justify-between w-full h-full"
          style={{ 
            paddingLeft: `${currentPaddingX}px`,
            paddingRight: `${currentPaddingX}px`,
          }}
        >
          <div className="flex items-center">
            {children ? children : breadcrumbItems && (
              <Breadcrumb items={breadcrumbItems} />
            )}
          </div>

          {action && (
            <div className="flex items-center">
              <Button onClick={action.onClick}>
                {action.label}
              </Button>
            </div>
          )}
        </div>
      </header>
    </div>
  );
};