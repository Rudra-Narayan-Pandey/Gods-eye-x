/**
 * GOD'S EYE X — Dashboard Page
 */

import { formatNumber, timeAgo, getMomentumColor, sparklinePath, sleep } from '../utils/helpers.js';
import { staggerAnimate, animateCounter } from '../utils/animations.js';
import { navigateTo } from '../router.js';

let opportunities = [];
let anomalies = [];
let evidence = [];
let trends = [];
let countryScores = []; // we can mock this locally if not in feed, or fetch it


let feedInterval = null;
let feedPaused = false;
let feedItems = [];

export async function renderDashboard(container) {
  // Fetch real data
  try {
    const res = await fetch('/api/dashboard/feed');
    if (res.ok) {
      const data = await res.json();
      anomalies = data.anomalies || [];
      evidence = data.evidence || [];
      opportunities = data.opportunities || [];
      trends = data.trends || [];
    }
    // Hardcode country scores just for the heatmap rendering until we map that API
    countryScores = [
      { id: "usa", name: "United States", code: "US", score: 95, x: 20, y: 15, w: 12, h: 8 },
      { id: "chn", name: "China", code: "CN", score: 88, x: 70, y: 20, w: 10, h: 8 },
      { id: "gbr", name: "United Kingdom", code: "UK", score: 82, x: 45, y: 15, w: 4, h: 5 }
    ];
  } catch (err) {
    console.error("Failed to fetch dashboard feed", err);
  }

  // Stop any previous feed interval
  if (feedInterval) { clearInterval(feedInterval); feedInterval = null; }

  feedItems = [...evidence].sort(() => Math.random() - 0.5);

  container.innerHTML = `
    <div class="dashboard-page">
      <div class="dashboard-inner">

        <!-- Header -->
        <div class="dashboard-header">
          <div>
            <h1 class="dashboard-title">Intelligence Dashboard</h1>
            <p class="dashboard-subtitle">Real-time global signal monitoring</p>
          </div>
          <div class="dashboard-header-right">
            <div class="live-badge">
              <span class="live-dot"></span>
              <span>LIVE</span>
            </div>
            <div class="dashboard-clock" id="dashboard-clock"></div>
          </div>
        </div>

        <!-- Stats row -->
        <div class="dashboard-stats-row stagger-children">
          ${[
            { label: 'Entities Tracked', value: 1200000, suffix: '', icon: '🌐', color: 'var(--accent-cyan)' },
            { label: 'Active Signals', value: 24519, suffix: '', icon: '📡', color: 'var(--accent-purple)' },
            { label: 'Opportunities', value: 142, suffix: '', icon: '💎', color: 'var(--accent-green)' },
            { label: 'Anomaly Alerts', value: anomalies.length, suffix: '', icon: '⚡', color: 'var(--accent-red)', alert: true },
          ].map((stat, i) => `
            <div class="dashboard-stat-card glass">
              <div class="stat-icon" style="color:${stat.color};">${stat.icon}</div>
              <div class="stat-body">
                <div class="stat-value text-mono" id="stat-val-${i}" data-target="${stat.value}">${stat.value >= 1000 ? formatNumber(stat.value) : stat.value}</div>
                <div class="stat-label">${stat.label}</div>
              </div>
              ${stat.alert ? `<span class="badge badge-red stat-alert-badge">${stat.value} new</span>` : ''}
            </div>
          `).join('')}
        </div>

        <!-- Main grid -->
        <div class="dashboard-grid">

          <!-- Intelligence Feed (span 8) -->
          <div class="dashboard-widget widget-span-8 glass">
            <div class="widget-header">
              <div class="widget-title-group">
                <span class="widget-title">Live Intelligence Feed</span>
                <span class="live-dot" style="margin-left:8px;"></span>
              </div>
              <div class="widget-controls">
                <button class="btn btn-ghost btn-sm" id="feed-pause-btn">⏸ Pause</button>
                <button class="btn-icon btn-sm tooltip" data-tooltip="Filter feed">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                </button>
              </div>
            </div>
            <div class="feed-list" id="intelligence-feed"></div>
          </div>

          <!-- Trending Opportunities (span 4) -->
          <div class="dashboard-widget widget-span-4 glass">
            <div class="widget-header">
              <span class="widget-title">Top Opportunities</span>
              <span class="badge badge-green">${opportunities.length}</span>
            </div>
            <div class="opp-list" id="opp-list"></div>
          </div>

          <!-- Country Heatmap (span 4) -->
          <div class="dashboard-widget widget-span-4 glass">
            <div class="widget-header">
              <span class="widget-title">Global Activity</span>
              <span class="badge badge-cyan">12 regions</span>
            </div>
            <div class="heatmap-container" id="heatmap-container"></div>
          </div>

          <!-- Active Trends (span 4) -->
          <div class="dashboard-widget widget-span-4 glass">
            <div class="widget-header">
              <span class="widget-title">Trending Now</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" stroke-width="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
            </div>
            <div class="trends-list" id="trends-list"></div>
          </div>

          <!-- Anomaly Alerts (span 4) -->
          <div class="dashboard-widget widget-span-4 glass">
            <div class="widget-header">
              <span class="widget-title">Anomaly Alerts</span>
              <span class="badge badge-red animate-pulse">${anomalies.length}</span>
            </div>
            <div class="anomaly-list" id="anomaly-list"></div>
          </div>

          <!-- Quick Search (span 12) -->
          <div class="dashboard-widget widget-span-12 glass quick-search-widget">
            <div class="quick-search-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              Quick Intelligence Search
            </div>
            <div class="quick-search-row">
              <input class="input input-lg quick-search-input" id="quick-search-input" placeholder="Search any topic, company, or technology…" />
              <button class="btn btn-primary" id="quick-search-btn">Search →</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  `;

  // Clock
  function updateClock() {
    const el = container.querySelector('#dashboard-clock');
    if (el) el.textContent = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
  updateClock();
  setInterval(updateClock, 1000);

  // Render sections
  renderFeed(container);
  renderOpportunities(container);
  renderHeatmap(container);
  renderTrends(container);
  renderAnomalies(container);

  // Feed controls
  const pauseBtn = container.querySelector('#feed-pause-btn');
  pauseBtn.addEventListener('click', () => {
    feedPaused = !feedPaused;
    pauseBtn.textContent = feedPaused ? '▶ Resume' : '⏸ Pause';
    pauseBtn.style.color = feedPaused ? 'var(--accent-green)' : '';
  });

  // Quick search
  const qs = container.querySelector('#quick-search-input');
  const qsBtn = container.querySelector('#quick-search-btn');
  const doSearch = () => {
    const q = qs.value.trim();
    if (q) navigateTo('/search');
    setTimeout(() => {
      const inp = document.querySelector('#main-search-input');
      if (inp) { inp.value = q; inp.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })); }
    }, 300);
  };
  qsBtn.addEventListener('click', doSearch);
  qs.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });

  // Stagger widgets
  staggerAnimate(container.querySelector('.dashboard-grid'), '.dashboard-widget', 80);

  // Start live feed
  startLiveFeed(container);
}

function renderFeed(container) {
  const list = container.querySelector('#intelligence-feed');
  const icons = { Bloomberg: '📰', Reuters: '📡', TechCrunch: '🚀', WSJ: '📊', 'MIT Tech Review': '🔬', ArXiv: '📄', 'Financial Times': '📈', Wired: '💡' };

  feedItems.slice(0, 12).forEach((item, i) => {
    const iconKey = Object.keys(icons).find(k => item.source?.includes(k)) || 'Bloomberg';
    const el = document.createElement('div');
    el.className = 'feed-item';
    el.style.animationDelay = `${i * 30}ms`;
    el.innerHTML = `
      <div class="feed-item-icon">${icons[iconKey] || '📄'}</div>
      <div class="feed-item-content">
        <div class="feed-item-title">${item.title}</div>
        <div class="feed-item-snippet">${item.snippet}</div>
        <div class="feed-item-meta">
          <span class="badge badge-indigo" style="font-size:10px;">${item.source}</span>
          <span class="feed-item-time">${timeAgo(item.publishedAt)}</span>
          <span class="feed-trust" style="color:${item.trustScore > 0.8 ? 'var(--accent-green)' : 'var(--accent-amber)'};font-size:11px;font-family:var(--font-mono);">
            ${Math.round(item.trustScore * 100)}% trust
          </span>
        </div>
      </div>
    `;
    list.appendChild(el);
  });
}

function startLiveFeed(container) {
  const sources = ['Bloomberg', 'Reuters', 'TechCrunch', 'The Information', 'Axios'];
  const templates = [
    (e) => `${e.name || 'Major AI company'} reports breakthrough in ${['autonomous systems', 'LLM efficiency', 'chip architecture', 'robotics'][Math.floor(Math.random()*4)]}`,
    (e) => `New funding round: ${e.name || 'Startup'} raises ${['$50M', '$120M', '$350M', '$1.2B'][Math.floor(Math.random()*4)]} in latest round`,
    (e) => `Hiring surge detected at ${e.name || 'tech company'} — ${Math.floor(Math.random()*80+20)}% headcount increase QoQ`,
    (e) => `Research paper: ${e.name || 'Lab'} publishes groundbreaking results on ${['AI safety', 'fusion energy', 'quantum error correction', 'protein folding'][Math.floor(Math.random()*4)]}`,
  ];

  feedInterval = setInterval(() => {
    if (feedPaused) return;
    const list = container.querySelector('#intelligence-feed');
    if (!list) { clearInterval(feedInterval); return; }

    const mockEntity = { name: ['OpenAI', 'NVIDIA', 'Anthropic', 'DeepMind', 'Scale AI', 'Mistral'][Math.floor(Math.random()*6)] };
    const tmpl = templates[Math.floor(Math.random() * templates.length)];
    const newItem = document.createElement('div');
    newItem.className = 'feed-item new';
    newItem.innerHTML = `
      <div class="feed-item-icon">🔔</div>
      <div class="feed-item-content">
        <div class="feed-item-title">${tmpl(mockEntity)}</div>
        <div class="feed-item-meta">
          <span class="badge badge-cyan" style="font-size:10px;">${sources[Math.floor(Math.random()*sources.length)]}</span>
          <span class="feed-item-time">just now</span>
        </div>
      </div>
    `;
    list.insertBefore(newItem, list.firstChild);

    // Keep max 20 items
    while (list.children.length > 20) list.removeChild(list.lastChild);
  }, 4000);
}

function renderOpportunities(container) {
  const list = container.querySelector('#opp-list');
  opportunities.slice(0, 5).forEach(opp => {
    const conf = Math.round(opp.confidenceScore * 100);
    const confColor = conf >= 80 ? 'var(--accent-green)' : conf >= 60 ? 'var(--accent-cyan)' : 'var(--accent-amber)';
    const el = document.createElement('div');
    el.className = 'opp-card';
    el.innerHTML = `
      <div class="opp-card-header">
        <span class="opp-card-title">${opp.title}</span>
        <span class="badge badge-green" style="font-family:var(--font-mono);font-size:10px;">${conf}%</span>
      </div>
      <div class="opp-card-desc">${opp.description.substring(0, 75)}…</div>
      <div class="opp-card-bar">
        <div style="height:3px;background:rgba(255,255,255,0.07);border-radius:2px;">
          <div style="width:${conf}%;height:100%;background:${confColor};border-radius:2px;transition:width 1.2s ease;"></div>
        </div>
      </div>
      <div class="opp-card-meta">
        <span class="badge badge-purple" style="font-size:10px;">${opp.category}</span>
        <a class="opp-explore-link" href="#/search">Explore →</a>
      </div>
    `;
    list.appendChild(el);
  });
}

function renderHeatmap(container) {
  const heatmap = container.querySelector('#heatmap-container');
  const svgW = 320, svgH = 160;

  const maxScore = Math.max(...countryScores.map(c => c.score));

  heatmap.innerHTML = `
    <svg viewBox="0 0 100 60" width="100%" height="100%" style="display:block;">
      <defs>
        <linearGradient id="heatGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#00f0ff"/>
          <stop offset="100%" stop-color="#a855f7"/>
        </linearGradient>
      </defs>
      <!-- Globe arc background -->
      <ellipse cx="50" cy="35" rx="48" ry="28" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.05)" stroke-width="0.5"/>
      ${countryScores.map(c => {
        const intensity = c.score / maxScore;
        const alpha = 0.15 + intensity * 0.65;
        const r = Math.round(0 + intensity * 0);
        const g = Math.round(240 * intensity);
        const b = Math.round(255 * (0.5 + intensity * 0.5));
        return `
          <rect
            x="${c.x}" y="${c.y}" width="${c.w}" height="${c.h}"
            rx="0.8"
            fill="rgba(0,${Math.round(g)},${Math.round(b)},${alpha.toFixed(2)})"
            stroke="rgba(0,240,255,0.15)"
            stroke-width="0.3"
            class="heatmap-country"
            data-name="${c.name}"
            data-score="${c.score}"
          >
            <title>${c.name}: ${c.score}/100</title>
          </rect>
          <text x="${c.x + c.w/2}" y="${c.y + c.h/2 + 1}" text-anchor="middle" font-size="1.8" fill="rgba(255,255,255,0.6)" pointer-events="none">${c.code}</text>
        `;
      }).join('')}
    </svg>
    <div class="heatmap-legend">
      <span style="font-size:10px;color:var(--text-tertiary);">Low</span>
      <div style="flex:1;height:4px;background:linear-gradient(90deg,rgba(0,240,255,0.15),rgba(0,240,255,0.8));border-radius:2px;"></div>
      <span style="font-size:10px;color:var(--text-tertiary);">High</span>
    </div>
  `;
}

function renderTrends(container) {
  const list = container.querySelector('#trends-list');
  trends.slice(0, 6).forEach(trend => {
    const isRising = trend.direction === 'rising';
    const color = isRising ? 'var(--accent-green)' : trend.direction === 'declining' ? 'var(--accent-red)' : 'var(--accent-amber)';
    const arrow = isRising ? '↗' : trend.direction === 'declining' ? '↘' : '→';
    const d = trend.trendData || [40,45,50,55,60,65,70,75,80,85];
    const path = sparklinePath(d, 60, 24);

    const el = document.createElement('div');
    el.className = 'trend-row';
    el.innerHTML = `
      <div class="trend-info">
        <span class="trend-name">${trend.name}</span>
        <div style="display:flex;align-items:center;gap:6px;">
          <span style="color:${color};font-size:16px;">${arrow}</span>
          <span class="badge" style="background:${color}22;color:${color};font-family:var(--font-mono);font-size:10px;">${trend.velocity}</span>
        </div>
      </div>
      <svg width="60" height="24" viewBox="0 0 60 24" style="flex-shrink:0;">
        <path d="${path}" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.8" stroke-linecap="round"/>
      </svg>
    `;
    list.appendChild(el);
  });
}

function renderAnomalies(container) {
  const list = container.querySelector('#anomaly-list');
  const sevColors = { critical: 'var(--accent-red)', high: 'var(--accent-amber)', medium: 'var(--accent-cyan)', low: 'var(--accent-green)' };

  anomalies.forEach(anomaly => {
    const color = sevColors[anomaly.severity] || 'var(--text-secondary)';
    const dev = anomaly.deviationPercentage;
    const el = document.createElement('div');
    el.className = 'anomaly-row';
    el.style.borderLeftColor = color;
    el.innerHTML = `
      <div class="anomaly-row-header">
        <span class="anomaly-entity">${anomaly.entityName}</span>
        <span class="badge" style="background:${color}22;color:${color};font-size:10px;">${anomaly.severity.toUpperCase()}</span>
      </div>
      <div class="anomaly-metric">${anomaly.metricName}: <span style="color:${color};font-family:var(--font-mono);">${dev > 0 ? '+' : ''}${dev}%</span></div>
      <div class="anomaly-time" style="font-size:11px;color:var(--text-tertiary);">${timeAgo(anomaly.detectedAt)}</div>
    `;
    list.appendChild(el);
  });
}
