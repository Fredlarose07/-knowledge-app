import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'px-4 py-2 rounded-[8px] font-semibold text-13 transition-colors duration-200';
  
  const variantStyles = {
    // Primary: bg #575BC7, border #6C78E6, text #FFFFFF, hover bg #6C78E6
    primary: 'bg-primary-600 hover:bg-primary-500 text-neutral-0 border border-primary-500',
    
    // Secondary: bg #1E2025, border #2A2D33, text #FFFFFF, hover bg #24272E
    secondary: 'bg-neutral-800 hover:bg-neutral-750 text-neutral-0 border border-neutral-700',
    
    // Ghost: text #9BA0AB, hover bg #181A1D, hover text #FFFFFF
    ghost: 'text-neutral-300 hover:text-neutral-0 hover:bg-neutral-850 border border-transparent',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};