'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  children: ReactNode;
}

export default function Button({ 
  variant = 'primary', 
  children, 
  className = '',
  ...props 
}: ButtonProps) {
  const baseClasses = 'px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-gradient-hero text-text-primary hover:shadow-glow-primary',
    secondary: 'bg-gradient-tech text-text-primary hover:shadow-glow-cyan',
    outline: 'border-2 border-neon-violet text-neon-violet hover:bg-neon-violet hover:text-bg-main hover:shadow-glow-primary',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
