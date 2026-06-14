import React from 'react';
import Section from '../ui/Section';

export const MissionSection: React.FC = () => {
  return (
    <Section id="company-mission" eyebrow="Mission" heading="Autonomous Execution">
      <div className="max-w-[760px] mx-auto text-left flex flex-col gap-6">
        <p className="text-lg md:text-xl text-text-secondary leading-relaxed font-medium">
          Our mission is to build software layers that execute actions autonomously and safely. We create systems that operate continuously, monitor complexity, and coordinate deterministic responses without requiring prompt-based human oversight.
        </p>
        <p className="text-sm text-text-secondary leading-relaxed">
          As computational complexity increases, manual monitoring becomes impossible. We believe the future of computing requires software capable of maintaining its own safety boundaries, self-reporting failures, and making localized remediation decisions deterministically.
        </p>
      </div>
    </Section>
  );
};
export default MissionSection;
