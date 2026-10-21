import { define } from '../core/define.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};
const MISSING = 'Adjunta al menos un archivo';
const UP = '<svg viewBox="0 0 24 24"><path d="M12 16V4M7 9l5-5 5 5M5 20h14"/></svg>';
const X = '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>';
const FILE = '<svg viewBox="0 0 24 24"><path d="M7 3h7l5 5v13H7zM14 3v5h5"/></svg>';
const css = `
:host{display:block;font-size:var(--ui-file-upload-size,16px)}
:host([hidden]){display:none!important}
*{box-sizing:border-box}
[hidden]{display:none!important}
.lbl{display:block;font-size:.85em;font-weight:600;margin-bottom:.5em}
:host([required]) .lbl::after{content:" *"}
.zone{display:grid;justify-items:center;gap:.35em;text-align:center;padding:1.75em 1em;border-radius:1.1em;cursor:pointer;outline:none;
  border:1.5px dashed var(--ui-input-border,color-mix(in srgb,currentColor 28%,transparent));
  background:var(--ui-input-bg,color-mix(in srgb,currentColor 4%,transparent));
  transition:border-color .2s,background-color .2s,transform .2s}
.zone:hover{border-color:color-mix(in srgb,var(--ui-accent,#6366f1) 70%,transparent)}
.zone:focus-visible{border-color:var(--ui-accent,#6366f1);box-shadow:0 0 0 .3em color-mix(in srgb,var(--ui-accent,#6366f1) 22%,transparent)}
.zone.drag{border-color:var(--ui-accent,#6366f1);background:color-mix(in srgb,var(--ui-accent,#6366f1) 10%,transparent);transform:scale(1.01)}
.invalid .zone{border-color:var(--ui-danger,#ef4444)}
:host([disabled]) .zone{opacity:.5;pointer-events:none}
.ic{display:grid;place-items:center;width:2.8em;height:2.8em;border-radius:50%;color:var(--ui-accent,#6366f1);
  background:color-mix(in srgb,var(--ui-accent,#6366f1) 12%,transparent)}
.ic svg{width:1.4em;height:1.4em;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.txt{line-height:1.5}
.txt u{color:var(--ui-accent,#6366f1);text-underline-offset:.2em;font-weight:600}
.sub{font-size:.82em;color:var(--ui-muted,inherit)}
.list{list-style:none;margin:.75em 0 0;padding:0;display:grid;gap:.5em}
.it{display:flex;align-items:center;gap:.75em;padding:.55em .65em;border-radius:.9em;
  background:color-mix(in srgb,currentColor 5%,transparent);box-shadow:inset 0 0 0 1px var(--ui-border,color-mix(in srgb,currentColor 12%,transparent))}
.th{flex:none;width:2.6em;height:2.6em;border-radius:.6em;object-fit:cover;display:grid;place-items:center;
  background:color-mix(in srgb,var(--ui-accent,#6366f1) 12%,transparent);color:var(--ui-accent,#6366f1)}
.th svg{width:1.3em;height:1.3em;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.nm{flex:1;min-width:0}
.nm strong{display:block;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.nm span{font-size:.82em;color:var(--ui-muted,inherit)}
.rm{all:unset;display:grid;place-items:center;flex:none;width:2em;height:2em;border-radius:.6em;cursor:pointer;opacity:.6;
  transition:opacity .2s,background-color .2s}
.rm:hover{opacity:1;background:color-mix(in srgb,var(--ui-danger,#ef4444) 14%,transparent);color:var(--ui-danger,#ef4444)}
.rm:focus-visible{outline:.15em solid var(--ui-accent,#6366f1);outline-offset:.05em}
.rm svg{width:1.1em;height:1.1em;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round}
.msg{padding:.45em .25em 0;font-size:.82em;line-height:1.3;opacity:.7}
.msg:empty{display:none}
.msg.err{color:var(--ui-danger,#ef4444);opacity:1}
@media (prefers-reduced-motion:reduce){*{transition-duration:.01ms!important}}
`;

const bytes = (b) => (b < 1024 ? `${b} B` : b < 1048576 ? `${Math.round(b / 1024)} KB` : `${(b / 1048576).toFixed(1)} MB`);
const accepts = (f, accept) => {
  const list = (accept || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
  if (!list.length) return true;
  const name = f.name.toLowerCase();
  const type = (f.type || '').toLowerCase();
  return list.some((a) => (a.startsWith('.') ? name.endsWith(a) : a.endsWith('/*') ? type.startsWith(a.slice(0, -1)) : type === a));
};

class UIFileUpload extends Base {
  static formAssociated = true;
  static observedAttributes = ['accept', 'multiple', 'max-size', 'max-files', 'label', 'hint', 'error', 'required', 'disabled', 'name'];
  #internals; #root; #zone; #input; #list; #msg; #lbl;
  #files = [];
  #urls = new Map();
  #touched = false;
  #flash = '';

  constructor() {
    super();
    this.#internals = this.attachInternals?.();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>${css}</style>
      <div class="wrap" part="wrap">
        <label class="lbl" part="label" hidden></label>
        <div class="zone" part="zone" role="button" tabindex="0" aria-describedby="m">
          <div class="ic" part="icon">${UP}</div>
          <div class="txt"><slot>Arrastra archivos aquí o <u>haz clic</u> para elegir</slot></div>
          <div class="sub" part="hint"></div>
        </div>
        <input class="file" type="file" hidden tabindex="-1" />
        <ul class="list" part="list" aria-label="Archivos seleccionados"></ul>
      </div>
      <div class="msg" part="message" id="m" aria-live="polite"></div>`;
    this.#root = root.querySelector('.wrap');
    this.#zone = root.querySelector('.zone');
    this.#input = root.querySelector('input');
    this.#list = root.querySelector('.list');
    this.#msg = root.querySelector('.msg');
    this.#lbl = root.querySelector('.lbl');

    this.#zone.addEventListener('click', () => { if (!this.disabled) this.#input.click(); });
    this.#zone.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.#zone.click(); }
    });
    this.#zone.addEventListener('blur', () => { this.#touched = true; this.#validate(); });
    ['dragenter', 'dragover'].forEach((t) => this.#zone.addEventListener(t, (e) => {
      if (this.disabled) return;
      e.preventDefault();
      this.#zone.classList.add('drag');
    }));
    ['dragleave', 'dragend'].forEach((t) => this.#zone.addEventListener(t, () => this.#zone.classList.remove('drag')));
    this.#zone.addEventListener('drop', (e) => {
      e.preventDefault();
      this.#zone.classList.remove('drag');
      if (!this.disabled) this.#take(e.dataTransfer?.files ?? []);
    });
    this.#input.addEventListener('change', () => {
      this.#take(this.#input.files ?? []);
      this.#input.value = '';
    });
    this.#list.addEventListener('click', (e) => {
      const b = e.target.closest('.rm');
      if (b) this.#removeAt(Number(b.dataset.i));
    });
    this.addEventListener('invalid', () => { this.#touched = true; this.#validate(); });
  }

  get files() { return [...this.#files]; }
  get disabled() { return this.hasAttribute('disabled'); }
  set disabled(v) { this.toggleAttribute('disabled', !!v); }
  clear() { if (this.#files.length) { this.#files = []; this.#flash = ''; this.#render(); this.#emit(); } }
  checkValidity() { return this.#internals?.checkValidity(); }
  reportValidity() { return this.#internals?.reportValidity(); }
  focus(opts) { this.#zone.focus(opts); }

  connectedCallback() { this.#render(); }
  disconnectedCallback() { this.#urls.forEach((u) => URL.revokeObjectURL?.(u)); this.#urls.clear(); }

  attributeChangedCallback(name, _, v) {
    if (name === 'label') { this.#lbl.textContent = v ?? ''; this.#lbl.hidden = !v; }
    else if (name === 'accept') this.#input.accept = v ?? '';
    else if (name === 'multiple') this.#input.multiple = v !== null;
    else if (name === 'disabled') { this.#zone.setAttribute('aria-disabled', String(this.disabled)); this.#zone.tabIndex = this.disabled ? -1 : 0; }
    this.#render();
  }

  formResetCallback() { this.#touched = false; this.#files = []; this.#flash = ''; this.#render(); }
  formDisabledCallback(d) { this.#zone.setAttribute('aria-disabled', String(d || this.disabled)); }

  get #multiple() { return this.hasAttribute('multiple'); }
  get #maxSize() { const n = parseFloat(this.getAttribute('max-size')); return n > 0 ? n : 0; }
  get #maxFiles() { const n = parseInt(this.getAttribute('max-files'), 10); return n > 0 ? n : 0; }

  #emit() { this.dispatchEvent(new CustomEvent('change', { detail: { files: this.files }, bubbles: true, composed: true })); }
  #reject(file, reason, text) {
    this.#flash = text;
    this.dispatchEvent(new CustomEvent('reject', { detail: { file, reason }, bubbles: true, composed: true }));
  }
  #take(list) {
    let added = false;
    this.#flash = '';
    for (const f of [...list]) {
      if (!accepts(f, this.getAttribute('accept'))) { this.#reject(f, 'type', `${f.name}: tipo de archivo no permitido`); continue; }
      if (this.#maxSize && f.size > this.#maxSize * 1048576) { this.#reject(f, 'size', `${f.name}: supera ${this.#maxSize} MB`); continue; }
      if (!this.#multiple) { this.#files = [f]; added = true; continue; }
      if (this.#maxFiles && this.#files.length >= this.#maxFiles) { this.#reject(f, 'count', `Máximo ${this.#maxFiles} archivos`); continue; }
      if (this.#files.some((x) => x.name === f.name && x.size === f.size && x.lastModified === f.lastModified)) continue;
      this.#files.push(f);
      added = true;
    }
    this.#render();
    if (added) this.#emit();
  }
  #removeAt(i) {
    this.#files.splice(i, 1);
    this.#flash = '';
    this.#render();
    this.#emit();
  }

  #render() {
    const sub = [];
    const acc = this.getAttribute('accept');
    if (acc) sub.push(acc.split(',').map((s) => s.trim()).join(', '));
    if (this.#maxSize) sub.push(`máx. ${this.#maxSize} MB`);
    if (this.#multiple && this.#maxFiles) sub.push(`hasta ${this.#maxFiles} archivos`);
    const hint = this.getAttribute('hint');
    this.#root.querySelector('.sub').textContent = [hint, ...sub].filter(Boolean).join(' · ');

    this.#urls.forEach((u) => URL.revokeObjectURL?.(u));
    this.#urls.clear();
    this.#list.replaceChildren(...this.#files.map((f, i) => {
      const li = document.createElement('li');
      li.className = 'it';
      li.setAttribute('part', 'item');
      let th;
      if ((f.type || '').startsWith('image/') && typeof URL.createObjectURL === 'function') {
        const url = URL.createObjectURL(f);
        this.#urls.set(f, url);
        th = document.createElement('img');
        th.src = url;
        th.alt = '';
      } else {
        th = document.createElement('span');
        th.innerHTML = FILE;
      }
      th.classList.add('th');
      const nm = document.createElement('div');
      nm.className = 'nm';
      const strong = document.createElement('strong');
      strong.textContent = f.name;
      const meta = document.createElement('span');
      meta.textContent = bytes(f.size);
      nm.append(strong, meta);
      const rm = document.createElement('button');
      rm.type = 'button';
      rm.className = 'rm';
      rm.dataset.i = String(i);
      rm.setAttribute('aria-label', `Quitar ${f.name}`);
      rm.innerHTML = X;
      li.append(th, nm, rm);
      return li;
    }));
    this.#list.hidden = !this.#files.length;
    this.#validate();
  }

  #validate() {
    const err = this.getAttribute('error');
    const missing = this.hasAttribute('required') && !this.#files.length;
    const i = this.#internals;
    const name = this.getAttribute('name');
    if (name && this.#files.length) {
      const fd = new FormData();
      this.#files.forEach((f) => fd.append(name, f));
      i?.setFormValue(fd);
    } else i?.setFormValue(null);
    if (err) i?.setValidity({ customError: true }, err, this.#zone);
    else if (missing) i?.setValidity({ valueMissing: true }, MISSING, this.#zone);
    else i?.setValidity({});
    const shown = err || this.#flash || (this.#touched && missing ? MISSING : '');
    this.#msg.textContent = shown;
    this.#msg.classList.toggle('err', !!shown);
    this.#root.classList.toggle('invalid', !!shown);
    this.#zone.setAttribute('aria-invalid', String(!!shown));
  }
}

define('ui-file-upload', UIFileUpload);
export { UIFileUpload };
