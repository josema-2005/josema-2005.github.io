/* ==========================================
   JOSÉ MARÍA GUERRERO — script.js · v2.0
   ========================================== */

'use strict';

/* ── YEAR ── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── REDUCE MOTION CHECK ── */
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── CUSTOM CURSOR (pointer/desktop only) ── */
if (!prefersReduced && window.matchMedia('(pointer: fine)').matches) {
  const cursor    = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');
  if (cursor && cursorDot) {
    let mouseX = -100, mouseY = -100, curX = -100, curY = -100;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top  = mouseY + 'px';
    });

    const animateCursor = () => {
      curX += (mouseX - curX) * 0.12;
      curY += (mouseY - curY) * 0.12;
      cursor.style.left = curX + 'px';
      cursor.style.top  = curY + 'px';
      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    document.querySelectorAll('a, button, .stab').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });
  }
}

/* ── HEADER: scroll state ── */
const header = document.getElementById('header');
if (header) {
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── MOBILE MENU ── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
  const open = () => {
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', () => {
    hamburger.getAttribute('aria-expanded') === 'true' ? close() : open();
  });
  document.querySelectorAll('.mobile-nav-link').forEach(l => l.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

/* ── SCROLL REVEAL ── */
const revealAll = () => document.querySelectorAll('.reveal-item').forEach(el => el.classList.add('visible'));

if (prefersReduced) {
  revealAll();
} else {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal-item').forEach(el => observer.observe(el));
}

/* ── STACK TABS ── */
const tabMap = {
  frontend:  'panel-fe',
  backend:   'panel-be',
  databases: 'panel-db',
  tools:     'panel-tl'
};



document.querySelectorAll('.stab').forEach(tab => {
  tab.addEventListener('click', () => {
    // tabs
    document.querySelectorAll('.stab').forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');

    // panels
    const targetId = tabMap[tab.dataset.tab];
    document.querySelectorAll('.stack-panel').forEach(panel => {
      if (panel.id === targetId) {
        panel.classList.add('active');
        panel.removeAttribute('hidden');
      } else {
        panel.classList.remove('active');
        panel.setAttribute('hidden', '');
      }
    });
  });
});



/* ── HERO PARALLAX on mousemove (desktop, subtle) ── */
if (!prefersReduced && window.matchMedia('(pointer: fine)').matches) {
  const heroEl  = document.querySelector('.hero');
  const geoArc  = document.querySelector('.geo-arc');
  const geoGrid = document.querySelector('.geo-grid');

  if (heroEl && geoArc && geoGrid) {
    heroEl.addEventListener('mousemove', e => {
      const r = heroEl.getBoundingClientRect();
      const x = (e.clientX - r.width  / 2) / r.width;
      const y = (e.clientY - r.height / 2) / r.height;
      geoArc.style.transform  = `translate(${x * -18}px, ${y * -12}px) rotate(${x * 2.5}deg)`;
      geoGrid.style.transform = `translateX(${x * 10}px)`;
    });
    heroEl.addEventListener('mouseleave', () => {
      geoArc.style.transform  = '';
      geoGrid.style.transform = '';
    });
  }
}

/* ── ACTIVE NAV LINK on scroll ── */
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

if (navLinks.length && sections.length) {
  const sectionObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = link.getAttribute('href') === '#' + entry.target.id
            ? 'var(--dark)'
            : '';
        });
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });
  sections.forEach(s => sectionObs.observe(s));
}
