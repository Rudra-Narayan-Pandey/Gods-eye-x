/**
 * GOD'S EYE X — Intelligence Panel Component
 */

import { formatPercent, timeAgo } from '../utils/helpers.js';

let opportunities = [];
let trends = [];
let evidence = [];

export function createIntelligencePanel() {
  const panel = document.createElement('div');
  panel.className = 'intelligence-panel';
  panel.id = 'intelligence-panel';

  let activeTab = 'opportunities';
  
  // Load data asynchronously
  fetch('/api/dashboard/feed').then(res => res.json()).then(data => {
    if (data) {
      opportunities = data.opportunities || [];
      trends = data.trends || [];
      evidence = data.evidence || [];
      // Update tab counts
      panel.querySelector('.tab[data-tab="opportunities"] .tab-count').textContent = opportunities.length;
      panel.querySelector('.tab[data-tab="trends"] .tab-count').textContent = trends.length;
      panel.querySelector('.tab[data-tab="evidence"] .tab-count').textContent = evidence.length;
      // Re-render active tab if already mounted
      renderTab(activeTab);
    }
  }).catch(e => console.error("Failed to load intel", e));

  const tabs = [
    { id: 'opportunities', label: 'Opportunities', count: opportunities.length },
    { id: 'risks', label: 'Risks', count: 4 },
    { id: 'trends', label: 'Trends', count: trends.length },
    { id: 'evidence', label: 'Evidence', count: evidence.length },
  ];

  panel.innerHTML = `
    <div class="intel-header">
      <span class="intel-title">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" stroke-width="2" style="display:inline;vertical-align:middle;margin-right:6px;"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
        Intelligence
      </span>
      <button class="btn-icon intel-collapse-btn" id="intel-collapse-btn" title="Collapse panel">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    </div>
    <div class="tabs intel-tabs">
      ${tabs.map(t => `
        <button class="tab ${t.id === activeTab ? 'active' : ''}" data-tab="${t.id}">
          ${t.label}
          <span class="tab-count">${t.count}</span>
        </button>
      `).join('')}
    </div>
    <div class="intel-body" id="intel-body"></div>
  `;

  function renderTab(tabId) {
    const body = panel.querySelector('#intel-body');
    body.style.opacity = '0';
    setTimeout(() => {
      body.innerHTML = '';
      if (tabId === 'opportunities') renderOpportunities(body);
      else if (tabId === 'risks') renderRisks(body);
      else if (tabId === 'trends') renderTrends(body);
      else if (tabId === 'evidence') renderEvidence(body);
      body.style.opacity = '1';
      body.style.transition = 'opacity 0.25s ease';
    }, 120);
  }

  function renderOpportunities(body) {
    opportunities.slice(0, 6).forEach(opp => {
      const card = document.createElement('div');
      card.className = 'intel-card intel-opp-card';
      const conf = Math.round(opp.confidenceScore * 100);
      const confColor = conf >= 80 ? 'var(--accent-green)' : conf >= 60 ? 'var(--accent-cyan)' : 'var(--accent-amber)';
      card.innerHTML = `
        <div class="intel-card-header">
          <span class="intel-card-title">${opp.title}</span>
          <span class="badge badge-cyan" style="font-family:var(--font-mono);font-size:11px;">${conf}%</span>
        </div>
        <p class="intel-card-desc">${opp.description.substring(0, 90)}…</p>
        <div class="intel-card-meta">
          <div class="intel-conf-bar">
            <div class="intel-conf-fill" style="width:${conf}%;background:${confColor}"></div>
          </div>
        </div>
        <div class="intel-card-footer">
          <span class="badge badge-purple">${opp.category}</span>
          <span class="intel-evidence-count">📎 ${opp.evidence?.length || 3} sources</span>
        </div>
      `;
      body.appendChild(card);
    });
  }

  function renderRisks(body) {
    const risks = [
      { title: 'AI Regulation Headwinds', desc: 'EU AI Act compliance costs could reduce margins for companies operating in Europe.', severity: 'high', category: 'Regulatory', conf: 0.82 },
      { title: 'Chip Export Restrictions', desc: 'US-China chip export controls expanding to more semiconductor categories.', severity: 'critical', category: 'Geopolitical', conf: 0.91 },
      { title: 'LLM Commoditization', desc: 'Rapid open-source model improvements reducing moat for proprietary LLM providers.', severity: 'medium', category: 'Competitive', conf: 0.75 },
      { title: 'Energy Infrastructure Bottleneck', desc: 'Data center power demand outpacing grid capacity in key AI hubs.', severity: 'high', category: 'Infrastructure', conf: 0.88 },
    ];
    risks.forEach(risk => {
      const card = document.createElement('div');
      card.className = 'intel-card intel-risk-card';
      const sevColor = { critical:'var(--accent-red)', high:'var(--accent-amber)', medium:'var(--accent-cyan)', low:'var(--accent-green)' }[risk.severity];
      card.innerHTML = `
        <div class="intel-card-header">
          <span class="intel-card-title">${risk.title}</span>
          <span class="badge" style="background:${sevColor}22;color:${sevColor};font-size:10px;">${risk.severity.toUpperCase()}</span>
        </div>
        <p class="intel-card-desc">${risk.desc}</p>
        <div class="intel-card-footer">
          <span class="badge badge-amber">${risk.category}</span>
          <span class="intel-evidence-count" style="font-family:var(--font-mono);">${Math.round(risk.conf*100)}% confidence</span>
        </div>
      `;
      body.appendChild(card);
    });
  }

  function renderTrends(body) {
    trends.slice(0, 8).forEach(trend => {
      const card = document.createElement('div');
      card.className = 'intel-card intel-trend-card';
      const isRising = trend.direction === 'rising';
      const arrowColor = isRising ? 'var(--accent-green)' : trend.direction === 'declining' ? 'var(--accent-red)' : 'var(--accent-amber)';
      const arrow = isRising ? '↗' : trend.direction === 'declining' ? '↘' : '→';
      // Mini sparkline
      const d = trend.trendData || [40,45,50,55,60,65,70,75,80,85,90,95];
      const max = Math.max(...d), min = Math.min(...d), range = max - min || 1;
      const pts = d.map((v,i) => `${(i/(d.length-1))*80},${28-((v-min)/range)*24}`).join(' ');

      card.innerHTML = `
        <div class="intel-trend-row">
          <div class="intel-trend-info">
            <span class="intel-card-title">${trend.name}</span>
            <div style="display:flex;align-items:center;gap:8px;margin-top:4px;">
              <span style="color:${arrowColor};font-size:18px;font-weight:700;">${arrow}</span>
              <span class="badge" style="background:${arrowColor}22;color:${arrowColor};font-family:var(--font-mono);">${trend.velocity}</span>
            </div>
          </div>
          <svg width="80" height="30" viewBox="0 0 80 30">
            <polyline points="${pts}" fill="none" stroke="${arrowColor}" stroke-width="2" opacity="0.8" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="${pts} 80,30 0,30" fill="${arrowColor}" opacity="0.08"/>
          </svg>
        </div>
      `;
      body.appendChild(card);
    });
  }

  function renderEvidence(body) {
    evidence.slice(0, 10).forEach(ev => {
      const card = document.createElement('div');
      card.className = 'intel-card intel-evidence-item';
      const trust = Math.round(ev.trustScore * 100);
      const trustColor = trust >= 80 ? 'var(--accent-green)' : trust >= 60 ? 'var(--accent-cyan)' : 'var(--accent-amber)';
      card.innerHTML = `
        <div class="intel-card-header">
          <span class="badge badge-indigo" style="font-size:10px;">${ev.source}</span>
          <span class="intel-time" style="color:var(--text-tertiary);font-size:11px;">${timeAgo(ev.publishedAt)}</span>
        </div>
        <p class="intel-evidence-title">${ev.title}</p>
        <p class="intel-card-desc">${ev.snippet}</p>
        <div class="intel-trust-row">
          <span style="font-size:11px;color:var(--text-tertiary);">Trust</span>
          <div class="intel-trust-bar">
            <div style="width:${trust}%;height:100%;background:${trustColor};border-radius:2px;transition:width 0.8s ease;"></div>
          </div>
          <span style="font-size:11px;font-family:var(--font-mono);color:${trustColor};">${trust}%</span>
        </div>
      `;
      body.appendChild(card);
    });
  }

  // Tab switching
  requestAnimationFrame(() => {
    panel.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        panel.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        activeTab = tab.dataset.tab;
        renderTab(activeTab);
      });
    });

    // Collapse
    panel.querySelector('#intel-collapse-btn').addEventListener('click', () => {
      panel.classList.toggle('collapsed');
      const icon = panel.querySelector('#intel-collapse-btn svg');
      icon.style.transform = panel.classList.contains('collapsed') ? 'rotate(180deg)' : '';
    });

    // Initial render
    renderTab(activeTab);
  });

  return panel;
}
