import { define } from '../core/define.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};
const css = `
:host{display:block;font-size:var(--ui-page-header-size,16px);--t:1.6em}
:host([hidden]){display:none!important}
:host([size=lg]){--t:2.2em}
*{box-sizing:border-box}
[hidden]{display:none!important}
.h{display:grid;gap:.9rem}
:host([divider]) .h{padding-bottom:1.25rem;border-bottom:1px solid var(--ui-border,color-mix(in srgb,currentColor 14%,transparent))}
.row{display:flex;flex-wrap:wrap;align-items:flex-start;justify-content:space-between;gap:1rem}
.titles{flex:1 1 18rem;min-width:0;display:grid;gap:.35rem}
.t{margin:0;font-size:var(--t);font-weight:750;letter-spacing:-.02em;line-height:1.15}
.d{margin:0;color:var(--ui-muted,inherit);line-height:1.55;max-width:46rem}
.acts{display:flex;flex-wrap:wrap;align-items:center;gap:.6rem}
`;

const has = (slot) => slot.assignedNodes({ flatten: true }).some((n) => n.nodeType === 1 || n.textContent.trim());

class UIPageHeader extends Base {
  static observedAttributes = ['heading', 'description', 'level'];

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>${css}</style>
      <header class="h" part="header">
        <div class="bc" part="breadcrumb" hidden><slot name="breadcrumb"></slot></div>
        <div class="row">
          <div class="titles">
            <div class="t" part="title" role="heading" aria-level="1"><span class="ta"></span><slot name="title"></slot></div>
            <p class="d" part="description" hidden><span class="da"></span><slot name="description"></slot></p>
          </div>
          <div class="acts" part="actions" hidden><slot name="actions"></slot></div>
        </div>
        <div class="tabs" part="tabs" hidden><slot name="tabs"></slot></div>
      </header>`;
    root.querySelectorAll('slot').forEach((s) => s.addEventListener('slotchange', () => this.#sync()));
  }

  connectedCallback() { this.#sync(); }
  attributeChangedCallback() { this.#sync(); }

  #sync() {
    const r = this.shadowRoot;
    const heading = this.getAttribute('heading') ?? '';
    const desc = this.getAttribute('description') ?? '';
    r.querySelector('.ta').textContent = heading;
    r.querySelector('.da').textContent = desc;
    const lv = parseInt(this.getAttribute('level'), 10);
    r.querySelector('.t').setAttribute('aria-level', String(lv >= 1 && lv <= 6 ? lv : 1));
    const show = (sel, slotName, force = false) => {
      r.querySelector(sel).hidden = !(force || has(r.querySelector(`slot[name=${slotName}]`)));
    };
    show('.bc', 'breadcrumb');
    show('.d', 'description', !!desc);
    show('.acts', 'actions');
    show('.tabs', 'tabs');
  }
}

define('ui-page-header', UIPageHeader);
export { UIPageHeader };
