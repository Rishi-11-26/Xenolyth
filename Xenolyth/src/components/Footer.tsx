import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bg-primary border-t border-border mt-auto" role="contentinfo">
      <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Column 1: Logo Lockup & Tagline */}
          <div className="flex flex-col gap-4 col-span-1 md:col-span-5">
            <Link href="/" className="relative h-10 w-10 focus:outline-none focus:ring-2 focus:ring-accent/40 rounded">
              <Image 
                src="/logo.jpg" 
                alt="Xenolyth" 
                fill 
                className="object-contain"
              />
            </Link>
            <p className="text-sm text-text-secondary max-w-[32ch] mt-2 leading-relaxed">
              Autonomous systems for problems that don&apos;t wait. Continuous reasoning, safety, and operational clarity.
            </p>
          </div>

          {/* Column 2: Products */}
          <div className="flex flex-col gap-4 col-span-1 md:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-primary">
              Products
            </span>
            <ul className="flex flex-col gap-2.5" role="list">
              <li>
                <Link href="/products/sentinel" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Sentinel <span className="text-[9px] font-bold text-success ml-1">●</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="flex flex-col gap-4 col-span-1 md:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-primary">
              Company
            </span>
            <ul className="flex flex-col gap-2.5" role="list">
              <li>
                <Link href="/company" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Overview
                </Link>
              </li>
              <li>
                <Link href="/research" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Research
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="flex flex-col gap-4 col-span-1 md:col-span-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-primary">
              System Operations
            </span>
            <ul className="flex flex-col gap-2.5" role="list">
              <li>
                <Link href="/privacy" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>

            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/50 mt-12 md:mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-secondary/80 text-center md:text-left">
            &copy; {currentYear} Xenolyth Inc. All rights reserved. Platform status: <span className="text-success font-semibold">ONLINE</span>
          </p>

          {/* Monochrome Social Icons (60% to 100% opacity) */}
          <div className="flex items-center gap-5">

            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-text-secondary hover:text-text-primary opacity-60 hover:opacity-100 transition-all duration-200"
              aria-label="X (formerly Twitter)"
            >
              <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-text-secondary hover:text-text-primary opacity-60 hover:opacity-100 transition-all duration-200"
              aria-label="LinkedIn Profile"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
