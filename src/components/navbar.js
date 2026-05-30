/**
 * GOD'S EYE X — Navbar Component
 */

import { navigateTo, getCurrentRoute } from '../router.js';

export function createNavbar() {
  const nav = document.createElement('nav');
  nav.className = 'navbar';
  nav.id = 'main-navbar';
  
  const currentPath = getCurrentRoute();

  nav.innerHTML = `
    <div class="navbar-inner">
      <a href="#/" class="navbar-brand" data-path="/">
        <div class="navbar-logo">
          <svg viewBox="0 0 64 64" fill="none" width="32" height="32">
            <defs>
              <linearGradient id="nav-g" x1="0" y1="0" x2="64" y2="64">
                <stop offset="0%" stop-color="#00f0ff"/>
                <stop offset="100%" stop-color="#a855f7"/>
              </linearGradient>
              <radialGradient id="nav-r" cx="32" cy="32" r="8">
                <stop offset="0%" stop-color="#00f0ff"/>
                <stop offset="100%" stop-color="#6366f1"/>
              </radialGradient>
            </defs>
            <path d="M32 12C18 12 6 24 2 32c4 8 16 20 30 20s26-12 30-20c-4-8-16-20-30-20z" stroke="url(#nav-g)" stroke-width="2.5" fill="none"/>
            <circle cx="32" cy="32" r="10" stroke="url(#nav-g)" stroke-width="2" fill="none"/>
            <circle cx="32" cy="32" r="5" fill="url(#nav-r)"/>
          </svg>
        </div>
        <span class="navbar-title">GOD'S EYE <span class="navbar-title-x">X</span></span>
      </a>
      
      <div class="navbar-links">
        <a href="#/search" class="nav-link ${currentPath === '/search' ? 'active' : ''}" data-path="/search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          Reality Search
        </a>
        <a href="#/graph" class="nav-link ${currentPath === '/graph' ? 'active' : ''}" data-path="/graph">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="12" r="3"/>
            <line x1="8.7" y1="7.5" x2="15.3" y2="10.5"/><line x1="8.7" y1="16.5" x2="15.3" y2="13.5"/>
          </svg>
          Graph Explorer
        </a>
        <a href="#/dashboard" class="nav-link ${currentPath === '/dashboard' ? 'active' : ''}" data-path="/dashboard">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
          Dashboard
        </a>
        <a href="#/reports" class="nav-link ${currentPath === '/reports' ? 'active' : ''}" data-path="/reports">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
          Reports
        </a>
      </div>

      <div class="navbar-actions">
        <div class="navbar-shortcut-hint">
          <kbd>Ctrl</kbd><span>+</span><kbd>K</kbd>
        </div>
        <button class="btn-icon navbar-menu-toggle" id="mobile-menu-toggle" aria-label="Toggle menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </div>
    </div>
  `;

  // Click handlers for nav links
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const path = link.getAttribute('data-path');
      navigateTo(path);
    });
  });

  nav.querySelector('.navbar-brand').addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('/');
  });

  // Mobile menu toggle
  const menuToggle = nav.querySelector('#mobile-menu-toggle');
  const navLinks = nav.querySelector('.navbar-links');
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-open');
  });

  return nav;
}
