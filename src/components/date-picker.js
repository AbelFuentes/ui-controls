import { define } from '../core/define.js';
import { place } from '../core/position.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};
const pad = (n) => String(n).padStart(2, '0');
const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parse = (s) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || '');
  if (!m) return null;
  const d = new Date(+m[1], +m[2] - 1, +m[3]);
  return d.getMonth() === +m[2] - 1 ? d : null;
};
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const addMonths = (d, n) => {
  const t = new Date(d.getFullYear(), d.getMonth() + n, 1);
  t.setDate(Math.min(d.getDate(), new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate()));
  return t;
};
const sameDay = (a, b) => !!a && !!b && iso(a) === iso(b);
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const MISSING = 'Elige una fecha';
const ICON = '<svg class="cal" viewBox="0 0 24 24"><path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4"/></svg>';
const X = '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>';
const LEFT = '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>';
const RIGHT = '<svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>';

const css = `
:host{display:block;font-size:var(--ui-date-size,16px);-webkit-tap-highlight-color:transparent}
:host([hidden]){display:none!important}
:host([size=sm]){font-size:13px}
:host([size=lg]){font-size:19px}
*{box-sizing:border-box}
[hidden]{display:none!important}
.wrap{position:relative}
.field{all:unset;box-sizing:border-box;width:100%;display:flex;align-items:center;gap:.6em;padding:0 1em;min-height:3.4em;border-radius:.9em;cursor:pointer;
  background:var(--ui-input-bg,color-mix(in srgb,currentColor 6%,transparent));
  box-shadow:inset 0 0 0 .08em var(--ui-input-border,color-mix(in srgb,currentColor 18%,transparent));transition:box-shadow .25s}
.field:hover{box-shadow:inset 0 0 0 .08em color-mix(in srgb,currentColor 32%,transparent)}
.field:focus-visible,.open .field{box-shadow:inset 0 0 0 .13em var(--ui-accent,#6366f1),0 0 0 .3em color-mix(in srgb,var(--ui-accent,#6366f1) 22%,transparent)}
.invalid .field{box-shadow:inset 0 0 0 .13em var(--ui-danger,#ef4444)}
:host([disabled]) .wrap{opacity:.5;pointer-events:none}
.box{position:relative;flex:1;min-width:0;height:3.4em}
.val{position:absolute;left:0;right:0;top:1.15em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height:1.3;transition:opacity .2s}
.nolabel .val{top:50%;transform:translateY(-50%)}
.val.ph{opacity:0}
.open .val.ph,.nolabel .val.ph{opacity:.4}
.lbl{position:absolute;left:0;top:50%;transform:translateY(-50%);transform-origin:left;pointer-events:none;white-space:nowrap;opacity:.6;
  transition:transform .25s cubic-bezier(.4,0,.2,1),opacity .2s,color .2s}
.float .lbl{transform:translateY(calc(-50% - .85em)) scale(.75);opacity:.85}
.open .lbl,.field:focus-visible .lbl{color:var(--ui-accent,#6366f1);opacity:1}
.invalid .lbl{color:var(--ui-danger,#ef4444)}
:host([required]) .lbl::after{content:" *"}
.cal{flex:none;width:1.25em;height:1.25em;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;opacity:.6}
.clr{all:unset;position:absolute;right:2.9em;top:50%;transform:translateY(-50%);display:grid;place-items:center;width:1.8em;height:1.8em;
  border-radius:.6em;cursor:pointer;opacity:.6;transition:opacity .2s,background-color .2s}
.clr:hover{opacity:1;background:color-mix(in srgb,currentColor 10%,transparent)}
.clr:focus-visible{outline:.15em solid var(--ui-accent,#6366f1);outline-offset:.05em}
.clr svg{width:1.1em;height:1.1em;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round}

.pop{position:fixed;inset:auto;margin:0;width:20em;padding:.8em;border:0;border-radius:1.1em;font-size:var(--ui-date-size,16px);
  background:var(--ui-surface,Canvas);color:var(--ui-text,CanvasText);
  box-shadow:0 0 0 1px color-mix(in srgb,currentColor 14%,transparent),0 1em 2.5em rgb(0 0 0/.3)}
.pop:popover-open{animation:in .18s cubic-bezier(.2,.9,.3,1.2)}
@keyframes in{from{opacity:0;transform:translateY(-.3em) scale(.97)}}
.hd{display:flex;align-items:center;gap:.25em;margin-bottom:.55em}
.ttl{flex:1;text-align:center;font-weight:650}
.nav{all:unset;display:grid;place-items:center;width:2.1em;height:2.1em;border-radius:.6em;cursor:pointer;transition:background-color .2s}
.nav:hover{background:color-mix(in srgb,currentColor 10%,transparent)}
.nav:focus-visible,.link:focus-visible{outline:.15em solid var(--ui-accent,#6366f1);outline-offset:.05em}
.nav svg{width:1.2em;height:1.2em;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.grid{display:grid;grid-template-columns:repeat(7,1fr);gap:.15em}
.dow{text-align:center;font-size:.7em;font-weight:600;color:var(--ui-muted,inherit);padding:.5em 0;text-transform:uppercase;letter-spacing:.04em}
.day{all:unset;box-sizing:border-box;display:grid;place-items:center;aspect-ratio:1;border-radius:.65em;cursor:pointer;font-size:.9em;
  font-variant-numeric:tabular-nums;transition:background-color .15s,transform .15s}
.day:hover{background:color-mix(in srgb,currentColor 9%,transparent)}
.day:active{transform:scale(.92)}
.day.out{opacity:.4}
.day[aria-current=date]{box-shadow:inset 0 0 0 .1em var(--ui-accent,#6366f1)}
.day[aria-selected=true]{background:linear-gradient(135deg,var(--ui-accent,#6366f1),var(--ui-accent-2,#a855f7));color:#fff;font-weight:700;opacity:1}
.day:disabled{opacity:.22;cursor:not-allowed;pointer-events:none}
.day:focus-visible{outline:.15em solid var(--ui-accent,#6366f1);outline-offset:.05em}
.ft{display:flex;justify-content:space-between;margin-top:.5em}
.link{all:unset;cursor:pointer;color:var(--ui-accent,#6366f1);font-size:.85em;font-weight:600;padding:.45em .7em;border-radius:.55em;transition:background-color .2s}
.link:hover{background:color-mix(in srgb,var(--ui-accent,#6366f1) 12%,transparent)}
.link:disabled{opacity:.35;pointer-events:none}
.msg{padding:.45em .25em 0;font-size:.82em;line-height:1.3;opacity:.65}
.msg:empty{display:none}
.msg.err{color:var(--ui-danger,#ef4444);opacity:1}
@media (prefers-reduced-motion:reduce){*{transition-duration:.01ms!important;animation:none!important}}
`;

class UIDatePicker extends Base {
  static formAssociated = true;
  static observedAttributes = ['value', 'min', 'max', 'label', 'placeholder', 'hint', 'error', 'required', 'disabled', 'locale', 'week-start', 'clearable'];
  #internals; #wrap; #field; #val; #lbl; #pop; #grid; #ttl; #msg; #clr; #today;
  #value = '';
  #view = null;
  #focus = null;
  #open = false;
  #touched = false;

  constructor() {
    super();
    this.#internals = this.attachInternals?.();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>${css}</style>
      <div class="wrap nolabel" part="wrap">
        <button class="field" part="field" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="p">
          <span class="box"><span class="val" part="value"></span><span class="lbl" part="label"></span></span>${ICON}
        </button>
        <button class="clr" part="clear" type="button" aria-label="Borrar fecha" hidden>${X}</button>
        <div class="pop" id="p" part="calendar" popover="manual" role="dialog" aria-label="Calendario">
          <div class="hd">
            <button class="nav prev" type="button" aria-label="Mes anterior">${LEFT}</button>
            <div class="ttl" aria-live="polite"></div>
            <button class="nav next" type="button" aria-label="Mes siguiente">${RIGHT}</button>
          </div>
          <div class="grid" role="group"></div>
          <div class="ft"><button class="link today" type="button">Hoy</button><button class="link none" type="button">Borrar</button></div>
        </div>
      </div>
      <div class="msg" part="message" id="m" aria-live="polite"></div>`;
    this.#wrap = root.querySelector('.wrap');
    this.#field = root.querySelector('.field');
    this.#val = root.querySelector('.val');
    this.#lbl = root.querySelector('.lbl');
    this.#pop = root.querySelector('.pop');
    this.#grid = root.querySelector('.grid');
    this.#ttl = root.querySelector('.ttl');
    this.#msg = root.querySelector('.msg');
    this.#clr = root.querySelector('.clr');
    this.#today = root.querySelector('.today');

    this.#field.addEventListener('click', () => (this.#open ? this.close() : this.open()));
    this.#field.addEventListener('keydown', (e) => {
      if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && !this.#open) { e.preventDefault(); this.open(); }
    });
    this.#clr.addEventListener('click', () => { this.#choose(''); this.#field.focus(); });
    root.querySelector('.prev').addEventListener('click', () => this.#shift(-1));
    root.querySelector('.next').addEventListener('click', () => this.#shift(1));
    root.querySelector('.none').addEventListener('click', () => { this.#choose(''); this.close(); });
    this.#today.addEventListener('click', () => this.#select(this.#clamp(this.#now())));
    this.#grid.addEventListener('click', (e) => {
      const b = e.target.closest('.day');
      if (b && !b.disabled) this.#select(parse(b.dataset.d));
    });
    this.#pop.addEventListener('keydown', (e) => this.#onKey(e));
    this.#pop.addEventListener('focusout', () => setTimeout(() => this.#maybeClose(), 0));
    this.#field.addEventListener('blur', () => { this.#touched = true; this.#validate(); setTimeout(() => this.#maybeClose(), 0); });
    this.addEventListener('invalid', () => { this.#touched = true; this.#validate(); });
  }

  get value() { return this.#value; }
  set value(v) { v ? this.setAttribute('value', v) : this.removeAttribute('value'); }
  get valueAsDate() { return parse(this.#value); }
  get disabled() { return this.hasAttribute('disabled'); }
  set disabled(v) { this.toggleAttribute('disabled', !!v); }
  checkValidity() { return this.#internals?.checkValidity(); }
  reportValidity() { return this.#internals?.reportValidity(); }
  focus(opts) { this.#field.focus(opts); }

  connectedCallback() {
    this.#value = parse(this.getAttribute('value')) ? this.getAttribute('value') : '';
    this.#paint();
  }
  disconnectedCallback() { this.#unlisten(); }

  attributeChangedCallback(name, _, v) {
    if (name === 'value') this.#value = parse(v) ? v : '';
    else if (name === 'label') { this.#lbl.textContent = v ?? ''; this.#wrap.classList.toggle('nolabel', !v); }
    else if (name === 'disabled') { this.#field.disabled = this.disabled; if (this.disabled) this.close(false); }
    this.#paint();
    if (this.#open) this.#renderCal();
  }

  formResetCallback() { this.#touched = false; this.removeAttribute('value'); }
  formDisabledCallback(d) { this.#field.disabled = d || this.disabled; }

  /* ───────── helpers ───────── */
  get #loc() { return this.getAttribute('locale') || document.documentElement.lang || (typeof navigator !== 'undefined' && navigator.language) || 'es-MX'; }
  get #ws() { return this.getAttribute('week-start') === '0' ? 0 : 1; }
  get #min() { return parse(this.getAttribute('min')); }
  get #max() { return parse(this.getAttribute('max')); }
  #now() { const t = new Date(); return new Date(t.getFullYear(), t.getMonth(), t.getDate()); }
  #inRange(d) { return !(this.#min && d < this.#min) && !(this.#max && d > this.#max); }
  #clamp(d) { return this.#min && d < this.#min ? this.#min : this.#max && d > this.#max ? this.#max : d; }
  #fmt(d) { return d.toLocaleDateString(this.#loc, { day: 'numeric', month: 'short', year: 'numeric' }); }

  /* ───────── campo ───────── */
  #paint() {
    const d = parse(this.#value);
    this.#val.textContent = d ? this.#fmt(d) : this.getAttribute('placeholder') ?? 'Selecciona una fecha';
    this.#val.classList.toggle('ph', !d);
    this.#wrap.classList.toggle('float', !!d || this.#open);
    this.#clr.hidden = !(this.hasAttribute('clearable') && d);
    this.#validate();
  }
  #validate() {
    const err = this.getAttribute('error');
    const d = parse(this.#value);
    const missing = this.hasAttribute('required') && !d;
    const under = d && this.#min && d < this.#min;
    const over = d && this.#max && d > this.#max;
    const i = this.#internals;
    i?.setFormValue(this.#value || null);
    if (err) i?.setValidity({ customError: true }, err, this.#field);
    else if (missing) i?.setValidity({ valueMissing: true }, MISSING, this.#field);
    else if (under) i?.setValidity({ rangeUnderflow: true }, `Desde ${this.#fmt(this.#min)}`, this.#field);
    else if (over) i?.setValidity({ rangeOverflow: true }, `Hasta ${this.#fmt(this.#max)}`, this.#field);
    else i?.setValidity({});
    const shown = err || (this.#touched && missing ? MISSING : '') || (under ? `Desde ${this.#fmt(this.#min)}` : '') || (over ? `Hasta ${this.#fmt(this.#max)}` : '');
    const text = shown || this.getAttribute('hint') || '';
    this.#msg.textContent = text;
    this.#msg.classList.toggle('err', !!shown);
    this.#wrap.classList.toggle('invalid', !!shown);
    this.#field.setAttribute('aria-invalid', String(!!shown));
    text ? this.#field.setAttribute('aria-describedby', 'm') : this.#field.removeAttribute('aria-describedby');
  }
  #choose(value) {
    const changed = value !== this.#value;
    value ? this.setAttribute('value', value) : this.removeAttribute('value');
    if (changed) this.dispatchEvent(new CustomEvent('change', { detail: { value }, bubbles: true, composed: true }));
  }
  #select(d) {
    if (!d || !this.#inRange(d)) return;
    this.#choose(iso(d));
    this.close();
  }

  /* ───────── calendario ───────── */
  open() {
    if (this.#open || this.disabled) return;
    this.#open = true;
    const base = parse(this.#value) ?? this.#clamp(this.#now());
    this.#view = new Date(base.getFullYear(), base.getMonth(), 1);
    this.#focus = base;
    this.#renderCal();
    this.#pop.showPopover();
    place(this.#pop, this.#field, 'bottom-start', 6);
    this.#wrap.classList.add('open', 'float');
    this.#field.setAttribute('aria-expanded', 'true');
    document.addEventListener('pointerdown', this.#onDoc, true);
    addEventListener('resize', this.#onMove);
    addEventListener('scroll', this.#onMove, true);
    this.#focusDay();
  }
  close(refocus = true) {
    if (!this.#open) return;
    this.#open = false;
    this.#pop.hidePopover();
    this.#wrap.classList.remove('open');
    this.#field.setAttribute('aria-expanded', 'false');
    this.#unlisten();
    this.#paint();
    if (refocus) this.#field.focus();
  }
  #unlisten() {
    document.removeEventListener('pointerdown', this.#onDoc, true);
    removeEventListener('resize', this.#onMove);
    removeEventListener('scroll', this.#onMove, true);
  }
  #onDoc = (e) => { if (!e.composedPath().includes(this)) this.close(false); };
  #onMove = () => { if (this.#open) place(this.#pop, this.#field, 'bottom-start', 6); };
  #maybeClose() {
    if (!this.#open) return;
    let inside = true;
    try { inside = this.matches(':focus-within'); } catch { /* selector no soportado */ }
    if (!inside) this.close(false);
  }

  #renderCal() {
    const loc = this.#loc;
    const v = this.#view;
    const first = new Date(v.getFullYear(), v.getMonth(), 1);
    const start = addDays(first, -((first.getDay() - this.#ws + 7) % 7));
    const today = this.#now();
    const sel = parse(this.#value);
    this.#ttl.textContent = cap(first.toLocaleDateString(loc, { month: 'long', year: 'numeric' }));
    this.#grid.setAttribute('aria-label', this.#ttl.textContent);

    const cells = [];
    for (let i = 0; i < 7; i++) {
      const dow = document.createElement('div');
      dow.className = 'dow';
      dow.setAttribute('aria-hidden', 'true');
      dow.textContent = addDays(new Date(2023, 0, 1), (this.#ws + i) % 7).toLocaleDateString(loc, { weekday: 'short' }).replace('.', '');
      cells.push(dow);
    }
    for (let n = 0; n < 42; n++) {
      const d = addDays(start, n);
      const b = document.createElement('button');
      b.type = 'button';
      b.className = `day${d.getMonth() !== v.getMonth() ? ' out' : ''}`;
      b.dataset.d = iso(d);
      b.textContent = String(d.getDate());
      b.setAttribute('aria-label', d.toLocaleDateString(loc, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
      b.setAttribute('aria-selected', String(sameDay(d, sel)));
      if (sameDay(d, today)) b.setAttribute('aria-current', 'date');
      b.tabIndex = sameDay(d, this.#focus) ? 0 : -1;
      b.disabled = !this.#inRange(d);
      cells.push(b);
    }
    this.#grid.replaceChildren(...cells);
    this.#today.disabled = !this.#inRange(today);
  }
  #focusDay() { this.#grid.querySelector('.day[tabindex="0"]')?.focus(); }
  #shift(n) {
    this.#view = new Date(this.#view.getFullYear(), this.#view.getMonth() + n, 1);
    this.#focus = this.#clamp(addMonths(this.#focus, n));
    this.#renderCal();
  }
  #move(d) {
    d = this.#clamp(d);
    this.#focus = d;
    if (d.getMonth() !== this.#view.getMonth() || d.getFullYear() !== this.#view.getFullYear()) this.#view = new Date(d.getFullYear(), d.getMonth(), 1);
    this.#renderCal();
    this.#focusDay();
  }
  #onKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); this.close(); return; }
    if (!e.target.classList?.contains('day')) return;
    const f = this.#focus;
    const wd = (f.getDay() - this.#ws + 7) % 7;
    const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
    let to;
    if (step) to = addDays(f, step);
    else if (e.key === 'Home') to = addDays(f, -wd);
    else if (e.key === 'End') to = addDays(f, 6 - wd);
    else if (e.key === 'PageUp') to = addMonths(f, e.shiftKey ? -12 : -1);
    else if (e.key === 'PageDown') to = addMonths(f, e.shiftKey ? 12 : 1);
    else return;
    e.preventDefault();
    this.#move(to);
  }
}

define('ui-date-picker', UIDatePicker);
export { UIDatePicker };
