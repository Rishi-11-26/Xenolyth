'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Layers, Eye } from 'lucide-react';
import { products } from '@/lib/products';
import { researchPosts } from '@/lib/research';
import Section from '@/components/ui/Section';
import ProductCard from '@/components/ui/ProductCard';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function Home() {
  const [isLCPDone, setIsLCPDone] = useState(false);

  useEffect(() => {
    // Trigger hero entrance after logo reveal handoff (approx 700ms-800ms)
    const timer = setTimeout(() => {
      setIsLCPDone(true);
    }, 750);
    return () => clearTimeout(timer);
  }, []);

  // Staggered child variants for Hero
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // 100ms stagger
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number] // Custom ease
      }
    }
  };

  const scrollRevealSettings = {
    initial: { opacity: 0, y: 24, scale: 0.98 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
  };

  return (
    <div className="relative w-full">
      {/* ── HERO SECTION ── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-border bg-bg-primary pt-16">
        {/* Drifting Abstract Gradient Mesh Background */}
        <motion.div
          animate={{
            x: [0, 30, -30, 0],
            y: [0, -20, 20, 0],
            scale: [1, 1.05, 0.95, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute inset-0 hero-gradient-mesh opacity-20 pointer-events-none"
          aria-hidden="true"
        />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" aria-hidden="true" />

        <div className="relative max-w-[1280px] w-full mx-auto px-6 md:px-8 z-10 py-16 md:py-24">
          {isLCPDone && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="max-w-[800px] flex flex-col gap-6"
            >
              <motion.span 
                variants={itemVariants} 
                className="label-eyebrow text-accent font-semibold tracking-widest"
              >
                XENOLYTH
              </motion.span>
              
              <motion.h1 
                variants={itemVariants} 
                className="display-heading text-text-primary tracking-tight font-bold"
              >
                Autonomous systems for problems that don&apos;t wait.
              </motion.h1>
              
              <motion.p 
                variants={itemVariants} 
                className="body-text text-text-secondary max-w-[54ch] leading-relaxed"
              >
                Xenolyth builds AI products that operate independently, reliably, and at scale — starting with Sentinel.
              </motion.p>
              
              <motion.div 
                variants={itemVariants} 
                className="flex flex-wrap items-center gap-4 mt-4"
              >
                <Link href="/products/sentinel">
                  <Button variant="primary">
                    Explore Sentinel
                  </Button>
                </Link>
                <Link href="#discover-xenolyth">
                  <Button variant="ghost" className="border border-border hover:border-accent/30 text-text-secondary hover:text-text-primary">
                    Discover Xenolyth
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── WHY XENOLYTH EXISTS ── */}
      <Section id="why-exist" bg="secondary" className="border-t-0">
        <motion.div {...scrollRevealSettings} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4 flex flex-col gap-2">
            <span className="label-eyebrow text-accent">Why we exist</span>
            <h2 className="h2-heading text-text-primary tracking-tight">The Autonomy Gap</h2>
          </div>
          <div className="md:col-span-8">
            <p className="text-lg md:text-xl text-text-secondary leading-relaxed max-w-[60ch]">
              Most artificial intelligence today assists — drafting messages, suggesting code, or summarizing documents — but stops short of execution. Real-world operations, constant monitoring, and critical responses require software that acts continuously without waiting for a prompt each time. Xenolyth builds that autonomous layer.
            </p>
          </div>
        </motion.div>
      </Section>

      {/* ── PRODUCT ECOSYSTEM ── */}
      <Section id="products" eyebrow="Products" heading="Built for autonomy.">
        <div className="flex flex-col gap-8 max-w-[640px] mx-auto">
          {products.map((product) => (
            <motion.div key={product.slug} {...scrollRevealSettings}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
        
        <motion.div {...scrollRevealSettings} className="text-center mt-12">
          <p className="text-sm text-text-secondary">
            More autonomous products are under development.{' '}
            <Link href="#beta" className="text-accent hover:underline font-medium">
              Join the waitlist to receive updates
            </Link>
          </p>
        </motion.div>
      </Section>

      {/* ── HOW WE BUILD (TRUST PRINCIPLES) ── */}
      <Section id="principles" bg="secondary" eyebrow="How we build" heading="Reliability, autonomy, transparency.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Reliability */}
          <motion.div {...scrollRevealSettings}>
            <Card className="flex flex-col gap-4 h-full p-8">
              <div className="w-10 h-10 rounded bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="h3-heading text-text-primary">Reliability</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Sentinel runs continuous health checks and degrades gracefully. If a core process encounters an exception, the system reports the breakdown and isolates the incident rather than failing silently.
              </p>
            </Card>
          </motion.div>

          {/* Autonomy */}
          <motion.div {...scrollRevealSettings}>
            <Card className="flex flex-col gap-4 h-full p-8">
              <div className="w-10 h-10 rounded bg-accent-argus/10 border border-accent-argus/20 flex items-center justify-center text-accent-argus">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="h3-heading text-text-primary">Autonomy</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Once configured with specific triggers, Sentinel operates continuously within defined boundaries. The system makes decisions based on structural rules without requiring a human to approve each individual step.
              </p>
            </Card>
          </motion.div>

          {/* Transparency */}
          <motion.div {...scrollRevealSettings}>
            <Card className="flex flex-col gap-4 h-full p-8">
              <div className="w-10 h-10 rounded bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="h3-heading text-text-primary">Transparency</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Every autonomous decision is logged with its underlying mathematical rationale and operational reason. This step-by-step audit trail is searchable and accessible at any time.
              </p>
            </Card>
          </motion.div>
        </div>
      </Section>

      {/* ── RESEARCH ── */}
      {researchPosts.length > 0 && (
        <Section id="research" eyebrow="Research" heading="From the lab.">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {researchPosts.map((post) => (
              <motion.div key={post.id} {...scrollRevealSettings}>
                <Card interactive className="flex flex-col justify-between h-full p-8 gap-6 group">
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center text-xs text-text-secondary font-mono">
                      <span>{post.date}</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="text-base font-semibold text-text-primary tracking-tight leading-snug group-hover:text-accent transition-colors duration-200">
                      {post.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="text-[10px] bg-bg-secondary text-text-secondary border border-border px-2 py-0.5 rounded font-mono">
                        {tag}
                      </span>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          <motion.div {...scrollRevealSettings} className="text-center mt-12">
            <Link href="/research" className="inline-flex items-center gap-2 text-sm text-accent hover:underline font-semibold">
              View all publications <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </Section>
      )}

      {/* ── DISCOVER XENOLYTH ── */}
      <Section id="discover-xenolyth" bg="secondary" eyebrow="Discover Xenolyth" heading="The Platform Strategy">
        <motion.div {...scrollRevealSettings} className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 flex flex-col gap-6 text-left">
            <p className="text-base text-text-secondary leading-relaxed">
              Xenolyth is a platform built on unified core principles: autonomy, deterministic reliability, and complete auditability. Rather than releasing disjointed tools, each new product we build leverages the same underlying agentic foundation and security-first orchestration.
            </p>
            <p className="text-base text-text-secondary leading-relaxed">
              Sentinel is our flagship product, and every subsequent product is explicitly designed to integrate and expand our autonomous platform capabilities. More products are currently in development.
            </p>
            <div className="mt-4">
              <Link href="/company">
                <Button variant="secondary" className="border-accent/20 hover:border-accent text-accent">
                  Learn about our principles
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:col-span-5 relative aspect-square w-full max-w-[360px] mx-auto rounded-xl border border-border bg-bg-primary flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
            <div className="absolute inset-0 grid-bg opacity-20" />
            
            {/* abstract platform visual */}
            <div className="relative w-44 h-44 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-dashed border-accent/20 animate-spin" style={{ animationDuration: '60s' }} />
              <div className="absolute w-36 h-36 rounded-full border border-accent-sentinel/30 animate-pulse" />
              <div className="absolute w-24 h-24 rounded-full bg-accent/5 border border-accent/40 flex items-center justify-center shadow-glow">
                {/* Embedded logo mark centered */}
                <div className="w-10 h-10 relative">
                  <Image src="/logo.jpg" alt="Xenolyth Logo" fill className="object-contain" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </Section>

      {/* ── NEW PRODUCTS TEASER ── */}
      <Section id="beta">
        <motion.div {...scrollRevealSettings} className="max-w-[720px] mx-auto text-center bg-bg-secondary border border-border border-dashed rounded-xl p-8 md:p-12">
          <span className="label-eyebrow text-accent">Coming Soon</span>
          <h2 className="h2-heading text-text-primary tracking-tight mt-2 mb-4">
            More Products in Development
          </h2>
          <p className="body-text text-text-secondary max-w-[50ch] mx-auto">
            New autonomous software is currently being built on the Xenolyth platform. Stay tuned for updates.
          </p>
        </motion.div>
      </Section>

      {/* ── COMPANY PREVIEW ── */}
      <Section id="company-teaser" bg="secondary" className="text-center">
        <motion.div {...scrollRevealSettings} className="max-w-[600px] mx-auto flex flex-col gap-4">
          <span className="label-eyebrow text-accent">Company</span>
          <h3 className="h3-heading text-text-primary">Our Principles</h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            We are a group of engineers and researchers focused on building autonomous products designed to handle complex information and system orchestrations. We optimize for safety and predictability.
          </p>
          <div className="mt-2">
            <Link href="/company" className="inline-flex items-center gap-2 text-sm text-accent hover:underline font-semibold">
              Read our full principles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </Section>

      {/* ── CONTACT CTA ── */}
      <Section id="contact-cta" className="text-center">
        <motion.div {...scrollRevealSettings} className="max-w-[500px] mx-auto flex flex-col gap-6">
          <h2 className="h2-heading text-text-primary tracking-tight">
            Want to talk?
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            Discuss customized integration scopes, platform capabilities, or technical details with our engineering team.
          </p>
          <div>
            <Link href="/contact">
              <Button variant="primary">
                Contact Engineering
              </Button>
            </Link>
          </div>
        </motion.div>
      </Section>
    </div>
  );
}
