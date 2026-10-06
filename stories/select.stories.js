const options = `
  <option value="mx">México</option>
  <option value="co">Colombia</option>
  <option value="ar">Argentina</option>
  <option value="cl">Chile</option>
  <option value="pe">Perú</option>
  <option value="uy" disabled>Uruguay (próximamente)</option>
  <option value="es">España</option>`;

const globe = `<svg slot="start" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/></svg>`;

const attrs = (o) =>
  Object.entries(o)
    .filter(([, v]) => v !== false && v !== '' && v != null)
    .map(([k, v]) => (v === true ? k : `${k}="${v}"`))
    .join(' ');

export default {
  title: 'Controls/Select',
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    value: { control: 'inline-radio', options: ['', 'mx', 'co', 'ar'] },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: { size: 'md', value: '', label: 'País', placeholder: 'Selecciona uno', hint: '', error: '', required: false, disabled: false },
  render: (a) => `<ui-select style="width:min(22rem,90vw)" ${attrs(a)}>${options}</ui-select>`,
};

export const Default = {};
export const Selected = { args: { value: 'co' } };
export const WithHint = { args: { hint: 'Donde recibirás tus pedidos' } };
export const WithError = { args: { error: 'Este campo es obligatorio' } };
export const Disabled = { args: { disabled: true, value: 'mx' } };

export const WithIcon = {
  render: () => `<ui-select label="País" value="mx" style="width:min(22rem,90vw)">${globe}${options}</ui-select>`,
};

export const AllSizes = {
  render: () => `
    <div style="display:grid;gap:1rem;width:min(22rem,90vw)">
      <ui-select size="sm" label="Pequeño" value="mx">${options}</ui-select>
      <ui-select label="Mediano" value="mx">${options}</ui-select>
      <ui-select size="lg" label="Grande" value="mx">${options}</ui-select>
    </div>`,
};

export const OpensUpwards = {
  parameters: { layout: 'fullscreen' },
  render: () => `
    <div style="min-height:100vh;display:flex;align-items:flex-end;justify-content:center;padding:1.5rem">
      <ui-select label="País" style="width:min(22rem,90vw)">${options}</ui-select>
    </div>`,
};

export const CustomColors = {
  render: () => `<ui-select label="País" value="co" style="--ui-accent:#10b981;width:min(22rem,90vw)">${options}</ui-select>`,
};

export const InForm = {
  render: () => {
    const el = document.createElement('div');
    el.innerHTML = `
      <form style="display:grid;gap:1rem;width:min(22rem,90vw)" novalidate>
        <ui-select name="country" label="País" required hint="Obligatorio">${options}</ui-select>
        <div style="display:flex;gap:.75rem">
          <ui-button type="reset" variant="ghost">Limpiar</ui-button>
          <ui-button type="submit" style="flex:1">Enviar</ui-button>
        </div>
        <pre class="out" style="margin:0;font-size:.85rem;opacity:.75;white-space:pre-wrap">Envía el formulario.</pre>
      </form>`;
    const form = el.querySelector('form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const s = form.querySelector('ui-select');
      if (!s.checkValidity()) { s.reportValidity(); return; }
      el.querySelector('.out').textContent = JSON.stringify(Object.fromEntries(new FormData(form)), null, 2);
    });
    return el;
  },
};
