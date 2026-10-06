import { define } from '../core/define.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};
const css = `
:host{display:inline-flex;font-size:var(--ui-badge-size,13px);--c:var(--ui-accent,#6366f1);vertical-align:middle}
:host([hidden]){display:none!important}
:host([tone=success]){--c:var(--ui-success,#10b981)}
:host([tone=warning]){--c:var(--ui-warning,#f59e0b)}
:host([tone=danger]){--c:var(--ui-danger,#ef4444)}
:host([tone=neutral]){--c:var(--ui-muted,#8087a0)}
:host([size=sm]){font-size:11px}
:host([size=lg]){font-size:15px}
.b{display:inline-flex;align-items:center;gap:.45em;padding:.3em .8em;border-radius:2em;font-weight:600;line-height:1.3;
  white-space:nowrap;color:var(--c);background:color-mix(in srgb,var(--c) 15%,transparent)}
:host([variant=solid]) .b{color:#fff;background:var(--c)}
:host([variant=outline]) .b{background:transparent;box-shadow:inset 0 0 0 .1em color-mix(in srgb,var(--c) 55%,transparent)}
.dot{display:none;flex:none;width:.55em;height:.55em;border-radius:50%;background:currentColor}
:host([dot]) .dot{display:block}
:host([pulse]) .dot{animation:p 1.8s ease-out infinite}
@keyframes p{0%{box-shadow:0 0 0 0 color-mix(in srgb,currentColor 50%,transparent)}70%,100%{box-shadow:0 0 0 .5em transparent}}
@media (prefers-reduced-motion:reduce){.dot{animation:none!important}}
`;

class UIBadge extends Base {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML =
      `<style>${css}</style><span class="b" part="badge"><i class="dot"></i><slot></slot></span>`;
  }
}

define('ui-badge', UIBadge);
export { UIBadge };
