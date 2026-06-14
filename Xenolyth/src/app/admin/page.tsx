'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { auth, db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

export default function AdminPage() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [loadingReqs, setLoadingReqs] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'processed'>('pending');

  useEffect(() => {
    if (!loading) {
      if (!user || userData?.role !== 'admin') {
        router.push('/dashboard');
      } else {
        fetchRequests();
      }
    }
  }, [user, userData, loading, router]);

  const fetchRequests = async () => {
    try {
      const snap = await getDocs(collection(db, 'beta_requests'));
      const reqs: any[] = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      reqs.sort((a, b) => {
        const timeA = a.requestedAt?.seconds || 0;
        const timeB = b.requestedAt?.seconds || 0;
        return timeB - timeA; // newest first
      });
      setRequests(reqs);
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoadingReqs(false);
    }
  };

  const handleAction = async (req: any, action: 'approved' | 'rejected') => {
    try {
      const targetProduct = req.product || 'sentinel';
      // update request doc
      await updateDoc(doc(db, 'beta_requests', req.id), { status: action });
      // update user doc
      await updateDoc(doc(db, 'users', req.uid), { 
        [`productBetaStatuses.${targetProduct}`]: action,
        betaStatus: action // legacy/fallback
      });

      // Send email if approved
      if (action === 'approved' && req.email) {
        try {
          await fetch('/api/send-approval-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: req.email,
              name: req.name || 'User',
              product: targetProduct
            }),
          });
        } catch (emailErr) {
          console.error("Error triggering approval email:", emailErr);
        }
      }

      // refresh UI
      fetchRequests();
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status. Check permissions.");
    }
  };

  if (loading || !user || userData?.role !== 'admin') {
    return (
      <Section className="min-h-[80vh] flex items-center justify-center pt-32">
        <div className="w-8 h-8 border-4 border-surface border-t-accent rounded-full animate-spin"></div>
      </Section>
    );
  }

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const processedRequests = requests.filter(r => r.status === 'approved' || r.status === 'rejected');

  const getProductName = (slug: string) => {
    if (slug === 'sentinel') return 'Sentinel';
    if (slug === 'argus') return 'Argus';
    return 'Sentinel'; // default legacy fallback
  };

  return (
    <Section className="min-h-[80vh] pt-32">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-accent">Admin Console</h1>
            <p className="text-text-secondary">Manage Beta Requests</p>
          </div>
          <Link href="/dashboard">
            <Button variant="secondary">Back to Dashboard</Button>
          </Link>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 mb-6 border-b border-border pb-px">
          <button
            onClick={() => setActiveTab('pending')}
            className={`py-3 px-6 text-sm font-medium border-b-2 transition-all ${
              activeTab === 'pending'
                ? 'border-accent text-accent'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            Pending Requests ({pendingRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('processed')}
            className={`py-3 px-6 text-sm font-medium border-b-2 transition-all ${
              activeTab === 'processed'
                ? 'border-accent text-accent'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            Approved / Processed ({processedRequests.length})
          </button>
        </div>

        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-sm text-text-secondary bg-surface/50">
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">Product</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Requested</th>
                  {activeTab === 'pending' && <th className="p-4 font-medium">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {loadingReqs ? (
                  <tr><td colSpan={5} className="p-8 text-center text-text-secondary">Loading...</td></tr>
                ) : activeTab === 'pending' ? (
                  pendingRequests.length === 0 ? (
                    <tr><td colSpan={5} className="p-8 text-center text-text-secondary">No pending requests.</td></tr>
                  ) : (
                    pendingRequests.map(req => (
                      <tr key={req.id} className="border-b border-border hover:bg-bg-secondary/30 transition-colors">
                        <td className="p-4 font-mono text-sm">{req.email}</td>
                        <td className="p-4 text-sm font-semibold text-accent">{getProductName(req.product)}</td>
                        <td className="p-4">
                          <Badge variant="warning">
                            {req.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm text-text-secondary">
                          {req.requestedAt ? new Date(req.requestedAt.seconds * 1000).toLocaleDateString() : 'Unknown'}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button onClick={() => handleAction(req, 'approved')} variant="primary" className="py-1 px-3 text-sm">Approve</Button>
                            <Button onClick={() => handleAction(req, 'rejected')} variant="secondary" className="py-1 px-3 text-sm text-red-400 border-red-500/30 hover:bg-red-500/10">Reject</Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )
                ) : (
                  processedRequests.length === 0 ? (
                    <tr><td colSpan={4} className="p-8 text-center text-text-secondary">No processed requests.</td></tr>
                  ) : (
                    processedRequests.map(req => (
                      <tr key={req.id} className="border-b border-border hover:bg-bg-secondary/30 transition-colors">
                        <td className="p-4 font-mono text-sm">{req.email}</td>
                        <td className="p-4 text-sm font-semibold text-accent">{getProductName(req.product)}</td>
                        <td className="p-4">
                          <Badge variant={req.status === 'approved' ? 'success' : 'danger'}>
                            {req.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm text-text-secondary">
                          {req.requestedAt ? new Date(req.requestedAt.seconds * 1000).toLocaleDateString() : 'Unknown'}
                        </td>
                      </tr>
                    ))
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Section>
  );
}
