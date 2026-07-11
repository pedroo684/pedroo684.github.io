'use strict';

/* ==========================================================================
   simulador-portafolios.js
   Lógica del simulador de portafolios: el usuario reparte porcentajes
   entre 7 clases de activo y obtiene un gráfico circular, una proyección
   de crecimiento, una rentabilidad esperada aproximada, un riesgo
   estimado y una puntuación de diversificación.

   IMPORTANTE: las cifras de rentabilidad y riesgo por clase de activo son
   aproximaciones educativas basadas en promedios históricos de largo
   plazo, simplificadas para fines pedagógicos. No son una predicción ni
   una garantía de resultados futuros. El cálculo de riesgo combinado es
   una media ponderada simple (no tiene en cuenta la correlación real
   entre activos), lo que lo convierte en una estimación orientativa, no
   en un modelo de gestión de carteras profesional.
   ========================================================================== */

const ASSETS = {
  sp500:   { label: 'S&P 500',        return: 10,  risk: 15 },
  nasdaq:  { label: 'Nasdaq-100',     return: 13,  risk: 20 },
  bonos:   { label: 'Bonos',          return: 4,   risk: 6  },
  oro:     { label: 'Oro',            return: 6,   risk: 15 },
  bitcoin: { label: 'Bitcoin',        return: 20,  risk: 60 },
  reits:   { label: 'REITs',          return: 8,   risk: 18 },
  efectivo:{ label: 'Efectivo',       return: 2,   risk: 1  }
};

const ASSET_COLORS = {
  sp500: '#a8763a', nasdaq: '#8c5f2c', bonos: '#1f6f5c', oro: '#d9ad6b',
  bitcoin: '#b23a24', reits: '#5c6b7a', efectivo: '#93a2b0'
};

document.addEventListener('DOMContentLoaded', () => {
  const sliders = {};
  Object.keys(ASSETS).forEach(key => {
    sliders[key] = document.getElementById('asset-' + key);
  });
  const totalDisplay = document.getElementById('allocationTotal');
  const initialInput = document.getElementById('simInitial');
  const yearsInput = document.getElementById('simYears');

  let pieChart, growthChart;

  function getWeights() {
    const weights = {};
    Object.keys(ASSETS).forEach(key => {
      weights[key] = parseFloat(sliders[key].value) || 0;
    });
    return weights;
  }

  function totalOf(weights) {
    return Object.values(weights).reduce((a, b) => a + b, 0);
  }

  function fmtPct(n) { return `${n.toFixed(0)}%`; }
  function fmtCurrency(n) {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
  }

  function computeMetrics(weights, total) {
    // Normalize so the math works even if the user hasn't reached exactly 100%
    const norm = {};
    Object.keys(weights).forEach(key => {
      norm[key] = total > 0 ? weights[key] / total : 0;
    });

    const expectedReturn = Object.keys(ASSETS).reduce(
      (sum, key) => sum + norm[key] * ASSETS[key].return, 0
    );
    // Simplified weighted-average risk (does not model correlation between assets)
    const estimatedRisk = Object.keys(ASSETS).reduce(
      (sum, key) => sum + norm[key] * ASSETS[key].risk, 0
    );

    // Herfindahl index for diversification: lower = more diversified
    const herfindahl = Object.values(norm).reduce((sum, w) => sum + w * w, 0);
    const numAssets = Object.keys(ASSETS).length;
    const minHerfindahl = 1 / numAssets; // perfectly equal split across all assets
    const diversificationScore = herfindahl > 0
      ? Math.max(0, Math.min(100, (1 - (herfindahl - minHerfindahl) / (1 - minHerfindahl)) * 100))
      : 0;

    return { expectedReturn, estimatedRisk, diversificationScore, norm };
  }

  function riskLabel(risk) {
    if (risk < 8) return { text: 'Bajo', className: 'filled-low' };
    if (risk < 20) return { text: 'Medio', className: 'filled-mid' };
    return { text: 'Alto', className: 'filled-high' };
  }

  function diversificationLabel(score) {
    if (score >= 66) return 'Alta';
    if (score >= 33) return 'Media';
    return 'Baja';
  }

  function updateResults() {
    const weights = getWeights();
    const total = totalOf(weights);

    totalDisplay.textContent = `Total: ${total.toFixed(0)}%`;
    totalDisplay.classList.toggle('is-valid', total === 100);
    totalDisplay.classList.toggle('is-invalid', total !== 100);

    Object.keys(ASSETS).forEach(key => {
      const out = document.getElementById('out-' + key);
      if (out) out.textContent = fmtPct(weights[key]);
    });

    const { expectedReturn, estimatedRisk, diversificationScore, norm } = computeMetrics(weights, total || 1);

    document.getElementById('resExpectedReturn').textContent = `${expectedReturn.toFixed(1)}% anual`;
    document.getElementById('resRisk').textContent = riskLabel(estimatedRisk).text;
    document.getElementById('resRiskValue').textContent = `Volatilidad aprox. ${estimatedRisk.toFixed(0)}`;
    document.getElementById('resDiversification').textContent = diversificationLabel(diversificationScore);
    document.getElementById('resDiversificationValue').textContent = `Puntuación ${diversificationScore.toFixed(0)}/100`;

    const meterEl = document.getElementById('riskMeter');
    const segments = meterEl.querySelectorAll('span');
    const filledCount = Math.round((Math.min(estimatedRisk, 60) / 60) * segments.length);
    segments.forEach((seg, i) => {
      seg.className = i < filledCount ? riskLabel(estimatedRisk).className : '';
    });

    renderPieChart(norm);
    renderGrowthChart(expectedReturn, estimatedRisk);
  }

  function renderPieChart(norm) {
    const ctx = document.getElementById('pieChart').getContext('2d');
    const labels = [];
    const data = [];
    const colors = [];
    Object.keys(ASSETS).forEach(key => {
      if (norm[key] > 0) {
        labels.push(ASSETS[key].label);
        data.push(+(norm[key] * 100).toFixed(1));
        colors.push(ASSET_COLORS[key]);
      }
    });

    if (pieChart) pieChart.destroy();
    const styles = getComputedStyle(document.documentElement);
    const textColor = styles.getPropertyValue('--text-muted').trim() || '#5c6b7a';

    pieChart = new Chart(ctx, {
      type: 'doughnut',
      data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 0 }] },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: textColor, boxWidth: 12, font: { size: 11 } } },
          tooltip: { callbacks: { label: (item) => `${item.label}: ${item.parsed}%` } }
        }
      }
    });
  }

  function renderGrowthChart(expectedReturn, estimatedRisk) {
    const initial = Math.max(0, parseFloat(initialInput.value) || 0);
    const years = Math.max(1, parseInt(yearsInput.value) || 1);
    const optimisticRate = (expectedReturn + estimatedRisk / 2) / 100;
    const baseRate = expectedReturn / 100;
    const pessimisticRate = Math.max(-0.5, (expectedReturn - estimatedRisk / 2) / 100);

    const labels = [];
    const base = [], optimistic = [], pessimistic = [];
    for (let y = 0; y <= years; y++) {
      labels.push(`Año ${y}`);
      base.push(Math.round(initial * Math.pow(1 + baseRate, y)));
      optimistic.push(Math.round(initial * Math.pow(1 + optimisticRate, y)));
      pessimistic.push(Math.round(initial * Math.pow(1 + pessimisticRate, y)));
    }

    const ctx = document.getElementById('growthChart').getContext('2d');
    if (growthChart) growthChart.destroy();

    const styles = getComputedStyle(document.documentElement);
    const accent = styles.getPropertyValue('--color-brass').trim() || '#a8763a';
    const slate = styles.getPropertyValue('--text-muted').trim() || '#5c6b7a';
    const gridColor = styles.getPropertyValue('--border').trim() || 'rgba(0,0,0,0.08)';

    growthChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: 'Escenario optimista', data: optimistic, borderColor: '#1f6f5c', borderDash: [4, 4], pointRadius: 0, borderWidth: 1.5, fill: false },
          { label: 'Rentabilidad esperada', data: base, borderColor: accent, backgroundColor: 'rgba(168,118,58,0.15)', pointRadius: 0, borderWidth: 2.5, fill: true, tension: 0.25 },
          { label: 'Escenario pesimista', data: pessimistic, borderColor: '#b23a24', borderDash: [4, 4], pointRadius: 0, borderWidth: 1.5, fill: false }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { labels: { color: slate, font: { size: 11 } } },
          tooltip: { callbacks: { label: (item) => `${item.dataset.label}: ${fmtCurrency(item.parsed.y)}` } }
        },
        scales: {
          x: { ticks: { color: slate, maxTicksLimit: 8 }, grid: { color: gridColor } },
          y: { ticks: { color: slate, callback: (v) => fmtCurrency(v) }, grid: { color: gridColor } }
        }
      }
    });
  }

  Object.values(sliders).forEach(slider => {
    if (slider) slider.addEventListener('input', updateResults);
  });
  initialInput.addEventListener('input', updateResults);
  yearsInput.addEventListener('input', updateResults);
  document.addEventListener('theme-changed', updateResults);

  // Preset: example "moderate" allocation on load
  updateResults();
});
