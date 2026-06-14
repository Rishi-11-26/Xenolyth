import React from 'react';
import Section from '../ui/Section';

export const LongTermSection: React.FC = () => {
  return (
    <Section id="company-longterm" bg="secondary" eyebrow="Long-Term" heading="Product Evaluation">
      <div className="max-w-[760px] mx-auto text-left flex flex-col gap-6">
        <p className="text-lg md:text-xl text-text-secondary leading-relaxed font-medium">
          We evaluate new system expansion modules based on a strict operational framework.
        </p>
        <p className="text-sm text-text-secondary leading-relaxed">
          Before initiating development on a new product, we evaluate it against three requirements:
        </p>
        <ol className="list-decimal pl-5 text-sm text-text-secondary flex flex-col gap-3" role="list">
          <li>
            <strong>Consensus Suitability:</strong> Does the target system benefit from localized, multi-agent state consensus?
          </li>
          <li>
            <strong>Deterministic Isolation:</strong> Can threat vectors or failures inside the domain be isolated cleanly without impacting external infrastructure?
          </li>
          <li>
            <strong>Audit Continuity:</strong> Can all agent decisions be output as structured, cryptographic logs that integrate with the core Xenolyth platform?
          </li>
        </ol>
        <p className="text-sm text-text-secondary leading-relaxed mt-2">
          By adhering to these rules, we ensure that every new platform capability inherits the security, safety, and speed of the entire Xenolyth ecosystem.
        </p>
      </div>
    </Section>
  );
};
export default LongTermSection;
