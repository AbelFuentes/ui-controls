import { define } from '../core/define.js';
import { UIDialog } from './dialog.js';

const css = `
:host{--w:26em}
:host([size=sm]){--w:20em}
:host([size=lg]){--w:36em}
dialog{margin:0;inset:0 0 0 auto;width:min(var(--w),92vw);height:100dvh;max-height:none}
dialog[open]{animation:slide-r .38s cubic-bezier(.2,.8,.2,1)}
.panel{height:100%;max-height:none;border-radius:1.25em 0 0 1.25em}
:host([side=left]) dialog{inset:0 auto 0 0}
:host([side=left]) dialog[open]{animation-name:slide-l}
:host([side=left]) .panel{border-radius:0 1.25em 1.25em 0}
:host([side=bottom]) dialog{inset:auto 0 0 0;width:100%;height:auto;max-height:90dvh}
:host([side=bottom]) dialog[open]{animation-name:slide-b}
:host([side=bottom]) .panel{height:auto;max-height:90dvh;border-radius:1.25em 1.25em 0 0}
@keyframes slide-r{from{transform:translateX(100%)}}
@keyframes slide-l{from{transform:translateX(-100%)}}
@keyframes slide-b{from{transform:translateY(100%)}}
`;

class UIDrawer extends UIDialog {
  constructor() {
    super();
    this.shadowRoot.insertAdjacentHTML('beforeend', `<style>${css}</style>`);
  }
}

define('ui-drawer', UIDrawer);
export { UIDrawer };
