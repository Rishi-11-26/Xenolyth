import { auth, db, onAuthStateChanged, doc, getDoc } from './firebase-client.js';

const FOUNDER_EMAIL = 'xenolyth26@gmail.com';

document.addEventListener('DOMContentLoaded', () => {
  const loginLinks = document.querySelectorAll('.nav-login-link');
  const betaCtas = document.querySelectorAll('.nav__cta, #nav-beta-cta, #nav-drawer-beta, #hero-beta-btn, #sentinel-beta-btn, #sentinel-page-beta, #sentinel-cta-beta, #home-contact-beta, #contact-page-beta');

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // User is signed in
      loginLinks.forEach(link => {
        link.textContent = 'Dashboard';
        link.href = 'dashboard.html';
      });

      try {
        const userSnap = await getDoc(doc(db, 'users', user.uid));
        const userData = userSnap.exists() ? userSnap.data() : {};
        const isAdmin    = userData.role === 'admin' || user.email?.toLowerCase() === FOUNDER_EMAIL;
        const betaStatus = isAdmin ? 'approved' : (userData.betaStatus || 'none');

        // Dynamically update beta CTAs
        betaCtas.forEach(cta => {
          if (!cta) return;
          cta.style.display = '';

          if (betaStatus === 'approved') {
            cta.href = 'sentinel-app.html';
            cta.removeAttribute('data-page'); // External page link

            if (cta.classList.contains('nav__cta') || cta.classList.contains('nav__drawer-cta')) {
              cta.innerHTML = '⬡&nbsp;&nbsp;Launch Sentinel';
            } else if (cta.classList.contains('contact-card__link')) {
              cta.textContent = 'Launch Sentinel →';
            } else {
              cta.innerHTML = 'Launch Sentinel &nbsp;→';
            }
          } else if (betaStatus === 'pending') {
            cta.href = 'dashboard.html';
            cta.removeAttribute('data-page');

            if (cta.classList.contains('nav__cta') || cta.classList.contains('nav__drawer-cta')) {
              cta.innerHTML = '⏳&nbsp;&nbsp;Request Pending';
            } else if (cta.classList.contains('contact-card__link')) {
              cta.textContent = 'Beta Request Pending →';
            } else {
              cta.textContent = 'Beta Request Pending';
            }
          } else if (betaStatus === 'rejected') {
            cta.href = 'dashboard.html';
            cta.removeAttribute('data-page');

            if (cta.classList.contains('nav__cta') || cta.classList.contains('nav__drawer-cta')) {
              cta.innerHTML = '✕&nbsp;&nbsp;Access Restricted';
            } else if (cta.classList.contains('contact-card__link')) {
              cta.textContent = 'Contact Xenolyth →';
            } else {
              cta.textContent = 'Beta Request Rejected';
            }
          } else {
            // betaStatus is 'none'
            cta.href = '#beta';
            cta.setAttribute('data-page', 'beta'); // SPA navigation

            if (cta.classList.contains('nav__cta') || cta.classList.contains('nav__drawer-cta')) {
              cta.innerHTML = '⬡&nbsp;&nbsp;Request Beta';
            } else if (cta.classList.contains('contact-card__link')) {
              cta.textContent = 'Apply for Beta →';
            } else {
              cta.innerHTML = 'Request Beta Access &nbsp;→';
            }
          }
        });
      } catch (err) {
        console.error('Error fetching user status:', err);
      }
    } else {
      // User is signed out
      loginLinks.forEach(link => {
        link.textContent = 'Login';
        link.href = 'login.html';
      });

      betaCtas.forEach(cta => {
        if (!cta) return;
        cta.href = 'login.html';
        cta.style.display = '';
        cta.removeAttribute('data-page'); // Force redirect to login page

        if (cta.classList.contains('nav__cta') || cta.classList.contains('nav__drawer-cta')) {
          cta.innerHTML = '⬡&nbsp;&nbsp;Request Beta';
        } else if (cta.classList.contains('contact-card__link')) {
          cta.textContent = 'Apply for Beta →';
        } else {
          cta.innerHTML = 'Request Beta Access &nbsp;→';
        }
      });
    }
  });
});
