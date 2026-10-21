import { define } from '../core/define.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};
const MISSING = 'Agrega al menos una etiqueta';
const css = `
:host{display:block;font-size:var(--ui-tag-input-size,16px);-webkit-tap-highlight-color:transparent}
:host([hidden]){display:none!important}
:host([size=sm]){font-size:13px}
:host([size=lg]){font-size:19px}
*{box-sizing:border-box}
[hidden]{display:none!important}
.field{padding:.55em .8em .6em 1em;min-height:3.4em;border-radius:.9em;cursor:text;
  background:var(--ui-input-bg,color-mix(in srgb,currentColor 6%,transparent));
  box-shadow:inset 0 0 0 .08em var(--ui-input-border,color-mix(in srgb,currentColor 18%,transparent));transition:box-shadow .25s}
.field:hover{box-shadow:inset 0 0 0 .08em color-mix(in srgb,currentColor 32%,transparent)}
.field:focus-within{box-shadow:inset 0 0 0 .13em var(--ui-accent,#6366f1),0 0 0 .3em color-mix(in srgb,var(--ui-accent,#6366f1) 22%,transparent)}
.field.invalid,.field.invalid:hover{box-shadow:inset 0 0 0 .13em var(--ui-danger,#ef4444)}
:host([disabled]) .field{opacity:.5;pointer-events:none}
.lbl{display:block;font-size:.75em;opacity:.7;margin-bottom:.3em;transition:color .2s,opacity .2s}
.field:focus-within .lbl{color:var(--ui-accent,#6366f1);opacity:1}
.invalid .lbl{color:var(--ui-danger,#ef4444)}
:host([required]) .lbl::after{content:" *"}
.row{display:flex;flex-wrap:wrap;align-items:center;gap:.4em}
.chip{display:inline-flex;align-items:center;gap:.15em;max-width:100%;padding:.25em .3em .25em .75em;border-radius:2em;font-size:.88em;font-weight:500;
  color:var(--ui-accent,#6366f1);background:color-mix(in srgb,var(--ui-accent,#6366f1) 13%,transparent);animation:pop .25s cubic-bezier(.34,1.5,.5,1)}
.chip span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.x{all:unset;display:grid;place-items:center;flex:none;width:1.45em;height:1.45em;border-radius:50%;cursor:pointer;opacity:.7;
  transition:opacity .2s,background-color .2s}
.x:hover{opacity:1;background:color-mix(in srgb,currentColor 18%,transparent)}
.x:focus-visible{outline:.15em solid currentColor;outline-offset:.05em}
.x svg{width:.9em;height:.9em;fill:none;stroke:currentColor;stroke-width:2.6;stroke-linecap:round}
.in{all:unset;box-sizing:border-box;flex:1;min-width:7em;padding:.3em 0;font:inherit;color:inherit}
.in::placeholder{color:currentColor;opacity:.4}
@keyframes pop{from{opacity:0;transform:scale(.8)}}
.msg{padding:.45em .25em 0;font-size:.82em;line-height:1.3;opacity:.65}
.msg:empty{display:none}
.msg.err{color:var(--ui-danger,#ef4444);opacity:1}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition-duration:.01ms!important}}
`;
const X = '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>';

class UITagInput extends Base {
  static formAssociated = true;
  static observedAttributes = ['value', 'label', 'placeholder', 'hint', 'error', 'required', 'disabled', 'max', 'allow-duplicates'];
  #internals; #field; #row; #in; #lbl; #msg;
  #tags = [];
  #touched = false;
  #flash = '';

  constructor() {
    super();
    this.#internals = this.attachInternals?.();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>${css}</style>
      <div class="field" part="field">
        <label class="lbl" for="i" part="label" hidden></label>
        <div class="row" part="row"><input class="in" part="input" id="i" autocomplete="off" /></div>
      </div>
      <div class="msg" part="message" id="m" aria-live="polite"></div>`;
    this.#field = root.querySelector('.field');
    this.#row = root.querySelector('.row');
    this.#in = root.querySelector('.in');
    this.#lbl = root.querySelector('.lbl');
    this.#msg = root.querySelector('.msg');

    this.#field.addEventListener('mousedown', (e) => {
      if (e.target === this.#field || e.target === this.#row) { e.preventDefault(); this.#in.focus(); }
    });
    this.#row.addEventListener('click', (e) => {
      const b = e.target.closest('.x');
      if (b) { this.#remove(Number(b.dataset.i)); this.#in.focus(); }
    });
    this.#in.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ',') {
        if (this.#in.value.trim() || e.key === ',') e.preventDefault();
        this.#commitText();
      } else if (e.key === 'Backspace' && !this.#in.value && this.#tags.length) this.#remove(this.#tags.length - 1);
    });
    this.#in.addEventListener('input', () => {
      this.#flash = '';
      if (/[,\n]/.test(this.#in.value)) {
        const parts = this.#in.value.split(/[,\n]/);
        const rest = parts.pop();
        this.#add(parts);
        this.#in.value = rest;
      }
      this.#validate();
    });
    this.#in.addEventListener('blur', () => { this.#commitText(); this.#touched = true; this.#validate(); });
    this.addEventListener('invalid', () => { this.#touched = true; this.#validate(); });
  }

  get tags() { return [...this.#tags]; }
  set tags(v) { this.#tags = this.#clean(Array.isArray(v) ? v : String(v ?? '').split(',')); this.#render(); }
  get value() { return this.#tags.join(','); }
  set value(v) { this.tags = v; }
  get disabled() { return this.hasAttribute('disabled'); }
  set disabled(v) { this.toggleAttribute('disabled', !!v); }
  checkValidity() { return this.#internals?.checkValidity(); }
  reportValidity() { return this.#internals?.reportValidity(); }
  focus(opts) { this.#in.focus(opts); }

  connectedCallback() { this.#render(); }

  attributeChangedCallback(name, _, v) {
    if (name === 'value') { this.#tags = this.#clean(String(v ?? '').split(',')); this.#render(); return; }
    if (name === 'label') { this.#lbl.textContent = v ?? ''; this.#lbl.hidden = !v; }
    else if (name === 'placeholder') this.#in.placeholder = v ?? '';
    else if (name === 'disabled') this.#in.disabled = this.disabled;
    this.#render();
  }

  formResetCallback() { this.#touched = false; this.#tags = this.#clean(String(this.getAttribute('value') ?? '').split(',')); this.#in.value = ''; this.#render(); }
  formDisabledCallback(d) { this.#in.disabled = d || this.disabled; }

  get #max() { const n = parseInt(this.getAttribute('max'), 10); return n > 0 ? n : Infinity; }
  #clean(list) {
    const out = [];
    for (const t of list.map((s) => String(s).trim()).filter(Boolean)) {
      if (!this.hasAttribute('allow-duplicates') && out.includes(t)) continue;
      if (out.length < this.#max) out.push(t);
    }
    return out;
  }
  #emit(type, detail) { this.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true })); }
  #commitText() {
    const t = this.#in.value;
    this.#in.value = '';
    this.#add([t]);
  }
  #add(list) {
    let added = false;
    for (const raw of list) {
      const tag = String(raw).trim();
      if (!tag) continue;
      if (this.#tags.length >= this.#max) { this.#reject(tag, 'max', `Máximo ${this.#max} etiquetas`); continue; }
      if (!this.hasAttribute('allow-duplicates') && this.#tags.includes(tag)) { this.#reject(tag, 'duplicate', `«${tag}» ya está`); continue; }
      this.#tags.push(tag);
      added = true;
      this.#emit('add', { tag });
    }
    if (added) { this.#flash = ''; this.#emit('change', { tags: this.tags }); }
    this.#render();
  }
  #reject(tag, reason, text) {
    this.#flash = text;
    this.#emit('reject', { tag, reason });
  }
  #remove(i) {
    const [tag] = this.#tags.splice(i, 1);
    if (tag === undefined) return;
    this.#flash = '';
    this.#emit('remove', { tag });
    this.#emit('change', { tags: this.tags });
    this.#render();
  }

  #render() {
    this.#row.querySelectorAll('.chip').forEach((c) => c.remove());
    this.#tags.forEach((t, i) => {
      const chip = document.createElement('span');
      chip.className = 'chip';
      chip.setAttribute('part', 'chip');
      const txt = document.createElement('span');
      txt.textContent = t;
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'x';
      b.tabIndex = -1;
      b.dataset.i = String(i);
      b.setAttribute('aria-label', `Quitar ${t}`);
      b.innerHTML = X;
      chip.append(txt, b);
      this.#row.insertBefore(chip, this.#in);
    });
    this.#validate();
  }
  #validate() {
    const err = this.getAttribute('error');
    const missing = this.hasAttribute('required') && !this.#tags.length;
    const i = this.#internals;
    i?.setFormValue(this.#tags.length ? this.#tags.join(',') : null);
    if (err) i?.setValidity({ customError: true }, err, this.#in);
    else if (missing) i?.setValidity({ valueMissing: true }, MISSING, this.#in);
    else i?.setValidity({});
    const shown = err || this.#flash || (this.#touched && missing ? MISSING : '');
    const text = shown || this.getAttribute('hint') || '';
    this.#msg.textContent = text;
    this.#msg.classList.toggle('err', !!shown);
    this.#field.classList.toggle('invalid', !!shown);
    this.#in.setAttribute('aria-invalid', String(!!shown));
    text ? this.#in.setAttribute('aria-describedby', 'm') : this.#in.removeAttribute('aria-describedby');
  }
}

define('ui-tag-input', UITagInput);
export { UITagInput };
