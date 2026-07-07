'use strict';

/* ==========================================================================
   ACADEMIA DE INVERSIÓN — script.js
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileNav();
  initHeroChart();
  initCompoundCalculator();
  initGoalCalculator();
  initAccordion();
  initScrollReveal();
  initCookieConsent();
  document.getElementById('year').textContent = new Date().getFullYear();
});

/* ---------------------------------------------------------------
   Cookie consent banner (basic EU/AdSense-compliant notice).
   Uses a plain first-party cookie (not localStorage) so consent
   is remembered on return visits once the site is deployed live.
---------------------------------------------------------------- */
function initCookieConsent() {
  const banner = document.getElementById('cookieBanner');
  const acceptBtn = document.getElementById('cookieAccept');
  const rejectBtn = document.getElementById('cookieReject');
  if (!banner) return;

  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  }
  function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  }

  const consent = getCookie('ai_cookie_consent');
  if (!consent) {
    banner.classList.add('is-visible');
  }

  acceptBtn.addEventListener('click', () => {
    setCookie('ai_cookie_consent', 'accepted', 180);
    banner.classList.remove('is-visible');
  });
  rejectBtn.addEventListener('click', () => {
    setCookie('ai_cookie_consent', 'rejected', 180);
    banner.classList.remove('is-visible');
    // Remove ad slots if consent for personalized ads/cookies is rejected.
    document.querySelectorAll('.ad-slot').forEach(slot => slot.remove());
  });
}

/* ---------------------------------------------------------------
   Theme toggle (light / dark).
   Note: intentionally kept in-memory (no localStorage) so the page
   behaves consistently in every hosting/preview context; the
   starting theme follows the OS/browser preference.
---------------------------------------------------------------- */
function initTheme() {
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
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
   Hero signature: hand-drawn ascending "ledger" growth curve
   drawn on a canvas with a lightweight self-animating line.
---------------------------------------------------------------- */
function initHeroChart() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  // Synthetic compounding curve with gentle noise to feel "hand-charted"
  const points = [];
  const steps = 60;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const compound = Math.pow(1.08, t * 30); // ~8% growth over 30 yrs
    const noise = Math.sin(i * 1.3) * (0.02 * compound);
    points.push(compound + noise);
  }
  const maxVal = Math.max(...points);

  const styles = getComputedStyle(document.documentElement);
  let progress = 0;
  const total = points.length;

  function draw() {
    const rect = canvas.getBoundingClientRect();
    const w = rect.width, h = rect.height;
    ctx.clearRect(0, 0, w, h);

    const ink = getComputedStyle(document.documentElement).getPropertyValue('--text').trim();
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--color-brass').trim();
    const border = getComputedStyle(document.documentElement).getPropertyValue('--border').trim();

    // ledger grid lines
    ctx.strokeStyle = border || 'rgba(0,0,0,0.08)';
    ctx.lineWidth = 1;
    for (let g = 1; g < 4; g++) {
      const y = h - (g / 4) * (h - 30);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // curve
    const visiblePoints = Math.floor(progress);
    ctx.beginPath();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = accent || '#a8763a';
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    for (let i = 0; i <= visiblePoints && i < points.length; i++) {
      const x = (i / (total - 1)) * w;
      const y = h - (points[i] / maxVal) * (h - 30) - 6;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // filled area under curve
    if (visiblePoints > 1) {
      ctx.lineTo((Math.min(visiblePoints, total - 1) / (total - 1)) * w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, 'rgba(168,118,58,0.22)');
      grad.addColorStop(1, 'rgba(168,118,58,0)');
      ctx.fillStyle = grad;
      ctx.fill();
    }

    // marker dot at the end
    if (visiblePoints > 0) {
      const i = Math.min(visiblePoints, total - 1);
      const x = (i / (total - 1)) * w;
      const y = h - (points[i] / maxVal) * (h - 30) - 6;
      ctx.beginPath();
      ctx.arc(x, y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = accent || '#a8763a';
      ctx.fill();
    }

    if (progress < total) {
      progress += 0.7;
      requestAnimationFrame(draw);
    }
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        progress = 0;
        draw();
        io.disconnect();
      }
    });
  }, { threshold: 0.3 });
  io.observe(canvas);

  // redraw (static) on theme change
  document.getElementById('themeToggle').addEventListener('click', () => {
    setTimeout(() => { progress = total; draw(); }, 50);
  });
}

/* ---------------------------------------------------------------
   Compound interest calculator (Chart.js)
---------------------------------------------------------------- */
function initCompoundCalculator() {
  const form = document.getElementById('compoundForm');
  const initialInput = document.getElementById('initial');
  const monthlyInput = document.getElementById('monthly');
  const rateInput = document.getElementById('rate');
  const yearsInput = document.getElementById('years');

  const resContributed = document.getElementById('resContributed');
  const resGains = document.getElementById('resGains');
  const resFinal = document.getElementById('resFinal');

  const ctx = document.getElementById('compoundChart').getContext('2d');
  let chart;

  function fmt(n) {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
  }

  function calculate() {
    const initial = Math.max(0, parseFloat(initialInput.value) || 0);
    const monthly = Math.max(0, parseFloat(monthlyInput.value) || 0);
    const annualRate = Math.max(0, parseFloat(rateInput.value) || 0) / 100;
    const years = Math.max(1, parseInt(yearsInput.value) || 1);
    const monthlyRate = annualRate / 12;

    const labels = [];
    const balanceSeries = [];
    const contributedSeries = [];

    let balance = initial;
    let contributed = initial;
    labels.push('0');
    balanceSeries.push(balance);
    contributedSeries.push(contributed);

    for (let m = 1; m <= years * 12; m++) {
      balance = balance * (1 + monthlyRate) + monthly;
      contributed += monthly;
      if (m % 12 === 0) {
        labels.push(String(m / 12));
        balanceSeries.push(Math.round(balance));
        contributedSeries.push(Math.round(contributed));
      }
    }

    const finalValue = balance;
    const gains = finalValue - contributed;

    resContributed.textContent = fmt(contributed);
    resGains.textContent = fmt(gains);
    resFinal.textContent = fmt(finalValue);

    renderChart(labels, balanceSeries, contributedSeries);
  }

  function renderChart(labels, balanceSeries, contributedSeries) {
    const styles = getComputedStyle(document.documentElement);
    const accent = styles.getPropertyValue('--color-brass').trim() || '#a8763a';
    const slate = styles.getPropertyValue('--text-muted').trim() || '#5c6b7a';
    const gridColor = styles.getPropertyValue('--border').trim() || 'rgba(0,0,0,0.08)';

    if (chart) chart.destroy();
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels.map(y => `Año ${y}`),
        datasets: [
          {
            label: 'Valor total',
            data: balanceSeries,
            borderColor: accent,
            backgroundColor: 'rgba(168,118,58,0.15)',
            fill: true,
            tension: 0.3,
            pointRadius: 0,
            borderWidth: 2.5
          },
          {
            label: 'Capital aportado',
            data: contributedSeries,
            borderColor: slate,
            borderDash: [5, 5],
            fill: false,
            tension: 0.1,
            pointRadius: 0,
            borderWidth: 1.5
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { labels: { color: slate, font: { family: 'Inter' } } },
          tooltip: {
            callbacks: {
              label: (item) => `${item.dataset.label}: ${fmt(item.parsed.y)}`
            }
          }
        },
        scales: {
          x: { ticks: { color: slate, maxTicksLimit: 8 }, grid: { color: gridColor } },
          y: { ticks: { color: slate, callback: (v) => fmt(v) }, grid: { color: gridColor } }
        }
      }
    });
  }

  form.addEventListener('input', calculate);
  calculate();
}

/* ---------------------------------------------------------------
   Goal calculator: "Quiero llegar a X" -> aporte mensual necesario
---------------------------------------------------------------- */
function initGoalCalculator() {
  const form = document.getElementById('goalForm');
  const goalAmount = document.getElementById('goalAmount');
  const goalYears = document.getElementById('goalYears');
  const goalInitial = document.getElementById('goalInitial');
  const tbody = document.querySelector('#goalTable tbody');

  const rates = [0.04, 0.06, 0.08, 0.10, 0.12];

  function fmt(n) {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
  }

  function requiredMonthlyContribution(target, initial, annualRate, years) {
    const monthlyRate = annualRate / 12;
    const months = years * 12;
    const futureValueOfInitial = initial * Math.pow(1 + monthlyRate, months);
    const remaining = target - futureValueOfInitial;
    if (remaining <= 0) return 0;
    if (monthlyRate === 0) return remaining / months;
    const factor = (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
    return remaining / factor;
  }

  function calculate() {
    const target = Math.max(1000, parseFloat(goalAmount.value) || 0);
    const years = Math.max(1, parseInt(goalYears.value) || 1);
    const initial = Math.max(0, parseFloat(goalInitial.value) || 0);

    tbody.innerHTML = '';
    rates.forEach(rate => {
      const monthly = requiredMonthlyContribution(target, initial, rate, years);
      const tr = document.createElement('tr');
      tr.innerHTML = `<td data-label="Rendimiento">${(rate * 100).toFixed(0)}% anual</td><td data-label="Aporte">${fmt(monthly)} / mes</td>`;
      tbody.appendChild(tr);
    });
  }

  form.addEventListener('input', calculate);
  calculate();
}

/* ---------------------------------------------------------------
   FAQ accordion
---------------------------------------------------------------- */
function initAccordion() {
  const triggers = document.querySelectorAll('.accordion-trigger');
  triggers.forEach(trigger => {
    const panel = trigger.nextElementSibling;
    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      triggers.forEach(t => {
        t.setAttribute('aria-expanded', 'false');
        t.nextElementSibling.style.maxHeight = null;
      });

      if (!isOpen) {
        trigger.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });
}

/* ---------------------------------------------------------------
   Scroll reveal for cards/sections
---------------------------------------------------------------- */
function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.ledger-card, .concept-card, .asset-card, .portfolio-card, .error-card, .resource-card, .calc-panel'
  );
  targets.forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => io.observe(el));
}
