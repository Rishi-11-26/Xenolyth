import { auth, db, onAuthStateChanged, collection, addDoc, doc, updateDoc, setDoc, query, where, getDocs, serverTimestamp } from './firebase-client.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('beta-form');
  const success = document.getElementById('beta-success');
  const loginGate = document.getElementById('beta-login-gate');
  const submitBtn = form?.querySelector('button[type="submit"]');

  let currentUser = null;

  if (!form) return;

  // ── Auth-gate the form ────────────────────────────────
  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser = user;
      form.style.display = '';
      if (loginGate) loginGate.style.display = 'none';

      // Pre-fill user data
      const nameInput = document.getElementById('f-name');
      const emailInput = document.getElementById('f-email');

      if (nameInput && !nameInput.value) {
        nameInput.value = user.displayName || '';
      }
      if (emailInput) {
        emailInput.value = user.email || '';
        emailInput.readOnly = true; // Email is locked to account
      }
    } else {
      currentUser = null;
      form.style.display = 'none';
      if (loginGate) loginGate.style.display = 'block';
    }
  });

  // ── Handle form submission ────────────────────────────
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!currentUser) {
      showFormError('Please sign in to submit a request.');
      return;
    }

    const name     = document.getElementById('f-name')?.value.trim();
    const email    = document.getElementById('f-email')?.value.trim();
    const role     = document.getElementById('f-role')?.value;
    const interest = document.getElementById('f-interest')?.value;
    const mission  = document.getElementById('f-mission')?.value.trim();

    if (!name || !email || !role || !interest || !mission) {
      showFormError('Please complete all required fields.');
      return;
    }

    // Generate readable request ID for reference
    const requestId = Date.now().toString(36).toUpperCase().slice(-8);

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';

      // Check for duplicate pending requests
      const q = query(
        collection(db, 'beta_requests'),
        where('uid', '==', currentUser.uid),
        where('status', '==', 'pending')
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        showFormError('Beta request already submitted.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Application';
        return;
      }

      // Save to Firebase Firestore under beta_requests collection
      await addDoc(collection(db, 'beta_requests'), {
        uid: currentUser.uid,
        email: currentUser.email,
        name,
        role,
        interest,
        mission,
        reason: mission, // For admin.html details compatibility
        requestId,
        status: 'pending',
        requestedAt: serverTimestamp()
      });

      // Update the user document to reflect pending beta status using setDoc (resilient merge)
      await setDoc(doc(db, 'users', currentUser.uid), {
        uid: currentUser.uid,
        email: currentUser.email,
        betaStatus: 'pending',
        updatedAt: serverTimestamp()
      }, { merge: true });

      // Show success
      form.style.display = 'none';
      clearFormError();

      if (success) {
        const idEl = success.querySelector('.form-success__id-value');
        if (idEl) idEl.textContent = `BRQ-${requestId}`;
        success.classList.add('show');
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error("Error submitting beta request details:", {
        code: err.code,
        message: err.message,
        stack: err.stack,
        error: err
      });
      showFormError(`An error occurred: ${err.message || err}`);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Application';
    }
  });

  function showFormError(msg) {
    clearFormError();
    const err = document.createElement('p');
    err.id = 'form-error-msg';
    err.style.cssText = 'font-family:var(--font-mono);font-size:.8125rem;color:#ff6b6b;text-align:center;padding:.5rem;';
    err.textContent = msg;
    form.prepend(err);
  }

  function clearFormError() {
    document.getElementById('form-error-msg')?.remove();
  }
});
