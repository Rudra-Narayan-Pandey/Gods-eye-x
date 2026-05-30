/**
 * GOD'S EYE X — Utility Helpers
 */

export function debounce(fn, ms = 150) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

export function throttle(fn, ms = 100) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= ms) {
      last = now;
      fn(...args);
    }
  };
}

export function formatNumber(n) {
  if (n == null) return '—';
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return n.toLocaleString();
}

export function formatCurrency(n) {
  if (n == null) return '—';
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(1) + 'B';
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return '$' + (n / 1e3).toFixed(0) + 'K';
  return '$' + n.toLocaleString();
}

export function formatPercent(n) {
  if (n == null) return '—';
  const sign = n >= 0 ? '+' : '';
  return sign + n.toFixed(1) + '%';
}

export function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return mins + 'm ago';
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + 'h ago';
  const days = Math.floor(hrs / 24);
  if (days < 30) return days + 'd ago';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

export function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function escapeHtml(str) {
  const el = document.createElement('div');
  el.textContent = str;
  return el.innerHTML;
}

/** Create element with attributes and children */
export function el(tag, attrs = {}, ...children) {
  const element = document.createElement(tag);
  for (const [key, val] of Object.entries(attrs)) {
    if (key === 'className') element.className = val;
    else if (key === 'style' && typeof val === 'object') Object.assign(element.style, val);
    else if (key.startsWith('on')) element.addEventListener(key.slice(2).toLowerCase(), val);
    else if (key === 'innerHTML') element.innerHTML = val;
    else element.setAttribute(key, val);
  }
  for (const child of children) {
    if (typeof child === 'string') element.appendChild(document.createTextNode(child));
    else if (child) element.appendChild(child);
  }
  return element;
}

/** Wait for ms */
export function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

/** Get momentum score color */
export function getMomentumColor(score) {
  if (score >= 0.8) return 'var(--accent-green)';
  if (score >= 0.6) return 'var(--accent-cyan)';
  if (score >= 0.4) return 'var(--accent-amber)';
  return 'var(--accent-red)';
}

/** Get severity color */
export function getSeverityColor(severity) {
  const map = {
    critical: 'var(--accent-red)',
    high: 'var(--accent-amber)',
    medium: 'var(--accent-cyan)',
    low: 'var(--accent-green)',
  };
  return map[severity] || 'var(--text-secondary)';
}

/** Sparkline SVG path from data array */
export function sparklinePath(data, width = 100, height = 30) {
  if (!data || data.length < 2) return '';
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  
  return data.map((val, i) => {
    const x = i * step;
    const y = height - ((val - min) / range) * height;
    return (i === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1);
  }).join(' ');
}
