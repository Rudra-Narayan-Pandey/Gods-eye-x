/**
 * GOD'S EYE X — Main Entry Point
 */

// Styles
import './styles/global.css';
import './styles/components.css';
import './styles/navbar.css';
import './styles/landing.css';
import './styles/search.css';
import './styles/graph.css';
import './styles/dashboard.css';
import './styles/reports.css';

// Core
import { initRouter, registerRoute } from './router.js';
import { createNavbar } from './components/navbar.js';
import { initKeyboardShortcuts, registerShortcut } from './utils/keyboard.js';
import { navigateTo } from './router.js';

// Pages (lazy-ish)
import { renderLanding } from './pages/landing.js';
import { renderSearch } from './pages/search.js';
import { renderGraph } from './pages/graph.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderReports } from './pages/reports.js';

function init() {
  const app = document.getElementById('app');

  // Ambient background
  const ambientBg = document.createElement('div');
  ambientBg.className = 'ambient-bg';
  app.appendChild(ambientBg);

  // Navbar
  const navbar = createNavbar();
  app.appendChild(navbar);

  // Toast container
  const toastContainer = document.createElement('div');
  toastContainer.className = 'toast-container';
  toastContainer.id = 'toast-container';
  app.appendChild(toastContainer);

  // Register routes
  registerRoute('/', renderLanding);
  registerRoute('/search', renderSearch);
  registerRoute('/graph', renderGraph);
  registerRoute('/dashboard', renderDashboard);
  registerRoute('/reports', renderReports);

  // Keyboard shortcuts
  initKeyboardShortcuts();
  
  registerShortcut('ctrl+k', () => {
    // Focus search bar if on search page, otherwise navigate
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
      searchInput.focus();
    } else {
      navigateTo('/search');
    }
  }, 'Focus Search');

  registerShortcut('escape', () => {
    // Close any open modal
    const modal = document.querySelector('.modal-backdrop.visible');
    if (modal) {
      modal.classList.remove('visible');
      setTimeout(() => modal.remove(), 300);
    }
  }, 'Close Modal');

  // Init router
  initRouter(app);

  // Track mouse for glow effects
  document.addEventListener('mousemove', (e) => {
    document.documentElement.style.setProperty('--mouse-x', e.clientX + 'px');
    document.documentElement.style.setProperty('--mouse-y', e.clientY + 'px');
  });

  console.log('%c⦿ GOD\'S EYE X %c— Real-Time Global Intelligence', 
    'color:#00f0ff;font-size:16px;font-weight:900;font-family:monospace;',
    'color:#8888aa;font-size:12px;font-family:monospace;');
}

// Start
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
