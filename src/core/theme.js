const KEY = 'ui-theme';
const root = document.documentElement;
const dark = () => matchMedia('(prefers-color-scheme: dark)');

const read = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
const write = (v) => { try { localStorage.setItem(KEY, v); } catch {} };

let styled = false;
const injectTransitionCSS = () => {
  if (styled) return;
  styled = true;
  const s = document.createElement('style');
  s.textContent = `
    ::view-transition-old(root),::view-transition-new(root){animation:none;mix-blend-mode:normal}
    ::view-transition-old(root){z-index:1}::view-transition-new(root){z-index:2}`;
  document.head.append(s);
};

export const getTheme = () => root.dataset.theme || read() || (dark().matches ? 'dark' : 'light');

function apply(theme) {
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  root.classList.toggle('dark', theme === 'dark'); // compat con Tailwind
  window.dispatchEvent(new CustomEvent('ui-theme-change', { detail: { theme } }));
}

export function setTheme(theme, { persist = true, animate = true, origin } = {}) {
  if (persist) write(theme);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!animate || reduce || !document.startViewTransition) return apply(theme);

  injectTransitionCSS();
  const x = origin?.x ?? innerWidth / 2;
  const y = origin?.y ?? 0;
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const t = document.startViewTransition(() => apply(theme));
  t.ready.then(() =>
    root.animate(
      { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 550, easing: 'cubic-bezier(.4,0,.2,1)', pseudoElement: '::view-transition-new(root)' }
    )
  );
}

export const toggleTheme = (opts) => setTheme(getTheme() === 'dark' ? 'light' : 'dark', opts);

// Sigue al sistema mientras el usuario no haya elegido manualmente
export function initTheme() {
  apply(getTheme());
  dark().addEventListener('change', (e) => { if (!read()) apply(e.matches ? 'dark' : 'light'); });
}
