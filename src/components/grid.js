import { define } from '../core/define.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};
const css = `
:host{display:grid;gap:var(--ui-grid-gap,var(--g));--g:1em;
  grid-template-columns:repeat(auto-fill,minmax(min(var(--min,14rem),100%),1fr))}
:host([hidden]){display:none!important}
:host([cols]){grid-template-columns:repeat(var(--cols),minmax(0,1fr))}
:host([gap=none]){--g:0}:host([gap=sm]){--g:.5em}:host([gap=lg]){--g:1.75em}:host([gap=xl]){--g:3em}
`;
const len = (v) => (/^\d+(\.\d+)?$/.test(v) ? `${v}rem` : v);

class UIGrid extends Base {
  static observedAttributes = ['cols', 'min'];
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = `<style>${css}</style><slot></slot>`;
  }
  attributeChangedCallback(name, _, v) {
    const prop = name === 'cols' ? '--cols' : '--min';
    v ? this.style.setProperty(prop, name === 'min' ? len(v) : v) : this.style.removeProperty(prop);
  }
}

define('ui-grid', UIGrid);
export { UIGrid };
