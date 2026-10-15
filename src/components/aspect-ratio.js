import { define } from '../core/define.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};
const css = `
:host{display:block;position:relative;overflow:hidden;aspect-ratio:var(--r,16/9)}
:host([hidden]){display:none!important}
:host([rounded]){border-radius:var(--ui-radius,1em)}
::slotted(*){position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
:host([fit=contain]) ::slotted(*){object-fit:contain}
`;

class UIAspectRatio extends Base {
  static observedAttributes = ['ratio'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = `<style>${css}</style><slot></slot>`;
  }

  attributeChangedCallback(_, __, v) {
    // "16/9", "16:9" o un número ("1.5")
    const r = (v ?? '').trim().replace(':', '/');
    r ? this.style.setProperty('--r', r) : this.style.removeProperty('--r');
  }
}

define('ui-aspect-ratio', UIAspectRatio);
export { UIAspectRatio };
