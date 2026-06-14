import React from 'react';
import { Metadata } from 'next';
import Section from '@/components/ui/Section';
import BackToHome from '@/components/ui/BackToHome';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Review the rules, liability boundaries, and operational agreements governing Xenolyth software use.',
};

export default function TermsPage() {
  return (
    <div className="relative w-full bg-bg-primary min-h-screen">
      <Section id="terms-header" className="pt-28 pb-8">
        <div className="max-w-[800px] flex flex-col gap-4">
          <BackToHome />
          <span className="label-eyebrow text-accent font-semibold tracking-widest">
            Terms
          </span>
          <h1 className="h1-heading text-text-primary tracking-tight font-bold">
            Terms of Service
          </h1>
        </div>
      </Section>

      <Section id="terms-content" bg="secondary" className="py-16">
        <div className="max-w-[760px] mx-auto text-left flex flex-col gap-8 text-sm text-text-secondary leading-relaxed">
          <div className="flex flex-col gap-3">
            <h2 className="text-base font-semibold text-text-primary">1. Operational Authority and Delegation</h2>
            <p>
              By installing and configuring Xenolyth software (including Sentinel and Argus agents), you explicitly delegate authority to the software to perform system actions. These actions include but are not limited to: dropping network packets, isolating virtual machines, terminating compute processes, and generating system warnings.
            </p>
            <p>
              You are sole responsible for verifying that the policy rules you configure reflect your target security postures. Xenolyth is not liable for system downtime, traffic loss, or data blocks caused by software acting within your configured policy boundaries.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-base font-semibold text-text-primary">2. Fault Containment and Graceful Degradation</h2>
            <p>
              Xenolyth software is built to isolate failures. While we mathematically verify consensus protocols under simulated environments, network latency and hardware degradation can impact local node speeds.
            </p>
            <p>
              The software is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We do not guarantee that the software will prevent all unauthorized access or capture 100% of telemetry deviations under extreme environment failure conditions.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-base font-semibold text-text-primary">3. Licensing and Instance Compliance</h2>
            <p>
              Xenolyth grants you a limited, non-exclusive, non-transferable license to run local agent binaries on your server instances. You agree not to reverse engineer the agent coordination communication protocol or bypass permission check validations.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-base font-semibold text-text-primary">4. Audit and Incident Liability</h2>
            <p>
              To the maximum extent permitted by law, Xenolyth shall not be liable for any indirect, incidental, or consequential damages arising from the autonomous actions of our software on your network assets, including lost revenue or database recovery expenses.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}
