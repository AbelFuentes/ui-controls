import { define } from '../core/define.js';
import { collapseCss } from '../core/breakpoints.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};
const len = (v) => (/^\d+(\.\d+)?$/.test(v) ? `${v}rem` : v);
const css = `
:host{display:grid;--cols:minmax(0,1fr) var(--aside,20rem);--g:2rem;grid-template-columns:var(--cols);
  gap:var(--ui-split-gap,var(--g));align-items:start}
:host([hidden]){display:none!important}
:host([side=left]){--cols:var(--aside,20rem) minmax(0,1fr)}
:host([gap=none]){--g:0}
:host([gap=sm]){--g:1rem}
:host([gap=lg]){--g:3rem}
:host([gap=xl]){--g:4rem}
.main{order:1;min-width:0}
.aside{order:2;min-width:0}
:host([side=left]) .main{order:2}
:host([side=left]) .aside{order:1}
:host([sticky]) .aside{position:sticky;top:var(--ui-split-offset,1rem)}
${collapseCss([['', '--cols:minmax(0,1fr)'], [' .aside', 'position:static']])}
`;

class UISplit extends Base {
  static observedAttributes = ['aside-width'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = `
      <style>${css}</style>
      <div class="main" part="main"><slot></slot></div>
      <aside class="aside" part="aside"><slot name="aside"></slot></aside>`;
  }

  attributeChangedCallback(_, __, v) {
    v ? this.style.setProperty('--aside', len(v)) : this.style.removeProperty('--aside');
  }
}

define('ui-split', UISplit);
export { UISplit };
