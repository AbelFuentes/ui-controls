import { define } from '../core/define.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};
const css = `
:host{display:block;font-size:var(--ui-breadcrumb-size,14px)}
:host([hidden]){display:none!important}
ol{display:flex;flex-wrap:wrap;align-items:center;gap:.4em;margin:0;padding:0;list-style:none}
li{display:flex;align-items:center;gap:.4em;min-width:0}
::slotted(*){color:inherit;text-decoration:none;opacity:.65;border-radius:.4em;padding:.15em .35em;
  transition:opacity .2s,color .2s,background-color .2s}
::slotted(a:hover),::slotted(button:hover){opacity:1;color:var(--ui-accent,#6366f1);
  background:color-mix(in srgb,var(--ui-accent,#6366f1) 10%,transparent)}
::slotted([aria-current=page]){opacity:1;font-weight:600;pointer-events:none}
.sep{flex:none;width:1em;height:1em;opacity:.4;fill:none;stroke:currentColor;stroke-width:2;
  stroke-linecap:round;stroke-linejoin:round}
`;

class UIBreadcrumb extends Base {
  static observedAttributes = ['label'];
  #nav; #ol; #mo;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `<style>${css}</style><nav part="nav" aria-label="Breadcrumb"><ol part="list"></ol></nav>`;
    this.#nav = root.querySelector('nav');
    this.#ol = root.querySelector('ol');
    this.#mo = new MutationObserver(() => this.#build());
  }

  connectedCallback() {
    this.#mo.observe(this, { childList: true });
    this.#build();
  }
  disconnectedCallback() { this.#mo.disconnect(); }
  attributeChangedCallback(_, __, v) { this.#nav.setAttribute('aria-label', v || 'Breadcrumb'); }

  #build() {
    const items = [...this.children];
    this.#ol.replaceChildren(...items.map((el, i) => {
      el.slot = `c${i}`;
      const last = i === items.length - 1;
      last ? el.setAttribute('aria-current', 'page') : el.removeAttribute('aria-current');
      const li = document.createElement('li');
      li.innerHTML = `<slot name="c${i}"></slot>${last ? '' : '<svg class="sep" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>'}`;
      return li;
    }));
  }
}

define('ui-breadcrumb', UIBreadcrumb);
export { UIBreadcrumb };
