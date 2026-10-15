import { define } from '../core/define.js';
import { below } from '../core/breakpoints.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};
const len = (v) => (/^\d+(\.\d+)?$/.test(v) ? `${v}rem` : v);
const VARS = {
  'sidebar-width': '--ui-shell-sidebar-width',
  'aside-width': '--ui-shell-aside-width',
  'header-height': '--ui-shell-header-height',
  'rail-width': '--ui-shell-rail-width',
};
const line = '1px solid var(--ui-border,rgb(128 135 160/.2))';
const css = `
:host{display:block;min-height:100vh;--sw:var(--ui-shell-sidebar-width,16rem);--aw:var(--ui-shell-aside-width,18rem);
  --rw:var(--ui-shell-rail-width,4.5rem);--hh:var(--ui-shell-header-height,4rem);--c-sb:var(--sw);--c-as:var(--aw)}
:host([hidden]){display:none!important}
:host([collapsed]){--c-sb:0px}
:host([collapsed][rail]){--c-sb:var(--rw)}
*{box-sizing:border-box}
[hidden]{display:none!important}
.shell{display:grid;min-height:100vh;grid-template-columns:var(--c-sb) minmax(0,1fr) var(--c-as);grid-template-rows:auto 1fr auto;
  grid-template-areas:"header header header" "sidebar main aside" "sidebar footer aside";transition:grid-template-columns .3s}
.nosb{--c-sb:0px}
.noas{--c-as:0px}

header{grid-area:header;position:sticky;top:0;z-index:30;display:flex;align-items:center;gap:.75em;
  min-height:var(--hh);padding:0 1.25em;backdrop-filter:blur(14px);
  background:color-mix(in srgb,var(--ui-surface,Canvas) 82%,transparent);border-bottom:${line}}
.hs{flex:1;min-width:0;display:flex;align-items:center;gap:.75em}
.burger{all:unset;display:grid;place-items:center;flex:none;width:2.4em;height:2.4em;border-radius:.7em;cursor:pointer;
  transition:background-color .2s,transform .15s}
.burger:hover{background:color-mix(in srgb,currentColor 10%,transparent)}
.burger:active{transform:scale(.92)}
.burger:focus-visible{outline:.15em solid var(--ui-accent,#6366f1);outline-offset:.05em}
.burger svg{width:1.3em;height:1.3em;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round}
:host([no-burger]) .burger,.nosb .burger{display:none}

.sb,.as{position:sticky;top:var(--hh);align-self:start;height:calc(100dvh - var(--hh));overflow:auto;padding:1em;
  background:var(--ui-surface,Canvas)}
.sb{grid-area:sidebar;border-right:${line}}
.as{grid-area:aside;border-left:${line}}
:host([collapsed]) .sb{visibility:hidden;border-right-width:0}
:host([collapsed][rail]) .sb{visibility:visible;border-right-width:1px;padding-inline:.5em;overflow-x:hidden}
main{grid-area:main;min-width:0;padding:var(--ui-shell-padding,1.5em)}
footer{grid-area:footer;padding:1em 1.5em;border-top:${line}}

.scrim{display:none}
@media ${below('lg')}{
  .shell{--c-as:0px}
  .as{display:none}
}
@media ${below('md')}{
  .shell{--c-sb:0px;--c-as:0px;grid-template-columns:minmax(0,1fr);grid-template-areas:"header" "main" "footer"}
  .sb,:host([collapsed]) .sb,:host([collapsed][rail]) .sb{visibility:visible;position:fixed;z-index:50;top:0;left:0;bottom:0;
    height:auto;width:min(var(--sw),85vw);padding:1em;overflow:auto;transform:translateX(-100%);border-right-width:1px;
    transition:transform .35s cubic-bezier(.2,.8,.2,1),box-shadow .35s}
  :host([open]) .sb{transform:none;box-shadow:0 0 3em rgb(0 0 0/.4)}
  .scrim{display:block;position:fixed;inset:0;z-index:40;background:rgb(0 0 0/.45);opacity:0;pointer-events:none;
    transition:opacity .3s}
  :host([open]) .scrim{opacity:1;pointer-events:auto}
}
@media (prefers-reduced-motion:reduce){*{transition-duration:.01ms!important}}
`;

class UIAppShell extends Base {
  static observedAttributes = ['collapsed', 'rail', ...Object.keys(VARS)];
  #shell; #sb; #as; #footer; #mq; #onMq;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>${css}</style>
      <div class="shell" part="shell">
        <header part="header">
          <button class="burger" part="menu" type="button" aria-label="Menú">
            <svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
          </button>
          <div class="hs"><slot name="header"></slot></div>
        </header>
        <aside class="sb" part="sidebar"><slot name="sidebar"></slot></aside>
        <main part="main"><slot></slot></main>
        <aside class="as" part="aside"><slot name="aside"></slot></aside>
        <footer part="footer"><slot name="footer"></slot></footer>
      </div>
      <div class="scrim" part="scrim"></div>`;
    this.#shell = root.querySelector('.shell');
    this.#sb = root.querySelector('.sb');
    this.#as = root.querySelector('.as');
    this.#footer = root.querySelector('footer');
    this.#mq = typeof matchMedia !== 'undefined' ? matchMedia(below('md')) : null;
    this.#onMq = () => this.#railSync();

    root.querySelectorAll('slot').forEach((s) => s.addEventListener('slotchange', () => this.#sync()));
    root.querySelector('.burger').addEventListener('click', () => this.toggle());
    root.querySelector('.scrim').addEventListener('click', () => this.close());
    this.#sb.addEventListener('click', (e) => { if (e.target.closest?.('a')) this.close(); });
    this.addEventListener('keydown', (e) => { if (e.key === 'Escape') this.close(); });
  }

  get mobile() { return !!this.#mq?.matches; }

  toggle() {
    this.mobile ? this.toggleAttribute('open') : this.toggleAttribute('collapsed');
    this.dispatchEvent(new CustomEvent('toggle', {
      detail: { open: this.hasAttribute('open'), collapsed: this.hasAttribute('collapsed') },
    }));
  }
  close() {
    if (this.mobile && this.hasAttribute('open')) this.removeAttribute('open');
  }

  connectedCallback() {
    this.#mq?.addEventListener?.('change', this.#onMq);
    this.#sync();
  }
  disconnectedCallback() { this.#mq?.removeEventListener?.('change', this.#onMq); }

  attributeChangedCallback(name, _, v) {
    if (VARS[name]) {
      v ? this.style.setProperty(VARS[name], len(v)) : this.style.removeProperty(VARS[name]);
      return;
    }
    this.#railSync();
  }

  #has(slot) {
    return slot.assignedNodes({ flatten: true }).some((n) => n.nodeType === 1 || n.textContent.trim());
  }

  #sync() {
    const r = this.shadowRoot;
    const sb = this.#has(r.querySelector('slot[name=sidebar]'));
    const as = this.#has(r.querySelector('slot[name=aside]'));
    this.#sb.hidden = !sb;
    this.#as.hidden = !as;
    this.#footer.hidden = !this.#has(r.querySelector('slot[name=footer]'));
    this.#shell.classList.toggle('nosb', !sb);
    this.#shell.classList.toggle('noas', !as);
    this.#railSync();
  }

  // En modo rail colapsado, los ui-nav del sidebar muestran solo iconos.
  #railSync() {
    const on = this.hasAttribute('rail') && this.hasAttribute('collapsed') && !this.mobile;
    this.querySelectorAll('[slot=sidebar] ui-nav, ui-nav[slot=sidebar]').forEach((n) => n.toggleAttribute('rail', on));
  }
}

define('ui-app-shell', UIAppShell);
export { UIAppShell };
