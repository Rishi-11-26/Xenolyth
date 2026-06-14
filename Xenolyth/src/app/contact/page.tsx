'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Clock } from 'lucide-react';
import Section from '@/components/ui/Section';
import BackToHome from '@/components/ui/BackToHome';

export default function ContactPage() {
  const scrollRevealSettings = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
  };

  return (
    <div className="relative w-full min-h-screen bg-bg-primary">
      {/* ── HEADER ── */}
      <Section id="contact-header" className="pt-28 pb-8">
        <div className="max-w-[800px] flex flex-col gap-4 text-left">
          <BackToHome />
          <span className="label-eyebrow text-accent font-semibold tracking-widest">
            Contact
          </span>
          <h1 className="h1-heading text-text-primary tracking-tight font-bold">
            Get in touch
          </h1>
          <p className="body-text text-text-secondary leading-relaxed">
            Have a question about Sentinel, want to discuss a deployment, or just want to say hello? Reach out directly — we read every email.
          </p>
        </div>
      </Section>

      {/* ── CONTACT DETAILS ── */}
      <Section id="contact-details" bg="secondary" className="py-16">
        <motion.div {...scrollRevealSettings} className="max-w-[600px] mx-auto flex flex-col gap-8">

          {/* Email CTA */}
          <div className="flex flex-col items-center text-center gap-5 bg-bg-primary border border-border rounded-xl p-10">
            <div className="w-14 h-14 rounded-full bg-accent/10 border border-accent/25 flex items-center justify-center text-accent">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary mb-2">Email us directly</h2>
              <p className="text-sm text-text-secondary leading-relaxed mb-6 max-w-[38ch] mx-auto">
                For inquiries about Sentinel, platform capabilities, partnerships, or anything else — drop us an email.
              </p>
              <a
                href="mailto:xenolyth26@gmail.com"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent text-bg-primary font-semibold text-sm hover:brightness-110 transition-all"
              >
                <Mail className="w-4 h-4" />
                xenolyth26@gmail.com
              </a>
            </div>
          </div>

          {/* Info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex gap-3 bg-bg-primary border border-border rounded-lg p-5">
              <MessageSquare className="w-4 h-4 text-accent mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-1">What to include</h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Your name, organization, and a brief description of what you need.
                </p>
              </div>
            </div>
            <div className="flex gap-3 bg-bg-primary border border-border rounded-lg p-5">
              <Clock className="w-4 h-4 text-accent mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-1">Response time</h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  We typically respond within 24–48 hours on business days.
                </p>
              </div>
            </div>
          </div>

        </motion.div>
      </Section>
    </div>
  );
}
