'use strict';

/* ==========================================================================
   blog.js — JavaScript ADITIVO para las páginas del blog.
   Es un archivo independiente de script.js: las páginas de artículos no
   tienen calculadoras ni el gráfico animado del hero, así que replican
   aquí solo lo que sí necesitan (tema, menú móvil, aviso de cookies y,
   en la portada del blog, el buscador). Esto evita cargar Chart.js y
   evita errores por buscar elementos (como #compoundForm) que no
   existen en estas páginas.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileNav();
  initCookieConsent();
  initBlogSearch();
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

/* ---------------------------------------------------------------
   Theme toggle (idéntico en comportamiento al de script.js)
---------------------------------------------------------------- */
function initTheme() {
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  let theme = prefersDark ? 'dark' : 'light';
  applyTheme(theme);

  toggle.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    applyTheme(theme);
  });

  function applyTheme(t) {
    if (t === 'dark') {
      root.setAttribute('data-theme', 'dark');
      toggle.setAttribute('aria-pressed', 'true');
    } else {
      root.removeAttribute('data-theme');
      toggle.setAttribute('aria-pressed', 'false');
    }
  }
}

/* ---------------------------------------------------------------
   Mobile navigation
---------------------------------------------------------------- */
function initMobileNav() {
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (!navToggle || !navLinks) return;

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------------------------------------------------------------
   Cookie consent banner (misma lógica que en script.js, cookie
   compartida "ai_cookie_consent" para que la decisión del usuario
   se respete en todo el sitio, no solo en la home).
---------------------------------------------------------------- */
function initCookieConsent() {
  const banner = document.getElementById('cookieBanner');
  if (!banner) return;
  const acceptBtn = document.getElementById('cookieAccept');
  const rejectBtn = document.getElementById('cookieReject');

  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  }
  function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  }

  const consent = getCookie('ai_cookie_consent');
  if (!consent) banner.classList.add('is-visible');

  if (acceptBtn) acceptBtn.addEventListener('click', () => {
    setCookie('ai_cookie_consent', 'accepted', 180);
    banner.classList.remove('is-visible');
  });
  if (rejectBtn) rejectBtn.addEventListener('click', () => {
    setCookie('ai_cookie_consent', 'rejected', 180);
    banner.classList.remove('is-visible');
    document.querySelectorAll('.ad-slot').forEach(slot => slot.remove());
  });
}

/* ---------------------------------------------------------------
   Buscador en vivo para la portada del blog (blog/index.html)
---------------------------------------------------------------- */
function initBlogSearch() {
  const input = document.getElementById('blogSearchInput');
  const cards = document.querySelectorAll('.blog-card');
  const emptyState = document.getElementById('blogEmptyState');
  if (!input || !cards.length) return;

  input.addEventListener('input', () => {
    const term = input.value.trim().toLowerCase();
    let visibleCount = 0;
    cards.forEach(card => {
      const haystack = card.textContent.toLowerCase();
      const match = haystack.includes(term);
      card.style.display = match ? '' : 'none';
      if (match) visibleCount++;
    });
    if (emptyState) emptyState.classList.toggle('is-visible', visibleCount === 0);
  });
}
