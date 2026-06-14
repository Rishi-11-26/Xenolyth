'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { motion } from 'framer-motion';
import { auth, db } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { doc, updateDoc, serverTimestamp, collection, addDoc } from 'firebase/firestore';
import Input from '@/components/ui/Input';

export default function DashboardPage() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  const [isBetaModalOpen, setIsBetaModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [betaForm, setBetaForm] = useState({ name: '', email: '', purpose: '' });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user || !userData) {
    return (
      <Section className="min-h-[80vh] flex items-center justify-center pt-32">
        <div className="w-8 h-8 border-4 border-surface border-t-accent rounded-full animate-spin"></div>
      </Section>
    );
  }

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const openBetaModal = (productSlug: string) => {
    setSelectedProduct(productSlug);
    setBetaForm({
      name: userData?.name || '',
      email: user?.email || '',
      purpose: ''
    });
    setIsBetaModalOpen(true);
  };

  const submitBetaRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedProduct) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        [`productBetaStatuses.${selectedProduct}`]: 'pending',
        betaStatus: 'pending', // global fallback support
        betaRequestedAt: serverTimestamp()
      });
      // Add to beta_requests collection
      await addDoc(collection(db, 'beta_requests'), {
        uid: user.uid,
        email: betaForm.email,
        name: betaForm.name,
        purpose: betaForm.purpose,
        product: selectedProduct,
        status: 'pending',
        requestedAt: serverTimestamp()
      });
      setIsBetaModalOpen(false);
      // Force reload to get updated status in context
      window.location.reload();
    } catch (err) {
      console.error("Error requesting beta:", err);
      alert("Failed to request beta. Please try again later.");
    }
  };

  const statusConfig = {
    'approved': { color: 'success', text: 'Beta Access Active', desc: 'You have full access to this product.', showLaunch: true },
    'pending': { color: 'warning', text: 'Application Under Review', desc: 'Your beta request is pending review. This status will be updated within 24 to 48 hours.', showLaunch: false },
    'rejected': { color: 'danger', text: 'Access Restricted', desc: 'Contact Xenolyth at xenolyth26@gmail.com for details.', showLaunch: false },
    'none': { color: 'neutral', text: 'Standard Access', desc: 'Apply for beta access to launch this product.', showLaunch: false }
  } as const;

  const productsList = [
    {
      slug: 'sentinel',
      name: 'Sentinel',
      description: 'Autonomous information monitoring and system orchestration.',
      link: '/products/sentinel',
      appLink: 'https://sentinelspace.vercel.app/',
      isComingSoon: false
    }
  ];

  return (
    <Section className="min-h-[80vh] pt-32">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-text-secondary">Welcome back, {userData.email}</p>
          </div>
          <div className="flex items-center gap-4">
            {userData.role === 'admin' && (
              <Link href="/admin">
                <Button variant="secondary" className="border-accent/30 text-accent">Admin Console</Button>
              </Link>
            )}
            <Button variant="secondary" onClick={handleSignOut}>Sign Out</Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {productsList.map((product) => {
            const status = userData.role === 'admin' 
              ? 'approved' 
              : (userData.productBetaStatuses?.[product.slug] || 'none');
            const conf = statusConfig[status] || statusConfig['none'];
            return (
              <motion.div 
                key={product.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 rounded-2xl bg-surface border border-border flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">{product.name}</h2>
                    {product.isComingSoon && (
                      <span className="text-[10px] bg-accent-argus/10 text-accent-argus border border-accent-argus/30 px-2 py-0.5 rounded font-mono uppercase">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-secondary mb-6 leading-relaxed">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-text-secondary text-sm">Status:</span>
                    <Badge variant={conf.color as any}>
                      {conf.text}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-text-secondary mb-8 leading-relaxed h-10">
                    {conf.desc}
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  {conf.showLaunch ? (
                    product.isComingSoon ? (
                      <Button variant="secondary" disabled className="w-full justify-center">
                        Coming Soon
                      </Button>
                    ) : (
                      <a href={product.appLink} target="_blank" rel="noopener noreferrer" className="w-full">
                        <Button variant="primary" className="w-full justify-center">
                          Launch {product.name}
                        </Button>
                      </a>
                    )
                  ) : status === 'none' ? (
                    <Button onClick={() => openBetaModal(product.slug)} variant="primary" className="w-full justify-center">
                      Request Beta Access
                    </Button>
                  ) : status === 'pending' ? (
                    <div className="flex flex-col gap-1.5 w-full text-center">
                      <Button disabled variant="secondary" className="w-full justify-center opacity-60">
                        Request Pending
                      </Button>
                      <span className="text-[10px] text-text-secondary/70">Will be updated in 24-48 hours</span>
                    </div>
                  ) : (
                    <Button disabled variant="secondary" className="w-full justify-center opacity-60">
                      Restricted
                    </Button>
                  )}
                  <Link href={product.link} className="w-full">
                    <Button variant="ghost" className="w-full justify-center border border-border/50 text-xs text-text-secondary hover:text-text-primary">
                      View Product Information
                    </Button>
                  </Link>
                </div>
              </motion.div>
            );
          })}

          {/* Coming Soon Teaser Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-8 rounded-2xl bg-surface border border-border border-dashed flex flex-col items-center justify-center text-center gap-4 min-h-[280px]"
          >
            <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center mb-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-secondary">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary mb-2">More Products Coming Soon</h2>
              <p className="text-sm text-text-secondary leading-relaxed max-w-[220px]">
                New operational software is currently in development. Stay tuned.
              </p>
            </div>
            <span className="text-[10px] border border-border px-3 py-1 rounded font-mono uppercase text-text-secondary tracking-widest mt-2">
              In Development
            </span>
          </motion.div>
        </div>
      </div>

      {/* Beta Request Modal */}
      {isBetaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-primary/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-[500px] bg-surface border border-border rounded-xl p-6 md:p-8 relative"
          >
            <h3 className="text-xl font-bold text-text-primary mb-2">Request Beta Access</h3>
            <p className="text-sm text-text-secondary mb-6 leading-relaxed">
              Please provide your details and intended operational use-case for {productsList.find(p => p.slug === selectedProduct)?.name}.
            </p>

            <form onSubmit={submitBetaRequest} className="flex flex-col gap-5">
              <Input
                label="Full Name"
                name="name"
                required
                value={betaForm.name}
                onChange={(e) => setBetaForm({ ...betaForm, name: e.target.value })}
              />
              <Input
                label="Work Email"
                name="email"
                type="email"
                required
                value={betaForm.email}
                onChange={(e) => setBetaForm({ ...betaForm, email: e.target.value })}
              />
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Intended Purpose
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Evaluating autonomous guardrails for production microservices..."
                  value={betaForm.purpose}
                  onChange={(e) => setBetaForm({ ...betaForm, purpose: e.target.value })}
                  className="w-full bg-bg-primary border border-border rounded-md px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all"
                />
              </div>

              <div className="flex gap-3 mt-4">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setIsBetaModalOpen(false)}
                  className="flex-1 justify-center border border-border/50"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="flex-1 justify-center"
                >
                  Submit Request
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </Section>
  );
}
