import React from 'react';
import Link, { LinkProps } from 'next/link';

interface NavLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  onClick?: () => void;
}

export const NavLink: React.FC<NavLinkProps> = ({
  children,
  className = '',
  id,
  onClick,
  ...props
}) => {
  return (
    <Link
      id={id}
      onClick={onClick}
      className={`relative py-1.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-200 group ${className}`}
      {...props}
    >
      {children}
      <span 
        className="absolute bottom-0 left-1/2 w-0 h-[1.5px] bg-accent transition-all duration-200 group-hover:w-full group-hover:left-0"
        aria-hidden="true"
      />
    </Link>
  );
};
export default NavLink;
