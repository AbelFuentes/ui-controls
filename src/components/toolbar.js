import { define } from '../core/define.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};
const css = `
:host{display:block;font-size:var(--ui-toolbar-size,15px);--py:.6rem;--px:1rem}
:host([hidden]){display:none!important}
:host([size=sm]){--py:.35rem;--px:.75rem}
:host([size=lg]){--py:1rem;--px:1.5rem}
*{box-sizing:border-box}
.bar{display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);align-items:center;gap:.75rem;padding:var(--py) var(--px)}
.start,.mid,.end{display:flex;align-items:center;gap:.6rem;min-width:0}
.mid{justify-content:center}
.end{justify-content:flex-end}
:host([variant=surface]) .bar{background:var(--ui-surface,Canvas);border-bottom:1px solid var(--ui-border,color-mix(in srgb,currentColor 14%,transparent))}
:host([variant=soft]) .bar{background:color-mix(in srgb,currentColor 5%,transparent);border-radius:1rem}
:host([variant=floating]) .bar{background:var(--ui-surface,Canvas);border-radius:1rem;
  box-shadow:0 0 0 1px var(--ui-border,color-mix(in srgb,currentColor 14%,transparent)),0 .8rem 2rem -.6rem rgb(0 0 0/.3)}
:host([sticky]){position:sticky;top:var(--ui-toolbar-offset,0);z-index:20}
:host([wrap]) .bar{display:flex;flex-wrap:wrap}
:host([wrap]) .start{flex:1 1 auto}
`;

class UIToolbar extends Base {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = `
      <style>${css}</style>
      <div class="bar" part="bar" role="toolbar">
        <div class="start" part="start"><slot name="start"></slot></div>
        <div class="mid" part="center"><slot></slot></div>
        <div class="end" part="end"><slot name="end"></slot></div>
      </div>`;
  }
}

define('ui-toolbar', UIToolbar);
export { UIToolbar };
