/**
 * GOD'S EYE X — Entity Detail Modal
 */

import { formatCurrency, formatNumber, formatPercent, timeAgo, getMomentumColor, sparklinePath } from '../utils/helpers.js';

export function showEntityDetailModal(entity, type) {
  // Remove any existing modal
  document.querySelector('.modal-backdrop')?.remove();

  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';

  const content = document.createElement('div');
  content.className = 'modal-content entity-modal';

  content.innerHTML = buildModalContent(entity, type);
  backdrop.appendChild(content);
  document.body.appendChild(backdrop);

  // Animate in
  requestAnimationFrame(() => requestAnimationFrame(() => backdrop.classList.add('visible')));

  // Close handlers
  backdrop.addEventListener('click', e => { if (e.target === backdrop) closeModal(backdrop); });
  content.querySelector('.modal-close')?.addEventListener('click', () => closeModal(backdrop));
  document.addEventListener('keydown', function onEsc(e) {
    if (e.key === 'Escape') { closeModal(backdrop); document.removeEventListener('keydown', onEsc); }
  });

  // Wire save button
  const saveBtn = content.querySelector('.modal-save-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      saveBtn.innerHTML = '❤️ Saved';
      saveBtn.style.color = 'var(--accent-red)';
    });
  }

  // Animate sparkline
  setTimeout(() => {
    content.querySelectorAll('.modal-sparkline-path').forEach(path => {
      const len = path.getTotalLength?.() || 200;
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
      path.style.transition = 'stroke-dashoffset 1.5s ease';
      requestAnimationFrame(() => { path.style.strokeDashoffset = '0'; });
    });
  }, 200);

  return backdrop;
}

function closeModal(backdrop) {
  backdrop.classList.remove('visible');
  setTimeout(() => backdrop.remove(), 300);
}

function buildModalContent(entity, type) {
  const m = entity.momentum || 0.8;
  const mColor = getMomentumColor(m);
  const mPct = Math.round(m * 100);
  const circ = 2 * Math.PI * 20;
  const dash = circ * m;

  const trendData = entity.trendData || [40,50,55,60,65,70,75,80,82,85,88,90];
  const sparkW = 280, sparkH = 60;
  const path = sparklinePath(trendData, sparkW, sparkH);
  const max = Math.max(...trendData), min = Math.min(...trendData), range = max-min||1;
  const areaPath = path + ` L${sparkW},${sparkH} L0,${sparkH} Z`;

  // Metrics grid based on type
  let metricsHtml = '';
  if (type === 'company' || type === 'startup') {
    const metrics = [
      { label: 'Total Funding', value: entity.funding ? formatCurrency(entity.funding) : entity.valuation ? formatCurrency(entity.valuation) : '—' },
      { label: 'Employees', value: formatNumber(entity.employees) },
      { label: 'Hiring Velocity', value: entity.hiringVelocity != null ? formatPercent(entity.hiringVelocity) : '—', positive: (entity.hiringVelocity || 0) > 0 },
      { label: 'Media Mentions', value: formatNumber(entity.mediaMentions) + ' /30d' },
      { label: 'Partnerships', value: formatNumber(entity.partnerships) },
      { label: 'Patents', value: formatNumber(entity.patents) },
    ];
    metricsHtml = metrics.map(m => `
      <div class="entity-modal-metric">
        <div class="metric-label">${m.label}</div>
        <div class="metric-value ${m.positive === true ? 'positive' : m.positive === false ? 'negative' : ''}">${m.value}</div>
      </div>
    `).join('');
  } else if (type === 'technology') {
    metricsHtml = [
      { label: 'Maturity Score', value: Math.round((entity.maturityScore||0.7)*100) + '%' },
      { label: 'Adoption Rate', value: (entity.adoptionRate||45) + '%' },
      { label: 'Trend', value: entity.trendDirection || 'Rising' },
      { label: 'Velocity (30d)', value: entity.velocity || '+34%' },
      { label: 'Key Players', value: (entity.keyPlayers||[]).length + ' orgs' },
      { label: 'Use Cases', value: (entity.useCases||[]).length + ' identified' },
    ].map(m => `
      <div class="entity-modal-metric">
        <div class="metric-label">${m.label}</div>
        <div class="metric-value">${m.value}</div>
      </div>
    `).join('');
  }

  // Timeline events
  const timeline = entity.timeline || buildDefaultTimeline(entity, type);

  // Tags
  const tags = entity.tags || entity.useCases?.slice(0,5) || [];

  // Key products
  const products = entity.keyProducts || [];

  return `
    <button class="modal-close">✕</button>

    <div class="entity-modal-header">
      <div class="entity-modal-logo">${entity.logo || '🏢'}</div>
      <div class="entity-modal-title-group">
        <h2 class="entity-modal-name">${entity.name}</h2>
        <div class="entity-modal-sub">
          ${entity.headquarters ? `<span>📍 ${entity.headquarters.city}, ${entity.headquarters.country}</span>` : ''}
          ${entity.industry ? `<span class="badge badge-cyan" style="margin-left:8px;">${entity.industry}</span>` : ''}
          ${entity.ticker ? `<span class="badge badge-green" style="margin-left:4px;">$${entity.ticker}</span>` : ''}
        </div>
      </div>
      <div class="entity-modal-score">
        <svg width="56" height="56" viewBox="0 0 56 56">
          <circle cx="28" cy="28" r="20" fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="4"/>
          <circle cx="28" cy="28" r="20" fill="none" stroke="${mColor}" stroke-width="4"
            stroke-dasharray="${dash.toFixed(1)} ${circ.toFixed(1)}"
            stroke-dashoffset="${(circ*0.25).toFixed(1)}"
            stroke-linecap="round" style="filter:drop-shadow(0 0 4px ${mColor});"/>
          <text x="28" y="33" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="13" font-weight="700" fill="${mColor}">${mPct}</text>
        </svg>
        <div style="font-size:10px;color:var(--text-tertiary);text-align:center;margin-top:4px;">MOMENTUM</div>
      </div>
    </div>

    <div class="entity-modal-actions">
      <button class="btn btn-secondary btn-sm modal-save-btn">♡ Save</button>
      <button class="btn btn-secondary btn-sm" onclick="navigator.clipboard?.writeText(window.location.href)">↗ Share</button>
      <button class="btn btn-secondary btn-sm">⬇ Export</button>
    </div>

    <!-- Trend Chart -->
    <div class="entity-modal-chart">
      <div class="entity-modal-section-title">30-Day Trend</div>
      <svg width="${sparkW}" height="${sparkH}" viewBox="0 0 ${sparkW} ${sparkH}" style="width:100%;overflow:visible;">
        <defs>
          <linearGradient id="modal-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${mColor}" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="${mColor}" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <path d="${areaPath}" fill="url(#modal-grad)"/>
        <path class="modal-sparkline-path" d="${path}" fill="none" stroke="${mColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>

    <!-- Key Metrics -->
    <div class="entity-modal-section">
      <div class="entity-modal-section-title">Key Metrics</div>
      <div class="entity-modal-metrics-grid">${metricsHtml}</div>
    </div>

    <!-- About -->
    <div class="entity-modal-section">
      <div class="entity-modal-section-title">About</div>
      <p class="entity-modal-description">${entity.description || 'No description available.'}</p>
      ${products.length ? `
        <div class="entity-modal-products">
          ${products.map(p => `<span class="tag">${p}</span>`).join('')}
        </div>
      ` : ''}
    </div>

    <!-- Tags -->
    ${tags.length ? `
    <div class="entity-modal-section">
      <div class="entity-modal-section-title">Tags</div>
      <div class="entity-modal-tags">
        ${tags.map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
    </div>
    ` : ''}

    <!-- Timeline -->
    <div class="entity-modal-section">
      <div class="entity-modal-section-title">Timeline</div>
      <div class="entity-modal-timeline">
        ${timeline.map((ev, i) => `
          <div class="timeline-event">
            <div class="timeline-dot" style="background:${i===0?'var(--accent-cyan)':'var(--text-tertiary)'}"></div>
            <div class="timeline-content">
              <div class="timeline-date">${ev.date}</div>
              <div class="timeline-title">${ev.title}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function buildDefaultTimeline(entity, type) {
  const base = entity.founded || 2020;
  if (type === 'company' || type === 'startup') {
    return [
      { date: '2025 Q1', title: `Reached ${formatNumber(entity.employees || 1000)} employees globally` },
      { date: '2024 Q3', title: entity.funding ? `Raised ${formatCurrency(entity.funding)} in funding` : 'Major product launch' },
      { date: '2024 Q1', title: 'Expanded to new international markets' },
      { date: '2023', title: 'Strategic partnerships with industry leaders' },
      { date: String(base), title: `${entity.name} founded` },
    ];
  }
  return [
    { date: '2025', title: 'Mainstream enterprise adoption begins' },
    { date: '2024', title: 'First major production deployments' },
    { date: '2023', title: 'Technology reaches production-ready maturity' },
    { date: '2022', title: 'Early research breakthroughs published' },
    { date: '2020', title: 'Technology concept first proposed' },
  ];
}
