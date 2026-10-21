import { define } from '../core/define.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};
const css = `
:host{display:block;font-size:var(--ui-empty-state-size,16px)}
:host([hidden]){display:none!important}
*{box-sizing:border-box}
[hidden]{display:none!important}
.e{display:grid;justify-items:center;gap:.6em;text-align:center;padding:2.5em 1.5em;border-radius:1.25em}
:host([size=sm]) .e{padding:1.25em 1em;gap:.4em}
:host([size=lg]) .e{padding:4em 2em;gap:.8em}
:host([bordered]) .e{border:1.5px dashed var(--ui-border,color-mix(in srgb,currentColor 25%,transparent))}
.ic{display:grid;place-items:center;width:4em;height:4em;border-radius:50%;color:var(--ui-accent,#6366f1);margin-bottom:.4em;
  background:color-mix(in srgb,var(--ui-accent,#6366f1) 12%,transparent)}
::slotted([slot=icon]){width:1.9em;height:1.9em}
.t{font-size:1.2em;font-weight:700;letter-spacing:-.01em}
.d{margin:0;max-width:28em;line-height:1.6;color:var(--ui-muted,inherit)}
.a{display:flex;flex-wrap:wrap;gap:.6em;justify-content:center;margin-top:.6em}
`;
const has = (slot) => slot.assignedNodes({ flatten: true }).some((n) => n.nodeType === 1 || n.textContent.trim());

class UIEmptyState extends Base {
  static observedAttributes = ['heading', 'description', 'level'];

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>${css}</style>
      <div class="e" part="empty">
        <div class="ic" part="icon" hidden><slot name="icon"></slot></div>
        <div class="t" part="title" role="heading" aria-level="2" hidden></div>
        <p class="d" part="description" hidden></p>
        <slot></slot>
        <div class="a" part="actions" hidden><slot name="actions"></slot></div>
      </div>`;
    root.querySelectorAll('slot').forEach((s) => s.addEventListener('slotchange', () => this.#sync()));
  }

  connectedCallback() { this.#sync(); }
  attributeChangedCallback() { this.#sync(); }

  #sync() {
    const r = this.shadowRoot;
    const h = this.getAttribute('heading') ?? '';
    const d = this.getAttribute('description') ?? '';
    const t = r.querySelector('.t');
    const p = r.querySelector('.d');
    t.textContent = h;
    t.hidden = !h;
    const lv = parseInt(this.getAttribute('level'), 10);
    t.setAttribute('aria-level', String(lv >= 1 && lv <= 6 ? lv : 2));
    p.textContent = d;
    p.hidden = !d;
    r.querySelector('.ic').hidden = !has(r.querySelector('slot[name=icon]'));
    r.querySelector('.a').hidden = !has(r.querySelector('slot[name=actions]'));
  }
}

define('ui-empty-state', UIEmptyState);
export { UIEmptyState };
