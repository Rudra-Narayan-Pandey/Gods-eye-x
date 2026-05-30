/**
 * GOD'S EYE X — Reality Search Page
 */

import { createFiltersPanel } from '../components/filters-panel.js';
import { createIntelligencePanel } from '../components/intelligence-panel.js';
import { createEntityCard } from '../components/entity-card.js';
import { showEntityDetailModal } from '../components/entity-detail-modal.js';
import { debounce, sleep } from '../utils/helpers.js';
import { staggerAnimate } from '../utils/animations.js';

// Autocomplete suggestions pool
const SUGGESTIONS = [
  'AI Infrastructure', 'Quantum Computing', 'Fusion Energy', 'Robotics Startups',
  'Defense Technology', 'Large Language Models', 'Semiconductor Industry',
  'Autonomous Vehicles', 'Brain-Computer Interface', 'Synthetic Biology',
  'Space Technology', 'Cybersecurity AI', 'Edge Computing', 'Neuromorphic Chips',
  'Carbon Capture', 'Gene Editing', 'Satellite Internet', 'Humanoid Robots',
];

let currentQuery = '';
let currentFilters = { entityTypes: { company: true, technology: true, startup: true }, momentumMin: 0, momentumMax: 1 };
let allEntities = [];
let searchTimeout = null;

export async function renderSearch(container) {
  try {
    const res = await fetch('/api/entities');
    if (res.ok) {
      const data = await res.json();
      // map backend type to _type for compatibility with frontend components
      allEntities = data.map(e => ({ ...e, _type: e.type, ...e.properties }));
    }
  } catch (err) {
    console.error("Failed to load entities", err);
    allEntities = [];
  }

  container.innerHTML = `
    <div class="search-page" id="search-page">
      <!-- Fixed Search Header -->
      <div class="search-header glass-static" id="search-header">
        <div class="search-bar-outer">
          <div class="search-bar-wrapper" id="search-bar-wrapper">
            <div class="search-icon-left">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <input
              type="text"
              class="search-input"
              id="main-search-input"
              placeholder="Search companies, technologies, trends…"
              autocomplete="off"
              spellcheck="false"
            />
            <div class="search-input-actions">
              <span class="search-kbd">⌘K</span>
              <button class="search-clear-btn" id="search-clear-btn" style="display:none;">✕</button>
            </div>
          </div>
          <div class="search-autocomplete" id="search-autocomplete" style="display:none;"></div>
        </div>
      </div>

      <!-- Main layout -->
      <div class="search-main" id="search-main">
        <!-- Left: Filters -->
        <div id="filters-container"></div>

        <!-- Center: Content -->
        <div class="search-content" id="search-content">
          <!-- Empty state initially -->
          <div class="search-empty-state" id="search-empty-state">
            <div class="search-empty-icon">
              <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="url(#eg)" stroke-width="1" stroke-linecap="round"><defs><linearGradient id="eg" x1="0" y1="0" x2="24" y2="24"><stop offset="0%" stop-color="#00f0ff"/><stop offset="100%" stop-color="#a855f7"/></linearGradient></defs><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <h2 class="search-empty-title">Search for anything</h2>
            <p class="search-empty-sub">Explore companies, technologies, trends, and geopolitical signals</p>
            <div class="search-suggestions-grid" id="search-suggestions-grid">
              ${SUGGESTIONS.slice(0, 8).map(s => `
                <button class="search-suggestion-chip" data-query="${s}">${s}</button>
              `).join('')}
            </div>
          </div>

          <!-- Results area -->
          <div class="search-results" id="search-results" style="display:none;">
            <div class="search-results-header">
              <span class="search-results-count" id="search-results-count"></span>
              <div class="search-results-sort">
                <select class="select" id="sort-select" style="font-size:13px;padding:6px 28px 6px 10px;width:auto;">
                  <option value="momentum">Sort: Momentum</option>
                  <option value="name">Sort: Name</option>
                  <option value="funding">Sort: Funding</option>
                </select>
              </div>
            </div>
            <div class="masonry-grid" id="entity-cards-grid"></div>
            <div class="search-load-more" id="search-load-more" style="display:none;">
              <button class="btn btn-secondary">Load More Results</button>
            </div>
          </div>

          <!-- Loading state -->
          <div class="search-loading-state" id="search-loading-state" style="display:none;">
            <div class="loading-progress-steps">
              <div class="progress-step" data-step="0">
                <div class="progress-step-dot"></div>
                <span>Collecting intelligence signals…</span>
              </div>
              <div class="progress-step" data-step="1">
                <div class="progress-step-dot"></div>
                <span>Extracting entities…</span>
              </div>
              <div class="progress-step" data-step="2">
                <div class="progress-step-dot"></div>
                <span>Building knowledge graph…</span>
              </div>
              <div class="progress-step" data-step="3">
                <div class="progress-step-dot"></div>
                <span>Generating insights…</span>
              </div>
            </div>
            <div class="masonry-grid skeleton-grid">
              ${Array(6).fill(0).map(() => `
                <div class="entity-card skeleton-card">
                  <div class="skeleton skeleton-title"></div>
                  <div class="skeleton skeleton-text"></div>
                  <div class="skeleton skeleton-text short"></div>
                  <div class="skeleton skeleton-text shorter" style="margin-top:16px;height:40px;border-radius:8px;"></div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- No results -->
          <div class="search-no-results" id="search-no-results" style="display:none;">
            <div class="empty-state">
              <div class="empty-state-icon">🔍</div>
              <h3>No results found</h3>
              <p>Try different keywords or broaden your filters</p>
              <div style="display:flex;gap:12px;margin-top:24px;flex-wrap:wrap;justify-content:center;">
                <button class="btn btn-secondary" id="no-results-broaden">Remove Filters</button>
                <button class="btn btn-ghost" id="no-results-clear">Clear Search</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Intelligence Panel -->
        <div id="intel-container"></div>
      </div>
    </div>
  `;

  // Mount filters panel
  const filtersContainer = container.querySelector('#filters-container');
  const filtersPanel = createFiltersPanel((filters) => {
    currentFilters = filters;
    if (currentQuery) renderResults(currentQuery);
  });
  filtersContainer.appendChild(filtersPanel);

  // Mount intelligence panel
  const intelContainer = container.querySelector('#intel-container');
  const intelPanel = createIntelligencePanel();
  intelContainer.appendChild(intelPanel);

  // Wire up search input
  const input = container.querySelector('#main-search-input');
  const clearBtn = container.querySelector('#search-clear-btn');
  const autocomplete = container.querySelector('#search-autocomplete');

  input.addEventListener('input', debounce(() => {
    const q = input.value.trim();
    clearBtn.style.display = q ? 'flex' : 'none';
    showAutocomplete(q, autocomplete, input);
  }, 180));

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const q = input.value.trim();
      hideAutocomplete(autocomplete);
      if (q) performSearch(q, container);
    }
    if (e.key === 'Escape') hideAutocomplete(autocomplete);
    if (e.key === 'ArrowDown') {
      const first = autocomplete.querySelector('.search-autocomplete-item');
      first?.focus();
    }
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    clearBtn.style.display = 'none';
    hideAutocomplete(autocomplete);
    showEmptyState(container);
  });

  // Suggestion chips
  container.querySelectorAll('.search-suggestion-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.dataset.query;
      input.value = q;
      clearBtn.style.display = 'flex';
      performSearch(q, container);
    });
  });

  // Sort
  container.querySelector('#sort-select')?.addEventListener('change', e => {
    if (currentQuery) renderResults(currentQuery, e.target.value);
  });

  // Focus search on Ctrl+K
  document.addEventListener('keydown', function handler(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      input.focus();
      input.select();
    }
  });

  // Close autocomplete on outside click
  document.addEventListener('click', e => {
    if (!e.target.closest('#search-bar-wrapper')) hideAutocomplete(autocomplete);
  });

  // Listen for entity-select events
  container.addEventListener('entity-select', e => {
    const { entity, type } = e.detail;
    showEntityDetailModal(entity, type);
  });

  // Auto-focus
  setTimeout(() => input.focus(), 100);
}

function showAutocomplete(query, dropdown, input) {
  if (!query) { hideAutocomplete(dropdown); return; }

  const matches = SUGGESTIONS.filter(s => s.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
  const entityMatches = allEntities
    .filter(e => e.name.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 4);

  if (!matches.length && !entityMatches.length) { hideAutocomplete(dropdown); return; }

  dropdown.innerHTML = `
    ${matches.length ? `
      <div class="autocomplete-section-label">Suggested Searches</div>
      ${matches.map(m => `
        <div class="search-autocomplete-item" tabindex="0" data-query="${m}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <span>${highlightMatch(m, query)}</span>
        </div>
      `).join('')}
    ` : ''}
    ${entityMatches.length ? `
      <div class="autocomplete-section-label">Entities</div>
      ${entityMatches.map(e => `
        <div class="search-autocomplete-item" tabindex="0" data-query="${e.name}">
          <span style="font-size:16px;">${e.logo || '🔵'}</span>
          <span>${highlightMatch(e.name, query)}</span>
          <span class="autocomplete-type-badge">${e._type}</span>
        </div>
      `).join('')}
    ` : ''}
  `;

  dropdown.querySelectorAll('.search-autocomplete-item').forEach(item => {
    item.addEventListener('click', () => {
      const q = item.dataset.query;
      input.value = q;
      hideAutocomplete(dropdown);
      const clearBtn = document.querySelector('#search-clear-btn');
      if (clearBtn) clearBtn.style.display = 'flex';
      performSearch(q, document.querySelector('#search-page').parentElement);
    });
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter') item.click();
      if (e.key === 'ArrowDown') item.nextElementSibling?.focus();
      if (e.key === 'ArrowUp') item.previousElementSibling?.focus() || input.focus();
    });
  });

  dropdown.style.display = 'block';
}

function hideAutocomplete(dropdown) {
  dropdown.style.display = 'none';
}

function highlightMatch(text, query) {
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return text.slice(0, idx) + `<mark style="background:var(--accent-cyan-dim);color:var(--accent-cyan);border-radius:2px;">${text.slice(idx, idx + query.length)}</mark>` + text.slice(idx + query.length);
}

async function performSearch(query, container) {
  currentQuery = query;
  hideAutocomplete(container.querySelector('#search-autocomplete'));
  showLoadingState(container);
  await animateLoadingSteps(container);
  renderResults(query, 'momentum', container);
}

async function animateLoadingSteps(container) {
  const steps = container.querySelectorAll('.progress-step');
  for (let i = 0; i < steps.length; i++) {
    if (i > 0) steps[i - 1].classList.remove('active');
    if (i > 0) steps[i - 1].classList.add('completed');
    steps[i].classList.add('active');
    await sleep(380);
  }
  steps[steps.length - 1].classList.add('completed');
  steps[steps.length - 1].classList.remove('active');
  await sleep(200);
}

function showLoadingState(container) {
  container.querySelector('#search-empty-state').style.display = 'none';
  container.querySelector('#search-results').style.display = 'none';
  container.querySelector('#search-no-results').style.display = 'none';
  container.querySelector('#search-loading-state').style.display = 'block';
  container.querySelectorAll('.progress-step').forEach(s => s.classList.remove('active', 'completed'));
}

function showEmptyState(container) {
  container.querySelector('#search-empty-state').style.display = 'flex';
  container.querySelector('#search-results').style.display = 'none';
  container.querySelector('#search-no-results').style.display = 'none';
  container.querySelector('#search-loading-state').style.display = 'none';
  currentQuery = '';
}

function renderResults(query, sortBy = 'momentum', container) {
  const c = container || document.querySelector('#search-page')?.parentElement;
  if (!c) return;

  // Filter entities
  let results = allEntities.filter(entity => {
    // Query match
    const q = query.toLowerCase();
    const nameMatch = entity.name.toLowerCase().includes(q);
    const tagMatch = (entity.tags || []).some(t => t.toLowerCase().includes(q));
    const descMatch = (entity.description || '').toLowerCase().includes(q);
    const industryMatch = (entity.industry || entity.category || '').toLowerCase().includes(q);
    if (!nameMatch && !tagMatch && !descMatch && !industryMatch) return false;

    // Type filter
    const typeEnabled = currentFilters.entityTypes?.[entity._type];
    if (!typeEnabled) return false;

    // Momentum filter
    const mom = entity.momentum || 0.5;
    if (mom < currentFilters.momentumMin || mom > currentFilters.momentumMax) return false;

    return true;
  });

  // Fallback: show all if query is broad
  if (results.length === 0 && query.length <= 3) {
    results = allEntities.filter(e => currentFilters.entityTypes?.[e._type]);
  }

  // Sort
  if (sortBy === 'momentum') results.sort((a, b) => (b.momentum || 0) - (a.momentum || 0));
  else if (sortBy === 'name') results.sort((a, b) => a.name.localeCompare(b.name));
  else if (sortBy === 'funding') results.sort((a, b) => (b.funding || b.valuation || 0) - (a.funding || a.valuation || 0));

  // Hide loading, show results or no-results
  c.querySelector('#search-loading-state').style.display = 'none';
  c.querySelector('#search-empty-state').style.display = 'none';

  if (results.length === 0) {
    c.querySelector('#search-results').style.display = 'none';
    c.querySelector('#search-no-results').style.display = 'flex';
    c.querySelector('#no-results-broaden')?.addEventListener('click', () => {
      currentFilters = { entityTypes: { company: true, technology: true, startup: true }, momentumMin: 0, momentumMax: 1 };
      renderResults(query, sortBy, c);
    });
    c.querySelector('#no-results-clear')?.addEventListener('click', () => showEmptyState(c));
    return;
  }

  c.querySelector('#search-no-results').style.display = 'none';
  const resultsEl = c.querySelector('#search-results');
  resultsEl.style.display = 'block';

  // Update count
  c.querySelector('#search-results-count').textContent = `${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`;

  // Render cards
  const grid = c.querySelector('#entity-cards-grid');
  grid.innerHTML = '';
  results.forEach(entity => {
    const card = createEntityCard(entity, entity._type);
    grid.appendChild(card);
  });

  staggerAnimate(grid, '.entity-card', 40);
}
