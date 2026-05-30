/**
 * GOD'S EYE X — Landing Page
 * Real-Time Global Intelligence Infrastructure
 */

import { el, debounce } from '../utils/helpers.js';
import { initScrollReveal, animateCounter, staggerAnimate } from '../utils/animations.js';
import { initParticles } from '../components/particles-bg.js';

/* ── Mock Data ─────────────────────────────────────────────── */
const AUTOCOMPLETE_DATA = [
  { icon: '🏢', title: 'OpenAI', desc: 'AI company · San Francisco, CA', badge: 'Company', badgeClass: 'badge-cyan', category: 'entity' },
  { icon: '📈', title: 'NVIDIA Stock Surge', desc: 'Unusual volume spike detected 2h ago', badge: 'Signal', badgeClass: 'badge-amber', category: 'signal' },
  { icon: '🌐', title: 'US-China Tech Relations', desc: 'Geopolitical tension cluster · 47 sources', badge: 'Topic', badgeClass: 'badge-purple', category: 'topic' },
  { icon: '💰', title: 'Series B Funding Rounds', desc: 'Q2 2026 venture capital trends', badge: 'Trend', badgeClass: 'badge-green', category: 'trend' },
  { icon: '⚡', title: 'Quantum Computing Breakthrough', desc: 'MIT research · 3 linked anomalies', badge: 'Anomaly', badgeClass: 'badge-red', category: 'anomaly' },
  { icon: '🔬', title: 'CRISPR Gene Therapy', desc: 'FDA approval pipeline · 12 entities', badge: 'Topic', badgeClass: 'badge-purple', category: 'topic' },
  { icon: '🏛️', title: 'Federal Reserve Policy', desc: 'Rate decision impact analysis', badge: 'Signal', badgeClass: 'badge-amber', category: 'signal' },
  { icon: '🚀', title: 'SpaceX Starship', desc: 'Orbital launch tracker · 8 data sources', badge: 'Entity', badgeClass: 'badge-cyan', category: 'entity' },
];

const FEATURES = [
  {
    icon: '🔍', title: 'Reality Search', accent: 'cyan',
    desc: 'Search for any concept, entity, or pattern across the entire knowledge universe. Natural language queries return structured intelligence.',
    previewType: 'search-ring',
  },
  {
    icon: '💎', title: 'Opportunity Discovery', accent: 'purple',
    desc: 'Surface hidden investment opportunities by analyzing market signals, sentiment shifts, and cross-domain correlations in real-time.',
    previewType: 'chart',
  },
  {
    icon: '🎯', title: 'Reality Drift Detection', accent: 'amber',
    desc: 'Detect when narratives diverge from underlying data. Track the gap between perception and reality across markets and media.',
    previewType: 'wave',
  },
  {
    icon: '🌐', title: 'Graph Intelligence', accent: 'indigo',
    desc: 'Explore the living knowledge graph connecting entities, events, and signals. Discover relationships invisible to traditional analysis.',
    previewType: 'dots',
  },
  {
    icon: '⚡', title: 'Anomaly Detection', accent: 'green',
    desc: 'Automatically detect unusual patterns, volume spikes, and behavioral shifts across thousands of data streams simultaneously.',
    previewType: 'spike',
  },
  {
    icon: '📊', title: 'AI Reports', accent: 'pink',
    desc: 'Auto-generated intelligence reports synthesizing complex multi-source data into actionable briefings, updated continuously.',
    previewType: 'docs',
  },
];

const USE_CASES = [
  { icon: '🏦', title: 'Venture Capital', desc: 'Identify breakout startups before the crowd. Track founder networks, market timing, and competitive signals.' },
  { icon: '📊', title: 'Hedge Funds', desc: 'Generate alpha with real-time alternative data. Detect market dislocations and sentiment regime changes.' },
  { icon: '🛡️', title: 'Government Intelligence', desc: 'Monitor geopolitical risk, track threat actors, and maintain situational awareness at global scale.' },
  { icon: '🔬', title: 'Research Labs', desc: 'Accelerate discovery by mapping the frontier of knowledge. Track publications, patents, and funding flows.' },
];

const STATS = [
  { value: 1200000, label: 'Entities Tracked', suffix: '+', format: v => v >= 1e6 ? (v / 1e6).toFixed(1) + 'M' : v.toLocaleString() },
  { value: 500, label: 'Data Sources', suffix: '+', format: v => v.toLocaleString() },
  { value: 99.7, label: 'Accuracy', suffix: '%', format: v => v.toFixed(1) },
  { value: 24, label: 'Real-time Updates', suffix: '/7', format: v => v.toString() },
];

/* ── Feature Preview Builders ──────────────────────────────── */
function buildSearchRingPreview() {
  const wrapper = el('div', { className: 'feature-card-preview' });
  wrapper.innerHTML = '<div class="preview-search-ring"></div>';
  return wrapper;
}

function buildChartPreview() {
  const wrapper = el('div', { className: 'feature-card-preview' });
  const chart = el('div', { className: 'preview-chart' });
  const heights = [40, 55, 35, 70, 50, 85, 60, 90, 75, 95, 80];
  heights.forEach((h, i) => {
    const bar = el('div', {
      className: 'preview-chart-bar',
      style: {
        height: h + '%',
        background: `linear-gradient(to top, var(--accent-purple), rgba(168, 85, 247, 0.3))`,
        animationDelay: (i * 0.12) + 's',
      },
    });
    chart.appendChild(bar);
  });
  wrapper.appendChild(chart);
  return wrapper;
}

function buildWavePreview() {
  const wrapper = el('div', { className: 'feature-card-preview' });
  wrapper.innerHTML = `
    <div class="preview-wave">
      <svg viewBox="0 0 200 32" preserveAspectRatio="none">
        <path class="preview-wave-path" stroke="var(--accent-amber)" d="M0,16 Q25,4 50,16 Q75,28 100,16 Q125,4 150,16 Q175,28 200,16" />
        <path class="preview-wave-path" stroke="rgba(245,158,11,0.3)" d="M0,16 Q25,8 50,16 Q75,24 100,16 Q125,8 150,16 Q175,24 200,16" style="animation-delay: 0.5s" />
      </svg>
    </div>`;
  return wrapper;
}

function buildDotsPreview() {
  const wrapper = el('div', { className: 'feature-card-preview' });
  const dotsContainer = el('div', { className: 'preview-dots' });
  const positions = [
    { x: 15, y: 30 }, { x: 40, y: 60 }, { x: 65, y: 25 },
    { x: 85, y: 55 }, { x: 30, y: 75 }, { x: 55, y: 45 },
    { x: 75, y: 70 },
  ];

  // Create SVG for connecting lines
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';

  const connections = [[0,1],[1,2],[2,3],[1,5],[5,3],[4,1],[5,6],[3,6]];
  connections.forEach(([a, b]) => {
    const line = document.createElementNS(svgNS, 'line');
    line.setAttribute('x1', positions[a].x);
    line.setAttribute('y1', positions[a].y);
    line.setAttribute('x2', positions[b].x);
    line.setAttribute('y2', positions[b].y);
    line.setAttribute('stroke', 'var(--accent-indigo)');
    line.setAttribute('stroke-width', '0.5');
    line.setAttribute('opacity', '0.3');
    svg.appendChild(line);
  });
  dotsContainer.appendChild(svg);

  positions.forEach((pos, i) => {
    const dot = el('div', {
      className: 'preview-dot',
      style: {
        left: pos.x + '%',
        top: pos.y + '%',
        background: 'var(--accent-indigo)',
        animationDelay: (i * 0.3) + 's',
      },
    });
    dotsContainer.appendChild(dot);
  });

  wrapper.appendChild(dotsContainer);
  return wrapper;
}

function buildSpikePreview() {
  const wrapper = el('div', { className: 'feature-card-preview' });
  const spike = el('div', { className: 'preview-spike' });
  for (let i = 0; i < 30; i++) {
    const line = el('div', {
      className: 'preview-spike-line',
      style: {
        background: 'var(--accent-green)',
        animationDelay: (i * 0.08) + 's',
        opacity: 0.4 + Math.random() * 0.6,
      },
    });
    spike.appendChild(line);
  }
  wrapper.appendChild(spike);
  return wrapper;
}

function buildDocsPreview() {
  const wrapper = el('div', { className: 'feature-card-preview' });
  const docs = el('div', { className: 'preview-docs' });
  const offsets = [
    { rot: -6, x: -8, color: 'rgba(236,72,153,0.3)', borderColor: 'rgba(236,72,153,0.2)', delay: '0s' },
    { rot: 0, x: 0, color: 'rgba(236,72,153,0.4)', borderColor: 'rgba(236,72,153,0.3)', delay: '0.1s' },
    { rot: 4, x: 6, color: 'rgba(236,72,153,0.5)', borderColor: 'rgba(236,72,153,0.4)', delay: '0.2s' },
  ];
  offsets.forEach(o => {
    const doc = el('div', {
      className: 'preview-doc',
      style: {
        background: o.color,
        borderColor: o.borderColor,
        transform: `rotate(${o.rot}deg) translateX(${o.x}px)`,
        animationDelay: o.delay,
      },
    });
    docs.appendChild(doc);
  });
  wrapper.appendChild(docs);
  return wrapper;
}

const PREVIEW_BUILDERS = {
  'search-ring': buildSearchRingPreview,
  'chart': buildChartPreview,
  'wave': buildWavePreview,
  'dots': buildDotsPreview,
  'spike': buildSpikePreview,
  'docs': buildDocsPreview,
};

/* ── Main Render ──────────────────────────────────────────── */
export async function renderLanding(container) {
  container.innerHTML = '';
  let cleanupParticles = null;

  // ─── HERO SECTION ────────────────────────────────────────
  const hero = el('section', { className: 'landing-hero' });

  // Particles container
  const particlesContainer = el('div', { className: 'hero-particles-container' });
  hero.appendChild(particlesContainer);

  // Hero content
  const heroContent = el('div', { className: 'hero-content' });

  // Eyebrow
  const eyebrow = el('div', {
    className: 'section-eyebrow',
    style: { marginBottom: '8px' },
    innerHTML: '⦿ GOD\'S EYE X',
  });

  // Headline
  const headline = el('h1', { className: 'hero-headline' }, 'Real-Time Global Intelligence Infrastructure');

  // Subheadline
  const subheadline = el('p', { className: 'hero-subheadline' }, 'See how everything connects. Powered by AI.');

  // Demo search widget
  const demoWidget = el('div', { className: 'hero-demo-widget' });
  const inputWrapper = el('div', { className: 'hero-demo-input-wrapper' });

  const searchIcon = el('div', {
    className: 'hero-demo-icon',
    innerHTML: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
  });

  const searchInput = el('input', {
    className: 'hero-demo-input',
    type: 'text',
    placeholder: 'Search any entity, concept, or signal...',
    'aria-label': 'Search',
    autocomplete: 'off',
  });

  const kbdHint = el('div', {
    className: 'hero-demo-kbd',
    innerHTML: '<kbd>⌘</kbd><kbd>K</kbd>',
  });

  inputWrapper.appendChild(searchInput);
  inputWrapper.appendChild(searchIcon);
  inputWrapper.appendChild(kbdHint);

  // Autocomplete dropdown
  const autocomplete = el('div', { className: 'hero-autocomplete' });

  // Wire up autocomplete
  const handleInput = debounce((value) => {
    if (!value.trim()) {
      autocomplete.classList.remove('visible');
      return;
    }

    const query = value.toLowerCase();
    const matches = AUTOCOMPLETE_DATA.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.desc.toLowerCase().includes(query) ||
      item.category.includes(query)
    ).slice(0, 5);

    // If no matches on specific query, show first 4 as generic suggestions
    const results = matches.length > 0 ? matches : AUTOCOMPLETE_DATA.slice(0, 4);

    autocomplete.innerHTML = '';
    results.forEach(item => {
      const itemEl = el('div', { className: 'hero-autocomplete-item' });

      const iconBg = item.badgeClass === 'badge-cyan' ? 'var(--accent-cyan-dim)' :
                     item.badgeClass === 'badge-purple' ? 'var(--accent-purple-dim)' :
                     item.badgeClass === 'badge-amber' ? 'var(--accent-amber-dim)' :
                     item.badgeClass === 'badge-green' ? 'var(--accent-green-dim)' :
                     'var(--accent-red-dim)';

      itemEl.innerHTML = `
        <div class="hero-autocomplete-item-icon" style="background:${iconBg}">${item.icon}</div>
        <div class="hero-autocomplete-item-text">
          <div class="hero-autocomplete-item-title">${item.title}</div>
          <div class="hero-autocomplete-item-desc">${item.desc}</div>
        </div>
        <span class="badge ${item.badgeClass} hero-autocomplete-item-badge">${item.badge}</span>
      `;
      autocomplete.appendChild(itemEl);
    });

    autocomplete.classList.add('visible');
  }, 200);

  searchInput.addEventListener('input', (e) => handleInput(e.target.value));
  searchInput.addEventListener('focus', () => {
    if (searchInput.value.trim()) handleInput(searchInput.value);
  });

  // Close autocomplete on outside click
  document.addEventListener('click', (e) => {
    if (!demoWidget.contains(e.target)) {
      autocomplete.classList.remove('visible');
    }
  });

  demoWidget.appendChild(inputWrapper);
  demoWidget.appendChild(autocomplete);

  // CTA buttons
  const ctaGroup = el('div', { className: 'hero-cta-group' });
  const ctaPrimary = el('button', { className: 'btn btn-primary hero-cta-primary' }, 'Try Live Demo →');
  const ctaSecondary = el('button', { className: 'btn btn-secondary hero-cta-secondary' }, 'Request Early Access');

  ctaPrimary.addEventListener('click', () => {
    window.location.hash = '/search';
  });

  ctaGroup.appendChild(ctaPrimary);
  ctaGroup.appendChild(ctaSecondary);

  // Stats row
  const statsRow = el('div', { className: 'landing-stats' });
  const statElements = [];

  STATS.forEach(stat => {
    const statEl = el('div', { className: 'landing-stat' });
    const valueEl = el('div', { className: 'landing-stat-value', 'data-target': stat.value });
    valueEl.textContent = '0' + stat.suffix;
    const labelEl = el('div', { className: 'landing-stat-label' }, stat.label);
    statEl.appendChild(valueEl);
    statEl.appendChild(labelEl);
    statsRow.appendChild(statEl);
    statElements.push({ el: valueEl, stat });
  });

  // Scroll indicator
  const scrollIndicator = el('div', {
    className: 'hero-scroll-indicator',
    innerHTML: `<span>Explore</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`,
  });

  heroContent.appendChild(eyebrow);
  heroContent.appendChild(headline);
  heroContent.appendChild(subheadline);
  heroContent.appendChild(demoWidget);
  heroContent.appendChild(ctaGroup);
  heroContent.appendChild(statsRow);
  hero.appendChild(heroContent);
  hero.appendChild(scrollIndicator);

  // ─── FEATURES SECTION ────────────────────────────────────
  const features = el('section', { className: 'features-section' });
  const featuresInner = el('div', { className: 'container' });

  const featuresHeader = el('div', { className: 'section-header reveal' });
  featuresHeader.innerHTML = `
    <div class="section-eyebrow">CAPABILITIES</div>
    <h2 class="section-title">Intelligence at Your Fingertips</h2>
    <p class="section-subtitle">Six powerful modules working in concert to give you a God-level view of reality.</p>
  `;

  const featuresGrid = el('div', { className: 'features-grid' });

  FEATURES.forEach((feature, i) => {
    const card = el('div', {
      className: 'feature-card reveal reveal-delay-' + ((i % 3) + 1),
    });
    card.setAttribute('data-accent', feature.accent);

    const header = el('div', { className: 'feature-card-header' });
    const icon = el('div', { className: 'feature-card-icon' });
    icon.textContent = feature.icon;
    const title = el('span', { className: 'feature-card-title' }, feature.title);
    header.appendChild(icon);
    header.appendChild(title);

    const desc = el('p', { className: 'feature-card-desc' }, feature.desc);

    const preview = PREVIEW_BUILDERS[feature.previewType]();

    card.appendChild(header);
    card.appendChild(desc);
    card.appendChild(preview);
    featuresGrid.appendChild(card);
  });

  featuresInner.appendChild(featuresHeader);
  featuresInner.appendChild(featuresGrid);
  features.appendChild(featuresInner);

  // ─── USE CASES SECTION ───────────────────────────────────
  const useCases = el('section', { className: 'use-cases-section' });
  const useCasesInner = el('div', { className: 'container' });

  const useCasesHeader = el('div', { className: 'section-header reveal' });
  useCasesHeader.innerHTML = `
    <div class="section-eyebrow">USE CASES</div>
    <h2 class="section-title">Trusted by the World's Elite</h2>
    <p class="section-subtitle">From Wall Street to research labs, GOD'S EYE X empowers decision-makers who can't afford to miss what matters.</p>
  `;

  const useCasesGrid = el('div', { className: 'use-cases-grid' });

  USE_CASES.forEach((uc, i) => {
    const card = el('div', { className: 'use-case-card reveal reveal-delay-' + (i + 1) });
    card.innerHTML = `
      <span class="use-case-card-icon">${uc.icon}</span>
      <h3 class="use-case-card-title">${uc.title}</h3>
      <p class="use-case-card-desc">${uc.desc}</p>
    `;
    useCasesGrid.appendChild(card);
  });

  useCasesInner.appendChild(useCasesHeader);
  useCasesInner.appendChild(useCasesGrid);
  useCases.appendChild(useCasesInner);

  // ─── CTA SECTION ─────────────────────────────────────────
  const cta = el('section', { className: 'cta-section' });
  const ctaContent = el('div', { className: 'cta-content reveal' });

  ctaContent.innerHTML = `
    <h2 class="cta-headline">Start seeing what others miss</h2>
    <p class="cta-subheadline">Join the waitlist for early access to the most advanced intelligence infrastructure ever built.</p>
    <form class="cta-form" onsubmit="return false;">
      <input type="email" class="cta-email-input input" placeholder="you@company.com" aria-label="Email address" />
      <button type="submit" class="btn btn-primary cta-submit-btn">Get Early Access</button>
    </form>
    <p class="cta-disclaimer">No spam. Invite-only access. Unsubscribe anytime.</p>
  `;

  // Wire up CTA form feedback
  cta.appendChild(ctaContent);

  // ─── FOOTER ──────────────────────────────────────────────
  const footer = el('footer', { className: 'landing-footer' });
  const footerInner = el('div', { className: 'container' });

  footerInner.innerHTML = `
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="footer-brand-name">GOD'S EYE <span>X</span></div>
        <p class="footer-brand-tagline">Real-Time Global Intelligence Infrastructure. See how everything connects.</p>
        <div class="footer-socials" style="margin-top: 8px;">
          <a class="footer-social-link" aria-label="Twitter/X">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a class="footer-social-link" aria-label="GitHub">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
          </a>
          <a class="footer-social-link" aria-label="LinkedIn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
          <a class="footer-social-link" aria-label="Discord">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/></svg>
          </a>
        </div>
      </div>
      <div class="footer-col">
        <h4 class="footer-col-title">Product</h4>
        <div class="footer-links">
          <a href="#/search" class="footer-link">Reality Search</a>
          <a href="#/graph" class="footer-link">Graph Explorer</a>
          <a href="#/dashboard" class="footer-link">Dashboard</a>
          <a href="#/reports" class="footer-link">AI Reports</a>
          <a href="#" class="footer-link">API Access</a>
        </div>
      </div>
      <div class="footer-col">
        <h4 class="footer-col-title">Company</h4>
        <div class="footer-links">
          <a href="#" class="footer-link">About</a>
          <a href="#" class="footer-link">Careers</a>
          <a href="#" class="footer-link">Blog</a>
          <a href="#" class="footer-link">Press Kit</a>
          <a href="#" class="footer-link">Contact</a>
        </div>
      </div>
      <div class="footer-col">
        <h4 class="footer-col-title">Legal</h4>
        <div class="footer-links">
          <a href="#" class="footer-link">Privacy Policy</a>
          <a href="#" class="footer-link">Terms of Service</a>
          <a href="#" class="footer-link">Cookie Policy</a>
          <a href="#" class="footer-link">Security</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="footer-copyright">© 2026 GOD'S EYE X. All rights reserved.</div>
    </div>
  `;

  footer.appendChild(footerInner);

  // ─── ASSEMBLE ────────────────────────────────────────────
  container.appendChild(hero);
  container.appendChild(features);
  container.appendChild(useCases);
  container.appendChild(cta);
  container.appendChild(footer);

  // ─── POST-RENDER SETUP ──────────────────────────────────
  // Init particles (non-blocking)
  initParticles(particlesContainer).then(cleanup => {
    cleanupParticles = cleanup;
  }).catch(err => {
    console.warn('Particles failed to load:', err);
  });

  // Animate stats when they scroll into view
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statElements.forEach(({ el: valueEl, stat }) => {
          animateCounter(valueEl, stat.value, 2000, (current) => {
            return stat.format(current) + stat.suffix;
          });
        });
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });
  statsObserver.observe(statsRow);

  // Stagger hero content entrance
  staggerAnimate(heroContent, ':scope > *', 80);

  // Init scroll reveal for all .reveal elements
  initScrollReveal();

  // CTA form interaction
  const ctaForm = cta.querySelector('.cta-form');
  if (ctaForm) {
    ctaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = ctaForm.querySelector('.cta-email-input');
      const submitBtn = ctaForm.querySelector('.cta-submit-btn');
      if (emailInput && emailInput.value.includes('@')) {
        submitBtn.textContent = '✓ You\'re on the list!';
        submitBtn.style.background = 'var(--accent-green)';
        emailInput.disabled = true;
        submitBtn.disabled = true;
      }
    });
  }
}
