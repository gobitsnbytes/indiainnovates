/* ========================================
   INDIA INNOVATES 2026 — PRIVATE LOOKUP JS
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('contextmenu', (e) => e.preventDefault());

  const nav = document.querySelector('.nav');
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks = document.getElementById('nav-links');
  const announcementBanner = document.getElementById('announcement-banner');

  function updateNavOffset() {
    if (!nav) return;
    const bannerH = (announcementBanner && !announcementBanner.classList.contains('dismissed'))
      ? announcementBanner.offsetHeight : 0;
    nav.style.top = bannerH + 'px';
    document.documentElement.style.setProperty('--banner-height', bannerH + 'px');
  }

  if (announcementBanner) {
    const closeBtn = document.getElementById('announcement-close');
    if (closeBtn) {
      try {
        if (sessionStorage.getItem('announcementDismissed') === '1') {
          announcementBanner.classList.add('dismissed');
        }
      } catch {}

      closeBtn.addEventListener('click', () => {
        announcementBanner.classList.add('dismissed');
        updateNavOffset();
        try { sessionStorage.setItem('announcementDismissed', '1'); } catch {}
      });
    }
  }

  updateNavOffset();
  window.addEventListener('resize', updateNavOffset, { passive: true });

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  const dataEl = document.getElementById('results-data');
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  const searchClear = document.getElementById('search-clear');
  const searchMeta = document.getElementById('search-meta');
  const lookupResult = document.getElementById('lookup-result');

  if (!dataEl || !searchInput || !searchBtn || !lookupResult) return;

  let entries;
  try {
    entries = JSON.parse(atob(dataEl.textContent.trim()));
  } catch {
    try {
      entries = JSON.parse(dataEl.textContent.trim());
    } catch {
      if (searchMeta) searchMeta.textContent = 'Unable to load the verification list right now.';
      return;
    }
  }

  const hashSet = new Set(entries.map((item) => String(item.h || '').toLowerCase()).filter(Boolean));

  // 17 Mar 2026, 14:30 IST = 17 Mar 2026, 09:00 UTC
  const UNLOCK_AT_UTC_MS = Date.UTC(2026, 2, 17, 9, 0, 0);

  function formatCountdown(msLeft) {
    const totalSec = Math.max(0, Math.floor(msLeft / 1000));
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  function applyTimeLock() {
    const now = Date.now();
    if (now >= UNLOCK_AT_UTC_MS) return false;

    searchInput.disabled = true;
    searchBtn.disabled = true;
    searchClear.disabled = true;
    searchBtn.textContent = 'Locked';
    searchInput.placeholder = 'Results unlock at 14:30 IST, 17 Mar 2026';

    const tick = () => {
      const remaining = UNLOCK_AT_UTC_MS - Date.now();
      if (remaining <= 0) {
        location.reload();
        return;
      }
      if (searchMeta) {
        searchMeta.textContent = `Results are locked until 14:30 IST (17 Mar 2026). Time left: ${formatCountdown(remaining)}`;
      }
      setResult('not-found', 'Verification is temporarily locked before the official release time.');
    };

    tick();
    setInterval(tick, 1000);
    return true;
  }

  async function sha256Hex(text) {
    const bytes = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  function setResult(type, message) {
    lookupResult.className = `lookup-result ${type}`;
    lookupResult.textContent = message;
    lookupResult.style.display = 'block';
  }

  async function runLookup() {
    const raw = searchInput.value.trim().toLowerCase();

    if (!raw) {
      if (searchMeta) searchMeta.textContent = 'Enter your registered leader email to verify.';
      lookupResult.style.display = 'none';
      return;
    }

    if (!raw.includes('@') || raw.length < 6) {
      if (searchMeta) searchMeta.textContent = 'Enter a valid email address.';
      lookupResult.style.display = 'none';
      return;
    }

    searchBtn.disabled = true;
    searchBtn.textContent = 'Checking...';
    if (searchMeta) searchMeta.textContent = 'Verifying your email securely...';

    try {
      const hash = await sha256Hex(raw);
      if (hashSet.has(hash)) {
        setResult(
          'success',
          'Shortlisted: this email is in the Round 1 selected list. Please check your registered inbox for next steps.'
        );
      } else {
        setResult(
          'not-found',
          'No shortlisted record found for this email. If you believe this is an error, contact the organizers.'
        );
      }
    } catch {
      setResult('error', 'We could not verify right now. Please retry in a few moments.');
    } finally {
      searchBtn.disabled = false;
      searchBtn.textContent = 'Verify';
    }
  }

  if (applyTimeLock()) {
    return;
  }

  searchBtn.addEventListener('click', runLookup);

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') runLookup();
  });

  if (searchClear) {
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      lookupResult.style.display = 'none';
      if (searchMeta) searchMeta.textContent = 'Enter your registered leader email to verify.';
      searchInput.focus();
      searchClear.classList.remove('visible');
    });

    searchInput.addEventListener('input', () => {
      searchClear.classList.toggle('visible', searchInput.value.trim().length > 0);
    });
  }

  if (searchMeta) {
    searchMeta.textContent = 'Enter your registered leader email to verify.';
  }
});
