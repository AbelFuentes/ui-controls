import { define } from '../core/define.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};
const len = (v) => (/^\d+(\.\d+)?$/.test(v) ? `${v}px` : v);
const css = `
:host{display:block;width:var(--w,100%)}
:host([hidden]){display:none!important}
:host([variant=circle]){--w:3em}
.stack{display:grid;gap:.6em}
.line{height:var(--h,1em);border-radius:.5em;
  background:linear-gradient(90deg,color-mix(in srgb,currentColor 8%,transparent) 25%,
    color-mix(in srgb,currentColor 16%,transparent) 50%,color-mix(in srgb,currentColor 8%,transparent) 75%);
  background-size:200% 100%;animation:sh 1.4s linear infinite}
.line:last-child:not(:first-child){width:60%}
:host([variant=rect]) .line{--h:8em;border-radius:1em}
:host([variant=circle]) .line{height:auto;aspect-ratio:1;border-radius:50%}
@keyframes sh{to{background-position:-200% 0}}
@media (prefers-reduced-motion:reduce){.line{animation:none}}
`;

class UISkeleton extends Base {
  static observedAttributes = ['variant', 'lines', 'width', 'height'];
  #stack;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `<style>${css}</style><div class="stack" part="skeleton" aria-hidden="true"></div>`;
    this.#stack = root.querySelector('.stack');
  }

  connectedCallback() { this.#render(); }
  attributeChangedCallback() { this.#render(); }

  #render() {
    const w = this.getAttribute('width');
    const h = this.getAttribute('height');
    w ? this.style.setProperty('--w', len(w)) : this.style.removeProperty('--w');
    h ? this.style.setProperty('--h', len(h)) : this.style.removeProperty('--h');
    const n = this.getAttribute('variant') === 'text' ? Math.max(1, parseInt(this.getAttribute('lines'), 10) || 1) : 1;
    this.#stack.replaceChildren(...Array.from({ length: n }, () => {
      const d = document.createElement('div');
      d.className = 'line';
      return d;
    }));
  }
}

define('ui-skeleton', UISkeleton);
export { UISkeleton };
