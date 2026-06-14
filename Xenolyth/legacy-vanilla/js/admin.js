import {
  auth, db,
  onAuthStateChanged,
  doc, getDoc, collection, getDocs,
  updateDoc, deleteDoc, addDoc, setDoc,
  query, orderBy, where, serverTimestamp
} from './firebase-client.js';

const FOUNDER_EMAIL = 'xenolyth26@gmail.com';

document.addEventListener('DOMContentLoaded', () => {
  const loader    = document.getElementById('loader');
  const tbody     = document.getElementById('req-table-body');
  const filters   = document.querySelectorAll('.filter-tab');
  const searchEl  = document.getElementById('search-input');
  const statsEls  = { total: qs('stat-total'), pending: qs('stat-pending'), approved: qs('stat-approved'), rejected: qs('stat-rejected') };

  let allRequests = [];
  let currentFilter = 'all';
  let searchTerm    = '';

  function qs(id) { return document.getElementById(id); }

  // ── Permission error banner ───────────────────────────
  function showPermissionBanner() {
    if (document.getElementById('perm-banner')) return; // already shown
    const banner = document.createElement('div');
    banner.id = 'perm-banner';
    banner.style.cssText = [
      'position:sticky;top:0;z-index:200;background:rgba(255,80,80,.08)',
      'border:1px solid rgba(255,80,80,.25);border-radius:.625rem',
      'padding:1rem 1.25rem;margin-bottom:1.5rem',
      'display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap'
    ].join(';');
    banner.innerHTML = `
      <div>
        <div style="font-weight:700;color:#ff6b6b;margin-bottom:.25rem;">⚠ Firestore Security Rules not deployed</div>
        <div style="font-size:.8125rem;color:var(--text-lo);line-height:1.5;">
          The live rules on Firebase still block admin writes.
          Deploy the updated rules to fix Approve / Reject.
        </div>
      </div>
      <div style="display:flex;gap:.625rem;flex-shrink:0;">
        <a href="deploy-rules.html" target="_blank"
           style="padding:.5rem 1rem;background:linear-gradient(135deg,#00d4ff,#0099bb);color:#000;font-weight:700;font-size:.8125rem;border-radius:.375rem;text-decoration:none;">
          Deploy Rules →
        </a>
        <button onclick="this.closest('#perm-banner').remove()"
          style="background:transparent;border:1px solid #3a4555;color:#7a8799;padding:.5rem .875rem;border-radius:.375rem;cursor:pointer;font-size:.8125rem;">
          Dismiss
        </button>
      </div>`;
    const main = document.querySelector('main') || document.body;
    main.prepend(banner);
  }

  // ── Auth guard — admin only ───────────────────────────
  onAuthStateChanged(auth, async (user) => {
    if (!user) { window.location.href = 'login.html'; return; }

    const isFounder = user.email?.toLowerCase() === FOUNDER_EMAIL;
    const userSnap  = await getDoc(doc(db, 'users', user.uid));
    const userData  = userSnap.exists() ? userSnap.data() : {};

    if (!isFounder && userData.role !== 'admin') {
      window.location.href = 'dashboard.html';
      return;
    }

    await loadRequests();
    hideLoader();
  });

  function hideLoader() {
    if (!loader) return;
    loader.style.opacity = '0';
    setTimeout(() => loader.style.display = 'none', 400);
  }

  // ── Load beta_requests ────────────────────────────────
  async function loadRequests() {
    try {
      console.log('Fetching beta requests from Firestore...');
      const q    = collection(db, 'beta_requests');
      const snap = await getDocs(q);
      allRequests = snap.docs.map(d => ({ _docId: d.id, ...d.data() }));

      // Sort in memory to avoid Firestore index dependencies
      allRequests.sort((a, b) => {
        const timeA = a.requestedAt?.seconds || (a.appliedAt?.seconds ? a.appliedAt.seconds : 0);
        const timeB = b.requestedAt?.seconds || (b.appliedAt?.seconds ? b.appliedAt.seconds : 0);
        return timeB - timeA;
      });

      console.log(`Successfully loaded ${allRequests.length} requests.`);
      updateStats();
      renderTable();
    } catch (err) {
      console.error('Firestore load error details:', {
        code: err.code,
        message: err.message,
        stack: err.stack,
        error: err
      });
      if (tbody) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:2.5rem;color:#ff6b6b;">
          <strong>Failed to load:</strong> ${err.message || err}<br>
          <span style="font-size:0.8rem;color:var(--text-lo);display:block;margin-top:.5rem;">Check Firestore Security Rules or verify if database is initialized.</span>
        </td></tr>`;
      }
    }
  }

  // ── Stats ─────────────────────────────────────────────
  function updateStats() {
    if (statsEls.total)    statsEls.total.textContent    = allRequests.length;
    if (statsEls.pending)  statsEls.pending.textContent  = allRequests.filter(r => (r.status || 'pending') === 'pending').length;
    if (statsEls.approved) statsEls.approved.textContent = allRequests.filter(r => r.status === 'approved').length;
    if (statsEls.rejected) statsEls.rejected.textContent = allRequests.filter(r => r.status === 'rejected').length;
  }

  // ── Render table ──────────────────────────────────────
  function renderTable() {
    if (!tbody) return;
    const term = searchTerm.toLowerCase();

    const filtered = allRequests.filter(r => {
      const status = r.status || 'pending';
      const matchFilter = currentFilter === 'all' || status === currentFilter;
      const matchSearch = !term ||
        r.name?.toLowerCase().includes(term)  ||
        r.email?.toLowerCase().includes(term) ||
        r._docId?.toLowerCase().includes(term);
      return matchFilter && matchSearch;
    });

    tbody.innerHTML = '';

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:2.5rem;color:var(--text-lo);">No requests found.</td></tr>`;
      return;
    }

    filtered.forEach(req => {
      const status = req.status || 'pending';
      const name = req.name || '—';
      const email = req.email || '—';
      const role = req.role || '—';
      const reason = req.reason || req.mission || '—';
      const uid = req.uid || '';

      const ts = req.requestedAt || req.appliedAt;
      const date = ts
        ? new Date(ts.seconds * 1000).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })
        : '—';

      let actions = '';
      if (status === 'pending') {
        actions = `
          <button class="action-btn action-btn--approve" data-id="${req._docId}" data-uid="${uid}" data-action="approved">✓ Approve</button>
          <button class="action-btn action-btn--reject"  data-id="${req._docId}" data-uid="${uid}" data-action="rejected">✕ Reject</button>`;
      } else if (status === 'approved') {
        actions = `
          <button class="action-btn action-btn--undo"   data-id="${req._docId}" data-uid="${uid}" data-action="pending">↩ Revoke</button>
          <button class="action-btn action-btn--delete" data-id="${req._docId}" data-uid="${uid}" data-action="delete">Delete</button>`;
      } else {
        actions = `
          <button class="action-btn action-btn--approve" data-id="${req._docId}" data-uid="${uid}" data-action="approved">✓ Re-approve</button>
          <button class="action-btn action-btn--delete"  data-id="${req._docId}" data-uid="${uid}" data-action="delete">Delete</button>`;
      }

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div style="font-weight:600;color:var(--text-hi);">${name}</div>
          <div style="font-size:.75rem;color:var(--text-lo);font-family:var(--font-mono);">${email}</div>
        </td>
        <td><span class="app-id-pill">${req._docId.slice(0,10).toUpperCase()}</span></td>
        <td style="font-size:.8125rem;">${role}</td>
        <td style="max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:.8125rem;color:var(--text-lo);" title="${reason}">${reason}</td>
        <td style="font-size:.8125rem;white-space:nowrap;">${date}</td>
        <td><span class="status-badge ${status}">${status}</span></td>
        <td>
          <div style="display:flex;gap:.375rem;justify-content:flex-end;flex-wrap:wrap;">${actions}</div>
        </td>`;
      tbody.appendChild(tr);
    });

    // Attach listeners
    tbody.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const { id, uid, action } = btn.dataset;
        if (action === 'delete') deleteRequest(id, uid);
        else updateStatus(id, uid, action);
      });
    });
  }

  // ── Update status ─────────────────────────────────────
  async function updateStatus(docId, userUid, newStatus) {
    const label = newStatus === 'pending' ? 'revoke' : `mark as ${newStatus}`;
    if (!confirm(`Are you sure you want to ${label} this request?`)) return;
    try {
      // Update beta_request doc
      await updateDoc(doc(db, 'beta_requests', docId), { status: newStatus, reviewedAt: serverTimestamp() });

      // Sync betaStatus on the user doc using setDoc (resilient merge)
      if (userUid) {
        await setDoc(doc(db, 'users', userUid), { betaStatus: newStatus, updatedAt: serverTimestamp() }, { merge: true });
      }

      // Write a personal system notification for the user
      const notifMessages = {
        approved: 'Your Sentinel beta request has been approved. You can now launch Sentinel from your dashboard.',
        rejected: 'Your beta request was declined. Please contact Xenolyth for further information.',
        pending:  'Your Sentinel beta access has been revoked and returned to pending review.'
      };
      const notifMsg = notifMessages[newStatus];
      if (notifMsg && userUid) {
        try {
          await addDoc(collection(db, 'system_notifications'), {
            uid:       userUid,
            message:   notifMsg,
            type:      newStatus,
            timestamp: serverTimestamp(),
            read:      false
          });
        } catch (nErr) {
          console.warn('Could not write system notification:', nErr.message);
        }
      }

      const idx = allRequests.findIndex(r => r._docId === docId);
      if (idx > -1) allRequests[idx].status = newStatus;
      updateStats();
      renderTable();

      // Success feedback — flash the row
      const rows = tbody?.querySelectorAll('tr');
      rows?.forEach(tr => {
        if (tr.innerHTML.includes(docId.slice(0, 10).toUpperCase())) {
          tr.style.transition = 'background .4s';
          tr.style.background = 'rgba(0,212,255,.06)';
          setTimeout(() => tr.style.background = '', 1500);
        }
      });
    } catch (err) {
      console.error('Update error details:', {
        code: err.code,
        message: err.message,
        stack: err.stack,
        error: err
      });
      if (err.code === 'permission-denied' || err.message?.includes('permission')) {
        showPermissionBanner();
      } else {
        alert(`Failed to update: ${err.message || err}`);
      }
    }
  }

  // ── Delete ────────────────────────────────────────────
  async function deleteRequest(docId, userUid) {
    if (!confirm('Permanently delete this beta request? This cannot be undone.')) return;
    try {
      await deleteDoc(doc(db, 'beta_requests', docId));
      // Reset user betaStatus to none using setDoc (resilient merge)
      if (userUid) {
        await setDoc(doc(db, 'users', userUid), { betaStatus: 'none', updatedAt: serverTimestamp() }, { merge: true });
      }
      allRequests = allRequests.filter(r => r._docId !== docId);
      updateStats();
      renderTable();
    } catch (err) {
      console.error('Delete error details:', {
        code: err.code,
        message: err.message,
        stack: err.stack,
        error: err
      });
      alert(`Failed to delete: ${err.message || err}`);
    }
  }

  // ── Filters ───────────────────────────────────────────
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderTable();
    });
  });

  // ── Search ────────────────────────────────────────────
  let debounce;
  searchEl?.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => { searchTerm = searchEl.value.trim(); renderTable(); }, 250);
  });
});
