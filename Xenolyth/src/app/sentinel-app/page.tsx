'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Section from '@/components/ui/Section';

export default function SentinelAppPage() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      const isApproved = userData?.role === 'admin' || userData?.productBetaStatuses?.sentinel === 'approved';
      if (!user || !isApproved) {
        router.push('/dashboard');
      }
    }
  }, [user, userData, loading, router]);

  const isApproved = userData?.role === 'admin' || userData?.productBetaStatuses?.sentinel === 'approved';

  if (loading || !user || !isApproved) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="w-8 h-8 border-4 border-surface border-t-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Section className="min-h-screen flex flex-col items-center justify-center pt-32 pb-32">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-cyan-500/10 text-cyan-400 mb-6">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold mb-4 text-white">Sentinel Active</h1>
        <p className="text-text-secondary max-w-md mx-auto">
          Welcome to the Sentinel Beta. Your workspace is authenticated and secured by Xenolyth. Full dashboard interface is loading...
        </p>
      </div>
    </Section>
  );
}
