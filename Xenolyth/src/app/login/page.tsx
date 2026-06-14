'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Section from '@/components/ui/Section';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { user, loading: authLoading } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const router = useRouter();

  // If already logged in, go straight to dashboard
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleAuthSuccess = () => {
    router.push('/dashboard');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setFormLoading(true);
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      handleAuthSuccess();
    } catch (err: any) {
      const msgs: Record<string, string> = {
        'auth/email-already-in-use': 'This email is already registered. Sign in instead.',
        'auth/weak-password': 'Password must be at least 6 characters.',
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/invalid-credential': 'Invalid email or password.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/too-many-requests': 'Too many attempts. Please wait and try again.',
      };
      setError(msgs[err.code] || `Error: ${err.message}`);
      setFormLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setFormLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      handleAuthSuccess();
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(`Google sign-in failed: ${err.message}`);
      }
      setFormLoading(false);
    }
  };

  return (
    <Section className="min-h-[80vh] flex items-center justify-center pt-32">
      {/* Back to Home */}
      <Link
        href="/"
        className="fixed top-5 left-6 flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors group z-50"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="group-hover:-translate-x-0.5 transition-transform"
        >
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
        Back to Home
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-2xl bg-surface border border-border shadow-2xl relative overflow-hidden"
      >
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-text-secondary text-sm">
            {isSignup ? 'Join Xenolyth. No approval required.' : 'Authenticate to access Xenolyth systems.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-bg-primary border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-bg-primary border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
              placeholder="••••••••"
            />
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            className="w-full justify-center mt-2"
            disabled={formLoading}
          >
            {formLoading ? 'Processing...' : (isSignup ? 'Create Account' : 'Sign In')}
          </Button>
        </form>

        <div className="mt-6 mb-6 flex items-center justify-center">
          <div className="w-full h-px bg-border"></div>
          <span className="px-4 text-xs text-text-secondary uppercase tracking-wider">OR</span>
          <div className="w-full h-px bg-border"></div>
        </div>

        <Button 
          type="button" 
          variant="secondary" 
          className="w-full justify-center text-text-primary hover:bg-surface border-border"
          onClick={handleGoogleAuth}
          disabled={formLoading}
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </Button>

        <p className="mt-8 text-center text-sm text-text-secondary">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{' '}
          <button 
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            className="text-accent hover:text-white transition-colors underline underline-offset-4"
          >
            {isSignup ? 'Sign in' : 'Create one'}
          </button>
        </p>
      </motion.div>
    </Section>
  );
}
