import { define } from '../core/define.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};
const ICONS = {
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  success: '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.7 2.7L16 9.5"/>',
  warning: '<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17h.01"/>',
  danger: '<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>',
};
const css = `
:host{--w:24em}
.wrap{position:fixed;inset:auto 1em 1em auto;margin:0;padding:0;border:0;background:transparent;overflow:visible;
  width:min(var(--w),calc(100vw - 2em));flex-direction:column-reverse;gap:.6em;
  font-size:var(--ui-toast-size,15px);color:var(--ui-text,CanvasText)}
.wrap:popover-open{display:flex}
.wrap:not(:popover-open){display:none}
:host([placement=bottom-left]) .wrap{inset:auto auto 1em 1em}
:host([placement=bottom-center]) .wrap{inset:auto 0 1em 0;margin-inline:auto}
:host([placement=top-right]) .wrap{inset:1em 1em auto auto;flex-direction:column}
:host([placement=top-left]) .wrap{inset:1em auto auto 1em;flex-direction:column}
:host([placement=top-center]) .wrap{inset:1em 0 auto 0;margin-inline:auto;flex-direction:column}
*{box-sizing:border-box}
.t{--c:var(--ui-accent,#6366f1);position:relative;display:flex;gap:.8em;align-items:flex-start;
  padding:.9em 1em .9em 1.1em;border-radius:1em;overflow:hidden;background:var(--ui-surface,Canvas);
  box-shadow:0 0 0 1px color-mix(in srgb,currentColor 12%,transparent),0 1em 2.5em rgb(0 0 0/.3);
  animation:in .35s cubic-bezier(.2,.9,.3,1.2)}
.t.success{--c:var(--ui-success,#10b981)}
.t.warning{--c:var(--ui-warning,#f59e0b)}
.t.danger{--c:var(--ui-danger,#ef4444)}
.ico{flex:none;width:1.4em;height:1.4em;margin-top:.05em;fill:none;stroke:var(--c);stroke-width:2;
  stroke-linecap:round;stroke-linejoin:round}
.txt{flex:1;min-width:0;line-height:1.45}
.ttl{display:block;font-weight:600}
.ttl:empty{display:none}
.x{all:unset;flex:none;display:grid;place-items:center;width:1.7em;height:1.7em;margin:-.2em -.3em 0 0;border-radius:.5em;
  cursor:pointer;opacity:.6;transition:opacity .2s,background-color .2s}
.x:hover{opacity:1;background:color-mix(in srgb,currentColor 10%,transparent)}
.x:focus-visible{outline:.15em solid var(--c);outline-offset:.05em}
.x svg{width:1em;height:1em;fill:none;stroke:currentColor;stroke-width:2.4;stroke-linecap:round}
.bar{position:absolute;left:0;bottom:0;height:.2em;width:100%;background:var(--c);transform-origin:left;
  animation:bar var(--d) linear forwards}
.t:hover .bar{animation-play-state:paused}
.t.out{animation:out .25s forwards}
@keyframes in{from{opacity:0;transform:translateY(.6em) scale(.96)}}
@keyframes out{to{opacity:0;transform:scale(.95)}}
@keyframes bar{to{transform:scaleX(0)}}
@media (prefers-reduced-motion:reduce){.t{animation-duration:.01ms}.bar{opacity:0}}
`;

class UIToaster extends Base {
  #wrap;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>${css}</style>
      <div class="wrap" part="toaster" popover="manual" aria-live="polite" aria-relevant="additions"></div>`;
    this.#wrap = root.querySelector('.wrap');
  }

  push(message, { title = '', tone = 'info', duration = 4500 } = {}) {
    const el = document.createElement('div');
    el.className = `t ${tone}`;
    el.setAttribute('part', 'toast');
    el.setAttribute('role', tone === 'danger' ? 'alert' : 'status');
    el.innerHTML = `
      <svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${ICONS[tone] ?? ICONS.info}</svg>
      <div class="txt"><span class="ttl"></span><span class="msg"></span></div>
      <button class="x" type="button" aria-label="Cerrar"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
      ${duration > 0 ? '<i class="bar"></i>' : ''}`;
    el.querySelector('.ttl').textContent = title;
    el.querySelector('.msg').textContent = message;
    if (duration > 0) el.style.setProperty('--d', `${duration}ms`);

    const dismiss = () => {
      if (!el.isConnected || el.classList.contains('out')) return;
      el.classList.add('out');
    };
    el.querySelector('.x').addEventListener('click', dismiss);
    el.addEventListener('animationend', (e) => {
      if (e.animationName === 'bar') dismiss();
      else if (e.animationName === 'out') {
        el.remove();
        if (!this.#wrap.children.length) this.#wrap.hidePopover();
      }
    });

    this.#wrap.prepend(el);
    if (!this.#wrap.matches(':popover-open')) this.#wrap.showPopover();
    return dismiss;
  }
}

define('ui-toaster', UIToaster);

export function toast(message, opts = {}) {
  if (typeof document === 'undefined') return () => {};
  let host = document.querySelector('ui-toaster');
  if (!host) {
    host = document.createElement('ui-toaster');
    document.body.append(host);
  }
  return host.push(message, opts);
}
for (const tone of ['info', 'success', 'warning', 'danger']) {
  toast[tone] = (message, opts) => toast(message, { ...opts, tone });
}

export { UIToaster };
