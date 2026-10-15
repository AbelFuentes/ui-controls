import { define } from '../core/define.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};
const len = (v) => (/^\d+(\.\d+)?$/.test(v) ? `${v}rem` : v);
const css = `
:host{display:block;flex:1 1 0;min-width:0;min-height:0}
:host([hidden]){display:none!important}
:host([size]){flex:0 0 var(--s)}
`;

class UISpacer extends Base {
  static observedAttributes = ['size'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = `<style>${css}</style>`;
  }

  connectedCallback() { this.setAttribute('aria-hidden', 'true'); }

  attributeChangedCallback(_, __, v) {
    v ? this.style.setProperty('--s', len(v)) : this.style.removeProperty('--s');
  }
}

define('ui-spacer', UISpacer);
export { UISpacer };
