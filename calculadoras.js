'use strict';

/* ==========================================================================
   calculadoras.js — JavaScript ADITIVO para la sección de calculadoras.
   Un único archivo compartido por todas las páginas de calculadora. Cada
   función de inicialización comprueba primero si sus elementos existen en
   la página actual, así que es seguro cargar este mismo script en todas
   ellas sin que una calculadora rompa a otra.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileNav();
  initCookieConsent();
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  initCompoundAdvanced();
  initInflationCalc();
  initRetirementCalc();
  initFireCalc();
  initFutureValueCalc();
  initPresentValueCalc();
  initNetWorthCalc();
  initDividendCalc();
  initMonthlyContributionCalc();
  initGoalCalc();
  initHistoricalGrowthCalc();
  initSafeWithdrawalCalc();
});

/* ---------------- Shared: theme / nav / cookies ---------------- */
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
    document.dispatchEvent(new CustomEvent('themechange'));
  });
  function applyTheme(t) {
    if (t === 'dark') { root.setAttribute('data-theme', 'dark'); toggle.setAttribute('aria-pressed', 'true'); }
    else { root.removeAttribute('data-theme'); toggle.setAttribute('aria-pressed', 'false'); }
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
  if (!getCookie('ai_cookie_consent')) banner.classList.add('is-visible');
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

/* ---------------- Shared helpers ---------------- */
function fmtEUR(n) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
}
function chartColors() {
  const s = getComputedStyle(document.documentElement);
  return {
    accent: s.getPropertyValue('--color-brass').trim() || '#a8763a',
    emerald: s.getPropertyValue('--color-emerald').trim() || '#1f6f5c',
    signal: s.getPropertyValue('--color-signal').trim() || '#b23a24',
    slate: s.getPropertyValue('--text-muted').trim() || '#5c6b7a',
    grid: s.getPropertyValue('--border').trim() || 'rgba(0,0,0,0.08)'
  };
}

/* =================================================================
   1) Interés compuesto avanzado
   Capital inicial, aporte mensual con crecimiento anual opcional,
   frecuencia de capitalización, ajuste por inflación.
================================================================= */
function initCompoundAdvanced() {
  const form = document.getElementById('compoundAdvForm');
  if (!form) return;

  const initial = document.getElementById('caInitial');
  const monthly = document.getElementById('caMonthly');
  const monthlyGrowth = document.getElementById('caMonthlyGrowth');
  const rate = document.getElementById('caRate');
  const years = document.getElementById('caYears');
  const inflation = document.getElementById('caInflation');
  const adjustInflation = document.getElementById('caAdjustInflation');

  const resContributed = document.getElementById('caResContributed');
  const resGains = document.getElementById('caResGains');
  const resFinal = document.getElementById('caResFinal');
  const resReal = document.getElementById('caResReal');

  const ctx = document.getElementById('caChart').getContext('2d');
  let chart;

  function calculate() {
    const P0 = Math.max(0, parseFloat(initial.value) || 0);
    let monthlyAmt = Math.max(0, parseFloat(monthly.value) || 0);
    const growth = Math.max(0, parseFloat(monthlyGrowth.value) || 0) / 100;
    const annualRate = Math.max(0, parseFloat(rate.value) || 0) / 100;
    const yrs = Math.max(1, parseInt(years.value) || 1);
    const infl = Math.max(0, parseFloat(inflation.value) || 0) / 100;
    const monthlyRate = annualRate / 12;

    let balance = P0, contributed = P0;
    const labels = ['0'], balances = [balance], contributions = [contributed];

    for (let y = 1; y <= yrs; y++) {
      for (let m = 1; m <= 12; m++) {
        balance = balance * (1 + monthlyRate) + monthlyAmt;
        contributed += monthlyAmt;
      }
      monthlyAmt = monthlyAmt * (1 + growth);
      labels.push(String(y));
      balances.push(Math.round(balance));
      contributions.push(Math.round(contributed));
    }

    const finalValue = balance;
    const gains = finalValue - contributed;
    const realValue = adjustInflation.checked ? finalValue / Math.pow(1 + infl, yrs) : null;

    resContributed.textContent = fmtEUR(contributed);
    resGains.textContent = fmtEUR(gains);
    resFinal.textContent = fmtEUR(finalValue);
    if (realValue !== null) {
      resReal.parentElement.style.display = '';
      resReal.textContent = fmtEUR(realValue);
    } else {
      resReal.parentElement.style.display = 'none';
    }

    const c = chartColors();
    if (chart) chart.destroy();
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels.map(y => `Año ${y}`),
        datasets: [
          { label: 'Valor nominal', data: balances, borderColor: c.accent, backgroundColor: 'rgba(168,118,58,0.15)', fill: true, tension: 0.3, pointRadius: 0, borderWidth: 2.5 },
          { label: 'Aportado', data: contributions, borderColor: c.slate, borderDash: [5, 5], fill: false, pointRadius: 0, borderWidth: 1.5 }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false },
        plugins: { legend: { labels: { color: c.slate } }, tooltip: { callbacks: { label: (i) => `${i.dataset.label}: ${fmtEUR(i.parsed.y)}` } } },
        scales: { x: { ticks: { color: c.slate, maxTicksLimit: 8 }, grid: { color: c.grid } }, y: { ticks: { color: c.slate, callback: v => fmtEUR(v) }, grid: { color: c.grid } } }
      }
    });
  }

  form.addEventListener('input', calculate);
  calculate();
}

/* =================================================================
   2) Calculadora de inflación
================================================================= */
function initInflationCalc() {
  const form = document.getElementById('inflationForm');
  if (!form) return;

  const amount = document.getElementById('infAmount');
  const rate = document.getElementById('infRate');
  const years = document.getElementById('infYears');
  const resFuturePrice = document.getElementById('infResFuturePrice');
  const resPurchasingPower = document.getElementById('infResPurchasingPower');
  const resNeeded = document.getElementById('infResNeeded');

  const ctx = document.getElementById('infChart').getContext('2d');
  let chart;

  function calculate() {
    const amt = Math.max(0, parseFloat(amount.value) || 0);
    const r = Math.max(0, parseFloat(rate.value) || 0) / 100;
    const yrs = Math.max(1, parseInt(years.value) || 1);

    const futurePrice = amt * Math.pow(1 + r, yrs);
    const purchasingPower = amt / Math.pow(1 + r, yrs);
    const needed = amt * Math.pow(1 + r, yrs);

    resFuturePrice.textContent = fmtEUR(futurePrice);
    resPurchasingPower.textContent = fmtEUR(purchasingPower);
    resNeeded.textContent = fmtEUR(needed);

    const labels = [], nominal = [], real = [];
    for (let y = 0; y <= yrs; y++) {
      labels.push(`Año ${y}`);
      nominal.push(Math.round(amt));
      real.push(Math.round(amt / Math.pow(1 + r, y)));
    }

    const c = chartColors();
    if (chart) chart.destroy();
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: 'Importe nominal (sin cambiar)', data: nominal, borderColor: c.slate, borderDash: [5, 5], fill: false, pointRadius: 0, borderWidth: 2 },
          { label: 'Poder de compra real', data: real, borderColor: c.signal, backgroundColor: 'rgba(178,58,36,0.12)', fill: true, tension: 0.3, pointRadius: 0, borderWidth: 2.5 }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: c.slate } }, tooltip: { callbacks: { label: (i) => `${i.dataset.label}: ${fmtEUR(i.parsed.y)}` } } },
        scales: { x: { ticks: { color: c.slate, maxTicksLimit: 8 }, grid: { color: c.grid } }, y: { ticks: { color: c.slate, callback: v => fmtEUR(v) }, grid: { color: c.grid } } }
      }
    });
  }

  form.addEventListener('input', calculate);
  calculate();
}

/* =================================================================
   3) Calculadora de jubilación
================================================================= */
function initRetirementCalc() {
  const form = document.getElementById('retirementForm');
  if (!form) return;

  const currentAge = document.getElementById('retCurrentAge');
  const retireAge = document.getElementById('retRetireAge');
  const currentSavings = document.getElementById('retCurrentSavings');
  const monthly = document.getElementById('retMonthly');
  const rate = document.getElementById('retRate');
  const annualSpend = document.getElementById('retAnnualSpend');
  const withdrawalRate = document.getElementById('retWithdrawalRate');

  const resCapital = document.getElementById('retResCapital');
  const resNeeded = document.getElementById('retResNeeded');
  const resStatus = document.getElementById('retResStatus');

  const ctx = document.getElementById('retChart').getContext('2d');
  let chart;

  function calculate() {
    const age0 = Math.max(16, parseInt(currentAge.value) || 30);
    const ageR = Math.max(age0 + 1, parseInt(retireAge.value) || 65);
    const yrs = ageR - age0;
    const P0 = Math.max(0, parseFloat(currentSavings.value) || 0);
    const m = Math.max(0, parseFloat(monthly.value) || 0);
    const r = Math.max(0, parseFloat(rate.value) || 0) / 100;
    const spend = Math.max(0, parseFloat(annualSpend.value) || 0);
    const wRate = Math.max(1, parseFloat(withdrawalRate.value) || 4) / 100;
    const monthlyRate = r / 12;

    let balance = P0;
    const labels = [String(age0)], balances = [Math.round(balance)];
    for (let y = 1; y <= yrs; y++) {
      for (let mo = 1; mo <= 12; mo++) balance = balance * (1 + monthlyRate) + m;
      labels.push(String(age0 + y));
      balances.push(Math.round(balance));
    }

    const capitalAtRetirement = balance;
    const capitalNeeded = spend / wRate;

    resCapital.textContent = fmtEUR(capitalAtRetirement);
    resNeeded.textContent = fmtEUR(capitalNeeded);
    if (capitalAtRetirement >= capitalNeeded) {
      resStatus.textContent = 'Tu proyección supera el capital estimado necesario.';
      resStatus.style.color = 'var(--color-emerald)';
    } else {
      const gap = capitalNeeded - capitalAtRetirement;
      resStatus.textContent = `Faltarían aprox. ${fmtEUR(gap)} respecto al capital estimado necesario.`;
      resStatus.style.color = 'var(--color-signal)';
    }

    const c = chartColors();
    if (chart) chart.destroy();
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels.map(a => `${a} años`),
        datasets: [
          { label: 'Capital proyectado', data: balances, borderColor: c.accent, backgroundColor: 'rgba(168,118,58,0.15)', fill: true, tension: 0.3, pointRadius: 0, borderWidth: 2.5 },
          { label: 'Capital estimado necesario', data: labels.map(() => Math.round(capitalNeeded)), borderColor: c.signal, borderDash: [5, 5], fill: false, pointRadius: 0, borderWidth: 1.5 }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: c.slate } }, tooltip: { callbacks: { label: (i) => `${i.dataset.label}: ${fmtEUR(i.parsed.y)}` } } },
        scales: { x: { ticks: { color: c.slate, maxTicksLimit: 8 }, grid: { color: c.grid } }, y: { ticks: { color: c.slate, callback: v => fmtEUR(v) }, grid: { color: c.grid } } }
      }
    });
  }

  form.addEventListener('input', calculate);
  calculate();
}

/* =================================================================
   4) Calculadora FIRE (Financial Independence, Retire Early)
================================================================= */
function initFireCalc() {
  const form = document.getElementById('fireForm');
  if (!form) return;

  const annualExpenses = document.getElementById('fireExpenses');
  const withdrawalRate = document.getElementById('fireWithdrawalRate');
  const currentSavings = document.getElementById('fireCurrentSavings');
  const monthly = document.getElementById('fireMonthly');
  const rate = document.getElementById('fireRate');

  const resNumber = document.getElementById('fireResNumber');
  const resYears = document.getElementById('fireResYears');
  const resDate = document.getElementById('fireResDate');

  const ctx = document.getElementById('fireChart').getContext('2d');
  let chart;

  function calculate() {
    const expenses = Math.max(0, parseFloat(annualExpenses.value) || 0);
    const wRate = Math.max(1, parseFloat(withdrawalRate.value) || 4) / 100;
    const P0 = Math.max(0, parseFloat(currentSavings.value) || 0);
    const m = Math.max(0, parseFloat(monthly.value) || 0);
    const r = Math.max(0, parseFloat(rate.value) || 0) / 100;
    const monthlyRate = r / 12;

    const fireNumber = expenses / wRate;
    resNumber.textContent = fmtEUR(fireNumber);

    let balance = P0, months = 0;
    const labels = ['0'], balances = [Math.round(balance)];
    const maxMonths = 70 * 12;
    while (balance < fireNumber && months < maxMonths) {
      balance = balance * (1 + monthlyRate) + m;
      months++;
      if (months % 12 === 0) {
        labels.push(String(months / 12));
        balances.push(Math.round(balance));
      }
    }

    if (balance >= fireNumber) {
      const yrs = (months / 12).toFixed(1);
      resYears.textContent = `${yrs} años`;
      const today = new Date();
      const targetYear = today.getFullYear() + Math.ceil(months / 12);
      resDate.textContent = `Aproximadamente en ${targetYear}`;
    } else {
      resYears.textContent = 'Más de 70 años con estos parámetros';
      resDate.textContent = 'Prueba a aumentar el aporte mensual o el rendimiento esperado';
    }

    const c = chartColors();
    if (chart) chart.destroy();
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels.map(y => `Año ${y}`),
        datasets: [
          { label: 'Patrimonio proyectado', data: balances, borderColor: c.accent, backgroundColor: 'rgba(168,118,58,0.15)', fill: true, tension: 0.3, pointRadius: 0, borderWidth: 2.5 },
          { label: 'Número FIRE (objetivo)', data: labels.map(() => Math.round(fireNumber)), borderColor: c.emerald, borderDash: [5, 5], fill: false, pointRadius: 0, borderWidth: 1.5 }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: c.slate } }, tooltip: { callbacks: { label: (i) => `${i.dataset.label}: ${fmtEUR(i.parsed.y)}` } } },
        scales: { x: { ticks: { color: c.slate, maxTicksLimit: 8 }, grid: { color: c.grid } }, y: { ticks: { color: c.slate, callback: v => fmtEUR(v) }, grid: { color: c.grid } } }
      }
    });
  }

  form.addEventListener('input', calculate);
  calculate();
}

/* =================================================================
   5) Calculadora de valor futuro
================================================================= */
function initFutureValueCalc() {
  const form = document.getElementById('fvForm');
  if (!form) return;

  const present = document.getElementById('fvPresent');
  const rate = document.getElementById('fvRate');
  const years = document.getElementById('fvYears');
  const resFuture = document.getElementById('fvResFuture');
  const resGrowth = document.getElementById('fvResGrowth');

  const ctx = document.getElementById('fvChart').getContext('2d');
  let chart;

  function calculate() {
    const P = Math.max(0, parseFloat(present.value) || 0);
    const r = Math.max(0, parseFloat(rate.value) || 0) / 100;
    const yrs = Math.max(1, parseInt(years.value) || 1);

    const labels = [], values = [];
    for (let y = 0; y <= yrs; y++) {
      labels.push(`Año ${y}`);
      values.push(Math.round(P * Math.pow(1 + r, y)));
    }
    const future = P * Math.pow(1 + r, yrs);

    resFuture.textContent = fmtEUR(future);
    resGrowth.textContent = fmtEUR(future - P);

    const c = chartColors();
    if (chart) chart.destroy();
    chart = new Chart(ctx, {
      type: 'line',
      data: { labels, datasets: [{ label: 'Valor futuro', data: values, borderColor: c.accent, backgroundColor: 'rgba(168,118,58,0.15)', fill: true, tension: 0.3, pointRadius: 0, borderWidth: 2.5 }] },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (i) => fmtEUR(i.parsed.y) } } },
        scales: { x: { ticks: { color: c.slate, maxTicksLimit: 8 }, grid: { color: c.grid } }, y: { ticks: { color: c.slate, callback: v => fmtEUR(v) }, grid: { color: c.grid } } }
      }
    });
  }

  form.addEventListener('input', calculate);
  calculate();
}

/* =================================================================
   6) Calculadora de valor presente
================================================================= */
function initPresentValueCalc() {
  const form = document.getElementById('pvForm');
  if (!form) return;

  const future = document.getElementById('pvFuture');
  const rate = document.getElementById('pvRate');
  const years = document.getElementById('pvYears');
  const resPresent = document.getElementById('pvResPresent');
  const resDiscount = document.getElementById('pvResDiscount');

  const ctx = document.getElementById('pvChart').getContext('2d');
  let chart;

  function calculate() {
    const F = Math.max(0, parseFloat(future.value) || 0);
    const r = Math.max(0, parseFloat(rate.value) || 0) / 100;
    const yrs = Math.max(1, parseInt(years.value) || 1);

    const present = F / Math.pow(1 + r, yrs);
    resPresent.textContent = fmtEUR(present);
    resDiscount.textContent = fmtEUR(F - present);

    const labels = [], values = [];
    for (let y = 0; y <= yrs; y++) {
      const remainingYears = yrs - y;
      labels.push(`Año ${y}`);
      values.push(Math.round(F / Math.pow(1 + r, remainingYears)));
    }

    const c = chartColors();
    if (chart) chart.destroy();
    chart = new Chart(ctx, {
      type: 'line',
      data: { labels, datasets: [{ label: 'Valor equivalente hoy', data: values, borderColor: c.emerald, backgroundColor: 'rgba(31,111,92,0.15)', fill: true, tension: 0.3, pointRadius: 0, borderWidth: 2.5 }] },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (i) => fmtEUR(i.parsed.y) } } },
        scales: { x: { ticks: { color: c.slate, maxTicksLimit: 8 }, grid: { color: c.grid } }, y: { ticks: { color: c.slate, callback: v => fmtEUR(v) }, grid: { color: c.grid } } }
      }
    });
  }

  form.addEventListener('input', calculate);
  calculate();
}

/* =================================================================
   7) Calculadora de patrimonio neto
================================================================= */
function initNetWorthCalc() {
  const form = document.getElementById('nwForm');
  if (!form) return;

  const cash = document.getElementById('nwCash');
  const investments = document.getElementById('nwInvestments');
  const realEstate = document.getElementById('nwRealEstate');
  const other = document.getElementById('nwOther');
  const debts = document.getElementById('nwDebts');

  const resAssets = document.getElementById('nwResAssets');
  const resDebts = document.getElementById('nwResDebts');
  const resNet = document.getElementById('nwResNet');

  const ctx = document.getElementById('nwChart').getContext('2d');
  let chart;

  function calculate() {
    const c = Math.max(0, parseFloat(cash.value) || 0);
    const inv = Math.max(0, parseFloat(investments.value) || 0);
    const re = Math.max(0, parseFloat(realEstate.value) || 0);
    const ot = Math.max(0, parseFloat(other.value) || 0);
    const d = Math.max(0, parseFloat(debts.value) || 0);

    const totalAssets = c + inv + re + ot;
    const netWorth = totalAssets - d;

    resAssets.textContent = fmtEUR(totalAssets);
    resDebts.textContent = fmtEUR(d);
    resNet.textContent = fmtEUR(netWorth);

    const colors = chartColors();
    if (chart) chart.destroy();
    chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Efectivo/ahorro', 'Inversiones', 'Inmuebles', 'Otros activos', 'Deudas'],
        datasets: [{
          data: [c, inv, re, ot, d],
          backgroundColor: [colors.slate, colors.accent, colors.emerald, '#8c5f2c', colors.signal],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: colors.slate, boxWidth: 12, padding: 14 } },
          tooltip: { callbacks: { label: (i) => `${i.label}: ${fmtEUR(i.parsed)}` } }
        }
      }
    });
  }

  form.addEventListener('input', calculate);
  calculate();
}

/* =================================================================
   8) Calculadora de dividendos
================================================================= */
function initDividendCalc() {
  const form = document.getElementById('divForm');
  if (!form) return;

  const capital = document.getElementById('divCapital');
  const yieldPct = document.getElementById('divYield');
  const growth = document.getElementById('divGrowth');
  const years = document.getElementById('divYears');
  const reinvest = document.getElementById('divReinvest');

  const resFirstYear = document.getElementById('divResFirstYear');
  const resTotal = document.getElementById('divResTotal');
  const resFinalCapital = document.getElementById('divResFinalCapital');

  const ctx = document.getElementById('divChart').getContext('2d');
  let chart;

  function calculate() {
    const P0 = Math.max(0, parseFloat(capital.value) || 0);
    const y0 = Math.max(0, parseFloat(yieldPct.value) || 0) / 100;
    const g = Math.max(0, parseFloat(growth.value) || 0) / 100;
    const yrs = Math.max(1, parseInt(years.value) || 1);
    const doReinvest = reinvest.checked;

    let capitalBalance = P0;
    let yieldRate = y0;
    let totalDividends = 0;
    const labels = ['0'], dividendSeries = [0], capitalSeries = [P0];

    for (let year = 1; year <= yrs; year++) {
      const dividendThisYear = capitalBalance * yieldRate;
      totalDividends += dividendThisYear;
      if (doReinvest) capitalBalance += dividendThisYear;
      labels.push(String(year));
      dividendSeries.push(Math.round(dividendThisYear));
      capitalSeries.push(Math.round(capitalBalance));
      yieldRate = y0 * Math.pow(1 + g, year);
    }

    const firstYearDividend = P0 * y0;
    resFirstYear.textContent = fmtEUR(firstYearDividend);
    resTotal.textContent = fmtEUR(totalDividends);
    resFinalCapital.textContent = fmtEUR(doReinvest ? capitalBalance : P0);

    const c = chartColors();
    if (chart) chart.destroy();
    chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels.map(y => `Año ${y}`),
        datasets: [{ label: 'Dividendo anual estimado', data: dividendSeries, backgroundColor: c.accent, borderRadius: 4 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (i) => fmtEUR(i.parsed.y) } } },
        scales: { x: { ticks: { color: c.slate, maxTicksLimit: 8 }, grid: { display: false } }, y: { ticks: { color: c.slate, callback: v => fmtEUR(v) }, grid: { color: c.grid } } }
      }
    });
  }

  form.addEventListener('input', calculate);
  calculate();
}

/* =================================================================
   9) Calculadora de aportes mensuales (comparador)
   Compara 3 escenarios de aporte mensual distinto sobre el mismo
   capital inicial, años y rendimiento.
================================================================= */
function initMonthlyContributionCalc() {
  const form = document.getElementById('mcForm');
  if (!form) return;

  const initial = document.getElementById('mcInitial');
  const m1 = document.getElementById('mcMonthly1');
  const m2 = document.getElementById('mcMonthly2');
  const m3 = document.getElementById('mcMonthly3');
  const rate = document.getElementById('mcRate');
  const years = document.getElementById('mcYears');

  const resFinal1 = document.getElementById('mcResFinal1');
  const resFinal2 = document.getElementById('mcResFinal2');
  const resFinal3 = document.getElementById('mcResFinal3');

  const ctx = document.getElementById('mcChart').getContext('2d');
  let chart;

  function project(P0, monthly, annualRate, yrs) {
    const monthlyRate = annualRate / 12;
    let balance = P0;
    const series = [Math.round(balance)];
    for (let y = 1; y <= yrs; y++) {
      for (let mo = 1; mo <= 12; mo++) balance = balance * (1 + monthlyRate) + monthly;
      series.push(Math.round(balance));
    }
    return series;
  }

  function calculate() {
    const P0 = Math.max(0, parseFloat(initial.value) || 0);
    const monthly1 = Math.max(0, parseFloat(m1.value) || 0);
    const monthly2 = Math.max(0, parseFloat(m2.value) || 0);
    const monthly3 = Math.max(0, parseFloat(m3.value) || 0);
    const r = Math.max(0, parseFloat(rate.value) || 0) / 100;
    const yrs = Math.max(1, parseInt(years.value) || 1);

    const s1 = project(P0, monthly1, r, yrs);
    const s2 = project(P0, monthly2, r, yrs);
    const s3 = project(P0, monthly3, r, yrs);

    resFinal1.textContent = fmtEUR(s1[s1.length - 1]);
    resFinal2.textContent = fmtEUR(s2[s2.length - 1]);
    resFinal3.textContent = fmtEUR(s3[s3.length - 1]);

    const labels = s1.map((_, i) => `Año ${i}`);
    const c = chartColors();
    if (chart) chart.destroy();
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: `${monthly1} €/mes`, data: s1, borderColor: c.slate, fill: false, tension: 0.3, pointRadius: 0, borderWidth: 2 },
          { label: `${monthly2} €/mes`, data: s2, borderColor: c.accent, fill: false, tension: 0.3, pointRadius: 0, borderWidth: 2.5 },
          { label: `${monthly3} €/mes`, data: s3, borderColor: c.emerald, fill: false, tension: 0.3, pointRadius: 0, borderWidth: 2.5 }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false },
        plugins: { legend: { labels: { color: c.slate } }, tooltip: { callbacks: { label: (i) => `${i.dataset.label}: ${fmtEUR(i.parsed.y)}` } } },
        scales: { x: { ticks: { color: c.slate, maxTicksLimit: 8 }, grid: { color: c.grid } }, y: { ticks: { color: c.slate, callback: v => fmtEUR(v) }, grid: { color: c.grid } } }
      }
    });
  }

  form.addEventListener('input', calculate);
  calculate();
}

/* =================================================================
   10) Calculadora de objetivo financiero
   Dado un objetivo y años, calcula el aporte mensual necesario
   a una tasa de rendimiento dada.
================================================================= */
function initGoalCalc() {
  const form = document.getElementById('goalForm2');
  if (!form) return;

  const target = document.getElementById('goal2Amount');
  const yrsInput = document.getElementById('goal2Years');
  const initialInput = document.getElementById('goal2Initial');
  const rateInput = document.getElementById('goal2Rate');

  const resMonthly = document.getElementById('goal2ResMonthly');
  const resTotalContributed = document.getElementById('goal2ResContributed');

  const ctx = document.getElementById('goal2Chart').getContext('2d');
  let chart;

  function requiredMonthly(target, initial, annualRate, years) {
    const monthlyRate = annualRate / 12;
    const months = years * 12;
    const fvInitial = initial * Math.pow(1 + monthlyRate, months);
    const remaining = target - fvInitial;
    if (remaining <= 0) return 0;
    if (monthlyRate === 0) return remaining / months;
    const factor = (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
    return remaining / factor;
  }

  function calculate() {
    const T = Math.max(1000, parseFloat(target.value) || 0);
    const yrs = Math.max(1, parseInt(yrsInput.value) || 1);
    const P0 = Math.max(0, parseFloat(initialInput.value) || 0);
    const r = Math.max(0, parseFloat(rateInput.value) || 0) / 100;

    const monthly = requiredMonthly(T, P0, r, yrs);
    resMonthly.textContent = fmtEUR(monthly);
    resTotalContributed.textContent = fmtEUR(P0 + monthly * yrs * 12);

    const monthlyRate = r / 12;
    let balance = P0;
    const labels = ['0'], series = [Math.round(balance)];
    for (let y = 1; y <= yrs; y++) {
      for (let mo = 1; mo <= 12; mo++) balance = balance * (1 + monthlyRate) + monthly;
      labels.push(String(y));
      series.push(Math.round(balance));
    }

    const c = chartColors();
    if (chart) chart.destroy();
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels.map(y => `Año ${y}`),
        datasets: [
          { label: 'Capital proyectado', data: series, borderColor: c.accent, backgroundColor: 'rgba(168,118,58,0.15)', fill: true, tension: 0.3, pointRadius: 0, borderWidth: 2.5 },
          { label: 'Objetivo', data: labels.map(() => Math.round(T)), borderColor: c.emerald, borderDash: [5, 5], fill: false, pointRadius: 0, borderWidth: 1.5 }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: c.slate } }, tooltip: { callbacks: { label: (i) => `${i.dataset.label}: ${fmtEUR(i.parsed.y)}` } } },
        scales: { x: { ticks: { color: c.slate, maxTicksLimit: 8 }, grid: { color: c.grid } }, y: { ticks: { color: c.slate, callback: v => fmtEUR(v) }, grid: { color: c.grid } } }
      }
    });
  }

  form.addEventListener('input', calculate);
  calculate();
}

/* =================================================================
   11) Calculadora de crecimiento histórico
   Proyecta un capital según la rentabilidad histórica aproximada
   de un activo predefinido (selector).
================================================================= */
function initHistoricalGrowthCalc() {
  const form = document.getElementById('hgForm');
  if (!form) return;

  const asset = document.getElementById('hgAsset');
  const capital = document.getElementById('hgCapital');
  const years = document.getElementById('hgYears');
  const customRate = document.getElementById('hgCustomRate');
  const customRateRow = document.getElementById('hgCustomRateRow');

  const resFinal = document.getElementById('hgResFinal');
  const resRateUsed = document.getElementById('hgResRateUsed');

  const ctx = document.getElementById('hgChart').getContext('2d');
  let chart;

  const presetRates = {
    sp500: 10, nasdaq100: 13, vti: 10, bonos: 4, oro: 7, smh: 15, custom: null
  };

  function toggleCustomRow() {
    customRateRow.style.display = asset.value === 'custom' ? '' : 'none';
  }

  function calculate() {
    toggleCustomRow();
    const P0 = Math.max(0, parseFloat(capital.value) || 0);
    const yrs = Math.max(1, parseInt(years.value) || 1);
    const rate = (asset.value === 'custom' ? (parseFloat(customRate.value) || 0) : presetRates[asset.value]) / 100;

    const labels = [], values = [];
    for (let y = 0; y <= yrs; y++) {
      labels.push(`Año ${y}`);
      values.push(Math.round(P0 * Math.pow(1 + rate, y)));
    }
    const final = P0 * Math.pow(1 + rate, yrs);

    resFinal.textContent = fmtEUR(final);
    resRateUsed.textContent = `${(rate * 100).toFixed(1)}% anual aprox.`;

    const c = chartColors();
    if (chart) chart.destroy();
    chart = new Chart(ctx, {
      type: 'line',
      data: { labels, datasets: [{ label: 'Capital proyectado', data: values, borderColor: c.accent, backgroundColor: 'rgba(168,118,58,0.15)', fill: true, tension: 0.3, pointRadius: 0, borderWidth: 2.5 }] },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (i) => fmtEUR(i.parsed.y) } } },
        scales: { x: { ticks: { color: c.slate, maxTicksLimit: 8 }, grid: { color: c.grid } }, y: { ticks: { color: c.slate, callback: v => fmtEUR(v) }, grid: { color: c.grid } } }
      }
    });
  }

  form.addEventListener('input', calculate);
  asset.addEventListener('change', calculate);
  calculate();
}

/* =================================================================
   12) Calculadora de retiro seguro
   Simula cuánto podría durar un capital retirando cada año un
   importe ajustado por inflación, con el resto siguiendo invertido.
================================================================= */
function initSafeWithdrawalCalc() {
  const form = document.getElementById('swForm');
  if (!form) return;

  const capital = document.getElementById('swCapital');
  const withdrawal = document.getElementById('swWithdrawal');
  const rate = document.getElementById('swRate');
  const inflation = document.getElementById('swInflation');

  const resDuration = document.getElementById('swResDuration');
  const resFirstWithdrawal = document.getElementById('swResFirstWithdrawal');

  const ctx = document.getElementById('swChart').getContext('2d');
  let chart;

  function calculate() {
    const P0 = Math.max(0, parseFloat(capital.value) || 0);
    const wRate = Math.max(0.5, parseFloat(withdrawal.value) || 4) / 100;
    const r = Math.max(0, parseFloat(rate.value) || 0) / 100;
    const infl = Math.max(0, parseFloat(inflation.value) || 0) / 100;

    let balance = P0;
    let annualWithdrawal = P0 * wRate;
    resFirstWithdrawal.textContent = fmtEUR(annualWithdrawal);

    const labels = ['0'], series = [Math.round(balance)];
    const maxYears = 60;
    let year = 0;
    while (balance > 0 && year < maxYears) {
      balance = balance * (1 + r) - annualWithdrawal;
      annualWithdrawal = annualWithdrawal * (1 + infl);
      year++;
      labels.push(String(year));
      series.push(Math.round(Math.max(0, balance)));
      if (balance <= 0) break;
    }

    if (balance > 0) {
      resDuration.textContent = `Más de ${maxYears} años (no se agota con estos parámetros)`;
    } else {
      resDuration.textContent = `Aproximadamente ${year} años`;
    }

    const c = chartColors();
    if (chart) chart.destroy();
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels.map(y => `Año ${y}`),
        datasets: [{ label: 'Capital restante', data: series, borderColor: c.signal, backgroundColor: 'rgba(178,58,36,0.12)', fill: true, tension: 0.3, pointRadius: 0, borderWidth: 2.5 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (i) => fmtEUR(i.parsed.y) } } },
        scales: { x: { ticks: { color: c.slate, maxTicksLimit: 10 }, grid: { color: c.grid } }, y: { ticks: { color: c.slate, callback: v => fmtEUR(v) }, grid: { color: c.grid } } }
      }
    });
  }

  form.addEventListener('input', calculate);
  calculate();
}
