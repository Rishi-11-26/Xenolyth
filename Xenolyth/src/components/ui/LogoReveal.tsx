'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const LogoReveal: React.FC = () => {
  const [shouldPlay, setShouldPlay] = useState(false);
  const [stage, setStage] = useState<'idle' | 'animate' | 'complete'>('idle');
  const [pointerEvents, setPointerEvents] = useState<'auto' | 'none'>('auto');

  useEffect(() => {
    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Check sessionStorage
    const hasPlayed = sessionStorage.getItem('xenolyth-logo-reveal-played');

    if (prefersReducedMotion || hasPlayed) {
      setTimeout(() => {
        setShouldPlay(false);
        setStage('complete');
        setPointerEvents('none');
      }, 0);
    } else {
      setTimeout(() => {
        setShouldPlay(true);
        setStage('animate');
      }, 0);
      
      // Pointer events: none after 400ms to allow immediate interaction
      const pointerTimeout = setTimeout(() => {
        setPointerEvents('none');
      }, 400);

      // Finish reveal and slide content up at 700ms, complete by 1000ms
      const endTimeout = setTimeout(() => {
        setStage('complete');
        sessionStorage.setItem('xenolyth-logo-reveal-played', 'true');
      }, 1000);

      return () => {
        clearTimeout(pointerTimeout);
        clearTimeout(endTimeout);
      };
    }
  }, []);

  if (!shouldPlay) return null;

  return (
    <AnimatePresence>
      {stage !== 'complete' && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          animate={{ opacity: stage === 'animate' ? 1 : 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed inset-0 bg-bg-primary z-50 flex items-center justify-center"
          style={{ pointerEvents }}
        >
          {/* New Logo (fades in & scales up) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.45,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="w-40 h-40 relative select-none"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.jpg"
              alt="Xenolyth"
              className="w-full h-full object-contain"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default LogoReveal;

