import { define } from '../core/define.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};
const ARROW = {
  up: '<path d="M7 14l5-5 5 5"/>',
  down: '<path d="M7 10l5 5 5-5"/>',
  flat: '<path d="M6 12h12"/>',
};
const css = `
:host{display:block;font-size:var(--ui-stat-size,16px)}
:host([hidden]){display:none!important}
*{box-sizing:border-box}
[hidden]{display:none!important}
.s{display:grid;gap:.35em}
.top{display:flex;align-items:center;justify-content:space-between;gap:.75em}
.lbl{font-size:.85em;font-weight:500;color:var(--ui-muted,inherit)}
.ico{display:grid;place-items:center;width:2.2em;height:2.2em;border-radius:.7em;color:var(--ui-accent,#6366f1);
  background:color-mix(in srgb,var(--ui-accent,#6366f1) 12%,transparent)}
::slotted([slot=icon]){width:1.2em;height:1.2em}
.val{font-size:2em;font-weight:800;letter-spacing:-.03em;line-height:1.1;font-variant-numeric:tabular-nums}
.meta{display:flex;align-items:center;gap:.6em;flex-wrap:wrap;min-height:1.6em}
.dl{display:inline-flex;align-items:center;gap:.2em;padding:.15em .6em .15em .4em;border-radius:2em;font-size:.82em;font-weight:600;
  color:var(--c);background:color-mix(in srgb,var(--c) 14%,transparent)}
.dl svg{width:1.1em;height:1.1em;fill:none;stroke:currentColor;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}
.dl.up{--c:var(--ui-success,#10b981)}
.dl.down{--c:var(--ui-danger,#ef4444)}
.dl.flat{--c:var(--ui-muted,#8087a0)}
.hint{font-size:.82em;color:var(--ui-muted,inherit)}
:host([loading]) .val,:host([loading]) .lbl{color:transparent;border-radius:.5em;width:fit-content;animation:sh 1.4s linear infinite;
  background:linear-gradient(90deg,color-mix(in srgb,currentColor 8%,transparent) 25%,color-mix(in srgb,currentColor 16%,transparent) 50%,color-mix(in srgb,currentColor 8%,transparent) 75%);
  background-size:200% 100%}
@keyframes sh{to{background-position:-200% 0}}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}
`;
const has = (slot) => slot.assignedNodes({ flatten: true }).some((n) => n.nodeType === 1 || n.textContent.trim());

class UIStat extends Base {
  static observedAttributes = ['label', 'value', 'delta', 'trend', 'invert', 'hint', 'loading'];

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>${css}</style>
      <div class="s" part="stat" role="group">
        <div class="top"><span class="lbl" part="label"></span><span class="ico" part="icon" hidden><slot name="icon"></slot></span></div>
        <div class="val" part="value"></div>
        <div class="meta"><span class="dl flat" part="delta" hidden><svg viewBox="0 0 24 24" aria-hidden="true"></svg><span class="dt"></span></span><span class="hint" part="hint"></span></div>
        <slot></slot>
      </div>`;
    root.querySelector('slot[name=icon]').addEventListener('slotchange', () => this.#sync());
  }

  connectedCallback() { this.#sync(); }
  attributeChangedCallback() { this.#sync(); }

  #sync() {
    const r = this.shadowRoot;
    const label = this.getAttribute('label') ?? '';
    const delta = this.getAttribute('delta') ?? '';
    const invert = this.hasAttribute('invert');
    let trend = this.getAttribute('trend');
    if (!ARROW[trend]) trend = /^\s*-/.test(delta) ? 'down' : /^\s*\+/.test(delta) ? 'up' : 'flat';
    // con invert, subir es malo (p. ej. costos): se invierten los colores, no la flecha
    const tone = invert && trend !== 'flat' ? (trend === 'up' ? 'down' : 'up') : trend;

    r.querySelector('.lbl').textContent = label;
    r.querySelector('.val').textContent = this.getAttribute('value') ?? '';
    r.querySelector('.hint').textContent = this.getAttribute('hint') ?? '';
    const dl = r.querySelector('.dl');
    dl.hidden = !delta;
    dl.className = `dl ${tone}`;
    r.querySelector('.dt').textContent = delta;
    r.querySelector('.dl svg').innerHTML = ARROW[trend];
    r.querySelector('.ico').hidden = !has(r.querySelector('slot[name=icon]'));
    r.querySelector('.s').setAttribute('aria-label', label || 'Indicador');
    r.querySelector('.s').setAttribute('aria-busy', String(this.hasAttribute('loading')));
  }
}

define('ui-stat', UIStat);
export { UIStat };
