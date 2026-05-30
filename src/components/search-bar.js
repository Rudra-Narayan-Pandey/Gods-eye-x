/**
 * GOD'S EYE X — Search Bar Component
 * Glass-styled search bar with autocomplete
 */

import { el, debounce } from '../utils/helpers.js';
import { companies } from '../data/companies.js';
import { technologies } from '../data/technologies.js';
import { startups } from '../data/startups.js';

const SEARCH_ICON_SVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;

const allEntities = [
  ...companies.map(c => ({ ...c, entityType: 'Company' })),
  ...technologies.map(t => ({ ...t, entityType: 'Technology' })),
  ...startups.map(s => ({ ...s, entityType: 'Startup' })),
];

let recentSearches = ['AI Infrastructure', 'Quantum Computing', 'Defense Startups'];

/**
 * Create a search bar component
 * @param {Object} options
 * @param {string} options.placeholder
 * @param {boolean} options.large
 * @param {Function} options.onSearch
 * @param {Function} options.onFocus
 * @returns {HTMLElement}
 */
export function createSearchBar(options = {}) {
  const {
    placeholder = 'Search entities, technologies, signals...',
    large = false,
    onSearch = () => {},
    onFocus = () => {},
  } = options;

  const wrapper = el('div', { className: `search-bar-wrapper${large ? ' large' : ''}` });

  // Search icon
  const icon = el('div', { className: 'search-bar-icon', innerHTML: SEARCH_ICON_SVG });

  // Input
  const input = el('input', {
    className: `search-input${large ? ' large' : ''}`,
    type: 'text',
    placeholder,
    autocomplete: 'off',
    spellcheck: 'false',
  });

  // Keyboard shortcut badge
  const shortcutBadge = el('div', { className: 'search-shortcut-badge' }, '⌘K');

  // Autocomplete dropdown
  const autocomplete = el('div', { className: 'search-autocomplete' });

  wrapper.appendChild(icon);
  wrapper.appendChild(input);
  wrapper.appendChild(shortcutBadge);
  wrapper.appendChild(autocomplete);

  // State
  let highlightedIndex = -1;
  let currentItems = [];

  // Build autocomplete content
  function buildAutocomplete(query) {
    autocomplete.innerHTML = '';
    currentItems = [];
    highlightedIndex = -1;

    if (!query.trim()) {
      // Show recent searches
      if (recentSearches.length > 0) {
        const section = el('div', { className: 'search-autocomplete-section' });
        section.appendChild(el('div', { className: 'search-autocomplete-label' }, 'Recent Searches'));

        recentSearches.forEach(term => {
          const item = el('div', { className: 'search-autocomplete-item' });
          item.appendChild(el('span', { className: 'item-icon', style: { background: 'rgba(255,255,255,0.05)', color: 'var(--text-tertiary)' } }, '🕒'));
          item.appendChild(el('span', { className: 'item-name' }, term));
          item.addEventListener('click', () => {
            input.value = term;
            hideAutocomplete();
            onSearch(term);
          });
          section.appendChild(item);
          currentItems.push(item);
        });

        autocomplete.appendChild(section);
      }

      showAutocomplete();
      return;
    }

    const lowerQuery = query.toLowerCase();

    // Match entities
    const matches = allEntities.filter(e => {
      const searchFields = [
        e.name,
        ...(e.tags || []),
        e.category || '',
        e.hq || '',
        e.description || '',
      ].join(' ').toLowerCase();
      return searchFields.includes(lowerQuery);
    }).slice(0, 8);

    if (matches.length > 0) {
      const section = el('div', { className: 'search-autocomplete-section' });
      section.appendChild(el('div', { className: 'search-autocomplete-label' }, 'Entities'));

      matches.forEach(entity => {
        const item = el('div', { className: 'search-autocomplete-item' });

        const iconEl = el('span', {
          className: 'item-icon',
          style: {
            background: entity.logoColor ? `${entity.logoColor}22` : 'var(--accent-cyan-dim)',
            color: entity.logoColor || 'var(--accent-cyan)',
          },
        }, entity.icon || entity.logo || entity.name.charAt(0));

        // Highlight matching text
        const nameEl = el('span', { className: 'item-name' });
        const name = entity.name;
        const idx = name.toLowerCase().indexOf(lowerQuery);
        if (idx >= 0) {
          nameEl.innerHTML = name.substring(0, idx) +
            '<mark>' + name.substring(idx, idx + query.length) + '</mark>' +
            name.substring(idx + query.length);
        } else {
          nameEl.textContent = name;
        }

        const typeEl = el('span', { className: 'item-type' }, entity.entityType);

        item.appendChild(iconEl);
        item.appendChild(nameEl);
        item.appendChild(typeEl);

        item.addEventListener('click', () => {
          input.value = entity.name;
          hideAutocomplete();
          addRecentSearch(entity.name);
          onSearch(entity.name);
        });

        section.appendChild(item);
        currentItems.push(item);
      });

      autocomplete.appendChild(section);
    }

    // Quick search suggestion
    const suggestSection = el('div', { className: 'search-autocomplete-section' });
    suggestSection.appendChild(el('div', { className: 'search-autocomplete-label' }, 'Search'));
    const searchItem = el('div', { className: 'search-autocomplete-item' });
    searchItem.appendChild(el('span', { className: 'item-icon', style: { background: 'var(--accent-cyan-dim)', color: 'var(--accent-cyan)' } }, '🔍'));
    const searchNameEl = el('span', { className: 'item-name' });
    searchNameEl.innerHTML = `Search for "<mark>${query}</mark>"`;
    searchItem.appendChild(searchNameEl);
    searchItem.addEventListener('click', () => {
      hideAutocomplete();
      addRecentSearch(query);
      onSearch(query);
    });
    suggestSection.appendChild(searchItem);
    currentItems.push(searchItem);
    autocomplete.appendChild(suggestSection);

    if (matches.length > 0 || query.trim()) {
      showAutocomplete();
    } else {
      hideAutocomplete();
    }
  }

  function showAutocomplete() {
    autocomplete.classList.add('visible');
  }

  function hideAutocomplete() {
    autocomplete.classList.remove('visible');
    highlightedIndex = -1;
    currentItems.forEach(item => item.classList.remove('highlighted'));
  }

  function updateHighlight() {
    currentItems.forEach((item, i) => {
      item.classList.toggle('highlighted', i === highlightedIndex);
    });
    if (highlightedIndex >= 0 && currentItems[highlightedIndex]) {
      currentItems[highlightedIndex].scrollIntoView({ block: 'nearest' });
    }
  }

  function addRecentSearch(term) {
    recentSearches = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
  }

  // Debounced input handler
  const debouncedBuild = debounce((query) => {
    buildAutocomplete(query);
  }, 200);

  // Events
  input.addEventListener('focus', () => {
    wrapper.classList.add('focused');
    onFocus();
    buildAutocomplete(input.value);
  });

  input.addEventListener('blur', () => {
    wrapper.classList.remove('focused');
    // Delay hide to allow click on items
    setTimeout(() => hideAutocomplete(), 200);
  });

  input.addEventListener('input', () => {
    debouncedBuild(input.value);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hideAutocomplete();
      input.blur();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!autocomplete.classList.contains('visible')) {
        buildAutocomplete(input.value);
        return;
      }
      highlightedIndex = Math.min(highlightedIndex + 1, currentItems.length - 1);
      updateHighlight();
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      highlightedIndex = Math.max(highlightedIndex - 1, 0);
      updateHighlight();
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && currentItems[highlightedIndex]) {
        currentItems[highlightedIndex].click();
      } else if (input.value.trim()) {
        hideAutocomplete();
        addRecentSearch(input.value.trim());
        onSearch(input.value.trim());
      }
      return;
    }
  });

  // Public API
  wrapper.getInput = () => input;
  wrapper.focus = () => input.focus();
  wrapper.setValue = (val) => { input.value = val; };
  wrapper.getValue = () => input.value;

  return wrapper;
}
