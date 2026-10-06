import { define } from '../core/define.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};
const css = `
:host{display:flex;flex-direction:column;gap:var(--ui-stack-gap,var(--g));--g:1em}
:host([hidden]){display:none!important}
:host([direction=row]){flex-direction:row}
:host([gap=none]){--g:0}:host([gap=xs]){--g:.25em}:host([gap=sm]){--g:.5em}
:host([gap=lg]){--g:1.75em}:host([gap=xl]){--g:3em}
:host([align=start]){align-items:flex-start}:host([align=center]){align-items:center}
:host([align=end]){align-items:flex-end}:host([align=stretch]){align-items:stretch}
:host([justify=center]){justify-content:center}:host([justify=end]){justify-content:flex-end}
:host([justify=between]){justify-content:space-between}
:host([wrap]){flex-wrap:wrap}
`;

class UIStack extends Base {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = `<style>${css}</style><slot></slot>`;
  }
}

define('ui-stack', UIStack);
export { UIStack };
