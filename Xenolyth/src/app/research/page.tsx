'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, Filter } from 'lucide-react';
import { researchPosts } from '@/lib/research';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import BackToHome from '@/components/ui/BackToHome';

export default function ResearchPage() {
  const scrollRevealSettings = {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
  };

  return (
    <div className="relative w-full min-h-screen bg-bg-primary">
      {/* ── HEADER ── */}
      <Section id="research-header" className="pt-28 pb-12">
        <div className="max-w-[800px] flex flex-col gap-4 text-left">
          <BackToHome />
          <span className="label-eyebrow text-accent font-semibold tracking-widest">
            Research Lab
          </span>
          <h1 className="h1-heading text-text-primary tracking-tight font-bold">
            From the lab
          </h1>
          <p className="body-text text-text-secondary leading-relaxed">
            Xenolyth publishes technical reports and research papers focusing on the safety, predictability, and consensus protocols of autonomous systems. We believe in transparency and share our operational theories and findings.
          </p>
        </div>
      </Section>

      {/* ── PUBLICATIONS GRID ── */}
      <Section id="research-publications" bg="secondary" className="py-16">
        <div className="flex flex-col gap-8 max-w-[1000px] mx-auto">
          {/* Controls Bar (Decorative placeholder for future search/filter) */}
          <div className="flex justify-between items-center border-b border-border/60 pb-4 text-xs text-text-secondary font-mono">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-accent" />
              Showing {researchPosts.length} publication{researchPosts.length !== 1 ? 's' : ''}
            </span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 opacity-60">
                <Search className="w-3 h-3" /> Search
              </span>
              <span className="flex items-center gap-1 opacity-60">
                <Filter className="w-3 h-3" /> Filter
              </span>
            </div>
          </div>

          {/* List of Posts */}
          <div className="flex flex-col gap-6">
            {researchPosts.length > 0 ? (
              researchPosts.map((post) => (
                <motion.article 
                  key={post.id} 
                  {...scrollRevealSettings}
                  role="article"
                >
                  <Card interactive className="flex flex-col md:flex-row justify-between items-start gap-6 p-8 group">
                    <div className="flex flex-col gap-3 flex-grow max-w-[700px]">
                      <div className="flex items-center gap-3 text-xs text-text-secondary font-mono">
                        <time dateTime={post.date}>{post.date}</time>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                      
                      <h2 className="text-lg font-bold text-text-primary group-hover:text-accent transition-colors duration-150">
                        {post.title}
                      </h2>
                      
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {post.excerpt}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-2">
                        {post.tags.map((tag) => (
                          <span 
                            key={tag} 
                            className="text-[9px] bg-bg-primary text-text-secondary border border-border px-2 py-0.5 rounded font-mono"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="shrink-0 flex items-center gap-1.5 text-xs text-accent opacity-0 group-hover:opacity-100 transition-all duration-200 mt-1">
                      Read report <span className="transition-transform duration-150 group-hover:translate-x-1">→</span>
                    </div>
                  </Card>
                </motion.article>
              ))
            ) : (
              // Honestly framed empty/in-progress state as fallback (re-usable copy)
              <div className="text-center py-16 bg-surface border border-border border-dashed rounded-lg">
                <p className="text-sm text-text-secondary">
                  Our research publications are currently in preparation.
                </p>
                <p className="text-xs text-text-secondary/60 mt-1">
                  We publish findings on multi-agent consensus and graceful degradation protocols.
                </p>
              </div>
            )}
          </div>
        </div>
      </Section>
    </div>
  );
}
