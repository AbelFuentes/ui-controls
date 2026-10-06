import { define } from '../core/define.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};
const SIZES = { xs: '24px', sm: '32px', md: '44px', lg: '64px', xl: '96px' };
const len = (v) => (/^\d+(\.\d+)?$/.test(v) ? `${v}px` : v);
const css = `
:host{display:inline-block;--s:44px;line-height:0;vertical-align:middle}
:host([hidden]){display:none!important}
*{box-sizing:border-box}
[hidden]{display:none!important}
.a{position:relative;display:block;width:var(--s);height:var(--s);border-radius:50%;color:#fff;
  background:var(--bg,linear-gradient(135deg,var(--ui-accent,#6366f1),var(--ui-accent-2,#a855f7)));
  box-shadow:inset 0 0 0 1px rgb(255 255 255/.18)}
:host([square]) .a{border-radius:28%}
.img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:inherit}
.ini{position:absolute;inset:0;display:grid;place-items:center;font:600 calc(var(--s) * .38)/1 system-ui,sans-serif;
  letter-spacing:.02em;user-select:none}
.st{position:absolute;right:-1%;bottom:-1%;width:26%;height:26%;border-radius:50%;background:var(--sc,#8087a0);
  box-shadow:0 0 0 .14em var(--ui-surface,Canvas);display:none}
:host([status]) .st{display:block}
:host([status=online]){--sc:var(--ui-success,#10b981)}
:host([status=busy]){--sc:var(--ui-danger,#ef4444)}
:host([status=away]){--sc:var(--ui-warning,#f59e0b)}
`;

class UIAvatar extends Base {
  static observedAttributes = ['src', 'name', 'alt', 'size'];
  #a; #img; #ini;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>${css}</style>
      <span class="a" part="avatar" role="img">
        <span class="ini" part="initials"></span>
        <img class="img" part="image" alt="" hidden />
        <i class="st" part="status"></i>
      </span>`;
    this.#a = root.querySelector('.a');
    this.#img = root.querySelector('img');
    this.#ini = root.querySelector('.ini');
    this.#img.addEventListener('error', () => (this.#img.hidden = true));
    this.#img.addEventListener('load', () => (this.#img.hidden = false));
  }

  connectedCallback() { this.#render(); }
  attributeChangedCallback() { this.#render(); }

  #render() {
    const name = (this.getAttribute('name') || '').trim();
    const src = this.getAttribute('src');
    const size = this.getAttribute('size');
    this.style.setProperty('--s', size ? SIZES[size] ?? len(size) : '44px');

    this.#ini.textContent = name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
    if (name) {
      const h = [...name].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 360, 7);
      this.#a.style.setProperty('--bg', `linear-gradient(135deg,hsl(${h} 70% 55%),hsl(${(h + 40) % 360} 70% 42%))`);
    } else this.#a.style.removeProperty('--bg');

    this.#a.setAttribute('aria-label', this.getAttribute('alt') || name || 'Avatar');
    if (src) { this.#img.hidden = true; this.#img.src = src; }
    else { this.#img.hidden = true; this.#img.removeAttribute('src'); }
  }
}

define('ui-avatar', UIAvatar);
export { UIAvatar };
