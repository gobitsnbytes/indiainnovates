/**
 * Generates results.html with embedded base64 data
 * Run: node build_results.cjs
 */
const fs = require('fs');
const path = require('path');

const b64Data = fs.readFileSync(path.join(__dirname, 'data/results.b64'), 'utf-8');

const html = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/png" href="images/HN%20logo-2.png">

  <!-- Anti-scraper: noindex -->
  <meta name="robots" content="noindex, nofollow">
  <meta name="googlebot" content="noindex, nofollow">

  <title>Results | India Innovates 2026</title>
  <meta name="description" content="India Innovates 2026 — Round 1 Results. Check your team's status.">

  <!-- Styles -->
  <link rel="stylesheet" href="css/styles.css">
  <link rel="stylesheet" href="css/results.css">

  <!-- Fuse.js for fuzzy search -->
  <script src="https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/dist/fuse.min.js" defer><\/script>

  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-K6F7N5MR4K"><\/script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'G-K6F7N5MR4K');
  <\/script>
</head>

<body>

  <!-- ==================== RESULTS BANNER ==================== -->
  <div class="announcement-banner" id="announcement-banner" role="alert" style="background:linear-gradient(135deg,var(--green) 0%,#0d6e04 60%,#1FAD0F 100%);">
    <div class="announcement-inner">
      <span class="announcement-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1-2.5-2.5v0a2.5 2.5 0 0 1 2.5-2.5H6"></path>
          <path d="M18 9h1.5a2.5 2.5 0 0 0 2.5-2.5v0a2.5 2.5 0 0 0-2.5-2.5H18"></path>
          <path d="M4 22h16"></path>
          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"></path>
        </svg>
      </span>
      <div class="announcement-content">
        <strong>Round 1 Results Are Live!</strong>
        You are viewing the India Innovates 2026 evaluation results. Search for your team below.
      </div>
      <button class="announcement-close" id="announcement-close" aria-label="Dismiss">&times;</button>
    </div>
  </div>

  <!-- ==================== NAVIGATION ==================== -->
  <nav class="nav" id="navbar">
    <div class="nav-inner">
      <a href="index.html" class="nav-logo">
        <img src="images/HN%20logo-2.png" alt="India Innovates Logo" width="36" height="36">
        <span><span class="logo-text-highlight">India</span> Innovates</span>
      </a>

      <div class="nav-links" id="nav-links">
        <a href="index.html#about">About</a>
        <a href="index.html#domains">Domains</a>
        <a href="index.html#timeline">Schedule</a>
        <a href="index.html#prizes">Prizes</a>
        <a href="index.html#guidelines">Rules</a>
        <a href="index.html#faqs">FAQs</a>
        <a href="results.html" style="color:var(--saffron);">Results</a>
        <a href="https://unstop.com/conferences/india-innovates-2026-municipal-corporation-of-delhi-1625920?utm_medium=Share&utm_source=rishajai19112&utm_campaign=Conferences" target="_blank" rel="noopener" class="nav-cta">Register</a>
      </div>

      <button class="nav-hamburger" id="nav-hamburger" aria-label="Toggle navigation">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </nav>

  <!-- ==================== RESULTS HERO ==================== -->
  <section class="results-hero">
    <div class="results-hero-inner">
      <div class="section-badge">Round 1 Results</div>
      <h1 class="results-hero-title">
        <span class="highlight-saffron">Results</span> Announced
      </h1>
      <p class="results-hero-subtitle">
        Shortlisting status for all registered teams. Search for your team name, email, or organisation below.<br>
        <span style="font-size: 0.85em; opacity: 0.8;"><em>Note: The order/serial number does not indicate any ranking based on quality.</em></span>
      </p>


    </div>
  </section>

  <!-- ==================== DISCORD NOTICE ==================== -->
  <div style="background:var(--navy);border-bottom:var(--border-thick);padding:1rem 0;">
    <div style="max-width:var(--max-width);margin:0 auto;padding:0 var(--space-lg);">
      <div style="display:flex;align-items:center;gap:1rem;padding:1rem 1.5rem;border:3px solid var(--saffron);background:rgba(255,153,0,0.08);flex-wrap:wrap;">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#7289da" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <div style="flex:1;min-width:200px;">
          <strong style="font-family:var(--font-heading);font-size:0.95rem;text-transform:uppercase;color:var(--saffron);">⚡ Selected Participants — Join Discord Now</strong>
          <p style="font-size:0.88rem;color:rgba(255,255,255,0.7);margin-top:4px;">All shortlisted teams <strong style="color:var(--white);">must</strong> join the official Discord server for coordination, booth assignments, event updates, and direct communication with organizers.</p>
        </div>
        <a href="https://discord.gg/BwfZKPZPQn" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:0.5rem;font-family:var(--font-heading);font-size:0.85rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;padding:0.6rem 1.5rem;background:#7289da;color:white;border:3px solid var(--navy);box-shadow:var(--shadow);text-decoration:none;white-space:nowrap;transition:transform 0.15s,box-shadow 0.15s;" onmouseover="this.style.transform='translate(-2px,-2px)';this.style.boxShadow='7px 7px 0 var(--navy)'" onmouseout="this.style.transform='';this.style.boxShadow='var(--shadow)'">Join Discord →</a>
      </div>
    </div>
  </div>

  <!-- ==================== SEARCH ==================== -->
  <section class="search-section">
    <div class="search-inner">
      <div class="search-box">
        <input type="text" id="search-input" class="search-input"
          placeholder="Search by team name, email, or organisation..."
          autocomplete="off" spellcheck="false">
        <button class="search-clear" id="search-clear" aria-label="Clear search">&times;</button>
        <button class="search-btn" id="search-btn">Search</button>
      </div>
      <div class="search-meta" id="search-meta"></div>

      <!-- Brute force fallback -->
      <div class="brute-force-section" id="brute-force-section">
        <p class="brute-desc">Fuzzy search didn't find your team? Try an exhaustive brute-force search across all fields.</p>
        <button class="brute-btn" id="brute-btn">Brute Force Search</button>
        <div class="brute-progress" id="brute-progress">
          <div class="brute-progress-bar" id="brute-bar"></div>
        </div>
      </div>
    </div>
  </section>

  <!-- ==================== RESULTS TABLE ==================== -->
  <section class="results-section">
    <div class="results-container">
      <!-- Desktop table -->
      <table class="results-table no-select">
        <thead>
          <tr>
            <th>S.No.</th>
            <th>Team Name</th>
            <th>Domain</th>
            <th>Organisation</th>
            <th>Leader Email</th>
          </tr>
        </thead>
        <tbody id="results-tbody"></tbody>
      </table>

      <!-- Mobile cards -->
      <div class="results-cards" id="results-cards"></div>

      <!-- No results -->
      <div class="no-results" id="no-results" style="display:none;">
        <div class="no-results-icon">🔍</div>
        <h3>No Teams Found</h3>
        <p>Try a different search term, check for typos, or use the brute-force search option above.</p>
      </div>

      <!-- Pagination -->
      <div class="pagination" id="pagination"></div>
    </div>
  </section>

  <!-- ==================== FOOTER ==================== -->
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-top">
        <div class="footer-brand">
          <h3><span>India</span> Innovates 2026</h3>
          <p>Where Code Meets Constitution. India's national civic tech hackathon building for Viksit Bharat 2047.</p>
        </div>
        <div class="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="index.html#about">About</a></li>
            <li><a href="index.html#domains">Domains</a></li>
            <li><a href="index.html#prizes">Prizes</a></li>
            <li><a href="results.html">Results</a></li>
            <li><a href="index.html#faqs">FAQs</a></li>
          </ul>
        </div>
        <div class="footer-links">
          <h4>Connect</h4>
          <ul>
            <li><a href="https://unstop.com/conferences/india-innovates-2026-municipal-corporation-of-delhi-1625920?utm_medium=Share&utm_source=rishajai19112&utm_campaign=Conferences" target="_blank" rel="noopener">Register on Unstop</a></li>
            <li><a href="https://www.instagram.com/indiainnovates2026?igsh=MWluNGsxMGVndTVhcA==" target="_blank" rel="noopener">Instagram</a></li>
            <li><a href="https://www.linkedin.com/company/india-innovates2026" target="_blank" rel="noopener">LinkedIn</a></li>
            <li><a href="mailto:contact@indiainnovates.org">Email Us</a></li>
            <li><a href="https://chat.whatsapp.com/Lrfd4LgqOScGkotc8HkDQ8" target="_blank" rel="noopener">WhatsApp Community</a></li>
            <li><a href="https://discord.gg/BwfZKPZPQn" target="_blank" rel="noopener">Discord Server</a></li>
          </ul>
        </div>
      </div>

      <!-- Footer Logos -->
      <div class="footer-logos">
        <div class="footer-logo-item">
          <img src="images/HN%20logo-2.png" alt="HN Logo">
          <span>HN</span>
        </div>
        <div class="footer-logo-item">
          <img src="images/1-1.png" alt="Bits&Bytes Logo">
          <span>Bits&Bytes</span>
        </div>
        <div class="footer-logo-item">
          <span style="font-size:1.2rem;">🏛</span>
          <span>MCD</span>
        </div>
        <div class="footer-logo-item">
          <span style="font-size:1.2rem;">🎓</span>
          <span>DDU</span>
        </div>
        <div class="footer-logo-item">
          <span style="font-size:1.2rem;">🏫</span>
          <span>IIT KGP</span>
        </div>
        <div class="footer-logo-item">
          <span style="font-size:1.2rem;">🚌</span>
          <span>DTC</span>
        </div>
        <div class="footer-logo-item">
          <span style="font-size:1.2rem;">🏛</span>
          <span>NSUT</span>
        </div>
        <div class="footer-logo-item">
          <span style="font-size:1.2rem;">🏛</span>
          <span>GGSIPU</span>
        </div>
      </div>

      <div class="footer-bottom">
        <div>&copy; 2026 India Innovates. All rights reserved.</div>
        <div class="footer-socials">
          <a href="https://www.instagram.com/indiainnovates2026?igsh=MWluNGsxMGVndTVhcA==" target="_blank" rel="noopener" aria-label="Instagram">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
          <a href="https://www.linkedin.com/company/india-innovates2026" target="_blank" rel="noopener" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>
          <a href="https://chat.whatsapp.com/Lrfd4LgqOScGkotc8HkDQ8" target="_blank" rel="noopener" aria-label="WhatsApp">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
          </a>
          <a href="mailto:contact@indiainnovates.org" aria-label="Email">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </footer>
  <div class="footer-tricolor"></div>

  <!-- Embedded Results Data (base64) -->
  <script type="application/json" id="results-data">${b64Data}<\/script>

  <!-- Results JS -->
  <script src="js/results.js"><\/script>
</body>

</html>`;

fs.writeFileSync(path.join(__dirname, 'results.html'), html, 'utf-8');
console.log('✅ Generated results.html (' + Math.round(html.length/1024) + ' KB)');
