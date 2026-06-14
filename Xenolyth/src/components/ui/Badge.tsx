import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'live' | 'coming-soon' | 'neutral' | 'success' | 'warning' | 'danger';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  children,
  className = '',
  ...props
}) => {
  const dotColor = {
    live: 'bg-success shadow-[0_0_8px_rgba(34,197,94,0.5)]',
    'coming-soon': 'bg-warning shadow-[0_0_8px_rgba(245,158,11,0.5)]',
    neutral: 'bg-text-secondary',
    success: 'bg-success shadow-[0_0_8px_rgba(34,197,94,0.5)]',
    warning: 'bg-warning shadow-[0_0_8px_rgba(245,158,11,0.5)]',
    danger: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-surface/80 border border-border text-text-primary ${className}`}
      {...props}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor[variant]}`} aria-hidden="true" />
      {children}
    </span>
  );
};
export default Badge;
