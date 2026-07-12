/**
 * Mwmbl theme switcher.
 *
 * - On DOMContentLoaded, read the previously-chosen theme from localStorage
 *   and apply it to <body data-theme="...">.
 * - Expose `window.MwmblTheme` with `set(name)`, `current()`, and `list()`.
 *   Components can listen for the `mwmbl:theme-change` event on `document` to
 *   re-render dependent UI.
 *
 * The list of valid theme names lives next to the CSS so they stay in sync.
 */

const STORAGE_KEY = 'mwmbl:theme';
const THEMES = Object.freeze([
  'light',
  'dark',
  'high-contrast-light',
  'high-contrast-dark',
  'sepia',
  'solarized-light',
  'solarized-dark',
  'dracula',
  'nord',
  'catppuccin-latte',
]);

function isValid(theme) {
  return THEMES.indexOf(theme) !== -1;
}

function applyTheme(theme) {
  if (!isValid(theme)) return;
  if (document.body) {
    document.body.dataset.theme = theme;
  }
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch (e) {
    // Private browsing / quota exceeded — fail silently, the theme still
    // applies for the current page.
  }
  document.dispatchEvent(new CustomEvent('mwmbl:theme-change', { detail: { theme } }));
}

function currentTheme() {
  if (document.body && document.body.dataset.theme) {
    return document.body.dataset.theme;
  }
  try {
    return localStorage.getItem(STORAGE_KEY) || 'light';
  } catch (e) {
    return 'light';
  }
}

function init() {
  const saved = (() => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  })();
  if (saved && isValid(saved)) {
    applyTheme(saved);
  } else {
    // No saved choice — use system preference for light/dark, else light.
    let initial = 'light';
    if (typeof window !== 'undefined'
        && window.matchMedia
        && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      initial = 'dark';
    }
    applyTheme(initial);
  }

  // React to live OS theme changes only for users who haven't picked yet.
  if (typeof window !== 'undefined' && window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onMqChange = (e) => {
      const stored = (() => {
        try { return localStorage.getItem(STORAGE_KEY); } catch (err) { return null; }
      })();
      // Only auto-switch if the user hasn't explicitly chosen.
      if (!stored || !isValid(stored)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    };
    if (mq.addEventListener) {
      mq.addEventListener('change', onMqChange);
    } else if (mq.addListener) {
      // Safari < 14 fallback.
      mq.addListener(onMqChange);
    }
  }
}

window.MwmblTheme = Object.freeze({
  list: THEMES.slice(),
  current: currentTheme,
  set: applyTheme,
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}

/**
 * Programmatically build a theme selector <select> element. Templates or
 * Django views can include this for users who want to override the OS default.
 *
 * Usage from a Django template or tested-in-JS pjax:
 *   document.body.appendChild(MwmblTheme.buildSelector());
 */
window.MwmblTheme.buildSelector = function buildSelector() {
  const select = document.createElement('select');
  select.setAttribute('aria-label', 'Colour theme');
  select.id = 'mwmbl-theme-select';
  THEMES.forEach((name) => {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name.replace(/-/g, ' ');
    if (name === currentTheme()) opt.selected = true;
    select.appendChild(opt);
  });
  select.addEventListener('change', (e) => applyTheme(e.target.value));
  return select;
};
