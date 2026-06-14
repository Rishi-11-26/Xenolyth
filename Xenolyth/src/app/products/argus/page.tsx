'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Badge from '@/components/ui/Badge';
import Section from '@/components/ui/Section';

export default function ArgusPage() {
  return (
    <div className="relative w-full">
      <Section className="relative min-h-[80vh] flex flex-col items-center justify-center overflow-hidden bg-bg-primary pt-24 pb-16">
        <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" aria-hidden="true" />
        <div className="absolute w-[500px] h-[500px] bg-accent-argus/5 rounded-full blur-3xl absolute-center pointer-events-none" aria-hidden="true" />

        <motion.div 
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[720px] w-full mx-auto px-6 md:px-8 z-10 text-center flex flex-col items-center gap-6"
        >
          <div className="flex items-center justify-center gap-2">
            <Badge variant="coming-soon">In Development</Badge>
          </div>
          
          <h1 className="h1-heading text-text-primary tracking-tight font-bold">
            Argus
          </h1>
          
          <p className="text-xl md:text-2xl font-medium text-accent-argus leading-snug max-w-[28ch]">
            Coming Soon
          </p>
        </motion.div>
      </Section>
    </div>
  );
}
