import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'default' | 'small';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'default',
  icon,
  iconPosition = 'left',
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-[6px] font-semibold transition-colors duration-200 inline-flex items-center';
  
  // Tailles
  const sizeStyles = {
    default: 'px-4 py-2 text-13 gap-2',
    small: 'px-2 py-1.5 text-12 gap-1',
  };
  
  // Variantes
  const variantStyles = {
    primary: 'bg-primary-600 hover:bg-primary-500 text-neutral-0 border border-primary-500',
    secondary: 'bg-[#1E2025] hover:bg-neutral-750 text-neutral-0 border border-[#2A2D33]',
    ghost: 'text-neutral-300 hover:text-neutral-0 hover:bg-neutral-850 border border-transparent',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && <span>{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span>{icon}</span>}
    </button>
  );
};