import { define } from '../core/define.js';
import { above } from '../core/breakpoints.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};
const BPS = ['sm', 'md', 'lg', 'xl'];
const css = `
:host{display:grid;gap:var(--ui-grid-gap,var(--g));--g:1em;
  grid-template-columns:repeat(auto-fill,minmax(min(var(--min,14rem),100%),1fr))}
:host([hidden]){display:none!important}
:host([cols]){grid-template-columns:repeat(var(--cols),minmax(0,1fr))}
:host([rows]){grid-template-rows:var(--rows)}
:host([gap=none]){--g:0}
:host([gap=xs]){--g:.25em}
:host([gap=sm]){--g:.5em}
:host([gap=lg]){--g:1.75em}
:host([gap=xl]){--g:3em}
:host([align=start]){align-items:start}
:host([align=center]){align-items:center}
:host([align=end]){align-items:end}
:host([align=stretch]){align-items:stretch}
:host([justify=start]){justify-items:start}
:host([justify=center]){justify-items:center}
:host([justify=end]){justify-items:end}
:host([dense]){grid-auto-flow:row dense}
${BPS.map((k) => `@media ${above(k)}{:host([cols-${k}]){grid-template-columns:repeat(var(--cols-${k}),minmax(0,1fr))}}`).join('\n')}
`;
const len = (v) => (/^\d+(\.\d+)?$/.test(v) ? `${v}rem` : v);

class UIGrid extends Base {
  static observedAttributes = ['cols', ...BPS.map((k) => `cols-${k}`), 'min', 'rows'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = `<style>${css}</style><slot></slot>`;
  }

  attributeChangedCallback(name, _, v) {
    const prop = `--${name}`;
    let val = v;
    if (name === 'min') val = v && len(v);
    if (name === 'rows') val = v && (/^\d+$/.test(v) ? `repeat(${v},minmax(0,1fr))` : v);
    v ? this.style.setProperty(prop, val) : this.style.removeProperty(prop);
  }
}

define('ui-grid', UIGrid);
export { UIGrid };
