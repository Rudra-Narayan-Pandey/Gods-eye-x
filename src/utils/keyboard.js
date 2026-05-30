/**
 * GOD'S EYE X — Global Keyboard Shortcut Handler
 */

const shortcuts = new Map();

export function registerShortcut(key, callback, description = '') {
  shortcuts.set(key.toLowerCase(), { callback, description });
}

export function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Don't fire shortcuts when typing in inputs
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
      if (e.key === 'Escape') {
        e.target.blur();
      }
      return;
    }

    const key = buildKeyString(e);
    const shortcut = shortcuts.get(key);
    
    if (shortcut) {
      e.preventDefault();
      shortcut.callback(e);
    }
  });
}

function buildKeyString(e) {
  const parts = [];
  if (e.ctrlKey || e.metaKey) parts.push('ctrl');
  if (e.altKey) parts.push('alt');
  if (e.shiftKey) parts.push('shift');
  parts.push(e.key.toLowerCase());
  return parts.join('+');
}

export function getShortcutsList() {
  const list = [];
  shortcuts.forEach((val, key) => {
    list.push({ key, description: val.description });
  });
  return list;
}
