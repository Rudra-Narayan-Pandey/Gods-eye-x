/**
 * GOD'S EYE X — Hash-based SPA Router
 */

const routes = {};
let currentPage = null;
let appContainer = null;

export function registerRoute(path, handler) {
  routes[path] = handler;
}

export function navigateTo(path) {
  window.location.hash = path;
}

export function getCurrentRoute() {
  return window.location.hash.slice(1) || '/';
}

async function handleRouteChange() {
  const path = getCurrentRoute();
  const handler = routes[path] || routes['/'];
  
  if (!handler) return;

  const pageContainer = appContainer.querySelector('.page-wrapper');
  
  // Fade out current page
  if (pageContainer) {
    pageContainer.style.opacity = '0';
    pageContainer.style.transform = 'translateY(10px)';
    await new Promise(r => setTimeout(r, 200));
  }

  // Clear and render new page
  const wrapper = document.createElement('div');
  wrapper.className = 'page-wrapper';
  wrapper.style.cssText = 'opacity:0;transform:translateY(10px);transition:opacity 0.4s ease,transform 0.4s ease;';
  
  // Keep navbar, replace page content
  const existingWrapper = appContainer.querySelector('.page-wrapper');
  if (existingWrapper) {
    existingWrapper.remove();
  }
  
  appContainer.appendChild(wrapper);
  
  try {
    await handler(wrapper);
  } catch (err) {
    console.error('Route error:', err);
    wrapper.innerHTML = `
      <div class="page-content flex-center" style="min-height:100vh;">
        <div class="empty-state">
          <div class="empty-state-icon">⚠️</div>
          <h3>Something went wrong</h3>
          <p>${err.message}</p>
          <button class="btn btn-primary" style="margin-top:24px;" onclick="location.reload()">Reload</button>
        </div>
      </div>
    `;
  }

  // Fade in new page
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      wrapper.style.opacity = '1';
      wrapper.style.transform = 'translateY(0)';
    });
  });

  // Update active nav link
  document.querySelectorAll('.nav-link').forEach(link => {
    const linkPath = link.getAttribute('data-path');
    link.classList.toggle('active', linkPath === path);
  });

  currentPage = path;
}

export function initRouter(container) {
  appContainer = container;
  window.addEventListener('hashchange', handleRouteChange);
  // Initial route
  handleRouteChange();
}
