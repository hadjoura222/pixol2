/**
 * components.js – Pixolai
 * Injects shared header + footer into every page.
 *
 * HOW TO ADD A NEW TOOL TO THE HEADER:
 *   1. Add a link inside the <nav> below pointing to /tools/your-tool.html
 *   2. Create the tool HTML file in /tools/
 */

(function () {
  /* ── Dark mode (must run before render to avoid flash) ── */
  const saved = localStorage.getItem('pixolai-theme');
  if (saved === 'dark') document.documentElement.setAttribute('data-theme', 'dark');

  function getThemeIcon() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙';
  }

  /* ── Determine active page ── */
  const path = window.location.pathname;
  function isActive(href) {
    if (href === '/' || href === '/index.html') return path === '/' || path.endsWith('index.html');
    return path.includes(href.replace(/^\//, ''));
  }

  function navLink(href, label) {
    const active = isActive(href) ? ' class="active"' : '';
    return `<a href="${href}"${active}>${label}</a>`;
  }

  /* ── Header HTML ── */
  const headerHTML = `
<header id="site-header" role="banner">
  <div class="container">
    <a href="/" class="nav-logo" aria-label="Pixolai Home">
      <div class="logo-mark" aria-hidden="true">P</div>
      Pixolai
    </a>
    <nav class="nav-links" id="nav-links" aria-label="Main navigation">
      ${navLink('/', 'Home')}
      ${navLink('/tools/', 'Tools')}
      ${navLink('/blog/', 'Blog')}
      ${navLink('/pages/contact.html', 'Contact')}
    </nav>
    <div style="display:flex;align-items:center;gap:10px">
      <button class="dark-toggle" id="dark-toggle" aria-label="Toggle dark mode" title="Toggle dark mode">
        ${getThemeIcon()}
      </button>
      <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</header>`;

  /* ── Footer HTML ── */
  const year = new Date().getFullYear();
  const footerHTML = `
<footer id="site-footer" role="contentinfo">
  <div class="container">
    <div class="footer-inner">
      <p class="footer-copy">© ${year} <strong>Pixolai</strong>. All rights reserved.</p>
      <nav class="footer-links" aria-label="Footer navigation">
        <a href="/pages/privacy.html">Privacy Policy</a>
        <a href="/pages/contact.html">Contact</a>
        <a href="/tools/">Tools</a>
        <a href="/blog/">Blog</a>
      </nav>
    </div>
  </div>
</footer>`;

  /* ── Inject ── */
  function inject() {
    const headerEl = document.getElementById('site-header');
    const footerEl = document.getElementById('site-footer');

    if (headerEl) {
      headerEl.outerHTML = headerHTML;
    } else {
      document.body.insertAdjacentHTML('afterbegin', headerHTML);
    }

    if (footerEl) {
      footerEl.outerHTML = footerHTML;
    } else {
      document.body.insertAdjacentHTML('beforeend', footerHTML);
    }

    bindEvents();
  }

  function bindEvents() {
    /* Dark mode toggle */
    const btn = document.getElementById('dark-toggle');
    if (btn) {
      btn.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
          document.documentElement.removeAttribute('data-theme');
          localStorage.setItem('pixolai-theme', 'light');
        } else {
          document.documentElement.setAttribute('data-theme', 'dark');
          localStorage.setItem('pixolai-theme', 'dark');
        }
        btn.textContent = getThemeIcon();
      });
    }

    /* Hamburger */
    const ham = document.getElementById('hamburger');
    const nav = document.getElementById('nav-links');
    if (ham && nav) {
      ham.addEventListener('click', () => {
        const open = nav.classList.toggle('open');
        ham.setAttribute('aria-expanded', open);
      });
      /* Close on outside click */
      document.addEventListener('click', (e) => {
        if (!ham.contains(e.target) && !nav.contains(e.target)) {
          nav.classList.remove('open');
          ham.setAttribute('aria-expanded', false);
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
