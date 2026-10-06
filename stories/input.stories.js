const mail = `<svg slot="start" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 8l9 6 9-6"/></svg>`;
const search = `<svg slot="start" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.500-3.500"/></svg>`;

const attrs = (o) =>
  Object.entries(o)
    .filter(([, v]) => v !== false && v !== '' && v != null)
    .map(([k, v]) => (v === true ? k : `${k}="${v}"`))
    .join(' ');

export default {
  title: 'Controls/Input',
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['text', 'email', 'password', 'number', 'url', 'tel', 'search'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: { type: 'text', size: 'md', label: 'Nombre', placeholder: '', hint: '', error: '', required: false, disabled: false },
  render: (a) => `<ui-input style="width:min(22rem,90vw)" ${attrs(a)}></ui-input>`,
};

export const Default = {};
export const WithHint = { args: { label: 'Usuario', hint: 'Solo letras y números' } };
export const WithError = { args: { label: 'Correo', type: 'email', error: 'Este correo ya está registrado' } };
export const Password = { args: { label: 'Contraseña', type: 'password' } };
export const Placeholder = { args: { label: 'Buscar', placeholder: 'Ej. teclado mecánico' } };
export const Disabled = { args: { disabled: true, label: 'Deshabilitado' } };

export const WithIcons = {
  render: () => `
    <div style="display:grid;gap:1rem;width:min(22rem,90vw)">
      <ui-input label="Correo" type="email">${mail}</ui-input>
      <ui-input label="Buscar" type="search">${search}</ui-input>
    </div>`,
};

export const AllSizes = {
  render: () => `
    <div style="display:grid;gap:1rem;width:min(22rem,90vw)">
      <ui-input size="sm" label="Pequeño"></ui-input>
      <ui-input label="Mediano"></ui-input>
      <ui-input size="lg" label="Grande"></ui-input>
    </div>`,
};

export const CustomColors = {
  render: () => `
    <ui-input label="Verde" style="--ui-accent:#10b981;width:min(22rem,90vw)"></ui-input>`,
};

export const InForm = {
  render: () => {
    const el = document.createElement('div');
    el.innerHTML = `
      <form style="display:grid;gap:1rem;width:min(22rem,90vw)" novalidate>
        <ui-input name="email" type="email" label="Correo" required hint="Te enviaremos un enlace">${mail}</ui-input>
        <ui-input name="password" type="password" label="Contraseña" required minlength="8" hint="Mínimo 8 caracteres"></ui-input>
        <ui-button type="submit" block>Crear cuenta</ui-button>
        <pre class="out" style="margin:0;font-size:.85rem;opacity:.75;white-space:pre-wrap">Envía el formulario.</pre>
      </form>`;
    const form = el.querySelector('form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fields = [...form.querySelectorAll('ui-input')];
      const bad = fields.find((f) => !f.checkValidity());
      if (bad) { bad.reportValidity(); return; }
      el.querySelector('.out').textContent = JSON.stringify(Object.fromEntries(new FormData(form)), null, 2);
    });
    return el;
  },
};
