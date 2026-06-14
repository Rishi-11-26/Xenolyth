'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useAuth } from '@/context/AuthContext';
import BackToHome from '@/components/ui/BackToHome';

export default function SentinelPage() {
  const { user, userData } = useAuth();

  const getCtaProps = () => {
    if (!user) {
      return { href: '/login', label: 'Join Beta', variant: 'primary', external: false };
    }
    
    const status = userData?.role === 'admin' 
      ? 'approved' 
      : (userData?.productBetaStatuses?.sentinel || 'none');

    if (status === 'none') {
      return { href: '/dashboard', label: 'Join Beta', variant: 'primary', external: false };
    } else if (status === 'pending') {
      return { href: '/dashboard', label: 'Beta Request Pending', variant: 'secondary', external: false };
    } else if (status === 'rejected') {
      return { href: '/dashboard', label: 'Access Restricted', variant: 'danger', external: false };
    } else {
      return { href: 'https://sentinelspace.vercel.app/', label: 'Launch Sentinel', variant: 'primary', external: true };
    }
  };
  const cta = getCtaProps();
  const scrollRevealSettings = {
    initial: { opacity: 0, y: 24, scale: 0.98 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
  };

  return (
    <div className="relative w-full">
      {/* ── HERO SECTION ── */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-border bg-bg-primary pt-24 pb-16">
        <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" aria-hidden="true" />
        <div className="absolute w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl absolute-center pointer-events-none" aria-hidden="true" />

        <div className="max-w-[1280px] w-full mx-auto px-6 md:px-8 z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex flex-col gap-6 lg:w-[45%] text-left">
            <BackToHome />
            <div className="flex items-center gap-3">
              <Badge variant="live">Live</Badge>
              <span className="text-[10px] font-semibold tracking-wider text-text-secondary uppercase">
                Xenolyth flag-ship
              </span>
            </div>
            <h1 className="h1-heading text-text-primary tracking-tight font-bold">
              Sentinel
            </h1>
            <p className="text-lg md:text-xl font-medium text-accent">
              Autonomous information monitoring and system orchestration.
            </p>
            <p className="body-text text-text-secondary leading-relaxed">
              Sentinel operates continuously to audit server behaviors, detect anomalous information flow, and trigger infrastructure-level isolations. Once configured, it acts independently without requiring active confirmation loops.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              {cta.external ? (
                <a href={cta.href} target="_blank" rel="noopener noreferrer">
                  <Button variant={cta.variant as any}>{cta.label}</Button>
                </a>
              ) : (
                <Link href={cta.href}>
                  <Button variant={cta.variant as any}>{cta.label}</Button>
                </Link>
              )}
              <Link href="#how-it-works">
                <Button variant="ghost" className="border border-border hover:border-accent/30 text-text-secondary hover:text-text-primary">
                  How it works
                </Button>
              </Link>
            </div>
          </div>

          {/* Device Mockup */}
          <div className="lg:w-[55%] w-full">
            <div className="w-full border border-border bg-bg-secondary rounded-xl p-3 shadow-md flex flex-col">
              <div className="w-full border border-border bg-bg-primary rounded-lg overflow-hidden shadow-inner flex flex-col">
                {/* Browser bar */}
                <div className="h-7 bg-surface border-b border-border flex items-center px-4 gap-1.5 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-border" />
                  <span className="w-2.5 h-2.5 rounded-full bg-border" />
                  <span className="w-2.5 h-2.5 rounded-full bg-border" />
                  <div className="mx-auto w-[65%] h-4 bg-bg-secondary rounded border border-border text-[8px] text-text-secondary/40 flex items-center justify-center font-mono">
                    sentinel.xenolyth.ai/console/radar
                  </div>
                </div>
                {/* Image */}
                <div className="relative aspect-[16/10] bg-bg-secondary">
                  <Image 
                    src="/images/sentinel_radar.png"
                    alt="Sentinel Radar Console"
                    fill
                    sizes="(max-w-1024px) 100vw, 55vw"
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ALTERNATING FEATURES ── */}
      {/* Feature 1: Left Visual, Right Copy */}
      <Section id="feature-1" bg="secondary" className="py-20 md:py-24">
        <motion.div {...scrollRevealSettings} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="relative aspect-video w-full rounded-xl border border-border bg-bg-primary overflow-hidden shadow-md">
              <Image 
                src="/images/sentinel_briefing.png"
                alt="Sentinel Action Configuration Briefing"
                fill
                sizes="(max-w-1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-6 flex flex-col gap-4 order-1 lg:order-2">
            <span className="label-eyebrow text-accent">Continuous Guardrails</span>
            <h2 className="h2-heading text-text-primary tracking-tight">
              Deterministic Safety Enforcements
            </h2>
            <p className="body-text text-text-secondary leading-relaxed">
              Sentinel evaluates system activities against strict, pre-configured policy rules. When state violations occur, Sentinel enforces constraints immediately—restricting data vectors, isolating nodes, or locking operations before damage spreads.
            </p>
          </div>
        </motion.div>
      </Section>

      {/* Feature 2: Right Visual, Left Copy */}
      <Section id="feature-2" className="py-20 md:py-24">
        <motion.div {...scrollRevealSettings} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 flex flex-col gap-4">
            <span className="label-eyebrow text-accent">Fault-Tolerant Operation</span>
            <h2 className="h2-heading text-text-primary tracking-tight">
              Graceful Subsystem Degradation
            </h2>
            <p className="body-text text-text-secondary leading-relaxed">
              Unlike traditional scripts that crash silently during unexpected events, Sentinel is designed to isolate failing components. If a connection fails, Sentinel switches to local diagnostics and alerts operators, maintaining core safety guardrails without shutting down the entire platform.
            </p>
          </div>
          <div className="lg:col-span-6">
            <div className="relative aspect-video w-full rounded-xl border border-border bg-bg-secondary overflow-hidden shadow-md">
              <Image 
                src="/images/sentinel_launch.png"
                alt="Sentinel Orchestration Deployments"
                fill
                sizes="(max-w-1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </motion.div>
      </Section>

      {/* Feature 3: Left Visual, Right Copy */}
      <Section id="feature-3" bg="secondary" className="py-20 md:py-24">
        <motion.div {...scrollRevealSettings} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="bg-bg-primary border border-border rounded-xl p-6 font-mono text-xs text-text-secondary h-64 overflow-y-auto flex flex-col gap-2 shadow-inner">
              <div className="text-accent-argus font-semibold">{'// DECISION LOG'}</div>
              <div>[14:02:11] Init system monitoring loop. Status: OK</div>
              <div>[14:02:15] Anomalous traffic payload detected on Port 8080</div>
              <div className="text-warning">[14:02:16] Warning: Action trigger condition met - policy id: POL-TRAFFIC-MAX</div>
              <div>[14:02:16] Reasoning: Volume exceeded baseline by 450% over 5.2s. Source IP unverified.</div>
              <div className="text-success">[14:02:17] Action executed: Traffic isolated on Port 8080. Routed to sandbox-3</div>
              <div>[14:02:18] Node status: RESTRICTED. Operational health: 92%</div>
            </div>
          </div>
          <div className="lg:col-span-6 flex flex-col gap-4 order-1 lg:order-2">
            <span className="label-eyebrow text-accent">Complete Auditability</span>
            <h2 className="h2-heading text-text-primary tracking-tight">
              Reasoning Logs and Audit Trails
            </h2>
            <p className="body-text text-text-secondary leading-relaxed">
              Every action taken by Sentinel is linked to a clear decision record. The console logs why the system intervened, what telemetry triggered the response, and how the policy was satisfied, providing total visibility for security compliance reviews.
            </p>
          </div>
        </motion.div>
      </Section>

      {/* ── HOW IT WORKS ── */}
      <Section id="how-it-works" eyebrow="Workflow" heading="How it works">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-[1120px] mx-auto mt-4">
          {/* Step 1 */}
          <motion.div {...scrollRevealSettings} className="flex flex-col gap-4">
            <div className="text-3xl font-bold text-accent/20 font-mono">01</div>
            <h3 className="text-base font-semibold text-text-primary">Policy Definition</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Define operational parameters, trigger bounds, and target nodes inside Sentinel&apos;s clean configuration file.
            </p>
          </motion.div>

          {/* Step 2 */}
          <motion.div {...scrollRevealSettings} className="flex flex-col gap-4">
            <div className="text-3xl font-bold text-accent/20 font-mono">02</div>
            <h3 className="text-base font-semibold text-text-primary">Continuous Loop</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Sentinel runs continuous observation cycles, analyzing incoming events and state structures in real-time.
            </p>
          </motion.div>

          {/* Step 3 */}
          <motion.div {...scrollRevealSettings} className="flex flex-col gap-4">
            <div className="text-3xl font-bold text-accent/20 font-mono">03</div>
            <h3 className="text-base font-semibold text-text-primary">Autonomous Actions</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Upon boundary violation, the system executes deterministic isolations, containment, or warning routes immediately.
            </p>
          </motion.div>

          {/* Step 4 */}
          <motion.div {...scrollRevealSettings} className="flex flex-col gap-4">
            <div className="text-3xl font-bold text-accent/20 font-mono">04</div>
            <h3 className="text-base font-semibold text-text-primary">Audit Synthesis</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Every incident maps directly to an immutable log explaining the decision path, keeping operators informed.
            </p>
          </motion.div>
        </div>
      </Section>

      {/* ── CLOSING CTA BAND ── */}
      <Section id="sentinel-cta" bg="secondary" className="text-center">
        <motion.div {...scrollRevealSettings} className="max-w-[600px] mx-auto flex flex-col gap-6">
          <h2 className="h2-heading text-text-primary tracking-tight">
            Join the Sentinel Beta
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            Integrate autonomous safety layers and continuous threat response directly into your server infrastructure.
          </p>
          <div className="flex justify-center gap-4 mt-2">
            {cta.external ? (
              <a href={cta.href} target="_blank" rel="noopener noreferrer">
                <Button variant={cta.variant as any}>{cta.label}</Button>
              </a>
            ) : (
              <Link href={cta.href}>
                <Button variant={cta.variant as any}>{cta.label}</Button>
              </Link>
            )}
            <Link href="/company">
              <Button variant="secondary" className="border-border">
                Platform Principles
              </Button>
            </Link>
          </div>
        </motion.div>
      </Section>
    </div>
  );
}
