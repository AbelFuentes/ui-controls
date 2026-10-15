import { define } from '../core/define.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};
const len = (v) => (/^\d+(\.\d+)?$/.test(v) ? `${v}rem` : v);
const css = `
:host{display:block;position:relative;min-width:0;min-height:0}
:host([hidden]){display:none!important}
.vp{box-sizing:border-box;height:100%;max-height:var(--mh,none);max-width:var(--mw,none);overflow:hidden auto;border-radius:inherit;
  scrollbar-width:thin;scrollbar-color:color-mix(in srgb,currentColor 30%,transparent) transparent;outline:none}
:host([direction=horizontal]) .vp{overflow:auto hidden}
:host([direction=both]) .vp{overflow:auto}
:host([hide-scrollbar]) .vp{scrollbar-width:none}
:host([hide-scrollbar]) .vp::-webkit-scrollbar{display:none}
.vp:focus-visible{outline:.15em solid var(--ui-accent,#6366f1);outline-offset:.15em}
:host([fade]) .vp{
  -webkit-mask-image:linear-gradient(var(--dir,to bottom),transparent 0,#000 var(--fs,0px),#000 calc(100% - var(--fe,0px)),transparent 100%);
  mask-image:linear-gradient(var(--dir,to bottom),transparent 0,#000 var(--fs,0px),#000 calc(100% - var(--fe,0px)),transparent 100%)}
`;

class UIScrollArea extends Base {
  static observedAttributes = ['max-height', 'max-width', 'label', 'direction'];
  #vp; #mo; #ro;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `<style>${css}</style><div class="vp" part="viewport"><slot></slot></div>`;
    this.#vp = root.querySelector('.vp');
    this.#vp.addEventListener('scroll', () => this.#update(), { passive: true });
    root.querySelector('slot').addEventListener('slotchange', () => this.#update());
    this.#mo = new MutationObserver(() => this.#update());
    this.#ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => this.#update()) : null;
  }

  connectedCallback() {
    this.#mo.observe(this, { childList: true, subtree: true, characterData: true });
    this.#ro?.observe(this.#vp);
    this.#update();
  }
  disconnectedCallback() {
    this.#mo.disconnect();
    this.#ro?.disconnect();
  }

  attributeChangedCallback(name, _, v) {
    if (name === 'max-height') v ? this.#vp.style.setProperty('--mh', len(v)) : this.#vp.style.removeProperty('--mh');
    if (name === 'max-width') v ? this.#vp.style.setProperty('--mw', len(v)) : this.#vp.style.removeProperty('--mw');
    this.#update();
  }

  #update() {
    const v = this.#vp;
    const horiz = this.getAttribute('direction') === 'horizontal';
    const max = (horiz ? v.scrollWidth - v.clientWidth : v.scrollHeight - v.clientHeight);
    const pos = horiz ? v.scrollLeft : v.scrollTop;
    const scrollable = max > 1;
    v.style.setProperty('--dir', horiz ? 'to right' : 'to bottom');
    v.style.setProperty('--fs', scrollable && pos > 1 ? '1.75rem' : '0px');
    v.style.setProperty('--fe', scrollable && pos < max - 1 ? '1.75rem' : '0px');
    if (scrollable) {
      v.setAttribute('tabindex', '0');
      v.setAttribute('role', 'region');
      v.setAttribute('aria-label', this.getAttribute('label') || 'Área desplazable');
    } else {
      v.removeAttribute('tabindex');
      v.removeAttribute('role');
      v.removeAttribute('aria-label');
    }
  }
}

define('ui-scroll-area', UIScrollArea);
export { UIScrollArea };
