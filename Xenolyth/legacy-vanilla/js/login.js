import {
  auth, db,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider, signInWithPopup,
  signOut, onAuthStateChanged,
  doc, setDoc, getDoc, updateDoc, serverTimestamp
} from './firebase-client.js';

// ── Founder email (always gets admin + beta access) ──────
const FOUNDER_EMAIL = 'xenolyth26@gmail.com';

document.addEventListener('DOMContentLoaded', () => {
  const form       = document.getElementById('login-form');
  const errorEl    = document.getElementById('auth-error');
  const googleBtn  = document.getElementById('google-btn');
  const toggleLink = document.getElementById('toggle-link');
  const toggleText = document.getElementById('toggle-text');
  const submitBtn  = document.getElementById('submit-btn');
  const titleEl    = document.getElementById('auth-title');
  const descEl     = document.getElementById('auth-desc');

  let isSignup = false;

  // ── Redirect if already logged in ────────────────────
  onAuthStateChanged(auth, (user) => {
    if (user) window.location.href = 'dashboard.html';
  });

  // ── Toggle signup / login ─────────────────────────────
  toggleLink?.addEventListener('click', (e) => {
    e.preventDefault();
    isSignup = !isSignup;
    hideError();
    if (isSignup) {
      titleEl.textContent   = 'Create Account';
      descEl.textContent    = 'Join Xenolyth. No approval required.';
      submitBtn.textContent = 'Create Account';
      toggleText.textContent = 'Already have an account?';
      toggleLink.textContent = 'Sign in';
    } else {
      titleEl.textContent   = 'Welcome Back';
      descEl.textContent    = 'Authenticate to access Xenolyth systems.';
      submitBtn.textContent = 'Sign In';
      toggleText.textContent = "Don't have an account?";
      toggleLink.textContent = 'Create one';
    }
  });

  // ── UI helpers ────────────────────────────────────────
  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.classList.add('show');
  }
  function hideError() {
    errorEl.classList.remove('show');
    errorEl.textContent = '';
  }
  function setLoading(on) {
    submitBtn.disabled = on;
    googleBtn.disabled = on;
    submitBtn.textContent = on ? 'Processing…' : (isSignup ? 'Create Account' : 'Sign In');
  }

  // ── Ensure user doc exists (no approval gate) ─────────
  async function ensureUserDoc(user) {
    const ref  = doc(db, 'users', user.uid);
    const snap = await getDoc(ref);

    const isFounder = user.email?.toLowerCase() === FOUNDER_EMAIL;

    if (!snap.exists()) {
      // New user — create document
      await setDoc(ref, {
        uid:        user.uid,
        email:      user.email,
        name:       user.displayName || '',
        role:       isFounder ? 'admin' : 'user',
        betaStatus: isFounder ? 'approved' : 'none',  // none | pending | approved | rejected
        createdAt:  serverTimestamp()
      });
    } else if (isFounder) {
      // Ensure founder always has correct privileges
      const data = snap.data();
      if (data.role !== 'admin' || data.betaStatus !== 'approved') {
        await setDoc(ref, { role: 'admin', betaStatus: 'approved' }, { merge: true });
      }
    }
  }

  // ── Handle successful auth ────────────────────────────
  async function handleAuthSuccess(user) {
    try {
      await ensureUserDoc(user);
      window.location.href = 'dashboard.html';
    } catch (err) {
      console.error('User doc error:', err);
      // Still redirect — doc creation is best-effort
      window.location.href = 'dashboard.html';
    }
  }

  // ── Email / password ──────────────────────────────────
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    const email    = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) { showError('Please enter your email and password.'); return; }
    if (password.length < 6) { showError('Password must be at least 6 characters.'); return; }

    setLoading(true);
    try {
      let cred;
      if (isSignup) {
        cred = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        cred = await signInWithEmailAndPassword(auth, email, password);
      }
      await handleAuthSuccess(cred.user);
    } catch (err) {
      console.error(err);
      const msgs = {
        'auth/email-already-in-use': 'This email is already registered. Sign in instead.',
        'auth/weak-password':        'Password must be at least 6 characters.',
        'auth/user-not-found':       'No account found with this email.',
        'auth/wrong-password':       'Incorrect password.',
        'auth/invalid-credential':   'Invalid email or password.',
        'auth/invalid-email':        'Please enter a valid email address.',
        'auth/too-many-requests':    'Too many attempts. Please wait and try again.',
      };
      showError(msgs[err.code] || `Error: ${err.message}`);
      setLoading(false);
    }
  });

  // ── Google sign-in ────────────────────────────────────
  googleBtn?.addEventListener('click', async () => {
    hideError();
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const cred     = await signInWithPopup(auth, provider);
      await handleAuthSuccess(cred.user);
    } catch (err) {
      console.error(err);
      if (err.code !== 'auth/popup-closed-by-user') {
        showError(`Google sign-in failed: ${err.message} (${err.code})`);
      }
      setLoading(false);
    }
  });
});
