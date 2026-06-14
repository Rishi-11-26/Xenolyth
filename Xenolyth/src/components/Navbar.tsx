'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { navItems } from '@/lib/nav';
import NavLink from './ui/NavLink';
import Button from './ui/Button';
import Dropdown from './ui/Dropdown';
import { useAuth } from '@/context/AuthContext';

export const Navbar: React.FC = () => {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedMobileItem, setExpandedMobileItem] = useState<string | null>(null);
  
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard navigation for mobile overlay
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  const toggleMobileItem = (label: string) => {
    setExpandedMobileItem(expandedMobileItem === label ? null : label);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 h-16 flex items-center
          ${isScrolled 
            ? 'bg-bg-primary/80 backdrop-blur-md border-b border-border shadow-sm' 
            : 'bg-transparent border-b border-transparent'
          }`}
      >
        <div className="w-full max-w-[1280px] mx-auto px-6 md:px-8 flex items-center justify-between">
          {/* Logo Section */}
          <Link href="/" className="relative h-7 flex items-center focus:outline-none focus:ring-2 focus:ring-accent/40 rounded">
          {/* Logo */}
            <div className="h-8 w-8 relative">
              <Image 
                src="/logo.jpg" 
                alt="Xenolyth" 
                fill
                priority
                className="object-contain"
              />
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8" role="navigation" aria-label="Desktop navigation">
            {navItems.map((item, idx) => {
              if (item.isButton) return null; // Render button separately on the right
              
              if (item.children) {
                return <Dropdown key={idx} item={item} activePath={pathname} />;
              }

              return (
                <NavLink key={idx} href={item.href}>
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          {/* Auth CTA Button (Desktop) */}
          <div className="hidden md:block">
            {user ? (
              <Link href="/dashboard">
                <Button variant="secondary" size="sm" className="border-accent/20 hover:border-accent text-accent bg-surface/50">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="secondary" size="sm" className="border-accent/20 hover:border-accent text-accent bg-surface/50">
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Hamburger Menu Trigger (Mobile) */}
          <button
            onClick={() => setIsMobileOpen(true)}
            className="block md:hidden text-text-secondary hover:text-text-primary p-2 focus:outline-none focus:ring-2 focus:ring-accent/40 rounded cursor-pointer"
            aria-label="Open mobile menu"
            aria-expanded={isMobileOpen}
            aria-controls="mobile-nav"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-bg-primary z-50 flex flex-col md:hidden"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
          >
            {/* Header bar in Overlay */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-border bg-bg-primary shrink-0">
              <Link href="/" onClick={() => setIsMobileOpen(false)} className="h-8 w-8 relative block">
                <Image 
                  src="/logo.jpg" 
                  alt="Xenolyth" 
                  fill 
                  className="object-contain" 
                />
              </Link>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="text-text-secondary hover:text-text-primary p-2 focus:outline-none focus:ring-2 focus:ring-accent/40 rounded cursor-pointer"
                aria-label="Close mobile menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Links List with Staggered Fade */}
            <div className="grow overflow-y-auto px-6 py-8 flex flex-col gap-6">
              {navItems.map((item, idx) => {
                if (item.isButton) return null;

                const isExpanded = expandedMobileItem === item.label;

                if (item.children) {
                  return (
                    <div key={idx} className="flex flex-col gap-2">
                      <button
                        onClick={() => toggleMobileItem(item.label)}
                        className="flex items-center justify-between text-left text-xl font-medium py-3 text-text-primary border-b border-border/50 focus:outline-none focus:text-accent w-full cursor-pointer"
                        aria-expanded={isExpanded}
                      >
                        {item.label}
                        <ChevronDown 
                          className={`w-5 h-5 transition-transform duration-200 text-text-secondary ${isExpanded ? 'rotate-180 text-accent' : ''}`} 
                        />
                      </button>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden pl-4 flex flex-col gap-3"
                          >
                            {item.children.map((child, cIdx) => (
                              <Link
                                key={cIdx}
                                href={child.href}
                                onClick={() => setIsMobileOpen(false)}
                                className="text-base text-text-secondary hover:text-text-primary py-2 flex items-center justify-between"
                              >
                                {child.label}
                                {child.status && (
                                  <span className={`text-[8px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border
                                    ${child.status === 'live' 
                                      ? 'border-success/30 text-success bg-success/5' 
                                      : 'border-warning/30 text-warning bg-warning/5'
                                    }`}
                                  >
                                    {child.status}
                                  </span>
                                )}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <Link
                    key={idx}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className="text-xl font-medium py-3 text-text-primary border-b border-border/50 hover:text-accent focus:outline-none focus:text-accent transition-colors"
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Sticky Auth Button at bottom of Mobile Overlay */}
            <div className="p-6 border-t border-border bg-bg-secondary shrink-0">
              {user ? (
                <Link href="/dashboard" onClick={() => setIsMobileOpen(false)}>
                  <Button variant="primary" className="w-full py-4 text-base">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/login" onClick={() => setIsMobileOpen(false)}>
                  <Button variant="primary" className="w-full py-4 text-base">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
export default Navbar;
