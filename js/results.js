/* ========================================
   INDIA INNOVATES 2026 — RESULTS PAGE JS
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- Anti-scraper ---
  document.addEventListener('contextmenu', e => e.preventDefault());

  // --- Shared Nav/Hamburger ---
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
      try { if (sessionStorage.getItem('announcementDismissed') === '1') announcementBanner.classList.add('dismissed'); } catch {}
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
    navLinks.querySelectorAll('a').forEach(link => {
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

  // --- Data Loading ---
  const dataEl = document.getElementById('results-data');
  if (!dataEl) return;

  let allTeams;
  try {
    const raw = atob(dataEl.textContent.trim());
    allTeams = JSON.parse(raw);
  } catch {
    try {
      allTeams = JSON.parse(dataEl.textContent.trim());
    } catch {
      console.error('Failed to parse results data');
      return;
    }
  }

  // Decode leader emails
  allTeams.forEach(t => {
    try { t._le = atob(t.l); } catch { t._le = t.l; }
  });

  // --- Constants ---
  const PER_PAGE = 20;
  let currentPage = 1;
  let displayedTeams = allTeams;

  // --- DOM refs ---
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  const searchClear = document.getElementById('search-clear');
  const searchMeta = document.getElementById('search-meta');
  const tableBody = document.getElementById('results-tbody');
  const cardsContainer = document.getElementById('results-cards');
  const paginationContainer = document.getElementById('pagination');
  const bruteSection = document.getElementById('brute-force-section');
  const bruteBtn = document.getElementById('brute-btn');
  const bruteProgress = document.getElementById('brute-progress');
  const bruteBar = document.getElementById('brute-bar');
  const noResults = document.getElementById('no-results');
  const totalTeamsEl = document.getElementById('total-teams');

  if (totalTeamsEl) totalTeamsEl.textContent = allTeams.length;

  // --- Email masking ---
  function maskEmail(email) {
    if (!email || !email.includes('@')) return '••••••';
    const [user, domain] = email.split('@');
    const maskedUser = user[0] + '•'.repeat(Math.min(user.length - 1, 4));
    const domParts = domain.split('.');
    const maskedDom = domParts[0][0] + '•'.repeat(Math.min(domParts[0].length - 1, 3)) +
      (domParts.length > 1 ? '.' + domParts.slice(1).join('.') : '');
    return maskedUser + '@' + maskedDom;
  }

  // --- Domain tag class ---
  function domainClass(d) {
    if (!d) return 'open';
    const dl = d.toLowerCase();
    if (dl.includes('urban')) return 'urban';
    if (dl.includes('democracy') || dl.includes('digital')) return 'democracy';
    if (dl.includes('cyber')) return 'cyber';
    return 'open';
  }

  // --- Rank badge ---
  function rankHTML(rank) {
    if (rank <= 3) {
      const cls = rank === 1 ? 'gold' : rank === 2 ? 'silver' : 'bronze';
      return `<span class="rank-badge ${cls}">#${rank}</span>`;
    }
    return `<span class="rank-cell">#${rank}</span>`;
  }

  // --- Render table row ---
  function renderRow(team) {
    const masked = maskEmail(team._le);
    return `<tr>
      <td class="rank-cell ${team.r <= 3 ? 'top-3' : ''}">${rankHTML(team.r)}</td>
      <td><span class="team-name">${escHTML(team.t)}</span></td>
      <td><span class="domain-tag ${domainClass(team.d)}">${escHTML(team.d)}</span></td>
      <td>${escHTML(team.o)}</td>
      <td><span class="masked-email no-select" data-e="${team.l}" data-m="${escHTML(masked)}">${escHTML(masked)}<span class="reveal-hint">click</span></span></td>
    </tr>`;
  }

  // --- Render card (mobile) ---
  function renderCard(team) {
    const masked = maskEmail(team._le);
    return `<div class="result-card">
      <div class="result-card-header">
        <div class="result-card-rank ${team.r <= 3 ? 'top-3' : ''}">#${team.r}</div>
        <div class="result-card-team">
          <div class="team-name">${escHTML(team.t)}</div>
          <div class="result-card-domain"><span class="domain-tag ${domainClass(team.d)}">${escHTML(team.d)}</span></div>
        </div>
      </div>
      <div class="result-card-body">
        <div class="result-card-field full-width">
          <div class="field-label">Organisation</div>
          <div class="field-value">${escHTML(team.o)}</div>
        </div>
        <div class="result-card-field full-width">
          <div class="field-label">Leader Email</div>
          <div class="field-value"><span class="masked-email no-select" data-e="${team.l}" data-m="${escHTML(masked)}">${escHTML(masked)}<span class="reveal-hint">tap</span></span></div>
        </div>
      </div>
    </div>`;
  }

  function escHTML(s) {
    if (!s) return '';
    const d = document.createElement('div');
    d.textContent = String(s);
    return d.innerHTML;
  }

  // --- Render page ---
  function render() {
    const start = (currentPage - 1) * PER_PAGE;
    const end = Math.min(start + PER_PAGE, displayedTeams.length);
    const pageTeams = displayedTeams.slice(start, end);

    if (displayedTeams.length === 0) {
      if (tableBody) tableBody.innerHTML = '';
      if (cardsContainer) cardsContainer.innerHTML = '';
      if (noResults) noResults.style.display = 'block';
      if (paginationContainer) paginationContainer.innerHTML = '';
      return;
    }

    if (noResults) noResults.style.display = 'none';

    // Table
    if (tableBody) {
      tableBody.innerHTML = pageTeams.map(renderRow).join('');
    }

    // Cards
    if (cardsContainer) {
      cardsContainer.innerHTML = pageTeams.map(renderCard).join('');
    }

    // Pagination
    renderPagination();

    // Attach email reveal handlers
    document.querySelectorAll('.masked-email:not(.revealed)').forEach(el => {
      el.addEventListener('click', function handler() {
        const enc = this.getAttribute('data-e');
        try {
          this.textContent = atob(enc);
        } catch {
          this.textContent = enc;
        }
        this.classList.add('revealed');
        this.removeEventListener('click', handler);
      }, { once: true });
    });
  }

  // --- Pagination ---
  function renderPagination() {
    if (!paginationContainer) return;
    const totalPages = Math.ceil(displayedTeams.length / PER_PAGE);
    if (totalPages <= 1) {
      paginationContainer.innerHTML = '';
      return;
    }

    let html = '';
    html += `<button class="page-btn nav-arrow" data-p="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}>←</button>`;

    const maxVisible = 7;
    let startP = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endP = Math.min(totalPages, startP + maxVisible - 1);
    if (endP - startP + 1 < maxVisible) startP = Math.max(1, endP - maxVisible + 1);

    if (startP > 1) {
      html += `<button class="page-btn" data-p="1">1</button>`;
      if (startP > 2) html += `<span class="page-info">…</span>`;
    }

    for (let i = startP; i <= endP; i++) {
      html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-p="${i}">${i}</button>`;
    }

    if (endP < totalPages) {
      if (endP < totalPages - 1) html += `<span class="page-info">…</span>`;
      html += `<button class="page-btn" data-p="${totalPages}">${totalPages}</button>`;
    }

    html += `<button class="page-btn nav-arrow" data-p="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''}>→</button>`;
    html += `<div class="page-info">Page ${currentPage} of ${totalPages}</div>`;

    paginationContainer.innerHTML = html;

    paginationContainer.querySelectorAll('.page-btn[data-p]').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = parseInt(btn.dataset.p);
        if (p >= 1 && p <= totalPages && p !== currentPage) {
          currentPage = p;
          render();
          // Scroll to results
          const sec = document.querySelector('.results-section');
          if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // --- Fuse.js search ---
  let fuse = null;

  function initFuse() {
    if (typeof Fuse === 'undefined') return null;
    return new Fuse(allTeams, {
      keys: [
        { name: 't', weight: 0.4 },
        { name: '_le', weight: 0.3 },
        { name: 'o', weight: 0.2 },
        { name: 'd', weight: 0.1 },
      ],
      threshold: 0.4,
      ignoreLocation: true,
      includeScore: true,
    });
  }

  // Init fuse when library loads
  function tryInitFuse() {
    if (!fuse && typeof Fuse !== 'undefined') {
      fuse = initFuse();
    }
  }

  // --- Search handler ---
  let searchTimeout = null;

  function doSearch() {
    const query = searchInput.value.trim();

    if (!query) {
      displayedTeams = allTeams;
      currentPage = 1;
      if (searchMeta) searchMeta.innerHTML = '';
      if (searchClear) searchClear.classList.remove('visible');
      if (bruteSection) bruteSection.classList.remove('visible');
      render();
      return;
    }

    if (searchClear) searchClear.classList.add('visible');

    tryInitFuse();

    if (fuse) {
      const results = fuse.search(query);
      displayedTeams = results.map(r => r.item);
    } else {
      // Fallback: simple substring
      const q = query.toLowerCase();
      displayedTeams = allTeams.filter(t =>
        t.t.toLowerCase().includes(q) ||
        t._le.toLowerCase().includes(q) ||
        t.o.toLowerCase().includes(q) ||
        t.d.toLowerCase().includes(q)
      );
    }

    currentPage = 1;
    if (searchMeta) searchMeta.innerHTML = `Found <strong>${displayedTeams.length}</strong> result${displayedTeams.length !== 1 ? 's' : ''} for "${escHTML(query)}"`;

    // Show brute force if no results
    if (displayedTeams.length === 0 && bruteSection) {
      bruteSection.classList.add('visible');
    } else if (bruteSection) {
      bruteSection.classList.remove('visible');
    }

    render();
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(doSearch, 300);
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        clearTimeout(searchTimeout);
        doSearch();
      }
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      clearTimeout(searchTimeout);
      doSearch();
    });
  }

  if (searchClear) {
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      doSearch();
      searchInput.focus();
    });
  }

  // --- Brute Force Search ---
  if (bruteBtn) {
    bruteBtn.addEventListener('click', () => {
      const query = searchInput.value.trim().toLowerCase();
      if (!query) return;

      bruteBtn.disabled = true;
      bruteBtn.textContent = 'Searching...';
      if (bruteProgress) bruteProgress.classList.add('visible');

      const results = [];
      const total = allTeams.length;
      let index = 0;
      const batchSize = 10;

      function processBatch() {
        const end = Math.min(index + batchSize, total);

        for (let i = index; i < end; i++) {
          const t = allTeams[i];
          const searchable = [
            t.t, t._le, t.o, t.d,
            String(t.s), String(t.r)
          ].join(' ').toLowerCase();

          if (searchable.includes(query)) {
            results.push(t);
          }
        }

        index = end;
        const progress = Math.round((index / total) * 100);
        if (bruteBar) bruteBar.style.width = progress + '%';

        if (index < total) {
          // Deliberate delay for thoroughness feel
          setTimeout(processBatch, Math.random() * 15 + 5);
        } else {
          // Done
          displayedTeams = results;
          currentPage = 1;
          if (searchMeta) searchMeta.innerHTML = `Brute-force found <strong>${results.length}</strong> result${results.length !== 1 ? 's' : ''} for "${escHTML(query)}"`;
          render();

          bruteBtn.disabled = false;
          bruteBtn.textContent = 'Brute Force Search';
          if (bruteProgress) bruteProgress.classList.remove('visible');
          if (bruteBar) bruteBar.style.width = '0%';

          if (results.length > 0 && bruteSection) {
            bruteSection.classList.remove('visible');
          }
        }
      }

      processBatch();
    });
  }

  // --- Initial render ---
  if (searchMeta) searchMeta.innerHTML = '';
  render();
});
