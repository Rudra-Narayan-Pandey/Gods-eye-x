/**
 * GOD'S EYE X — Entity Card Component
 * Renders company, technology, or startup cards for the masonry grid
 */

import { el, formatCurrency, formatNumber, formatPercent, sparklinePath, getMomentumColor } from '../utils/helpers.js';

/**
 * Create a small SVG momentum gauge
 * @param {number} score 0-1
 * @param {number} size
 * @returns {HTMLElement}
 */
function createMomentumGauge(score, size = 44) {
  const gaugeEl = el('div', { className: 'momentum-gauge' });
  const r = (size - 6) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const arcLength = circumference * 0.75; // 270 degree arc
  const dashOffset = arcLength - (arcLength * score);
  const color = getMomentumColor(score);
  const label = Math.round(score * 100);

  gaugeEl.innerHTML = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="3"
        stroke-dasharray="${arcLength} ${circumference}" stroke-dashoffset="0"
        transform="rotate(135 ${cx} ${cy})" stroke-linecap="round"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="3"
        stroke-dasharray="${arcLength} ${circumference}" stroke-dashoffset="${dashOffset}"
        transform="rotate(135 ${cx} ${cy})" stroke-linecap="round"
        style="transition: stroke-dashoffset 1s ease; filter: drop-shadow(0 0 4px ${color})"/>
      <text class="momentum-gauge-label" x="${cx}" y="${cy + 1}" style="fill:${color}">${label}</text>
    </svg>
  `;
  return gaugeEl;
}

/**
 * Create a mini sparkline SVG
 * @param {number[]} data
 * @param {string} color
 * @returns {HTMLElement}
 */
function createSparkline(data, color = 'var(--accent-cyan)') {
  const container = el('div', { className: 'entity-card-sparkline' });
  const path = sparklinePath(data, 200, 28);
  if (!path) return container;

  // Create gradient area path
  const lastX = (data.length - 1) * (200 / (data.length - 1));
  const areaPath = path + ` L${lastX.toFixed(1)},28 L0,28 Z`;

  container.innerHTML = `
    <svg viewBox="0 0 200 28" preserveAspectRatio="none">
      <defs>
        <linearGradient id="spark-grad-${Math.random().toString(36).substr(2, 4)}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${color}" stop-opacity="0.2"/>
          <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <path d="${areaPath}" fill="url(#spark-grad-${container.innerHTML})" opacity="0.5"/>
      <path d="${path}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>
    </svg>
  `;

  // Fix gradient ID
  const gradId = 'sg-' + Math.random().toString(36).substr(2, 6);
  const svg = container.querySelector('svg');
  const grad = svg.querySelector('linearGradient');
  grad.id = gradId;
  const areaPathEl = svg.querySelector('path:first-of-type');
  areaPathEl.setAttribute('fill', `url(#${gradId})`);

  return container;
}

/**
 * Create an entity card
 * @param {Object} entity - Entity data
 * @param {'company'|'technology'|'startup'} type
 * @returns {HTMLElement}
 */
export function createEntityCard(entity, type) {
  const card = el('div', { className: 'entity-card' });
  card.setAttribute('data-entity-id', entity.id);
  card.setAttribute('data-entity-type', type);

  if (type === 'company') {
    card.appendChild(buildCompanyCard(entity));
  } else if (type === 'technology') {
    card.appendChild(buildTechnologyCard(entity));
  } else if (type === 'startup') {
    card.appendChild(buildStartupCard(entity));
  }

  // Click handler - dispatch custom event
  card.addEventListener('click', () => {
    card.dispatchEvent(new CustomEvent('entity-select', {
      bubbles: true,
      detail: { entity, type },
    }));
  });

  return card;
}

function buildCompanyCard(entity) {
  const fragment = document.createDocumentFragment();

  // Header
  const header = el('div', { className: 'entity-card-header' });

  const logo = el('div', {
    className: 'entity-card-logo',
    style: {
      background: `${entity.logoColor || 'var(--accent-cyan)'}22`,
      color: entity.logoColor || 'var(--accent-cyan)',
    },
  }, entity.logo || entity.name.charAt(0));

  const info = el('div', { className: 'entity-card-info' });
  info.appendChild(el('div', { className: 'entity-card-name' }, entity.name));
  const hq = entity.headquarters ? `${entity.headquarters.city}, ${entity.headquarters.country}` : (entity.hq || '');
  info.appendChild(el('div', { className: 'entity-card-subtitle' }, hq));

  header.appendChild(logo);
  header.appendChild(info);
  header.appendChild(createMomentumGauge(entity.momentum));
  fragment.appendChild(header);

  // Body
  const body = el('div', { className: 'entity-card-body' });

  // Metrics
  const metrics = el('div', { className: 'entity-card-metrics' });

  if (entity.funding) {
    const fundingMetric = el('div', { className: 'entity-card-metric' });
    fundingMetric.appendChild(el('div', { className: 'entity-card-metric-label' }, 'Funding'));
    fundingMetric.appendChild(el('div', { className: 'entity-card-metric-value' }, formatCurrency(entity.funding)));
    metrics.appendChild(fundingMetric);
  }

  const employeeMetric = el('div', { className: 'entity-card-metric' });
  employeeMetric.appendChild(el('div', { className: 'entity-card-metric-label' }, 'Employees'));
  employeeMetric.appendChild(el('div', { className: 'entity-card-metric-value' }, formatNumber(entity.employees)));
  metrics.appendChild(employeeMetric);

  body.appendChild(metrics);

  // Hiring velocity badge
  if (entity.hiringVelocity) {
    const velocityBadge = el('span', {
      className: `velocity-badge ${entity.hiringVelocity >= 0 ? 'positive' : 'negative'}`,
    });
    velocityBadge.textContent = `${entity.hiringVelocity >= 0 ? '↑' : '↓'} ${formatPercent(entity.hiringVelocity)} hiring`;
    body.appendChild(velocityBadge);
  }

  // Tags
  if (entity.tags && entity.tags.length > 0) {
    const tagsRow = el('div', { className: 'entity-card-tags' });
    entity.tags.slice(0, 4).forEach(tag => {
      tagsRow.appendChild(el('span', { className: 'tag' }, tag));
    });
    body.appendChild(tagsRow);
  }

  // Sparkline
  if (entity.sparkline) {
    body.appendChild(createSparkline(entity.sparkline, entity.logoColor || 'var(--accent-cyan)'));
  }

  fragment.appendChild(body);
  return fragment;
}

function buildTechnologyCard(entity) {
  const fragment = document.createDocumentFragment();

  // Header
  const header = el('div', { className: 'entity-card-header' });

  const iconEl = el('div', {
    className: 'entity-card-logo',
    style: {
      background: 'var(--accent-purple-dim)',
      fontSize: '20px',
    },
  }, entity.icon || '🔬');

  const info = el('div', { className: 'entity-card-info' });
  info.appendChild(el('div', { className: 'entity-card-name' }, entity.name));

  const categoryBadge = el('span', { className: 'badge badge-purple', style: { fontSize: '10px', padding: '1px 6px' } }, entity.category || '');
  info.appendChild(categoryBadge);

  header.appendChild(iconEl);
  header.appendChild(info);
  header.appendChild(createMomentumGauge(entity.momentum));
  fragment.appendChild(header);

  // Body
  const body = el('div', { className: 'entity-card-body' });

  // Maturity bar
  const maturityPct = entity.maturityScore != null ? Math.round(entity.maturityScore * 100) : (entity.maturity || 70);
  const maturityGroup = el('div', { className: 'entity-card-metric' });
  maturityGroup.appendChild(el('div', { className: 'entity-card-metric-label' }, `Maturity: ${maturityPct}%`));
  const barContainer = el('div', { className: 'maturity-bar-container' });
  const bar = el('div', { className: 'maturity-bar', style: { width: `${maturityPct}%` } });
  barContainer.appendChild(bar);
  maturityGroup.appendChild(barContainer);
  body.appendChild(maturityGroup);

  // Metrics
  const metrics = el('div', { className: 'entity-card-metrics' });

  const adoptionMetric = el('div', { className: 'entity-card-metric' });
  adoptionMetric.appendChild(el('div', { className: 'entity-card-metric-label' }, 'Adoption'));
  adoptionMetric.appendChild(el('div', { className: 'entity-card-metric-value' }, `${entity.adoptionRate || 0}%`));
  metrics.appendChild(adoptionMetric);

  const trendMetric = el('div', { className: 'entity-card-metric' });
  trendMetric.appendChild(el('div', { className: 'entity-card-metric-label' }, 'Trend'));
  const arrowMap = { rising: '↑', declining: '↓', stable: '→', up: '↑', down: '↓' };
  const arrowColorMap = { rising: 'var(--accent-green)', up: 'var(--accent-green)', declining: 'var(--accent-red)', down: 'var(--accent-red)', stable: 'var(--accent-amber)' };
  const td = entity.trendDirection || 'stable';
  const arrowEl = el('span', {
    className: `trend-arrow ${td}`,
    style: { color: arrowColorMap[td] || 'var(--text-secondary)' },
  }, `${arrowMap[td] || '→'} ${td}`);
  trendMetric.appendChild(arrowEl);
  metrics.appendChild(trendMetric);

  body.appendChild(metrics);

  // Tags
  if (entity.tags && entity.tags.length > 0) {
    const tagsRow = el('div', { className: 'entity-card-tags' });
    entity.tags.slice(0, 3).forEach(tag => {
      tagsRow.appendChild(el('span', { className: 'tag' }, tag));
    });
    body.appendChild(tagsRow);
  }

  // Sparkline
  const techSparkData = entity.trendData || entity.sparkline;
  if (techSparkData) {
    body.appendChild(createSparkline(techSparkData, 'var(--accent-purple)'));
  }

  fragment.appendChild(body);
  return fragment;
}

function buildStartupCard(entity) {
  const fragment = document.createDocumentFragment();

  // Header
  const header = el('div', { className: 'entity-card-header' });

  const logo = el('div', {
    className: 'entity-card-logo',
    style: {
      background: `${entity.logoColor || 'var(--accent-cyan)'}22`,
      color: entity.logoColor || 'var(--accent-cyan)',
    },
  }, entity.logo || entity.name.charAt(0));

  const info = el('div', { className: 'entity-card-info' });
  const nameRow = el('div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } });
  nameRow.appendChild(el('span', { className: 'entity-card-name' }, entity.name));

  const stageText = entity.stage.replace(/-/g, ' ');
  const stageBadge = el('span', { className: `stage-badge ${entity.stage}` }, stageText);
  nameRow.appendChild(stageBadge);
  info.appendChild(nameRow);
  const startupHq = entity.headquarters ? `${entity.headquarters.city || ''}, ${entity.headquarters.country || ''}` : (entity.hq || entity.location || '');
  info.appendChild(el('div', { className: 'entity-card-subtitle' }, startupHq));

  header.appendChild(logo);
  header.appendChild(info);
  header.appendChild(createMomentumGauge(entity.momentum));
  fragment.appendChild(header);

  // Body
  const body = el('div', { className: 'entity-card-body' });

  // Metrics
  const metrics = el('div', { className: 'entity-card-metrics' });

  const lastFundingMetric = el('div', { className: 'entity-card-metric' });
  lastFundingMetric.appendChild(el('div', { className: 'entity-card-metric-label' }, 'Last Round'));
  lastFundingMetric.appendChild(el('div', { className: 'entity-card-metric-value' }, entity.lastFunding ? formatCurrency(entity.lastFunding) : '—'));
  metrics.appendChild(lastFundingMetric);

  const totalFundingMetric = el('div', { className: 'entity-card-metric' });
  totalFundingMetric.appendChild(el('div', { className: 'entity-card-metric-label' }, 'Total Raised'));
  totalFundingMetric.appendChild(el('div', { className: 'entity-card-metric-value' }, entity.totalFunding ? formatCurrency(entity.totalFunding) : entity.funding ? formatCurrency(entity.funding) : '—'));
  metrics.appendChild(totalFundingMetric);

  body.appendChild(metrics);

  // Hiring velocity
  if (entity.hiringVelocity) {
    const velocityBadge = el('span', {
      className: `velocity-badge ${entity.hiringVelocity >= 0 ? 'positive' : 'negative'}`,
    });
    velocityBadge.textContent = `${entity.hiringVelocity >= 0 ? '↑' : '↓'} ${formatPercent(entity.hiringVelocity)} hiring`;
    body.appendChild(velocityBadge);
  }

  // Tags
  if (entity.tags && entity.tags.length > 0) {
    const tagsRow = el('div', { className: 'entity-card-tags' });
    entity.tags.slice(0, 3).forEach(tag => {
      tagsRow.appendChild(el('span', { className: 'tag' }, tag));
    });
    body.appendChild(tagsRow);
  }

  // Investors
  if (entity.investors && entity.investors.length > 0) {
    const investorRow = el('div', { className: 'investor-row' });
    entity.investors.slice(0, 3).forEach(inv => {
      investorRow.appendChild(el('span', { className: 'investor-chip' }, inv));
    });
    body.appendChild(investorRow);
  }

  // Sparkline
  const startupSparkData = entity.trendData || entity.sparkline;
  if (startupSparkData) {
    body.appendChild(createSparkline(startupSparkData, entity.logoColor || 'var(--accent-pink)'));
  }

  fragment.appendChild(body);
  return fragment;
}
