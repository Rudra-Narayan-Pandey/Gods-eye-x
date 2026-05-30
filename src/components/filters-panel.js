/**
 * GOD'S EYE X — Filters Panel Component
 */

export function createFiltersPanel(onFilterChange) {
  const panel = document.createElement('div');
  panel.className = 'filters-sidebar';
  panel.id = 'filters-panel';

  const state = {
    entityTypes: { company: true, technology: true, startup: true },
    timeRange: '30d',
    momentumMin: 0,
    momentumMax: 1,
    verifiedOnly: false,
    collapsed: false,
  };

  function notify() {
    if (onFilterChange) onFilterChange({ ...state });
  }

  panel.innerHTML = `
    <div class="filters-header">
      <span class="filters-title">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline;vertical-align:middle;margin-right:6px;"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
        Filters
      </span>
      <button class="filters-collapse-btn btn-icon" id="filters-collapse-btn" title="Collapse">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
    </div>

    <div class="filters-body" id="filters-body">

      <!-- Entity Types -->
      <div class="filters-section">
        <div class="filters-section-label">Entity Types</div>
        <div class="filters-checkboxes">
          <label class="checkbox-wrapper">
            <input type="checkbox" id="filter-company" checked />
            <span class="checkbox-custom"></span>
            <span class="checkbox-label">
              <span class="entity-type-dot" style="background:var(--accent-indigo)"></span>
              Company
            </span>
          </label>
          <label class="checkbox-wrapper">
            <input type="checkbox" id="filter-technology" checked />
            <span class="checkbox-custom"></span>
            <span class="checkbox-label">
              <span class="entity-type-dot" style="background:var(--accent-purple)"></span>
              Technology
            </span>
          </label>
          <label class="checkbox-wrapper">
            <input type="checkbox" id="filter-startup" checked />
            <span class="checkbox-custom"></span>
            <span class="checkbox-label">
              <span class="entity-type-dot" style="background:var(--accent-pink)"></span>
              Startup
            </span>
          </label>
        </div>
      </div>

      <div class="filters-divider"></div>

      <!-- Time Range -->
      <div class="filters-section">
        <div class="filters-section-label">Time Range</div>
        <div class="filters-radio-group">
          ${['24h','7d','30d','90d','1y','All time'].map(t => `
            <label class="radio-wrapper">
              <input type="radio" name="timeRange" value="${t}" ${t === '30d' ? 'checked' : ''} />
              <span class="radio-custom"></span>
              <span>${t}</span>
            </label>
          `).join('')}
        </div>
      </div>

      <div class="filters-divider"></div>

      <!-- Momentum Score -->
      <div class="filters-section">
        <div class="filters-section-label" style="display:flex;justify-content:space-between;">
          Momentum Score
          <span class="filters-range-display" id="momentum-display">0.0 – 1.0</span>
        </div>
        <div class="filters-range-track">
          <input type="range" class="range-slider" id="momentum-min" min="0" max="100" value="0" step="5" />
          <input type="range" class="range-slider" id="momentum-max" min="0" max="100" value="100" step="5" />
        </div>
      </div>

      <div class="filters-divider"></div>

      <!-- Verified Only -->
      <div class="filters-section">
        <div class="filters-toggle-row">
          <span class="filters-section-label" style="margin-bottom:0">Verified Only</span>
          <label class="toggle">
            <input type="checkbox" id="filter-verified" />
            <span class="toggle-slider"></span>
          </label>
        </div>
        <p class="filters-hint">Show only entities with verified data sources</p>
      </div>

      <div class="filters-divider"></div>

      <!-- Actions -->
      <div class="filters-actions">
        <button class="btn btn-primary" id="apply-filters-btn" style="flex:1;justify-content:center;">Apply</button>
        <button class="btn btn-ghost" id="reset-filters-btn">Reset</button>
      </div>
    </div>
  `;

  // Wire up events after DOM insertion
  requestAnimationFrame(() => {
    const body = panel.querySelector('#filters-body');

    // Collapse toggle
    panel.querySelector('#filters-collapse-btn').addEventListener('click', () => {
      state.collapsed = !state.collapsed;
      panel.classList.toggle('collapsed', state.collapsed);
      const icon = panel.querySelector('#filters-collapse-btn svg');
      icon.style.transform = state.collapsed ? 'rotate(180deg)' : '';
    });

    // Entity type checkboxes
    ['company','technology','startup'].forEach(type => {
      panel.querySelector(`#filter-${type}`).addEventListener('change', e => {
        state.entityTypes[type] = e.target.checked;
      });
    });

    // Time range
    panel.querySelectorAll('input[name="timeRange"]').forEach(radio => {
      radio.addEventListener('change', e => { state.timeRange = e.target.value; });
    });

    // Momentum sliders
    const minSlider = panel.querySelector('#momentum-min');
    const maxSlider = panel.querySelector('#momentum-max');
    const display = panel.querySelector('#momentum-display');

    function updateMomentum() {
      let min = parseInt(minSlider.value);
      let max = parseInt(maxSlider.value);
      if (min > max) { const t = min; min = max; max = t; }
      state.momentumMin = min / 100;
      state.momentumMax = max / 100;
      display.textContent = `${state.momentumMin.toFixed(1)} – ${state.momentumMax.toFixed(1)}`;
    }
    minSlider.addEventListener('input', updateMomentum);
    maxSlider.addEventListener('input', updateMomentum);

    // Verified toggle
    panel.querySelector('#filter-verified').addEventListener('change', e => {
      state.verifiedOnly = e.target.checked;
    });

    // Apply
    panel.querySelector('#apply-filters-btn').addEventListener('click', () => {
      notify();
      // Flash button
      const btn = panel.querySelector('#apply-filters-btn');
      btn.textContent = '✓ Applied';
      btn.style.background = 'var(--accent-green)';
      setTimeout(() => {
        btn.textContent = 'Apply';
        btn.style.background = '';
      }, 1200);
    });

    // Reset
    panel.querySelector('#reset-filters-btn').addEventListener('click', () => {
      panel.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = true; });
      panel.querySelector('input[value="30d"]').checked = true;
      minSlider.value = 0; maxSlider.value = 100;
      panel.querySelector('#filter-verified').checked = false;
      Object.assign(state, {
        entityTypes: { company: true, technology: true, startup: true },
        timeRange: '30d', momentumMin: 0, momentumMax: 1, verifiedOnly: false,
      });
      display.textContent = '0.0 – 1.0';
      notify();
    });
  });

  return panel;
}
