export default { title: 'Controls/AdvancedFields', parameters: { layout: 'centered' } };

const W = 'width:min(26rem,92vw)';
const attrs = (o) =>
  Object.entries(o)
    .filter(([, v]) => v !== false && v !== '' && v != null)
    .map(([k, v]) => (v === true ? k : `${k}="${v}"`))
    .join(' ');
const countries = `
  <option value="mx">México</option><option value="co">Colombia</option><option value="ar">Argentina</option>
  <option value="cl">Chile</option><option value="pe" disabled>Perú (próximamente)</option><option value="es">España</option>
  <option value="uy">Uruguay</option><option value="br">Brasil</option><option value="ec">Ecuador</option>`;

/* ───────── Combobox ───────── */
export const Combobox = {
  argTypes: {
    clearable: { control: 'boolean' }, 'allow-custom': { control: 'boolean' }, required: { control: 'boolean' },
    disabled: { control: 'boolean' }, size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    hint: { control: 'text' }, error: { control: 'text' },
  },
  args: { clearable: true, 'allow-custom': false, required: false, disabled: false, size: 'md', hint: 'Escribe para buscar, sin acentos si quieres', error: '' },
  render: (a) => {
    const el = document.createElement('div');
    el.style.cssText = `${W};display:grid;gap:.75rem`;
    el.innerHTML = `<ui-combobox label="País" name="pais" ${attrs(a)}>${countries}</ui-combobox>
      <span class="out" style="font-size:.85rem;opacity:.7">Sin selección</span>`;
    el.querySelector('ui-combobox').addEventListener('change', (e) => {
      el.querySelector('.out').textContent = `value="${e.detail.value}" · label="${e.detail.label}"`;
    });
    return el;
  },
};

export const ComboboxCustomValues = {
  render: () => `
    <ui-combobox label="Categoría" name="categoria" allow-custom clearable hint="Elige una o escribe la tuya y pulsa Enter" style="${W}">
      <option value="comida">Comida</option><option value="transporte">Transporte</option><option value="oficina">Oficina</option>
      <option value="software">Software</option><option value="viajes">Viajes</option>
    </ui-combobox>`,
};

/* ───────── DatePicker ───────── */
export const DatePicker = {
  argTypes: {
    'week-start': { control: 'inline-radio', options: ['1', '0'] },
    locale: { control: 'select', options: ['es-MX', 'en-US', 'fr-FR', 'de-DE'] },
    clearable: { control: 'boolean' }, required: { control: 'boolean' }, disabled: { control: 'boolean' },
    min: { control: 'text' }, max: { control: 'text' }, value: { control: 'text' },
  },
  args: { 'week-start': '1', locale: 'es-MX', clearable: true, required: false, disabled: false, min: '', max: '', value: '' },
  render: (a) => {
    const el = document.createElement('div');
    el.style.cssText = `${W};display:grid;gap:.75rem`;
    el.innerHTML = `<ui-date-picker label="Fecha" name="fecha" ${attrs(a)} hint="Flechas, RePág/AvPág y Esc en el calendario"></ui-date-picker>
      <span class="out" style="font-size:.85rem;opacity:.7">Sin fecha</span>`;
    el.querySelector('ui-date-picker').addEventListener('change', (e) => {
      el.querySelector('.out').textContent = e.detail.value ? `value="${e.detail.value}"` : 'Sin fecha';
    });
    return el;
  },
};

export const DatePickerWithLimits = {
  render: () => {
    const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const t = new Date();
    const min = iso(new Date(t.getFullYear(), t.getMonth(), 5));
    const max = iso(new Date(t.getFullYear(), t.getMonth() + 1, 10));
    return `<ui-date-picker label="Fecha de entrega" name="entrega" min="${min}" max="${max}" required hint="Solo del ${min} al ${max}" style="${W}"></ui-date-picker>`;
  },
};

/* ───────── TagInput ───────── */
export const TagInput = {
  argTypes: { max: { control: 'number' }, 'allow-duplicates': { control: 'boolean' }, required: { control: 'boolean' }, disabled: { control: 'boolean' } },
  args: { max: 5, 'allow-duplicates': false, required: false, disabled: false },
  render: (a) => {
    const el = document.createElement('div');
    el.style.cssText = `${W};display:grid;gap:.75rem`;
    el.innerHTML = `<ui-tag-input label="Etiquetas" name="tags" value="oficina,viajes" placeholder="Escribe y pulsa Enter o coma" ${attrs(a)}
      hint="Backspace quita la última · puedes pegar texto con comas"></ui-tag-input>
      <span class="out" style="font-size:.85rem;opacity:.7"></span>`;
    const t = el.querySelector('ui-tag-input');
    const out = el.querySelector('.out');
    const show = () => (out.textContent = `tags: ${JSON.stringify(t.tags)}`);
    t.addEventListener('change', show);
    show();
    return el;
  },
};

/* ───────── FileUpload ───────── */
export const FileUpload = {
  argTypes: { multiple: { control: 'boolean' }, 'max-size': { control: 'number' }, 'max-files': { control: 'number' }, required: { control: 'boolean' }, disabled: { control: 'boolean' } },
  args: { multiple: true, 'max-size': 5, 'max-files': 4, required: false, disabled: false },
  render: (a) => {
    const el = document.createElement('div');
    el.style.cssText = `${W};display:grid;gap:.75rem`;
    el.innerHTML = `<ui-file-upload label="Comprobantes" name="docs" accept=".pdf,image/*" hint="PDF o imágenes" ${attrs(a)}></ui-file-upload>
      <span class="out" style="font-size:.85rem;opacity:.7">0 archivos</span>`;
    el.querySelector('ui-file-upload').addEventListener('change', (e) => (el.querySelector('.out').textContent = `${e.detail.files.length} archivo(s)`));
    return el;
  },
};

export const FileUploadCustomZone = {
  render: () => `
    <ui-file-upload label="Foto de perfil" accept="image/*" max-size="2" style="${W}">
      <strong>Suelta tu foto aquí</strong><br><span style="opacity:.7">o haz clic para buscarla</span>
    </ui-file-upload>`,
};

/* ───────── Todo junto en un formulario ───────── */
export const InForm = {
  render: () => {
    const el = document.createElement('div');
    el.style.cssText = `${W};display:grid;gap:1rem`;
    el.innerHTML = `
      <form novalidate style="display:grid;gap:1rem">
        <ui-combobox name="pais" label="País" required clearable>${countries}</ui-combobox>
        <ui-date-picker name="fecha" label="Fecha" required></ui-date-picker>
        <ui-tag-input name="tags" label="Etiquetas" required></ui-tag-input>
        <ui-file-upload name="docs" label="Comprobantes" multiple accept=".pdf,image/*" max-size="5" required></ui-file-upload>
        <div style="display:flex;gap:.75rem"><ui-button type="reset" variant="ghost">Limpiar</ui-button><ui-button type="submit" style="flex:1">Enviar</ui-button></div>
        <pre class="out" style="margin:0;font-size:.8rem;opacity:.75;white-space:pre-wrap">Envía el formulario.</pre>
      </form>`;
    const form = el.querySelector('form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const bad = [...form.querySelectorAll('ui-combobox, ui-date-picker, ui-tag-input, ui-file-upload')].find((f) => !f.checkValidity());
      if (bad) return bad.reportValidity();
      const data = Object.fromEntries([...new FormData(form)].map(([k, v]) => [k, v instanceof File ? v.name : v]));
      el.querySelector('.out').textContent = JSON.stringify(data, null, 2);
    });
    return el;
  },
};
