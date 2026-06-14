'use strict';

/* =============================================================
   XENOLYTH — App JavaScript
   Router · Nav · Particles · Animations · FAQ · Form
   ============================================================= */

/* ============================================================
   ROUTER — Hash-based SPA
   ============================================================ */
const Router = (() => {
  const routes = {
    '':          'home',
    'home':      'home',
    'sentinel':  'sentinel',
    'research':  'research',
    'about':     'about',
    'contact':   'contact',
    'beta':      'beta',
  };

  function navigate(hash) {
    const key    = (hash || '').replace(/^#/, '').toLowerCase().trim();
    const pageId = routes[key] || 'home';

    // Hide all pages
    document.querySelectorAll('.page').forEach(p => {
      p.classList.remove('active');
    });

    // Show target
    const target = document.getElementById(`page-${pageId}`);
    if (target) {
      target.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    // Update nav active states
    document.querySelectorAll('[data-page]').forEach(el => {
      const linkPage = (el.dataset.page || '').toLowerCase();
      const isActive = linkPage === pageId;
      if (el.classList.contains('nav__link') || el.classList.contains('nav__drawer-link')) {
        el.classList.toggle('active', isActive);
      }
    });

    // Trigger scroll animations for new page
    setTimeout(() => Animations.observeAll(), 80);
  }

  function init() {
    window.addEventListener('hashchange', () => navigate(location.hash));
    navigate(location.hash);
  }

  return { init, navigate };
})();

/* ============================================================
   NAV — Scroll glass effect + Mobile drawer
   ============================================================ */
const Nav = (() => {
  let hamburger, drawer, isOpen = false;

  function init() {
    hamburger = document.getElementById('nav-hamburger');
    drawer    = document.getElementById('nav-drawer');

    hamburger?.addEventListener('click', toggleDrawer);

    // Glass effect on scroll
    const nav    = document.querySelector('.nav');
    const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Close on outside click
    document.addEventListener('click', e => {
      if (isOpen && !drawer?.contains(e.target) && !hamburger?.contains(e.target)) {
        closeDrawer();
      }
    });

    // Close on resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024 && isOpen) closeDrawer();
    });
  }

  function toggleDrawer() {
    isOpen ? closeDrawer() : openDrawer();
  }

  function openDrawer() {
    isOpen = true;
    hamburger?.classList.add('open');
    hamburger?.setAttribute('aria-expanded', 'true');
    drawer?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    isOpen = false;
    hamburger?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
    drawer?.classList.remove('open');
    document.body.style.overflow = '';
  }

  return { init, closeDrawer };
})();

/* ============================================================
   PARTICLES — Subtle network dots on canvas
   ============================================================ */
const Particles = (() => {
  let canvas, ctx, pts = [], raf, W, H;

  const CFG = {
    count:   65,
    speed:   0.15,
    maxDist: 160,
    dotMax:  1.2,
  };

  class Point {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - .5) * CFG.speed;
      this.vy = (Math.random() - .5) * CFG.speed;
      this.r  = Math.random() * CFG.dotMax + .4;
      this.a  = Math.random() * .35 + .05;
    }
    step() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
      this.x = Math.max(0, Math.min(W, this.x));
      this.y = Math.max(0, Math.min(H, this.y));
    }
  }

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    pts = Array.from({ length: CFG.count }, () => new Point());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => p.step());

    // Lines between close points
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i], b = pts[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < CFG.maxDist) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(0,212,255,${(1 - d / CFG.maxDist) * .10})`;
          ctx.lineWidth = .6;
          ctx.stroke();
        }
      }
    }

    // Dots
    pts.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,212,255,${p.a})`;
      ctx.fill();
    });

    raf = requestAnimationFrame(loop);
  }

  function init() {
    canvas = document.getElementById('xeno-particles');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
    loop();
  }

  return { init };
})();

/* ============================================================
   SCROLL ANIMATIONS — IntersectionObserver
   ============================================================ */
const Animations = (() => {
  let observer;

  function init() {
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    observeAll();
  }

  function observeAll() {
    document.querySelectorAll('.reveal, .reveal-left').forEach(el => {
      if (!el.classList.contains('visible')) observer?.observe(el);
    });
  }

  return { init, observeAll };
})();

/* ============================================================
   FAQ ACCORDION
   ============================================================ */
const FAQ = (() => {
  function init() {
    document.querySelectorAll('.faq-question').forEach(q => {
      q.addEventListener('click', () => {
        const item   = q.closest('.faq-item');
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });

      // Keyboard accessibility
      q.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          q.click();
        }
      });
    });
  }

  return { init };
})();

/* ============================================================
   MAGNETIC BUTTONS — Subtle mouse-tracking
   ============================================================ */
const Magnetic = (() => {
  function init() {
    document.querySelectorAll('.btn--primary').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r  = btn.getBoundingClientRect();
        const dx = ((e.clientX - r.left) / r.width  - .5) * 10;
        const dy = ((e.clientY - r.top)  / r.height - .5) * 6;
        btn.style.transform = `translate(${dx}px, ${dy}px) translateY(-2px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  return { init };
})();

/* ============================================================
   BETA FORM (Moved to beta-submit.js module)
   ============================================================ */

/* ============================================================
   NAV LINK BINDING — data-page → hash router
   ============================================================ */
function bindLinks() {
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-page]');
    if (!el) return;
    e.preventDefault();
    const page = el.dataset.page;
    if (page) {
      location.hash = page;
      Nav.closeDrawer();
    }
  });
}

/* ============================================================
   DYNAMIC YEAR
   ============================================================ */
function setYear() {
  document.querySelectorAll('.js-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
}

/* ============================================================
   STAT COUNTER ANIMATION
   ============================================================ */
function initCounters() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const end = parseFloat(el.dataset.count);
      if (isNaN(end)) return;
      observer.unobserve(el);
      let start = 0;
      const dur = 1800;
      const t0  = performance.now();
      const step = ts => {
        const progress = Math.min((ts - t0) / dur, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(start + (end - start) * ease);
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => observer.observe(el));
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  setYear();
  Nav.init();
  Particles.init();
  Animations.init();
  FAQ.init();
  Magnetic.init();
  initCounters();
  bindLinks();
  Router.init();
});
