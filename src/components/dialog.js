import { define } from '../core/define.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};
const css = `
:host{display:contents;--w:32em;font-size:var(--ui-dialog-size,16px)}
:host([size=sm]){--w:24em}
:host([size=lg]){--w:44em}
:host([size=xl]){--w:60em}
*{box-sizing:border-box}
dialog{width:min(var(--w),92vw);max-width:none;max-height:none;margin:auto;padding:0;border:0;
  background:transparent;color:inherit;overflow:visible}
dialog[open]{animation:pop .32s cubic-bezier(.2,.9,.3,1.2)}
dialog::backdrop{background:rgb(8 10 20/.55);backdrop-filter:blur(5px);animation:fade .25s}
.panel{display:flex;flex-direction:column;max-height:85dvh;border-radius:1.25em;overflow:hidden;
  background:var(--ui-surface,Canvas);color:var(--ui-text,CanvasText);
  box-shadow:0 0 0 1px color-mix(in srgb,currentColor 12%,transparent),0 2em 5em rgb(0 0 0/.45)}
.head{display:flex;align-items:flex-start;gap:1em;padding:1.4em 1.5em .4em}
.title{flex:1;min-width:0;font-size:1.2em;font-weight:650;line-height:1.4}
.x{all:unset;flex:none;display:grid;place-items:center;width:2em;height:2em;margin:-.3em -.5em 0 0;border-radius:.6em;
  cursor:pointer;opacity:.6;transition:opacity .2s,background-color .2s}
.x:hover{opacity:1;background:color-mix(in srgb,currentColor 10%,transparent)}
.x:focus-visible{outline:.15em solid var(--ui-accent,#6366f1);outline-offset:.05em}
.x svg{width:1.1em;height:1.1em;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round}
:host([no-close]) .x{display:none}
.body{padding:.6em 1.5em 1.4em;overflow:auto;line-height:1.55}
.foot{display:flex;justify-content:flex-end;gap:.75em;padding:1em 1.5em;
  border-top:1px solid var(--ui-border,rgb(128 135 160/.2))}
.foot[hidden]{display:none}
@keyframes pop{from{opacity:0;transform:scale(.94) translateY(.6em)}}
@keyframes fade{from{opacity:0}}
@media (prefers-reduced-motion:reduce){dialog,dialog::backdrop{animation-duration:.01ms!important}}
`;

class UIDialog extends Base {
  static observedAttributes = ['open'];
  #d;
  #foot;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>${css}</style>
      <dialog part="dialog" aria-labelledby="t">
        <div class="panel" part="panel">
          <div class="head" part="header">
            <div class="title" id="t"><slot name="header"></slot></div>
            <button class="x" part="close" type="button" aria-label="Cerrar">
              <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>
            </button>
          </div>
          <div class="body" part="body"><slot></slot></div>
          <div class="foot" part="footer"><slot name="footer"></slot></div>
        </div>
      </dialog>`;
    this.#d = root.querySelector('dialog');
    this.#foot = root.querySelector('.foot');
    root.querySelector('slot[name=footer]').addEventListener('slotchange', () => this.#sync());
    root.querySelector('.x').addEventListener('click', () => this.close());
    this.#d.addEventListener('click', (e) => {
      if (e.target === this.#d && !this.hasAttribute('persistent')) this.close();
    });
    this.#d.addEventListener('cancel', (e) => {
      if (this.hasAttribute('persistent')) e.preventDefault();
    });
    this.#d.addEventListener('close', () => {
      this.removeAttribute('open');
      this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
    });
  }

  get open() { return this.hasAttribute('open'); }
  set open(v) { this.toggleAttribute('open', !!v); }
  show() { this.open = true; }
  close() { this.open = false; }

  connectedCallback() {
    this.#sync();
    if (this.open && !this.#d.open) this.#d.showModal();
  }

  attributeChangedCallback(_, __, v) {
    if (!this.isConnected) return;
    if (v !== null) {
      if (!this.#d.open) {
        this.#d.showModal();
        this.dispatchEvent(new CustomEvent('open', { bubbles: true, composed: true }));
      }
    } else if (this.#d.open) this.#d.close();
  }

  #sync() {
    const nodes = this.shadowRoot.querySelector('slot[name=footer]').assignedNodes({ flatten: true });
    this.#foot.hidden = !nodes.some((n) => n.nodeType === 1 || n.textContent.trim());
  }
}

define('ui-dialog', UIDialog);
export { UIDialog };
