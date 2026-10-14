import React from 'react';

interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function PremiumCard({ children, className = '', onClick }: PremiumCardProps) {
  return (
    <div 
      className={`bg-white rounded-2xl border border-blue-50/50 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden ${onClick ? 'cursor-pointer hover:-translate-y-1' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
