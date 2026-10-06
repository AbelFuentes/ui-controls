import { define } from '../core/define.js';
import { place } from '../core/position.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};
const css = `
:host{display:inline-block}
:host([hidden]){display:none!important}
.tip{position:fixed;inset:auto;margin:0;padding:.45em .75em;border:0;border-radius:.6em;max-width:min(20em,90vw);
  background:var(--ui-tooltip-bg,#12141a);color:var(--ui-tooltip-fg,#fff);font:500 .85em/1.35 system-ui,sans-serif;
  box-shadow:0 0 0 1px rgb(255 255 255/.12),0 .5em 1.5em rgb(0 0 0/.3);pointer-events:none;overflow:visible}
.tip:popover-open{animation:in .15s ease-out}
@keyframes in{from{opacity:0;transform:scale(.95)}}
@media (prefers-reduced-motion:reduce){.tip{animation:none!important}}
`;

class UITooltip extends Base {
  static observedAttributes = ['text'];
  #tip; #t; #slot; #timer;
  #shown = false;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>${css}</style>
      <slot></slot>
      <div class="tip" part="tooltip" popover="manual" role="tooltip"><span class="t"></span><slot name="content"></slot></div>`;
    this.#tip = root.querySelector('.tip');
    this.#t = root.querySelector('.t');
    this.#slot = root.querySelector('slot:not([name])');
    this.#slot.addEventListener('slotchange', () => this.#describe());
    this.addEventListener('pointerenter', (e) => { if (e.pointerType !== 'touch') this.#queue(); });
    this.addEventListener('pointerleave', this.#hide);
    this.addEventListener('focusin', () => this.#show());
    this.addEventListener('focusout', this.#hide);
    this.addEventListener('keydown', (e) => { if (e.key === 'Escape') this.#hide(); });
  }

  connectedCallback() { this.#describe(); }
  disconnectedCallback() { this.#hide(); }
  attributeChangedCallback() { this.#describe(); }

  #describe() {
    const text = this.getAttribute('text') || '';
    this.#t.textContent = text;
    const el = this.#slot.assignedElements()[0];
    if (el && text) el.setAttribute('aria-description', text);
  }

  #queue() {
    clearTimeout(this.#timer);
    this.#timer = setTimeout(() => this.#show(), parseInt(this.getAttribute('delay'), 10) || 250);
  }

  #show() {
    clearTimeout(this.#timer);
    if (this.#shown) return;
    if (!this.getAttribute('text') && !this.querySelector('[slot=content]')) return;
    this.#tip.showPopover();
    place(this.#tip, this, this.getAttribute('placement') || 'top');
    this.#shown = true;
    addEventListener('scroll', this.#hide, true);
  }

  #hide = () => {
    clearTimeout(this.#timer);
    if (!this.#shown) return;
    this.#tip.hidePopover();
    this.#shown = false;
    removeEventListener('scroll', this.#hide, true);
  };
}

define('ui-tooltip', UITooltip);
export { UITooltip };
