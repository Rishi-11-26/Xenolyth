import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  interactive = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-surface border border-border rounded-lg p-6 transition-all duration-200 
        ${interactive ? 'hover:-translate-y-1 hover:border-accent/30 hover:shadow-glow cursor-pointer' : ''} 
        ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
export default Card;
