import { define } from '../core/define.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};
const css = `
:host{display:block;--w:72rem;--py:4rem;--p:1.25rem}
:host([hidden]){display:none!important}
:host([padding=none]){--py:0}
:host([padding=sm]){--py:2rem}
:host([padding=lg]){--py:6rem}
:host([padding=xl]){--py:8rem}
:host([size=sm]){--w:40rem}
:host([size=md]){--w:56rem}
:host([size=xl]){--w:88rem}
:host([size=full]){--w:none}
:host([tone=soft]){--bg:color-mix(in srgb,var(--ui-accent,#6366f1) 7%,transparent)}
:host([tone=surface]){--bg:var(--ui-surface,Canvas)}
:host([tone=accent]){--bg:linear-gradient(135deg,var(--ui-accent,#6366f1),var(--ui-accent-2,#a855f7));--fg:#fff}
:host([tone=dark]){--bg:#0d0f14;--fg:#eceef5}
.s{box-sizing:border-box;padding-block:var(--ui-section-padding,var(--py));color:var(--fg,inherit);background:var(--bg,transparent)}
:host([tone=surface]) .s{border-block:1px solid var(--ui-border,color-mix(in srgb,currentColor 14%,transparent))}
.in{box-sizing:border-box;max-width:var(--w);margin-inline:auto;padding-inline:var(--p)}
:host([center]) .in{text-align:center}
`;

class UISection extends Base {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML =
      `<style>${css}</style><section class="s" part="section"><div class="in" part="inner"><slot></slot></div></section>`;
  }
}

define('ui-section', UISection);
export { UISection };
