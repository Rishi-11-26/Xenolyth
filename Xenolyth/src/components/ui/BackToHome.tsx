'use client';

import Link from 'next/link';

export default function BackToHome() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors group mb-8"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="group-hover:-translate-x-0.5 transition-transform"
      >
        <path d="M19 12H5" />
        <path d="M12 19l-7-7 7-7" />
      </svg>
      Back to Home
    </Link>
  );
}
