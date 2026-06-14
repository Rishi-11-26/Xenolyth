import React from 'react';
import Section from '../ui/Section';

export const VisionSection: React.FC = () => {
  return (
    <Section id="company-vision" bg="secondary" eyebrow="Vision" heading="Platform Orchestration">
      <div className="max-w-[760px] mx-auto text-left flex flex-col gap-6">
        <p className="text-lg md:text-xl text-text-secondary leading-relaxed font-medium">
          Over the next three to five years, the Xenolyth platform will expand into multiple computing domains.
        </p>
        <p className="text-sm text-text-secondary leading-relaxed">
          From security monitoring (Sentinel) to cloud resource isolation (Argus), each node is designed to collaborate, sharing telemetry and consensus policies to prevent outages and security compromises.
        </p>
        <p className="text-sm text-text-secondary leading-relaxed">
          We do not build disjointed tools. Our vision is a unified coordination system where distributed software agents manage network routes, compute resources, and data pipelines autonomously, maintaining global operational integrity under any condition.
        </p>
      </div>
    </Section>
  );
};
export default VisionSection;
