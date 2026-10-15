import { define } from '../core/define.js';
import { collapseCss } from '../core/breakpoints.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};
const LINE = '1px solid var(--ui-border,color-mix(in srgb,currentColor 14%,transparent))';
const G = 'var(--ui-stack-gap,var(--g))';
const css = `
:host{display:flex;flex-direction:column;gap:var(--ui-stack-gap,var(--g));--g:1em}
:host([hidden]){display:none!important}
:host([inline]){display:inline-flex}
:host([direction=row]){flex-direction:row}
:host([reverse]){flex-direction:column-reverse}
:host([direction=row][reverse]){flex-direction:row-reverse}
:host([gap=none]){--g:0}
:host([gap=xs]){--g:.25em}
:host([gap=sm]){--g:.5em}
:host([gap=lg]){--g:1.75em}
:host([gap=xl]){--g:3em}
:host([align=start]){align-items:flex-start}
:host([align=center]){align-items:center}
:host([align=end]){align-items:flex-end}
:host([align=stretch]){align-items:stretch}
:host([justify=center]){justify-content:center}
:host([justify=end]){justify-content:flex-end}
:host([justify=between]){justify-content:space-between}
:host([wrap]){flex-wrap:wrap}
:host([divider]){gap:0}
:host([divider]) ::slotted(:not(:first-child)){margin-block-start:${G};padding-block-start:${G};border-block-start:${LINE}}
:host([divider][direction=row]) ::slotted(:not(:first-child)){margin-block-start:0;padding-block-start:0;border-block-start:0;
  margin-inline-start:${G};padding-inline-start:${G};border-inline-start:${LINE}}
${collapseCss([['', 'flex-direction:column']], { extra: '[direction=row]', optIn: true })}
${collapseCss([[' ::slotted(:not(:first-child))',
  `margin-inline-start:0;padding-inline-start:0;border-inline-start:0;margin-block-start:${G};padding-block-start:${G};border-block-start:${LINE}`]],
  { extra: '[direction=row][divider]', optIn: true })}
`;

class UIStack extends Base {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = `<style>${css}</style><slot></slot>`;
  }
}

define('ui-stack', UIStack);
export { UIStack };
