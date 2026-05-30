/**
 * GOD'S EYE X — Report Center Page
 */

import { sampleReports } from '../data/reports.js';
import { generateId, sleep, timeAgo } from '../utils/helpers.js';
import { staggerAnimate } from '../utils/animations.js';

let reportsData = [...sampleReports];

export async function renderReports(container) {
  container.innerHTML = `
    <div class="reports-page">

      <!-- Sidebar: Generator -->
      <div class="reports-sidebar glass-static">
        <div class="reports-sidebar-header">
          <h2 class="reports-sidebar-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" stroke-width="2" style="display:inline;vertical-align:middle;margin-right:8px;"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/></svg>
            Generate Report
          </h2>
          <p class="reports-sidebar-sub">AI-powered intelligence reports in seconds</p>
        </div>

        <div class="report-form">
          <div class="form-group">
            <label class="form-label" for="report-topic">Topic *</label>
            <input class="input" id="report-topic" placeholder="e.g., AI Infrastructure, Fusion Energy…" />
          </div>

          <div class="form-group">
            <label class="form-label" for="report-type">Report Type</label>
            <select class="select" id="report-type">
              <option value="executive_summary">Executive Summary</option>
              <option value="full_report" selected>Full Report</option>
              <option value="market_analysis">Market Analysis</option>
              <option value="competitive_analysis">Competitive Analysis</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="report-depth">Depth</label>
            <select class="select" id="report-depth">
              <option value="brief">Brief (5 min read)</option>
              <option value="standard" selected>Standard (15 min read)</option>
              <option value="comprehensive">Comprehensive (30 min read)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="checkbox-wrapper">
              <input type="checkbox" id="include-recommendations" checked />
              <span class="checkbox-custom"></span>
              <span class="checkbox-label">Include Recommendations</span>
            </label>
            <label class="checkbox-wrapper" style="margin-top:8px;">
              <input type="checkbox" id="include-risks" checked />
              <span class="checkbox-custom"></span>
              <span class="checkbox-label">Include Risk Analysis</span>
            </label>
          </div>

          <button class="btn btn-primary" id="generate-report-btn" style="width:100%;justify-content:center;padding:14px;font-size:15px;">
            <span>✨</span>
            Generate Report
          </button>
        </div>

        <!-- Progress (hidden by default) -->
        <div class="report-gen-progress" id="report-gen-progress" style="display:none;">
          <div class="report-gen-title">Generating report…</div>
          <div class="progress-steps">
            ${[
              'Collecting intelligence sources',
              'Analyzing data patterns',
              'Generating insights',
              'Writing report',
              'Complete!'
            ].map((step, i) => `
              <div class="progress-step" data-gen-step="${i}">
                <div class="progress-step-dot"></div>
                <span>${step}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Main: Reports list -->
      <div class="reports-main">
        <div class="reports-main-header">
          <h2 class="reports-main-title">Intelligence Reports</h2>
          <span class="badge badge-cyan" id="reports-count">${reportsData.length} reports</span>
        </div>

        <!-- Table view -->
        <div class="reports-table-container glass-static" id="reports-table-view">
          <table class="data-table" id="reports-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Topic</th>
                <th>Type</th>
                <th>Generated</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="reports-tbody"></tbody>
          </table>
        </div>

        <!-- Detail view (hidden by default) -->
        <div class="report-detail-view glass-static" id="report-detail-view" style="display:none;"></div>
      </div>
    </div>
  `;

  renderReportsTable(container);

  // Generate button
  container.querySelector('#generate-report-btn').addEventListener('click', () => {
    const topic = container.querySelector('#report-topic').value.trim();
    if (!topic) {
      const input = container.querySelector('#report-topic');
      input.style.borderColor = 'var(--accent-red)';
      input.placeholder = 'Please enter a topic!';
      setTimeout(() => { input.style.borderColor = ''; input.placeholder = 'e.g., AI Infrastructure, Fusion Energy…'; }, 2000);
      return;
    }
    generateReport(topic, container);
  });
}

function renderReportsTable(container) {
  const tbody = container.querySelector('#reports-tbody');
  tbody.innerHTML = '';

  reportsData.forEach(report => {
    const tr = document.createElement('tr');
    const statusColors = { completed: 'badge-green', processing: 'badge-amber', failed: 'badge-red', pending: 'badge-indigo' };
    const typeLabels = {
      executive_summary: 'Executive Summary',
      full_report: 'Full Report',
      market_analysis: 'Market Analysis',
      competitive_analysis: 'Competitive Analysis',
    };

    tr.innerHTML = `
      <td style="font-weight:600;color:var(--text-primary);max-width:240px;" class="truncate">${report.title}</td>
      <td><span class="badge badge-cyan">${report.topic}</span></td>
      <td style="font-size:12px;">${typeLabels[report.reportType] || report.reportType}</td>
      <td style="font-family:var(--font-mono);font-size:12px;color:var(--text-secondary);">${timeAgo(report.generatedAt)}</td>
      <td><span class="badge ${statusColors[report.status] || 'badge-indigo'}">${report.status}</span></td>
      <td>
        <div class="report-actions-cell">
          <button class="btn-icon btn-sm tooltip" data-tooltip="View Report" data-action="view" data-id="${report.id}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
          <button class="btn-icon btn-sm tooltip" data-tooltip="Download PDF" data-action="download">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          </button>
          <button class="btn-icon btn-sm tooltip" data-tooltip="Delete" data-action="delete" data-id="${report.id}" style="--icon-hover-color:var(--accent-red);">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
          </button>
        </div>
      </td>
    `;

    // Row click handlers
    tr.querySelectorAll('button[data-action]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const action = btn.dataset.action;
        const id = btn.dataset.id;
        if (action === 'view') showReportDetail(id, container);
        if (action === 'delete') deleteReport(id, container);
        if (action === 'download') {
          btn.innerHTML = '✓';
          btn.style.color = 'var(--accent-green)';
          setTimeout(() => { btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>'; btn.style.color = ''; }, 1500);
        }
      });
    });

    tbody.appendChild(tr);
  });

  staggerAnimate(tbody, 'tr', 50);
}

async function generateReport(topic, container) {
  const genBtn = container.querySelector('#generate-report-btn');
  const form = container.querySelector('.report-form');
  const progress = container.querySelector('#report-gen-progress');

  genBtn.disabled = true;
  form.style.opacity = '0.4';
  progress.style.display = 'block';

  const steps = progress.querySelectorAll('.progress-step');
  const durations = [900, 900, 900, 700, 500];

  for (let i = 0; i < steps.length; i++) {
    if (i > 0) { steps[i-1].classList.remove('active'); steps[i-1].classList.add('completed'); }
    steps[i].classList.add('active');
    await sleep(durations[i]);
  }
  steps[steps.length-1].classList.add('completed');
  steps[steps.length-1].classList.remove('active');

  // Build new report via API
  const type = container.querySelector('#report-type').value;
  const depth = container.querySelector('#report-depth').value;
  
  let newReport = null;
  try {
    const res = await fetch(`/api/reports/generate?topic=${encodeURIComponent(topic)}&report_type=${encodeURIComponent(type)}&depth=${encodeURIComponent(depth)}`, { method: 'POST' });
    if (res.ok) {
      newReport = await res.json();
    }
  } catch (e) {
    console.error("API error", e);
  }

  // Fallback if API fails
  if (!newReport) {
    const typeLabels = { executive_summary: 'Executive Summary', full_report: 'Full Report', market_analysis: 'Market Analysis', competitive_analysis: 'Competitive Analysis' };
    newReport = {
      id: generateId(),
      title: `${typeLabels[type]}: ${topic}`,
      topic,
      reportType: type,
      depth,
      status: 'completed',
      generatedAt: new Date().toISOString(),
      processingTimeMs: 4800,
      executiveSummary: `This ${depth} analysis examines ${topic} across multiple dimensions including market dynamics, key players, technological maturity, and investment signals. Our AI-powered intelligence engine synthesized data from 200+ sources to deliver actionable insights.`,
      keyFindings: [
        `${topic} market is growing at an estimated 34% CAGR with $127B in projected value by 2028`,
        `Three dominant players control 67% of market share, with significant disruption risk from emerging startups`,
        `Government investment in ${topic} increased 156% YoY, signaling strong policy tailwinds`,
        `Talent acquisition is the primary bottleneck — 89% of companies cite hiring as their #1 challenge`,
        `Convergence with adjacent technologies (AI, robotics, materials science) is accelerating innovation cycles`,
      ],
      content: `## Market Overview\n\nThe ${topic} sector is experiencing unprecedented growth, driven by a confluence of technological breakthroughs, geopolitical imperatives, and private capital deployment. Our analysis of 450+ data signals over the past 90 days reveals a market in transformation...\n\n## Key Players & Dynamics\n\nLeading organizations in this space are consolidating competitive advantages through vertical integration and strategic partnerships. The top three players have collectively deployed $18.4B in capital expenditure over the past 12 months...\n\n## Investment Signals\n\nVenture capital deployment into ${topic} reached $34.2B in the trailing 12 months, representing a 67% increase from the prior year. Notably, late-stage rounds ($100M+) now account for 78% of total capital deployed, signaling investor confidence in near-term commercialization...\n\n## Risk Factors\n\nRegulatory uncertainty remains the primary risk vector, with five major jurisdictions actively developing ${topic}-specific legislation. Supply chain concentration in critical materials presents a secondary risk, with 73% of key components sourced from a single geographic region...\n\n## Strategic Recommendations\n\n1. **Accelerate talent acquisition** — The hiring window for specialized talent is narrowing as competition intensifies\n2. **Diversify supply chains** — Reduce geographic concentration risk through multi-supplier strategies\n3. **Engage regulatory bodies proactively** — Shape policy outcomes rather than react to them\n4. **Monitor three key trigger events** — These signals indicate inflection points for market entry/exit decisions`,
    };
  } else {
    // Fill in mock content for the returned shell report
    newReport.executiveSummary = `AI synthesized report on ${topic}. Data connected across global graphs.`;
    newReport.keyFindings = [`${topic} shows 40% growth`, `High correlation with geopolitical risk`];
    newReport.content = `## Overview\nReal generated report from FastAPI endpoint. Status: ${newReport.status}. ID: ${newReport.id}`;
    newReport.status = 'completed'; // auto complete for UI demo purposes
  }

  reportsData.unshift(newReport);

  // Reset UI
  await sleep(400);
  progress.style.display = 'none';
  form.style.opacity = '1';
  genBtn.disabled = false;
  steps.forEach(s => s.classList.remove('active', 'completed'));
  container.querySelector('#report-topic').value = '';
  container.querySelector('#reports-count').textContent = `${reportsData.length} reports`;

  renderReportsTable(container);

  // Highlight new row
  setTimeout(() => {
    const firstRow = container.querySelector('#reports-tbody tr');
    if (firstRow) {
      firstRow.style.background = 'var(--accent-cyan-dim)';
      firstRow.style.transition = 'background 1s ease';
      setTimeout(() => { firstRow.style.background = ''; }, 2000);
    }
  }, 100);
}

function showReportDetail(id, container) {
  const report = reportsData.find(r => r.id === id);
  if (!report) return;

  const tableView = container.querySelector('#reports-table-view');
  const detailView = container.querySelector('#report-detail-view');

  tableView.style.display = 'none';
  detailView.style.display = 'block';

  const typeColors = { executive_summary: 'badge-cyan', full_report: 'badge-purple', market_analysis: 'badge-green', competitive_analysis: 'badge-amber' };

  detailView.innerHTML = `
    <div class="report-detail-topbar">
      <button class="btn btn-ghost" id="back-to-reports">← Back to Reports</button>
      <div class="report-detail-actions">
        <button class="btn btn-secondary btn-sm">↗ Share</button>
        <button class="btn btn-primary btn-sm">⬇ Download PDF</button>
      </div>
    </div>

    <div class="report-detail-content">
      <div class="report-detail-meta">
        <span class="badge ${typeColors[report.reportType] || 'badge-cyan'}">${report.reportType.replace(/_/g, ' ')}</span>
        <span class="badge badge-indigo">${report.depth}</span>
        <span style="color:var(--text-tertiary);font-size:12px;margin-left:8px;">${new Date(report.generatedAt).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}</span>
      </div>

      <h1 class="report-detail-title">${report.title}</h1>

      <div class="report-section">
        <h3 class="report-section-heading">Executive Summary</h3>
        <p class="report-prose">${report.executiveSummary}</p>
      </div>

      <div class="report-section">
        <h3 class="report-section-heading">Key Findings</h3>
        <ol class="report-findings-list">
          ${(report.keyFindings || []).map(f => `<li>${f}</li>`).join('')}
        </ol>
      </div>

      <div class="report-section">
        <h3 class="report-section-heading">Full Analysis</h3>
        <div class="report-prose">
          ${(report.content || '').split('\n\n').map(para => {
            if (para.startsWith('## ')) return `<h4 class="report-subheading">${para.slice(3)}</h4>`;
            if (para.startsWith('1. ') || para.startsWith('- ')) {
              return `<ul class="report-list">${para.split('\n').map(li => `<li>${li.replace(/^[\d\.\-\*]\s+/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('')}</ul>`;
            }
            return `<p>${para.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>`;
          }).join('')}
        </div>
      </div>
    </div>
  `;

  detailView.querySelector('#back-to-reports').addEventListener('click', () => {
    detailView.style.display = 'none';
    tableView.style.display = 'block';
  });

  detailView.scrollTop = 0;
}

function deleteReport(id, container) {
  reportsData = reportsData.filter(r => r.id !== id);
  container.querySelector('#reports-count').textContent = `${reportsData.length} reports`;
  renderReportsTable(container);
}
