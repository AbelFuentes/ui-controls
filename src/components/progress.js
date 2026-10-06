import { define } from '../core/define.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};
const css = `
:host{display:block;font-size:var(--ui-progress-size,14px)}
:host([circular]){display:inline-block}
:host([hidden]){display:none!important}
:host([size=sm]){font-size:11px}
:host([size=lg]){font-size:18px}
*{box-sizing:border-box}
[hidden]{display:none!important}
.row{display:flex;justify-content:space-between;gap:1em;margin-bottom:.5em;font-weight:500}
.val{opacity:.7;font-variant-numeric:tabular-nums}
.bar{position:relative;height:.7em;border-radius:1em;overflow:hidden;
  background:var(--ui-progress-bg,color-mix(in srgb,currentColor 14%,transparent))}
.fill{height:100%;width:var(--p,0%);border-radius:inherit;
  background:linear-gradient(90deg,var(--ui-accent,#6366f1),var(--ui-accent-2,#a855f7));
  transition:width .5s cubic-bezier(.4,0,.2,1)}
:host([indeterminate]) .fill{width:40%;animation:ind 1.3s ease-in-out infinite}
@keyframes ind{from{transform:translateX(-100%)}to{transform:translateX(250%)}}

.ring{display:none;position:relative;width:5em;height:5em}
.ring svg{width:100%;height:100%;transform:rotate(-90deg)}
.ring circle{fill:none;stroke-width:10;stroke-linecap:round}
.tr{stroke:var(--ui-progress-bg,color-mix(in srgb,currentColor 14%,transparent))}
.fg{stroke:url(#g);stroke-dasharray:264;transition:stroke-dashoffset .5s cubic-bezier(.4,0,.2,1)}
.rv{position:absolute;inset:0;display:grid;place-items:center;font-weight:700;font-size:1.1em;font-variant-numeric:tabular-nums}
:host([indeterminate]) .ring svg{animation:spin 1s linear infinite}
@keyframes spin{to{transform:rotate(270deg)}}
:host([circular]) .ring{display:block}
:host([circular]) .lin{display:none}
@media (prefers-reduced-motion:reduce){*{transition-duration:.01ms!important;animation-duration:3s!important}}
`;

class UIProgress extends Base {
  static observedAttributes = ['value', 'max', 'indeterminate', 'label', 'show-value'];
  #pb; #row; #lbl; #val; #fill; #fg; #rv;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>${css}</style>
      <div class="pb" part="progress" role="progressbar" aria-valuemin="0">
        <div class="row lin" part="row"><span class="lbl"></span><span class="val"></span></div>
        <div class="bar lin" part="bar"><div class="fill" part="fill"></div></div>
        <div class="ring" part="ring">
          <svg viewBox="0 0 100 100">
            <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" style="stop-color:var(--ui-accent,#6366f1)"/>
              <stop offset="1" style="stop-color:var(--ui-accent-2,#a855f7)"/>
            </linearGradient></defs>
            <circle class="tr" cx="50" cy="50" r="42"/>
            <circle class="fg" cx="50" cy="50" r="42"/>
          </svg>
          <span class="rv"></span>
        </div>
      </div>`;
    this.#pb = root.querySelector('.pb');
    this.#row = root.querySelector('.row');
    this.#lbl = root.querySelector('.lbl');
    this.#val = root.querySelector('.val');
    this.#fill = root.querySelector('.fill');
    this.#fg = root.querySelector('.fg');
    this.#rv = root.querySelector('.rv');
  }

  get value() { return parseFloat(this.getAttribute('value')) || 0; }
  set value(v) { this.setAttribute('value', String(v)); }

  connectedCallback() { this.#render(); }
  attributeChangedCallback() { this.#render(); }

  #render() {
    const max = parseFloat(this.getAttribute('max')) || 100;
    const r = Math.min(1, Math.max(0, this.value / max));
    const ind = this.hasAttribute('indeterminate');
    const label = this.getAttribute('label') || '';
    const show = this.hasAttribute('show-value');
    const pct = `${Math.round(r * 100)}%`;

    this.#fill.style.setProperty('--p', `${r * 100}%`);
    this.#fg.style.strokeDashoffset = ind ? 198 : 264 * (1 - r);
    this.#lbl.textContent = label;
    this.#val.textContent = show && !ind ? pct : '';
    this.#row.hidden = !label && !(show && !ind);
    this.#rv.textContent = pct;
    this.#rv.hidden = !show || ind;

    this.#pb.setAttribute('aria-label', label || 'Progreso');
    this.#pb.setAttribute('aria-valuemax', max);
    ind ? this.#pb.removeAttribute('aria-valuenow') : this.#pb.setAttribute('aria-valuenow', this.value);
  }
}

define('ui-progress', UIProgress);
export { UIProgress };
