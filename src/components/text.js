import { define } from '../core/define.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};
const LEVEL = { display: 1, h1: 1, h2: 2, h3: 3, h4: 4, h5: 5, h6: 6 };
const css = `
:host{display:block;margin:0;font-size:var(--fs,1rem);line-height:1.6;color:var(--c,inherit);font-weight:var(--fw,400)}
:host([hidden]){display:none!important}
:host([inline]){display:inline}
:host([variant=display]){--fs:clamp(2.4rem,6vw,4rem);--fw:800;line-height:1.05;letter-spacing:-.03em}
:host([variant=h1]){--fs:2.1rem;--fw:750;line-height:1.15;letter-spacing:-.02em}
:host([variant=h2]){--fs:1.6rem;--fw:700;line-height:1.2;letter-spacing:-.015em}
:host([variant=h3]){--fs:1.3rem;--fw:650;line-height:1.3}
:host([variant=h4]){--fs:1.1rem;--fw:650;line-height:1.35}
:host([variant=h5]){--fs:1rem;--fw:650;line-height:1.4}
:host([variant=h6]){--fs:.85rem;--fw:650;line-height:1.4;text-transform:uppercase;letter-spacing:.05em}
:host([variant=lead]){--fs:1.2rem;--c:var(--ui-muted,inherit);line-height:1.65}
:host([variant=small]){--fs:.875rem}
:host([variant=caption]){--fs:.78rem;--c:var(--ui-muted,inherit)}
:host([variant=overline]){--fs:.72rem;--fw:600;--c:var(--ui-muted,inherit);text-transform:uppercase;letter-spacing:.08em}
:host([variant=code]){--fs:.9em;display:inline;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  padding:.15em .45em;border-radius:.45em;background:color-mix(in srgb,currentColor 9%,transparent)}
:host([size=xs]){--fs:.75rem}
:host([size=sm]){--fs:.875rem}
:host([size=lg]){--fs:1.125rem}
:host([size=xl]){--fs:1.25rem}
:host([size=2xl]){--fs:1.5rem}
:host([size=3xl]){--fs:1.875rem}
:host([tone=muted]){--c:var(--ui-muted,inherit)}
:host([tone=accent]){--c:var(--ui-accent,#6366f1)}
:host([tone=success]){--c:var(--ui-success,#10b981)}
:host([tone=warning]){--c:var(--ui-warning,#f59e0b)}
:host([tone=danger]){--c:var(--ui-danger,#ef4444)}
:host([weight=normal]){--fw:400}
:host([weight=medium]){--fw:500}
:host([weight=semibold]){--fw:600}
:host([weight=bold]){--fw:700}
:host([align=start]){text-align:start}
:host([align=center]){text-align:center}
:host([align=end]){text-align:end}
:host([truncate]){overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
:host([lines]){display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:var(--lines);overflow:hidden}
:host([balance]){text-wrap:balance}
`;

class UIText extends Base {
  static observedAttributes = ['variant', 'level', 'lines'];
  #auto = false;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = `<style>${css}</style><slot></slot>`;
  }

  connectedCallback() { this.#sync(); }

  attributeChangedCallback(name, _, v) {
    if (name === 'lines') {
      const n = parseInt(v, 10);
      n > 0 ? this.style.setProperty('--lines', String(n)) : this.style.removeProperty('--lines');
      return;
    }
    this.#sync();
  }

  // Los encabezados exponen role="heading" y aria-level sin cambiar el elemento
  #sync() {
    const lvl = parseInt(this.getAttribute('level'), 10) || LEVEL[this.getAttribute('variant')];
    if (lvl >= 1 && lvl <= 6 && (!this.hasAttribute('role') || this.#auto)) {
      this.setAttribute('role', 'heading');
      this.setAttribute('aria-level', String(lvl));
      this.#auto = true;
    } else if (this.#auto) {
      this.removeAttribute('role');
      this.removeAttribute('aria-level');
      this.#auto = false;
    }
  }
}

define('ui-text', UIText);
export { UIText };
