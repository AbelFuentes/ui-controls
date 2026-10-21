import { define } from '../core/define.js';
import { place } from '../core/position.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};
const norm = (s) => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const MISSING = 'Selecciona una opción';
const X = '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>';
const CHEV = '<svg class="chev" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>';

const css = `
:host{display:block;font-size:var(--ui-combobox-size,16px);-webkit-tap-highlight-color:transparent}
:host([hidden]){display:none!important}
:host([size=sm]){font-size:13px}
:host([size=lg]){font-size:19px}
*{box-sizing:border-box}
[hidden]{display:none!important}
.field{position:relative;display:flex;align-items:center;gap:.4em;padding:0 .5em 0 1em;min-height:3.4em;border-radius:.9em;
  background:var(--ui-input-bg,color-mix(in srgb,currentColor 6%,transparent));
  box-shadow:inset 0 0 0 .08em var(--ui-input-border,color-mix(in srgb,currentColor 18%,transparent));transition:box-shadow .25s}
.field:hover{box-shadow:inset 0 0 0 .08em color-mix(in srgb,currentColor 32%,transparent)}
.field:focus-within{box-shadow:inset 0 0 0 .13em var(--ui-accent,#6366f1),0 0 0 .3em color-mix(in srgb,var(--ui-accent,#6366f1) 22%,transparent)}
.field.invalid,.field.invalid:hover{box-shadow:inset 0 0 0 .13em var(--ui-danger,#ef4444)}
.field.invalid:focus-within{box-shadow:inset 0 0 0 .13em var(--ui-danger,#ef4444),0 0 0 .3em color-mix(in srgb,var(--ui-danger,#ef4444) 22%,transparent)}
:host([disabled]) .field{opacity:.5;pointer-events:none}
.box{position:relative;flex:1;min-width:0;height:3.4em}
.in{all:unset;display:block;box-sizing:border-box;width:100%;height:100%;padding-top:1em;font:inherit;color:inherit;
  text-overflow:ellipsis;white-space:nowrap;overflow:hidden}
.nolabel .in{padding-top:0}
.in::placeholder{color:currentColor;opacity:0;transition:opacity .2s}
.in:focus::placeholder,.nolabel .in::placeholder{opacity:.4}
.lbl{position:absolute;left:0;top:50%;transform:translateY(-50%);transform-origin:left;pointer-events:none;white-space:nowrap;opacity:.6;
  transition:transform .25s cubic-bezier(.4,0,.2,1),opacity .2s,color .2s}
.in:focus ~ .lbl,.in:not(:placeholder-shown) ~ .lbl{transform:translateY(calc(-50% - .85em)) scale(.75);opacity:.85}
.field:focus-within .lbl{color:var(--ui-accent,#6366f1);opacity:1}
.invalid .lbl{color:var(--ui-danger,#ef4444)}
:host([required]) .lbl::after{content:" *"}
.btn{all:unset;display:grid;place-items:center;flex:none;width:1.9em;height:1.9em;border-radius:.6em;cursor:pointer;opacity:.6;
  transition:opacity .2s,background-color .2s}
.btn:hover{opacity:1;background:color-mix(in srgb,currentColor 10%,transparent)}
.btn svg{width:1.15em;height:1.15em;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.chev{transition:transform .3s cubic-bezier(.34,1.4,.5,1)}
.open .chev{transform:rotate(180deg)}
.menu{position:fixed;inset:auto;margin:0;padding:.35em;list-style:none;max-height:16em;overflow:auto;border:0;border-radius:.9em;
  background:var(--ui-surface,Canvas);color:var(--ui-text,CanvasText);font-size:var(--ui-combobox-size,16px);
  box-shadow:0 0 0 1px color-mix(in srgb,currentColor 14%,transparent),0 1em 2.5em rgb(0 0 0/.3)}
.menu:popover-open{animation:in .18s cubic-bezier(.2,.9,.3,1.2)}
@keyframes in{from{opacity:0;transform:translateY(-.3em) scale(.97)}}
.opt{display:flex;align-items:center;gap:.6em;padding:.65em .8em;border-radius:.6em;cursor:pointer;line-height:1.2}
.opt.active{background:color-mix(in srgb,var(--ui-accent,#6366f1) 14%,transparent)}
.opt[aria-selected=true]{font-weight:600;color:var(--ui-accent,#6366f1)}
.opt[aria-disabled=true]{opacity:.4;cursor:not-allowed}
.opt mark{background:none;color:inherit;font-weight:700;text-decoration:underline;
  text-decoration-color:var(--ui-accent,#6366f1);text-underline-offset:.2em}
.none{padding:.9em .8em;opacity:.6;text-align:center;font-size:.92em}
.msg{padding:.45em .25em 0;font-size:.82em;line-height:1.3;opacity:.65}
.msg:empty{display:none}
.msg.err{color:var(--ui-danger,#ef4444);opacity:1}
@media (prefers-reduced-motion:reduce){*{transition-duration:.01ms!important;animation:none!important}}
`;

class UICombobox extends Base {
  static formAssociated = true;
  static observedAttributes = ['value', 'label', 'placeholder', 'hint', 'error', 'required', 'disabled', 'empty', 'clearable', 'allow-custom'];
  #internals; #field; #in; #lbl; #menu; #msg; #clr; #mo;
  #value = '';
  #typed = false;
  #open = false;
  #active = -1;
  #touched = false;
  #list = [];

  constructor() {
    super();
    this.#internals = this.attachInternals?.();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>${css}</style>
      <div class="field nolabel" part="field">
        <div class="box">
          <input class="in" part="input" id="i" role="combobox" aria-autocomplete="list" aria-expanded="false"
            aria-controls="lb" autocomplete="off" spellcheck="false" placeholder=" " />
          <label class="lbl" for="i" part="label"></label>
        </div>
        <button class="btn clr" part="clear" type="button" aria-label="Borrar" tabindex="-1" hidden>${X}</button>
        <button class="btn tog" part="toggle" type="button" aria-label="Mostrar opciones" tabindex="-1">${CHEV}</button>
      </div>
      <ul class="menu" id="lb" part="menu" role="listbox" popover="manual"></ul>
      <div class="msg" part="message" id="m" aria-live="polite"></div>`;
    this.#field = root.querySelector('.field');
    this.#in = root.querySelector('.in');
    this.#lbl = root.querySelector('.lbl');
    this.#menu = root.querySelector('.menu');
    this.#msg = root.querySelector('.msg');
    this.#clr = root.querySelector('.clr');

    this.#in.addEventListener('input', () => this.#onInput());
    this.#in.addEventListener('keydown', (e) => this.#onKey(e));
    this.#in.addEventListener('focus', () => { this.#touched = false; });
    this.#in.addEventListener('blur', () => this.#onBlur());
    root.querySelectorAll('.btn').forEach((b) => b.addEventListener('mousedown', (e) => e.preventDefault()));
    this.#clr.addEventListener('click', () => { this.#choose('', ''); this.#in.focus(); });
    root.querySelector('.tog').addEventListener('click', () => {
      if (this.#open) this.#close();
      else { this.#in.focus(); this.#openMenu(); }
    });
    this.#menu.addEventListener('mousedown', (e) => e.preventDefault());
    this.#menu.addEventListener('click', (e) => {
      const li = e.target.closest('.opt');
      if (li) this.#commit(Number(li.dataset.i));
    });
    this.#menu.addEventListener('mousemove', (e) => {
      const li = e.target.closest('.opt');
      if (li && Number(li.dataset.i) !== this.#active && li.getAttribute('aria-disabled') !== 'true') this.#setActive(Number(li.dataset.i), false);
    });
    this.addEventListener('invalid', () => { this.#touched = true; this.#validate(); });
    this.#mo = new MutationObserver(() => { this.#syncText(); if (this.#open) this.#renderMenu(); });
  }

  get value() { return this.#value; }
  set value(v) { v ? this.setAttribute('value', v) : this.removeAttribute('value'); }
  get query() { return this.#in.value; }
  get disabled() { return this.hasAttribute('disabled'); }
  set disabled(v) { this.toggleAttribute('disabled', !!v); }
  checkValidity() { return this.#internals?.checkValidity(); }
  reportValidity() { return this.#internals?.reportValidity(); }
  focus(opts) { this.#in.focus(opts); }

  connectedCallback() {
    this.#mo.observe(this, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['value', 'disabled'] });
    this.#value = this.getAttribute('value') ?? '';
    this.#syncText();
    this.#validate();
  }
  disconnectedCallback() {
    this.#mo.disconnect();
    this.#unlisten();
  }

  attributeChangedCallback(name, _, v) {
    if (name === 'value') { this.#value = v ?? ''; this.#syncText(); }
    else if (name === 'label') { this.#lbl.textContent = v ?? ''; this.#field.classList.toggle('nolabel', !v); }
    else if (name === 'placeholder') this.#in.placeholder = v || ' ';
    else if (name === 'disabled') { this.#in.disabled = this.disabled; if (this.disabled) this.#close(); }
    this.#validate();
  }

  formResetCallback() { this.#touched = false; this.removeAttribute('value'); }
  formDisabledCallback(d) { this.#in.disabled = d || this.disabled; }

  get #options() {
    return [...this.querySelectorAll('option')].map((o) => ({ value: o.value, label: o.textContent.trim(), disabled: o.disabled }));
  }
  #labelOf(v) {
    return this.#options.find((o) => o.value === v)?.label ?? (this.hasAttribute('allow-custom') ? v : '');
  }
  #syncText() {
    if (this.#typed) return;
    this.#in.value = this.#value ? this.#labelOf(this.#value) : '';
    this.#ui();
  }
  #ui() {
    this.#clr.hidden = !(this.hasAttribute('clearable') && (this.#value || this.#in.value));
  }

  /* ───────── menú ───────── */
  #filter() {
    const q = this.#typed ? norm(this.#in.value.trim()) : '';
    return this.#options.filter((o) => !q || norm(o.label).includes(q));
  }
  #renderMenu() {
    const q = this.#typed ? this.#in.value.trim() : '';
    this.#list = this.#filter();
    if (!this.#list.length) {
      const li = document.createElement('li');
      li.className = 'none';
      li.setAttribute('role', 'presentation');
      li.textContent = this.getAttribute('empty') ?? 'Sin resultados';
      this.#menu.replaceChildren(li);
      this.#active = -1;
      this.#in.removeAttribute('aria-activedescendant');
      return;
    }
    this.#menu.replaceChildren(...this.#list.map((o, i) => {
      const li = document.createElement('li');
      li.className = 'opt';
      li.id = `o${i}`;
      li.dataset.i = String(i);
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', String(o.value === this.#value));
      if (o.disabled) li.setAttribute('aria-disabled', 'true');
      const at = q ? norm(o.label).indexOf(norm(q)) : -1;
      if (at >= 0) {
        const mark = document.createElement('mark');
        mark.textContent = o.label.slice(at, at + q.length);
        li.append(o.label.slice(0, at), mark, o.label.slice(at + q.length));
      } else li.textContent = o.label;
      return li;
    }));
    const sel = this.#typed ? -1 : this.#list.findIndex((o) => o.value === this.#value && !o.disabled);
    this.#setActive(sel >= 0 ? sel : this.#list.findIndex((o) => !o.disabled));
  }
  #setActive(i, scroll = true) {
    this.#active = i;
    this.#menu.querySelectorAll('.opt').forEach((li, k) => li.classList.toggle('active', k === i));
    const li = this.#menu.children[i];
    li?.classList?.contains('opt') ? this.#in.setAttribute('aria-activedescendant', li.id) : this.#in.removeAttribute('aria-activedescendant');
    if (li && scroll && li.scrollIntoView) li.scrollIntoView({ block: 'nearest' });
  }
  #move(dir) {
    const ok = this.#list.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0);
    if (!ok.length) return;
    let p = ok.indexOf(this.#active);
    p = p < 0 ? (dir > 0 ? 0 : ok.length - 1) : (p + dir + ok.length) % ok.length;
    this.#setActive(ok[p]);
  }
  #place() {
    this.#menu.style.minWidth = `${this.#field.offsetWidth}px`;
    place(this.#menu, this.#field, 'bottom-start', 6);
  }
  #openMenu() {
    if (this.#open || this.disabled) return;
    this.#open = true;
    this.#renderMenu();
    this.#menu.showPopover();
    this.#place();
    this.#field.classList.add('open');
    this.#in.setAttribute('aria-expanded', 'true');
    document.addEventListener('pointerdown', this.#onDoc, true);
    addEventListener('resize', this.#onMove);
    addEventListener('scroll', this.#onMove, true);
  }
  #close() {
    if (!this.#open) return;
    this.#open = false;
    this.#menu.hidePopover();
    this.#field.classList.remove('open');
    this.#in.setAttribute('aria-expanded', 'false');
    this.#in.removeAttribute('aria-activedescendant');
    this.#unlisten();
  }
  #unlisten() {
    document.removeEventListener('pointerdown', this.#onDoc, true);
    removeEventListener('resize', this.#onMove);
    removeEventListener('scroll', this.#onMove, true);
  }
  #onDoc = (e) => { if (!e.composedPath().includes(this)) this.#close(); };
  #onMove = () => { if (this.#open) this.#place(); };

  /* ───────── interacción ───────── */
  #onInput() {
    this.#typed = true;
    const text = this.#in.value;
    if (!text && this.#value) this.#choose('', '', true);
    this.#ui();
    if (!this.#open) this.#openMenu();
    else { this.#renderMenu(); this.#place(); }
  }
  #onKey(e) {
    const k = e.key;
    if (k === 'ArrowDown' || k === 'ArrowUp') {
      e.preventDefault();
      if (!this.#open) this.#openMenu();
      else this.#move(k === 'ArrowDown' ? 1 : -1);
    } else if (k === 'Enter') {
      if (this.#open && this.#active >= 0) { e.preventDefault(); this.#commit(this.#active); }
      else if (this.hasAttribute('allow-custom') && this.#in.value.trim()) { e.preventDefault(); this.#commitCustom(); }
    } else if (k === 'Escape') {
      if (this.#open) { e.preventDefault(); this.#close(); }
      else this.#revert();
    } else if (k === 'Tab') this.#close();
  }
  #onBlur() {
    this.#touched = true;
    if (this.#typed) {
      if (this.hasAttribute('allow-custom') && this.#in.value.trim()) this.#commitCustom();
      else this.#revert();
    }
    this.#close();
    this.#validate();
  }
  #revert() {
    this.#typed = false;
    this.#in.value = this.#value ? this.#labelOf(this.#value) : '';
    this.#ui();
  }
  #commit(i) {
    const o = this.#list[i];
    if (!o || o.disabled) return;
    this.#close();
    this.#choose(o.value, o.label);
  }
  #commitCustom() {
    const t = this.#in.value.trim();
    this.#close();
    this.#choose(t, t);
  }
  #choose(value, label, keepTyping = false) {
    const changed = value !== this.#value;
    this.#typed = keepTyping;
    value ? this.setAttribute('value', value) : this.removeAttribute('value');
    if (!keepTyping) this.#in.value = label;
    this.#ui();
    if (changed) {
      this.dispatchEvent(new CustomEvent('change', { detail: { value, label }, bubbles: true, composed: true }));
    }
  }

  #validate() {
    const err = this.getAttribute('error');
    const missing = this.hasAttribute('required') && !this.#value;
    const i = this.#internals;
    i?.setFormValue(this.#value || null);
    if (err) i?.setValidity({ customError: true }, err, this.#in);
    else if (missing) i?.setValidity({ valueMissing: true }, MISSING, this.#in);
    else i?.setValidity({});
    const shown = err || (this.#touched && missing ? MISSING : '');
    const text = shown || this.getAttribute('hint') || '';
    this.#msg.textContent = text;
    this.#msg.classList.toggle('err', !!shown);
    this.#field.classList.toggle('invalid', !!shown);
    this.#in.setAttribute('aria-invalid', String(!!shown));
    text ? this.#in.setAttribute('aria-describedby', 'm') : this.#in.removeAttribute('aria-describedby');
  }
}

define('ui-combobox', UICombobox);
export { UICombobox };
