import { define } from '../core/define.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};
const css = `
:host{display:block;width:100%;margin-inline:auto;box-sizing:border-box;--w:72rem;--p:1.25rem;
  max-width:var(--ui-container-width,var(--w));padding-inline:var(--ui-container-padding,var(--p))}
:host([hidden]){display:none!important}
:host([size=sm]){--w:40rem}
:host([size=md]){--w:56rem}
:host([size=xl]){--w:88rem}
:host([size=full]){--w:none}
:host([padding=none]){--p:0}
:host([padding=sm]){--p:.75rem}
:host([padding=lg]){--p:2rem}
:host([center]){text-align:center}
`;

class UIContainer extends Base {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = `<style>${css}</style><slot></slot>`;
  }
}

define('ui-container', UIContainer);
export { UIContainer };
