import React from 'react';
import Section from '../ui/Section';
import Card from '../ui/Card';

export const PrinciplesSection: React.FC = () => {
  return (
    <Section id="company-principles" eyebrow="Principles" heading="Engineering Guidelines">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
        {/* Reliability */}
        <Card className="flex flex-col gap-4 p-8">
          <h3 className="h3-heading text-text-primary">01 / Reliability</h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            We build systems that prioritize fault-isolation. If a node fails, it must degrade gracefully and report its condition to neighboring nodes, preventing silent cascades and allowing the rest of the cluster to operate normally.
          </p>
        </Card>

        {/* Autonomy */}
        <Card className="flex flex-col gap-4 p-8">
          <h3 className="h3-heading text-text-primary">02 / Autonomy</h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            We build systems that act on clear, pre-defined rules. Once boundaries are established, our software executes containment and mitigation protocols without waiting for active manual confirmation, reducing reaction latency.
          </p>
        </Card>

        {/* Transparency */}
        <Card className="flex flex-col gap-4 p-8">
          <h3 className="h3-heading text-text-primary">03 / Transparency</h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            We build systems that explain their decisions. Every action is backed by a deterministic log record outlining the telemetric triggers and logical parameters used, ensuring complete auditable compliance.
          </p>
        </Card>
      </div>
    </Section>
  );
};
export default PrinciplesSection;
