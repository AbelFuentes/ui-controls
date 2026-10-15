import { define } from '../core/define.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};
const css = `
:host{display:flex;align-items:center;--sp:.5rem;margin-block:var(--ui-divider-spacing,var(--sp));color:var(--ui-muted,inherit)}
:host([hidden]){display:none!important}
:host([spacing=none]){--sp:0}
:host([spacing=sm]){--sp:.25rem}
:host([spacing=lg]){--sp:1.25rem}
.line{flex:1;height:1px;background:var(--ui-border,color-mix(in srgb,currentColor 18%,transparent))}
:host([tone=strong]) .line{background:color-mix(in srgb,currentColor 35%,transparent)}
.label{padding-inline:.9em;font-size:.85em;white-space:nowrap}
[hidden]{display:none!important}
:host([align=start]) .s{flex:0 0 1.5rem}
:host([align=end]) .e{flex:0 0 1.5rem}
:host([orientation=vertical]){display:inline-flex;flex-direction:column;align-self:stretch;min-height:1.2em;
  margin-block:0;margin-inline:var(--ui-divider-spacing,var(--sp))}
:host([orientation=vertical]) .line{width:1px;height:auto}
:host([orientation=vertical]) .label{padding:.6em 0}
`;

class UIDivider extends Base {
  static observedAttributes = ['orientation'];
  #label; #end;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>${css}</style>
      <span class="line s" part="line"></span>
      <span class="label" part="label" hidden><slot></slot></span>
      <span class="line e" part="line" hidden></span>`;
    this.#label = root.querySelector('.label');
    this.#end = root.querySelector('.e');
    root.querySelector('slot').addEventListener('slotchange', () => this.#sync());
  }

  connectedCallback() {
    if (!this.hasAttribute('role')) this.setAttribute('role', 'separator');
    this.#aria();
    this.#sync();
  }
  attributeChangedCallback() { this.#aria(); }

  #aria() {
    this.getAttribute('orientation') === 'vertical'
      ? this.setAttribute('aria-orientation', 'vertical')
      : this.removeAttribute('aria-orientation');
  }
  #sync() {
    const has = this.shadowRoot.querySelector('slot').assignedNodes({ flatten: true })
      .some((n) => n.nodeType === 1 || n.textContent.trim());
    this.#label.hidden = !has;
    this.#end.hidden = !has;
  }
}

define('ui-divider', UIDivider);
export { UIDivider };
