import { define } from '../core/define.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};
const css = `
:host{display:block;font-size:var(--ui-pagination-size,15px)}
:host([hidden]){display:none!important}
:host([size=sm]){font-size:12px}
:host([size=lg]){font-size:18px}
nav{display:flex;flex-wrap:wrap;align-items:center;gap:.3em}
.p{all:unset;box-sizing:border-box;min-width:2.4em;height:2.4em;display:grid;place-items:center;padding:0 .6em;
  border-radius:.7em;cursor:pointer;font-weight:500;font-variant-numeric:tabular-nums;
  transition:background-color .2s,color .2s,transform .15s,box-shadow .25s}
.p:hover{background:color-mix(in srgb,currentColor 10%,transparent)}
.p:active{transform:scale(.93)}
.p:focus-visible{outline:.15em solid var(--ui-accent,#6366f1);outline-offset:.1em}
.p[aria-current=page]{color:#fff;font-weight:600;pointer-events:none;
  background:linear-gradient(135deg,var(--ui-accent,#6366f1),var(--ui-accent-2,#a855f7));
  box-shadow:0 .2em .8em color-mix(in srgb,var(--ui-accent,#6366f1) 40%,transparent)}
.p:disabled{opacity:.35;pointer-events:none}
.p svg{width:1.2em;height:1.2em;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.dots{min-width:1.6em;text-align:center;opacity:.5;user-select:none}
@media (prefers-reduced-motion:reduce){*{transition-duration:.01ms!important}}
`;

class UIPagination extends Base {
  static observedAttributes = ['page', 'pages', 'siblings'];
  #nav;
  #focus = null;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `<style>${css}</style><nav part="nav" aria-label="Paginación"></nav>`;
    this.#nav = root.querySelector('nav');
    this.#nav.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-page]');
      if (b) this.#go(Number(b.dataset.page));
    });
  }

  get pages() { return Math.max(1, parseInt(this.getAttribute('pages'), 10) || 1); }
  set pages(v) { this.setAttribute('pages', String(v)); }
  get page() { return Math.min(this.pages, Math.max(1, parseInt(this.getAttribute('page'), 10) || 1)); }
  set page(v) { this.setAttribute('page', String(v)); }

  connectedCallback() { this.#render(); }
  attributeChangedCallback() { this.#render(); }

  #go(n) {
    n = Math.min(this.pages, Math.max(1, n));
    if (n === this.page) return;
    this.#focus = n;
    this.setAttribute('page', String(n));
    this.dispatchEvent(new CustomEvent('change', { detail: { page: n }, bubbles: true, composed: true }));
  }

  #range() {
    const { page, pages } = this;
    const sib = Math.max(0, Number.isNaN(parseInt(this.getAttribute('siblings'), 10)) ? 1 : parseInt(this.getAttribute('siblings'), 10));
    const start = Math.max(2, page - sib);
    const end = Math.min(pages - 1, page + sib);
    const out = [1];
    if (start > 3) out.push('…');
    else if (start === 3) out.push(2);
    for (let i = start; i <= end; i++) out.push(i);
    if (end < pages - 2) out.push('…');
    else if (end === pages - 2) out.push(pages - 1);
    if (pages > 1) out.push(pages);
    return out;
  }

  #render() {
    const { page, pages } = this;
    const arrow = (dir) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'p';
      b.setAttribute('part', 'arrow');
      b.dataset.page = String(dir < 0 ? page - 1 : page + 1);
      b.disabled = dir < 0 ? page <= 1 : page >= pages;
      b.setAttribute('aria-label', dir < 0 ? 'Página anterior' : 'Página siguiente');
      b.innerHTML = `<svg viewBox="0 0 24 24"><path d="${dir < 0 ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'}"/></svg>`;
      return b;
    };
    const nodes = this.#range().map((it) => {
      if (it === '…') {
        const s = document.createElement('span');
        s.className = 'dots';
        s.textContent = '…';
        return s;
      }
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'p';
      b.setAttribute('part', 'page');
      b.dataset.page = String(it);
      b.textContent = it;
      b.setAttribute('aria-label', `Página ${it}`);
      if (it === page) b.setAttribute('aria-current', 'page');
      return b;
    });
    this.#nav.replaceChildren(arrow(-1), ...nodes, arrow(1));
    if (this.#focus != null) {
      this.#nav.querySelector(`[data-page="${this.#focus}"]`)?.focus();
      this.#focus = null;
    }
  }
}

define('ui-pagination', UIPagination);
export { UIPagination };
