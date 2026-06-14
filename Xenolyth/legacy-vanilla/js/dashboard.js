import {
  auth, db,
  onAuthStateChanged, signOut,
  doc, getDoc, getDocs, addDoc, updateDoc, setDoc,
  collection, query, where, orderBy, serverTimestamp
} from './firebase-client.js';

const FOUNDER_EMAIL = 'xenolyth26@gmail.com';

function qs(id) { return document.getElementById(id); }

// ── Toast ─────────────────────────────────────────────────
function showToast(title, msg, duration = 4000) {
  const toast = qs('notif-toast');
  if (!toast) return;
  qs('toast-title').textContent = title;
  qs('toast-msg').textContent   = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

// ── Time helpers ─────────────────────────────────────────
function timeAgo(ts) {
  if (!ts) return 'Just now';
  const d    = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
  const diff = Math.floor((Date.now() - d) / 1000);
  if (diff < 60)   return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ── Beta status badge ─────────────────────────────────────
function renderStatusBadge(status, isAdmin) {
  const navBadge  = qs('nav-status-badge');
  const topBadge  = qs('beta-status-badge');

  const cfgs = {
    approved: { cls: 'badge badge--cyan',   dot: true,  label: 'Beta Access Active' },
    pending:  { cls: 'badge badge--yellow', dot: false, label: 'Application Under Review' },
    rejected: { cls: 'badge badge--red',    dot: false, label: 'Contact Xenolyth' },
    none:     { cls: 'badge',               dot: false, label: 'Standard Access', style: 'background:transparent;border:1px solid var(--border);color:var(--text-lo);' },
  };

  const cfg = isAdmin ? { cls: 'badge badge--red', dot: true, label: 'Admin' } : (cfgs[status] || cfgs.none);
  const dotHtml = cfg.dot ? '<span class="badge__dot"></span>' : '';
  const html = `${dotHtml}${cfg.label}`;

  [navBadge, topBadge].forEach(el => {
    if (!el) return;
    el.className = cfg.cls;
    el.innerHTML = html;
    if (cfg.style) el.style.cssText = cfg.style;
    el.style.display = 'inline-flex';
  });

  const accountStatusEl = qs('account-status');
  if (accountStatusEl) {
    const colors = { approved: 'var(--cyan)', pending: '#ffbd2e', rejected: '#ff6b6b', none: 'var(--text-lo)' };
    accountStatusEl.textContent = isAdmin ? 'Admin (Full Access)' : { approved: 'Approved', pending: 'Under Review', rejected: 'Rejected', none: 'No Beta Requested' }[status] || status;
    accountStatusEl.style.color = isAdmin ? '#ff6b6b' : (colors[status] || 'var(--text-lo)');
  }
}

// ── Sentinel Card ─────────────────────────────────────────
function renderSentinelCard(betaStatus, isAdmin, onRequest) {
  const card = qs('sentinel-card');
  if (!card) return;

  const canAccess = isAdmin || betaStatus === 'approved';

  // Top badges
  card.querySelector('.pc-icon').style.background = canAccess ? 'var(--cyan-15)' : 'var(--surface)';
  card.querySelector('.pc-icon').style.color      = canAccess ? 'var(--cyan)'    : 'var(--text-lo)';

  const metaAccess = card.querySelector('#sentinel-meta-access');
  const statusDot  = card.querySelector('#sentinel-status-dot');
  const statusText = card.querySelector('#sentinel-status-text');
  const actionArea = card.querySelector('#sentinel-action');

  if (metaAccess) metaAccess.textContent = canAccess ? 'Beta Approved' : (betaStatus === 'pending' ? 'Pending Review' : betaStatus === 'rejected' ? 'Rejected' : 'Requires Approval');

  if (statusDot && statusText) {
    if (canAccess) {
      statusDot.className = 'status-dot status-dot--live';
      statusText.textContent = 'LIVE';
      statusText.style.color = 'var(--cyan)';
    } else {
      statusDot.className = 'status-dot status-dot--locked';
      statusText.textContent = 'RESTRICTED';
      statusText.style.color = 'var(--text-lo)';
    }
  }

  if (!actionArea) return;
  actionArea.innerHTML = '';

  if (canAccess) {
    actionArea.innerHTML = `<a href="sentinel-app.html" class="btn btn--primary" style="width:100%;justify-content:center;">Launch Sentinel</a>`;
  } else if (betaStatus === 'pending') {
    actionArea.innerHTML = `
      <div style="background:rgba(255,189,46,.06);border:1px solid rgba(255,189,46,.15);border-radius:.5rem;padding:.875rem 1rem;text-align:center;">
        <div style="font-size:.75rem;color:#ffbd2e;font-weight:600;margin-bottom:.25rem;">⏳ Application Under Review</div>
        <div style="font-size:.75rem;color:var(--text-lo);">You will be notified when a decision is made.</div>
      </div>`;
  } else if (betaStatus === 'rejected') {
    actionArea.innerHTML = `
      <div style="background:rgba(255,107,107,.06);border:1px solid rgba(255,107,107,.15);border-radius:.5rem;padding:.875rem 1rem;text-align:center;margin-bottom:.75rem;">
        <div style="font-size:.75rem;color:#ff6b6b;font-weight:600;margin-bottom:.25rem;">Application Not Approved</div>
        <div style="font-size:.75rem;color:var(--text-lo);">Contact Xenolyth for further information.</div>
      </div>
      <button id="reapply-btn" class="btn btn--ghost btn--sm" style="width:100%;justify-content:center;">Reapply for Beta Access</button>`;
    qs('reapply-btn')?.addEventListener('click', onRequest);
  } else {
    // none — never requested
    actionArea.innerHTML = `<button id="request-beta-btn" class="btn btn--primary" style="width:100%;justify-content:center;">Request Beta Access</button>`;
    qs('request-beta-btn')?.addEventListener('click', onRequest);
  }
}

// ── Beta Request Modal ────────────────────────────────────
function showRequestModal(user, onSuccess) {
  // Remove any existing
  document.getElementById('beta-modal')?.remove();

  const overlay = document.createElement('div');
  overlay.id    = 'beta-modal';
  overlay.style.cssText = `
    position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;
    background:rgba(0,0,0,.7);backdrop-filter:blur(8px);padding:1rem;animation:modalFadeIn .25s ease;
  `;
  overlay.innerHTML = `
    <style>@keyframes modalFadeIn{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}</style>
    <div style="background:var(--card);border:1px solid var(--border-hi);border-radius:1rem;padding:2rem;max-width:460px;width:100%;position:relative;">
      <button id="modal-close" style="position:absolute;top:1rem;right:1rem;background:transparent;border:none;color:var(--text-lo);font-size:1.25rem;cursor:pointer;line-height:1;">✕</button>
      <div style="margin-bottom:1.5rem;">
        <div class="eyebrow">Sentinel Private Beta</div>
        <h2 style="font-size:1.25rem;font-weight:700;color:var(--text-hi);margin:.25rem 0 .5rem;">Request Beta Access</h2>
        <p style="font-size:.8125rem;color:var(--text-lo);line-height:1.6;">Tell us about yourself. The admin team will review your request.</p>
      </div>
      <div id="modal-error" style="display:none;background:rgba(255,107,107,.08);border:1px solid rgba(255,107,107,.2);border-radius:.5rem;color:#ff6b6b;font-size:.8125rem;padding:.75rem;margin-bottom:1rem;"></div>
      <form id="beta-request-form" style="display:flex;flex-direction:column;gap:1rem;">
        <div>
          <label style="font-size:.7rem;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:var(--text-lo);display:block;margin-bottom:.5rem;">Your Role / Background</label>
          <input id="br-role" type="text" placeholder="e.g. Data Scientist, Aerospace Engineer…" style="width:100%;background:rgba(0,0,0,.3);border:1px solid var(--border-hi);border-radius:.5rem;padding:.75rem 1rem;color:var(--text-hi);font-family:inherit;font-size:.9rem;" required />
        </div>
        <div>
          <label style="font-size:.7rem;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:var(--text-lo);display:block;margin-bottom:.5rem;">Why do you want access to Sentinel?</label>
          <textarea id="br-reason" rows="3" placeholder="Describe your use case…" style="width:100%;background:rgba(0,0,0,.3);border:1px solid var(--border-hi);border-radius:.5rem;padding:.75rem 1rem;color:var(--text-hi);font-family:inherit;font-size:.9rem;resize:vertical;" required></textarea>
        </div>
        <button type="submit" id="modal-submit" class="btn btn--primary" style="width:100%;justify-content:center;">Submit Request</button>
      </form>
    </div>
  `;

  document.body.appendChild(overlay);

  document.getElementById('modal-close')?.addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

  document.getElementById('beta-request-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const role   = document.getElementById('br-role').value.trim();
    const reason = document.getElementById('br-reason').value.trim();
    const errEl  = document.getElementById('modal-error');
    const btn    = document.getElementById('modal-submit');

    if (!role || !reason) { errEl.textContent = 'Please fill in all fields.'; errEl.style.display = 'block'; return; }

    btn.disabled = true;
    btn.textContent = 'Submitting…';
    errEl.style.display = 'none';

    try {
      // Check for duplicate pending requests
      const q = query(
        collection(db, 'beta_requests'),
        where('uid', '==', user.uid),
        where('status', '==', 'pending')
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        errEl.textContent = 'Beta request already submitted.';
        errEl.style.display = 'block';
        btn.disabled = false;
        btn.textContent = 'Submit Request';
        return;
      }

      // Create beta_request entry
      await addDoc(collection(db, 'beta_requests'), {
        uid:         user.uid,
        email:       user.email,
        name:        user.displayName || user.email.split('@')[0],
        role,
        reason,
        status:      'pending',
        requestedAt: serverTimestamp()
      });

      // Update user doc betaStatus with setDoc (resilient merge)
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        betaStatus: 'pending',
        updatedAt: serverTimestamp()
      }, { merge: true });

      overlay.remove();
      onSuccess();
    } catch (err) {
      console.error('Beta request submission failed error details:', {
        code: err.code,
        message: err.message,
        stack: err.stack,
        error: err
      });
      errEl.textContent = `Failed to submit request: ${err.message || err}`;
      errEl.style.display = 'block';
      btn.disabled = false;
      btn.textContent = 'Submit Request';
    }
  });
}

// ── Notifications ─────────────────────────────────────────
function renderNotifications(notifs) {
  const list     = qs('notifs-list');
  const countEl  = qs('notif-count');
  if (!list) return;

  if (countEl) countEl.textContent = `${notifs.length} alert${notifs.length !== 1 ? 's' : ''}`;

  if (notifs.length === 0) {
    list.innerHTML = '<div class="notifs-empty">No notifications yet.</div>';
    return;
  }

  list.innerHTML = '';
  notifs.slice(0, 6).forEach(n => {
    const div = document.createElement('div');
    div.className = 'notif-item';
    div.innerHTML = `
      <div class="notif-dot"></div>
      <div>
        <div class="notif-text">${n.message}</div>
        <div class="notif-time">${timeAgo(n.timestamp)}</div>
      </div>`;
    list.appendChild(div);
  });
}

// ── Stats ─────────────────────────────────────────────────
async function loadStats(user) {
  // Watchlist count
  try {
    const wlSnap = await getDocs(query(collection(db, 'watchlists'), where('uid', '==', user.uid)));
    const el = qs('stat-watchlist');
    if (el) el.textContent = wlSnap.size;
  } catch(e) {}
}

// ── Main ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const loader = qs('loader');

  function hideLoader() {
    if (!loader) return;
    loader.style.opacity = '0';
    setTimeout(() => loader.style.display = 'none', 400);
  }

  function handleLogout() {
    signOut(auth).then(() => { window.location.href = 'index.html'; });
  }
  qs('logout-btn')?.addEventListener('click', handleLogout);
  qs('logout-btn-2')?.addEventListener('click', handleLogout);

  onAuthStateChanged(auth, async (user) => {
    if (!user) { window.location.href = 'login.html'; return; }

    try {
      const userSnap = await getDoc(doc(db, 'users', user.uid));
      const userData = userSnap.exists() ? userSnap.data() : {};

      const isAdmin = userData.role === 'admin' || user.email?.toLowerCase() === FOUNDER_EMAIL;
      const name    = userData.name || user.displayName || user.email.split('@')[0];

      // ── Identity ──
      if (qs('user-name'))    qs('user-name').textContent    = name;
      if (qs('account-name')) qs('account-name').textContent = name;
      if (qs('account-email'))qs('account-email').textContent= user.email;
      if (qs('account-role')) qs('account-role').textContent = isAdmin ? 'admin' : (userData.role || 'user');
      if (qs('user-avatar'))  qs('user-avatar').textContent  = name.charAt(0).toUpperCase();

      // Default fallback date
      if (userData.createdAt && qs('account-since')) {
        qs('account-since').textContent = new Date(userData.createdAt.seconds * 1000)
          .toLocaleDateString('en-IN', { year: 'numeric', month: 'short' });
      }

      // ── Fetch Beta Request by UID ──
      let betaStatus = 'none';
      let requestId = '';
      let requestedAt = null;

      try {
        const brSnap = await getDocs(query(collection(db, 'beta_requests'), where('uid', '==', user.uid)));
        if (!brSnap.empty) {
          const reqs = brSnap.docs.map(d => ({ _docId: d.id, ...d.data() }));
          // Sort descending in memory
          reqs.sort((a, b) => {
            const tA = a.requestedAt?.seconds || (a.appliedAt?.seconds ? a.appliedAt.seconds : 0);
            const tB = b.requestedAt?.seconds || (b.appliedAt?.seconds ? b.appliedAt.seconds : 0);
            return tB - tA;
          });

          const latestReq = reqs[0];
          betaStatus = latestReq.status || 'pending';
          requestId  = latestReq.requestId || latestReq._docId.slice(0, 8).toUpperCase();
          requestedAt = latestReq.requestedAt || latestReq.appliedAt;
        }
      } catch (brErr) {
        console.error('Error fetching beta request document details:', {
          code: brErr.code,
          message: brErr.message,
          stack: brErr.stack,
          error: brErr
        });
      }

      // Admin role overrides to approved access
      if (isAdmin) {
        betaStatus = 'approved';
      }

      // Display Request ID
      if (qs('account-app-id')) {
        qs('account-app-id').textContent = requestId ? `BRQ-${requestId}` : '—';
      }

      // Display submission date in place of member since if request exists
      if (requestedAt && qs('account-since')) {
        qs('account-since').textContent = new Date(requestedAt.seconds * 1000)
          .toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
      }

      // ── Admin link ──
      if (isAdmin && qs('admin-link-wrapper')) {
        qs('admin-link-wrapper').style.display = 'block';
      }

      // ── Stats ──
      if (qs('stat-products')) qs('stat-products').textContent = (isAdmin || betaStatus === 'approved') ? '1' : '0';
      if (qs('stat-beta'))     qs('stat-beta').textContent     = (isAdmin || betaStatus === 'approved') ? '1' : '0';
      await loadStats(user);

      // ── Status badge ──
      renderStatusBadge(betaStatus, isAdmin);

      // ── Sentinel card ──
      renderSentinelCard(betaStatus, isAdmin, () => {
        showRequestModal(user, async () => {
          showToast('Request Submitted', 'Your Sentinel beta request is under review.', 5000);
          
          // Re-render card immediately to pending state
          renderSentinelCard('pending', false, () => {});
          renderStatusBadge('pending', false);
          
          if (qs('stat-products')) qs('stat-products').textContent = '0';
          if (qs('stat-beta'))     qs('stat-beta').textContent     = '0';
          
          // Try to update Request ID dynamically after successful submission
          try {
            const updatedSnap = await getDocs(query(collection(db, 'beta_requests'), where('uid', '==', user.uid)));
            if (!updatedSnap.empty && qs('account-app-id')) {
              const uReq = updatedSnap.docs[0].data();
              const uId = uReq.requestId || updatedSnap.docs[0].id.slice(0, 8).toUpperCase();
              qs('account-app-id').textContent = `BRQ-${uId}`;
            }
          } catch(e) {}
        });
      });

      // ── Notifications (personal — filtered by uid) ──
      let notifs = [];
      try {
        const nSnap = await getDocs(
          query(
            collection(db, 'system_notifications'),
            where('uid', '==', user.uid)
          )
        );
        notifs = nSnap.docs
          .map(d => d.data())
          .sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
      } catch(e) {
        console.warn('Notifications fetch error:', e.message);
      }
      renderNotifications(notifs);

      // ── Status-aware welcome toast ──
      if (isAdmin) {
        showToast('Admin Access', `Welcome back, ${name.split(' ')[0]}. Admin console is active.`, 3500);
      } else if (betaStatus === 'approved') {
        showToast('✓ Beta Access Active', 'Sentinel is unlocked. You can launch it from your dashboard.', 5000);
      } else if (betaStatus === 'pending') {
        showToast('⏳ Request Pending', 'Your Sentinel application is under review. We’ll notify you soon.', 4500);
      } else if (betaStatus === 'rejected') {
        showToast('Application Status', 'Your beta request was declined. Contact Xenolyth for details.', 5000);
      } else {
        showToast('Access Granted', `Welcome back, ${name.split(' ')[0]}.`, 3500);
      }

      hideLoader();
    } catch (err) {
      console.error('Dashboard error:', err);
      hideLoader();
    }
  });
});
