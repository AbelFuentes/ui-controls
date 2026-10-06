import { define } from '../core/define.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};
const ICONS = {
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  success: '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.7 2.7L16 9.5"/>',
  warning: '<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17h.01"/>',
  danger: '<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>',
};
const css = `
:host{display:block;font-size:var(--ui-alert-size,15px);--c:var(--ui-accent,#6366f1)}
:host([hidden]){display:none!important}
:host([tone=success]){--c:var(--ui-success,#10b981)}
:host([tone=warning]){--c:var(--ui-warning,#f59e0b)}
:host([tone=danger]){--c:var(--ui-danger,#ef4444)}
*{box-sizing:border-box}
.a{position:relative;display:flex;gap:.85em;align-items:flex-start;padding:1em 1.1em 1em 1.3em;border-radius:1em;overflow:hidden;
  background:color-mix(in srgb,var(--c) 11%,var(--ui-surface,transparent));
  box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--c) 28%,transparent);
  animation:in .35s cubic-bezier(.2,.8,.2,1)}
.a::before{content:"";position:absolute;inset:0 auto 0 0;width:.28em;background:var(--c)}
.ico{flex:none;width:1.4em;height:1.4em;margin-top:.05em;fill:none;stroke:var(--c);stroke-width:2;
  stroke-linecap:round;stroke-linejoin:round}
.txt{flex:1;min-width:0;line-height:1.5}
::slotted([slot=title]){display:block;font-weight:600;margin-bottom:.15em}
.x{all:unset;flex:none;display:grid;place-items:center;width:1.7em;height:1.7em;margin:-.2em -.3em 0 0;border-radius:.5em;
  cursor:pointer;opacity:.6;transition:opacity .2s,background-color .2s}
.x:hover{opacity:1;background:color-mix(in srgb,currentColor 10%,transparent)}
.x:focus-visible{outline:.15em solid var(--c);outline-offset:.05em}
.x svg{width:1em;height:1em;fill:none;stroke:currentColor;stroke-width:2.4;stroke-linecap:round}
:host(:not([dismissible])) .x{display:none}
.closing{animation:out .25s forwards}
@keyframes in{from{opacity:0;transform:translateY(-.4em)}}
@keyframes out{to{opacity:0;transform:translateY(-.4em) scale(.98)}}
@media (prefers-reduced-motion:reduce){*{animation-duration:.01ms!important}}
`;

class UIAlert extends Base {
  static observedAttributes = ['tone'];
  #a; #ico;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>${css}</style>
      <div class="a" part="alert">
        <svg class="ico" viewBox="0 0 24 24" aria-hidden="true"></svg>
        <div class="txt" part="content"><slot name="title"></slot><slot></slot></div>
        <button class="x" part="close" type="button" aria-label="Cerrar">
          <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </div>`;
    this.#a = root.querySelector('.a');
    this.#ico = root.querySelector('.ico');
    root.querySelector('.x').addEventListener('click', () => this.dismiss());
    this.#a.addEventListener('animationend', (e) => {
      if (e.animationName !== 'out') return;
      this.#a.classList.remove('closing');
      this.hidden = true;
      this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
    });
  }

  connectedCallback() { this.#tone(); }
  attributeChangedCallback() { this.#tone(); }

  dismiss() { this.#a.classList.add('closing'); }
  show() { this.hidden = false; }

  #tone() {
    const t = ICONS[this.getAttribute('tone')] ? this.getAttribute('tone') : 'info';
    this.#ico.innerHTML = ICONS[t];
    this.setAttribute('role', t === 'danger' || t === 'warning' ? 'alert' : 'status');
  }
}

define('ui-alert', UIAlert);
export { UIAlert };
