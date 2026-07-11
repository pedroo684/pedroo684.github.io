'use strict';

/* ==========================================================================
   herramientas.js — JavaScript compartido para la sección "Herramientas"
   (tema, menú móvil, aviso de cookies). Misma lógica que blog.js, en un
   archivo independiente para que cada sección conserve sus propias
   dependencias y no haya que tocar archivos ya existentes.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileNav();
  initCookieConsent();
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

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
    document.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme } }));
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
