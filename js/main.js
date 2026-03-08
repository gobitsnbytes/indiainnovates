/* ========================================
   INDIA INNOVATES 2026 — INTERACTIONS
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- Announcement Banner Dismiss ---
  const announcementBanner = document.getElementById('announcement-banner');
  const announcementClose = document.getElementById('announcement-close');
  const nav = document.querySelector('.nav');

  function updateNavOffset() {
    if (!nav) return;
    const bannerH = (announcementBanner && !announcementBanner.classList.contains('dismissed'))
      ? announcementBanner.offsetHeight
      : 0;
    nav.style.top = bannerH + 'px';
    // Keep hero padding in sync
    document.documentElement.style.setProperty('--banner-height', bannerH + 'px');
  }

  if (announcementClose && announcementBanner) {
    // Restore dismissed state within the same session
    try {
      if (sessionStorage.getItem('announcementDismissed') === '1') {
        announcementBanner.classList.add('dismissed');
      }
    } catch (e) { /* ignore */ }

    announcementClose.addEventListener('click', () => {
      announcementBanner.classList.add('dismissed');
      updateNavOffset();
      try { sessionStorage.setItem('announcementDismissed', '1'); } catch (e) { /* ignore */ }
    });
  }

  updateNavOffset();
  // Re-calculate on resize (banner may reflow to different height)
  window.addEventListener('resize', updateNavOffset, { passive: true });

  // --- Countdown Timer ---
  const targetDate = new Date('2026-03-28T09:00:00+05:30').getTime();

  function updateCountdown() {
    const now = Date.now();
    const diff = targetDate - now;

    if (diff <= 0) {
      document.querySelectorAll('.countdown-number').forEach(el => el.textContent = '00');
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minsEl = document.getElementById('cd-mins');
    const secsEl = document.getElementById('cd-secs');

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(minutes).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // --- Mobile Hamburger Menu ---
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu when a nav link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Navbar Scroll Effect ---
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        // Close all
        faqItems.forEach(i => i.classList.remove('active'));
        // Toggle current
        if (!isOpen) {
          item.classList.add('active');
        }
      });
    }
  });

  // --- Scroll Reveal Animation ---
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback: show everything
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

});
