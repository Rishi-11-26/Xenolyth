import {
  auth, db,
  onAuthStateChanged, signOut,
  collection, addDoc, getDocs, deleteDoc,
  doc, query, where, orderBy, serverTimestamp, getDoc
} from './firebase-client.js';

const FOUNDER_EMAIL = 'xenolyth26@gmail.com';

document.addEventListener('DOMContentLoaded', () => {
  const lockScreen  = document.getElementById('lock-screen');
  const logoutBtn   = document.getElementById('logout-btn');
  const notifsList  = document.getElementById('system-notifs');
  const watchlistEl = document.getElementById('watchlist-list');
  const addForm     = document.getElementById('add-target-form');
  const targetInput = document.getElementById('target-input');
  const userLabel   = document.getElementById('s-user-label');

  let currentUser = null;

  // ── Telemetry animation ───────────────────────────────
  const telemData = {
    objects: { el: document.getElementById('tele-objects'), values: ['2,847','2,851','2,849','2,853'], i: 0 },
    iss:     { el: document.getElementById('tele-iss'),     values: ['LOCKED','LOCKED','ACTIVE','LOCKED'], i: 0 },
    solar:   { el: document.getElementById('tele-solar'),   values: ['NOMINAL','NOMINAL','WATCH','NOMINAL'], i: 0 },
    uptime:  { start: Date.now() }
  };

  function startTelemetry() {
    setInterval(() => {
      ['objects','iss','solar'].forEach(k => {
        const t = telemData[k];
        t.i = (t.i + 1) % t.values.length;
        if (t.el) {
          t.el.style.opacity = '0';
          setTimeout(() => { t.el.textContent = t.values[t.i]; t.el.style.opacity = '1'; t.el.style.transition = 'opacity .4s'; }, 200);
        }
      });
    }, 6000);

    setInterval(() => {
      const el = document.getElementById('tele-uptime');
      if (!el) return;
      const s  = Math.floor((Date.now() - telemData.uptime.start) / 1000);
      el.textContent = `${String(Math.floor(s/3600)).padStart(2,'0')}:${String(Math.floor((s%3600)/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
    }, 1000);
  }

  // ── Auth & access gate ────────────────────────────────
  onAuthStateChanged(auth, async (user) => {
    if (!user) { showLockdown('unauthenticated'); return; }

    try {
      const userSnap = await getDoc(doc(db, 'users', user.uid));
      const userData = userSnap.exists() ? userSnap.data() : {};

      const isAdmin    = userData.role === 'admin' || user.email?.toLowerCase() === FOUNDER_EMAIL;
      const betaStatus = userData.betaStatus || 'none';
      const canAccess  = isAdmin || betaStatus === 'approved';

      if (!canAccess) {
        // Redirect to dashboard with context — do NOT show sentinel at all
        const reason = betaStatus === 'pending'  ? 'pending'
                     : betaStatus === 'rejected' ? 'rejected'
                     : 'none';
        showLockdown(reason, user);
        return;
      }

      currentUser = user;
      if (userLabel) { userLabel.textContent = userData.name || user.email; userLabel.style.display = 'block'; }

      startTelemetry();
      await Promise.all([loadNotifications(), loadWatchlist()]);

      lockScreen.style.opacity = '0';
      setTimeout(() => lockScreen.style.display = 'none', 500);
    } catch (err) {
      console.error('Sentinel gate error:', err);
      showLockdown('error');
    }
  });

  // ── Lockdown screen ───────────────────────────────────
  function showLockdown(reason, user) {
    const msgs = {
      'unauthenticated': {
        title: 'Authentication Required',
        body:  'Sentinel is in private beta. Please sign in through the Xenolyth portal.',
        cta:   '<a href="login.html" class="s-lock-btn">Sign In</a><a href="index.html" class="s-lock-btn s-lock-btn--ghost">Xenolyth Home</a>'
      },
      'none': {
        title: 'Beta Access Required',
        body:  'Sentinel is a private beta product. Request access from your dashboard to apply.',
        cta:   '<a href="dashboard.html" class="s-lock-btn">Request Beta Access</a>'
      },
      'pending': {
        title: 'Application Under Review',
        body:  'Your Sentinel beta request has been submitted and is under review. You will be notified when a decision is made.',
        cta:   '<a href="dashboard.html" class="s-lock-btn s-lock-btn--ghost">Back to Dashboard</a>'
      },
      'rejected': {
        title: 'Access Not Approved',
        body:  'Your beta application was not approved at this time. Contact Xenolyth for further information or reapply from your dashboard.',
        cta:   '<a href="dashboard.html" class="s-lock-btn s-lock-btn--ghost">Back to Dashboard</a>'
      },
      'error': {
        title: 'Connection Failed',
        body:  'Unable to verify your access credentials. Please try again.',
        cta:   '<a href="login.html" class="s-lock-btn">Retry</a>'
      }
    };

    const m = msgs[reason] || msgs['unauthenticated'];
    document.body.innerHTML = `
      <style>
        body{background:#010308;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:system-ui,sans-serif;}
        .s-lock-wrap{text-align:center;padding:2rem;max-width:420px;}
        .s-lock-hex{font-size:2.5rem;color:#00d4ff;margin-bottom:1.5rem;line-height:1;}
        .s-lock-title{font-size:1.375rem;font-weight:700;color:#fff;margin-bottom:.625rem;}
        .s-lock-body{font-size:.875rem;color:rgba(255,255,255,.45);line-height:1.7;margin-bottom:2rem;}
        .s-lock-cta{display:flex;gap:.75rem;justify-content:center;flex-wrap:wrap;}
        .s-lock-btn{display:inline-flex;align-items:center;padding:.625rem 1.375rem;border-radius:.5rem;font-size:.875rem;font-weight:600;text-decoration:none;background:rgba(0,212,255,.12);border:1px solid rgba(0,212,255,.25);color:#00d4ff;transition:all .2s;}
        .s-lock-btn:hover{background:rgba(0,212,255,.2);}
        .s-lock-btn--ghost{background:transparent;border-color:rgba(255,255,255,.1);color:rgba(255,255,255,.45);}
        .s-lock-btn--ghost:hover{background:rgba(255,255,255,.05);color:rgba(255,255,255,.7);}
      </style>
      <div class="s-lock-wrap">
        <div class="s-lock-hex">⬡</div>
        <h1 class="s-lock-title">${m.title}</h1>
        <p class="s-lock-body">${m.body}</p>
        <div class="s-lock-cta">${m.cta}</div>
      </div>`;
  }

  // ── Logout ────────────────────────────────────────────
  logoutBtn?.addEventListener('click', async (e) => {
    e.preventDefault();
    await signOut(auth);
    window.location.href = 'index.html';
  });

  // ── Notifications ─────────────────────────────────────
  async function loadNotifications() {
    try {
      const q    = query(collection(db, 'system_notifications'), orderBy('timestamp', 'desc'));
      const snap = await getDocs(q);

      if (snap.empty) { await seedDefaultNotifications(); return; }

      notifsList.innerHTML = '';
      snap.docs.slice(0, 6).forEach(d => {
        const n    = d.data();
        const time = n.timestamp
          ? new Date(n.timestamp.seconds * 1000).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })
          : 'Just now';
        const div  = document.createElement('div');
        div.className = `s-notif${n.type === 'warning' ? ' s-notif--amber' : ''}`;
        div.innerHTML = `<div class="s-notif-time">${time} — SYSTEM</div><div class="s-notif-msg">${n.message}</div>`;
        notifsList.appendChild(div);
      });
    } catch (err) {
      console.error('Notifications error:', err);
      notifsList.innerHTML = '<div style="color:var(--text-lo);font-size:.75rem;padding:.5rem 0;">Unable to load intel feed.</div>';
    }
  }

  async function seedDefaultNotifications() {
    const defaults = [
      { message: '<strong>NASA API</strong> connected. Telemetry stream active.', type: 'system' },
      { message: '<strong>ISS Tracking</strong> active. Orbital path locked at 408 km altitude.', type: 'system' },
      { message: '<strong>Solar Activity:</strong> Geomagnetic index nominal. No K5+ events.', type: 'system' },
      { message: '<strong>NEO Database</strong> synchronised. 2,847 objects indexed.', type: 'system' },
    ];
    try {
      for (const d of defaults) {
        await addDoc(collection(db, 'system_notifications'), { ...d, timestamp: serverTimestamp() });
      }
      await loadNotifications();
    } catch(e) { console.error('Seed error:', e); }
  }

  // ── Watchlist ─────────────────────────────────────────
  async function loadWatchlist() {
    try {
      const q    = query(collection(db, 'watchlists'), where('uid','==', currentUser.uid), orderBy('addedAt','desc'));
      const snap = await getDocs(q);

      watchlistEl.innerHTML = '';
      if (snap.empty) {
        watchlistEl.innerHTML = '<div style="text-align:center;color:var(--text-lo);font-size:.75rem;padding:1rem 0;">No targets tracked.</div>';
        return;
      }

      snap.forEach(d => {
        const item = d.data();
        const div  = document.createElement('div');
        div.className = 's-wl-item';
        div.innerHTML = `
          <div>
            <div class="s-wl-name">${item.targetId}</div>
            <div class="s-wl-status">TRACKING ACTIVE</div>
          </div>
          <button class="s-wl-drop" data-id="${d.id}" title="Stop tracking">Drop</button>`;
        watchlistEl.appendChild(div);
      });

      watchlistEl.querySelectorAll('.s-wl-drop').forEach(btn => {
        btn.addEventListener('click', () => removeTarget(btn.dataset.id));
      });
    } catch (err) {
      console.error('Watchlist error:', err);
      watchlistEl.innerHTML = '<div style="color:#ff6b6b;font-size:.75rem;">Failed to load watchlist.</div>';
    }
  }

  addForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const raw = targetInput.value.trim().toUpperCase();
    if (!raw || !currentUser) return;
    try {
      await addDoc(collection(db, 'watchlists'), { uid: currentUser.uid, targetId: raw, addedAt: serverTimestamp() });
      targetInput.value = '';
      await loadWatchlist();
    } catch(err) { console.error('Track error:', err); }
  });

  async function removeTarget(docId) {
    try {
      await deleteDoc(doc(db, 'watchlists', docId));
      await loadWatchlist();
    } catch(err) { console.error('Drop error:', err); }
  }
});
