import { define } from '../core/define.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};
const css = `
:host{display:inline-block;font-size:var(--ui-spinner-size,24px);line-height:0;vertical-align:middle}
:host([hidden]){display:none!important}
:host([size=sm]){font-size:16px}
:host([size=lg]){font-size:40px}
:host([size=xl]){font-size:64px}
.s{display:block;width:1em;height:1em;border-radius:50%;
  background:conic-gradient(from 0deg,transparent 5%,var(--ui-accent-2,#a855f7) 40%,var(--ui-accent,#6366f1));
  -webkit-mask:radial-gradient(farthest-side,transparent calc(100% - .14em),#000 calc(100% - .13em));
  mask:radial-gradient(farthest-side,transparent calc(100% - .14em),#000 calc(100% - .13em));
  animation:r .8s linear infinite}
@keyframes r{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){.s{animation-duration:2.4s}}
`;

class UISpinner extends Base {
  static observedAttributes = ['label'];
  #s;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `<style>${css}</style><span class="s" part="spinner" role="status" aria-label="Cargando"></span>`;
    this.#s = root.querySelector('.s');
  }

  attributeChangedCallback(_, __, v) { this.#s.setAttribute('aria-label', v || 'Cargando'); }
}

define('ui-spinner', UISpinner);
export { UISpinner };
