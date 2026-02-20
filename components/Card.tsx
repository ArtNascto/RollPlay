'use client';

import { ReactNode, CSSProperties } from 'react';

interface CardProps {
  children: ReactNode;
  variant?: 'surface-1' | 'surface-2';
  hover?: boolean;
  className?: string;
  onClick?: () => void;
  style?: CSSProperties;
}

export default function Card({ 
  children, 
  variant = 'surface-1', 
  hover = false,
  className = '',
  onClick,
  style
}: CardProps) {
  const baseClasses = 'rounded-xl border border-border p-6 transition-all';
  const variantClasses = variant === 'surface-1' ? 'bg-surface-1' : 'bg-surface-2';
  const hoverClasses = hover ? 'cursor-pointer hover:border-neon-violet hover:shadow-glow-primary' : '';
  const clickableClass = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`${baseClasses} ${variantClasses} ${hoverClasses} ${clickableClass} ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
}
