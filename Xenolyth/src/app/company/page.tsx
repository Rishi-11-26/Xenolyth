import React from 'react';
import { Metadata } from 'next';
import MissionSection from '@/components/company/MissionSection';
import VisionSection from '@/components/company/VisionSection';
import PrinciplesSection from '@/components/company/PrinciplesSection';
import LongTermSection from '@/components/company/LongTermSection';
import BackToHome from '@/components/ui/BackToHome';

export const metadata: Metadata = {
  title: 'Company Overview',
  description: 'Learn about Xenolyth\'s mission, vision, engineering principles, and long-term strategy for autonomous systems.',
};

export default function CompanyPage() {
  return (
    <div className="relative w-full">
      {/* ── HEADER ── */}
      <section className="relative bg-bg-primary pt-28 pb-4">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8">
          <div className="max-w-[800px] flex flex-col gap-4">
            <BackToHome />
            <span className="label-eyebrow text-accent font-semibold tracking-widest">
              Company
            </span>
            <h1 className="h1-heading text-text-primary tracking-tight font-bold">
              About Xenolyth
            </h1>
            <p className="body-text text-text-secondary leading-relaxed">
              Xenolyth develops the software layers required for deterministic autonomous computing. Here is how we think, design, and build for the long term.
            </p>
          </div>
        </div>
      </section>

      {/* ── MODULAR SECTIONS ── */}
      <div className="flex flex-col">
        <MissionSection />
        <VisionSection />
        <PrinciplesSection />
        <LongTermSection />
      </div>
    </div>
  );
}
