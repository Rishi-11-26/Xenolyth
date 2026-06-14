'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { NavItem } from '@/lib/nav';

interface DropdownProps {
  item: NavItem;
  activePath: string;
}

export const Dropdown: React.FC<DropdownProps> = ({ item, activePath }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  // Check if any child item is active
  const isChildActive = item.children?.some(child => activePath === child.href) ?? false;

  return (
    <div 
      ref={containerRef} 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        ref={triggerRef}
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`flex items-center gap-1 py-1.5 text-sm font-medium transition-colors duration-200 cursor-pointer
          ${isOpen || isChildActive ? 'text-text-primary' : 'text-text-secondary'} 
          hover:text-text-primary focus:outline-none focus:text-text-primary`}
      >
        {item.label}
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-accent' : 'text-text-secondary'}`} 
          aria-hidden="true" 
        />
      </button>

      {isOpen && item.children && (
        <div 
          className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-56 z-40 transition-all duration-150 animate-fade-in"
          role="menu"
        >
          <div className="bg-surface border border-border rounded-lg shadow-md p-2 flex flex-col gap-1 backdrop-blur-md bg-surface/95">
            {item.children.map((child, idx) => (
              <Link
                key={idx}
                href={child.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-md text-sm text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-all duration-150 focus:outline-none focus:bg-bg-secondary focus:text-text-primary group"
                role="menuitem"
              >
                <span>{child.label}</span>
                {child.status && (
                  <span 
                    className={`text-[9px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full border
                      ${child.status === 'live' 
                        ? 'border-success/35 text-success bg-success/5' 
                        : 'border-warning/35 text-warning bg-warning/5'
                      }`}
                  >
                    {child.status}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default Dropdown;
