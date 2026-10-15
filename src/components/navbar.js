import { define } from '../core/define.js';
import { BP, below, collapseCss } from '../core/breakpoints.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};
const css = `
:host{display:block;position:relative;z-index:30;font-size:var(--ui-navbar-size,15px);--h:var(--ui-navbar-height,4rem)}
:host([hidden]){display:none!important}
:host([sticky]){position:sticky;top:0;z-index:40}
*{box-sizing:border-box}
.bar{display:flex;align-items:center;gap:1rem;min-height:var(--h);padding-inline:var(--ui-navbar-padding,1.25rem);
  background:color-mix(in srgb,var(--ui-surface,Canvas) 84%,transparent);backdrop-filter:blur(14px);
  border-bottom:1px solid var(--ui-border,color-mix(in srgb,currentColor 14%,transparent))}
:host([variant=transparent]) .bar{background:transparent;backdrop-filter:none;border-bottom-color:transparent}
.brand{display:flex;align-items:center;gap:.6rem;font-weight:800;font-size:1.1em}
.links{display:flex;align-items:center;gap:.25rem;flex:1;min-width:0}
:host([links-align=center]) .links{justify-content:center}
:host([links-align=end]) .links{justify-content:flex-end}
.actions{display:flex;align-items:center;gap:.6rem;margin-left:auto}
.links ~ .actions{margin-left:0}
::slotted(a){color:inherit;text-decoration:none;padding:.5rem .8rem;border-radius:.65rem;font-weight:500;opacity:.75;
  transition:opacity .2s,background-color .2s,color .2s}
::slotted(a:hover){opacity:1;background:color-mix(in srgb,currentColor 8%,transparent)}
::slotted(a[aria-current=page]){opacity:1;color:var(--ui-accent,#6366f1);font-weight:600}
.burger{all:unset;display:none;place-items:center;flex:none;width:2.5rem;height:2.5rem;border-radius:.75rem;cursor:pointer;
  transition:background-color .2s}
.burger:hover{background:color-mix(in srgb,currentColor 10%,transparent)}
.burger:focus-visible{outline:.15em solid var(--ui-accent,#6366f1);outline-offset:.05em}
.burger svg{width:1.4rem;height:1.4rem;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round}
.burger .x{display:none}
:host([open]) .burger .m{display:none}
:host([open]) .burger .x{display:block}
${collapseCss([
  ['  .burger', 'display:grid'],
  ['  .actions', 'margin-left:auto'],
  ['  .links', 'display:none;position:absolute;top:100%;left:0;right:0;flex-direction:column;align-items:stretch;gap:.15rem;'
    + 'padding:.75rem 1rem 1rem;background:var(--ui-surface,Canvas);border-bottom:1px solid var(--ui-border,rgb(128 135 160/.25));'
    + 'box-shadow:0 1.2rem 2rem -1rem rgb(0 0 0/.35)'],
  ['  ::slotted(a)', 'padding:.8rem']
])}
${collapseCss([['  .links', 'display:flex']], { extra: '[open]' })}
@media (prefers-reduced-motion:reduce){*{transition-duration:.01ms!important}}
`;

class UINavbar extends Base {
  static observedAttributes = ['open', 'collapse', 'label'];
  #burger; #nav; #mq; #onMq;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>${css}</style>
      <header class="bar" part="bar">
        <div class="brand" part="brand"><slot name="brand"></slot></div>
        <nav class="links" part="links" id="l"><slot></slot></nav>
        <div class="actions" part="actions"><slot name="actions"></slot></div>
        <button class="burger" part="menu" type="button" aria-expanded="false" aria-controls="l" aria-label="Menú">
          <svg class="m" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
          <svg class="x" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </header>`;
    this.#burger = root.querySelector('.burger');
    this.#nav = root.querySelector('nav');
    this.#burger.addEventListener('click', () => this.toggle());
    this.#nav.addEventListener('click', (e) => {
      if (this.hasAttribute('open') && e.target.closest?.('a, button, ui-button')) this.close();
    });
    this.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.hasAttribute('open')) { this.close(); this.#burger.focus(); }
    });
    this.#onMq = (e) => { if (!e.matches) this.close(); };
  }

  get open() { return this.hasAttribute('open'); }
  set open(v) { this.toggleAttribute('open', !!v); }
  toggle() { this.open = !this.open; }
  close() { this.open = false; }

  connectedCallback() {
    this.#listen();
    document.addEventListener('pointerdown', this.#onDoc, true);
  }
  disconnectedCallback() {
    this.#mq?.removeEventListener?.('change', this.#onMq);
    document.removeEventListener('pointerdown', this.#onDoc, true);
  }

  attributeChangedCallback(name, old, v) {
    if (name === 'label') {
      v ? this.#nav.setAttribute('aria-label', v) : this.#nav.removeAttribute('aria-label');
    } else if (name === 'collapse') this.#listen();
    else if (name === 'open') {
      this.#burger.setAttribute('aria-expanded', String(v !== null));
      this.#burger.setAttribute('aria-label', v !== null ? 'Cerrar menú' : 'Menú');
      if ((old === null) !== (v === null)) {
        this.dispatchEvent(new CustomEvent('toggle', { detail: { open: v !== null }, bubbles: true, composed: true }));
      }
    }
  }

  #onDoc = (e) => { if (this.open && !e.composedPath().includes(this)) this.close(); };

  #listen() {
    this.#mq?.removeEventListener?.('change', this.#onMq);
    const k = this.getAttribute('collapse') ?? 'md';
    this.#mq = BP[k] && typeof matchMedia !== 'undefined' ? matchMedia(below(k)) : null;
    this.#mq?.addEventListener?.('change', this.#onMq);
  }
}

define('ui-navbar', UINavbar);
export { UINavbar };
