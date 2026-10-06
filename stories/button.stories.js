const plus = `<svg slot="start" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>`;
const arrow = `<svg slot="end" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;
const heart = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.600-7 10-7 10z"/></svg>`;

export default {
  title: 'Controls/Button',
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: ['solid', 'soft', 'outline', 'ghost'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    pill: { control: 'boolean' },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    text: { control: 'text' },
  },
  args: { variant: 'solid', size: 'md', pill: false, loading: false, disabled: false, text: 'Continuar' },
  render: ({ variant, size, pill, loading, disabled, text }) =>
    `<ui-button variant="${variant}" size="${size}" ${pill ? 'pill' : ''} ${loading ? 'loading' : ''} ${disabled ? 'disabled' : ''}>${text}</ui-button>`,
};

export const Default = {};
export const Soft = { args: { variant: 'soft' } };
export const Outline = { args: { variant: 'outline' } };
export const Ghost = { args: { variant: 'ghost' } };
export const Loading = { args: { loading: true } };
export const Disabled = { args: { disabled: true } };

export const Variants = {
  render: () => `
    <div style="display:flex;gap:1rem;align-items:center;flex-wrap:wrap;justify-content:center">
      <ui-button>Solid</ui-button>
      <ui-button variant="soft">Soft</ui-button>
      <ui-button variant="outline">Outline</ui-button>
      <ui-button variant="ghost">Ghost</ui-button>
    </div>`,
};

export const Sizes = {
  render: () => `
    <div style="display:flex;gap:1rem;align-items:center">
      <ui-button size="sm">Pequeño</ui-button>
      <ui-button>Mediano</ui-button>
      <ui-button size="lg">Grande</ui-button>
    </div>`,
};

export const WithIcons = {
  render: () => `
    <div style="display:flex;gap:1rem;align-items:center;flex-wrap:wrap;justify-content:center">
      <ui-button>${plus}Nuevo</ui-button>
      <ui-button variant="outline">Siguiente${arrow}</ui-button>
      <ui-button pill>${plus}Crear${arrow}</ui-button>
    </div>`,
};

export const IconOnly = {
  render: () => `
    <div style="display:flex;gap:1rem;align-items:center">
      <ui-button icon pill label="Me gusta">${heart}</ui-button>
      <ui-button icon variant="soft" label="Me gusta">${heart}</ui-button>
      <ui-button icon variant="ghost" label="Me gusta">${heart}</ui-button>
    </div>`,
};

export const Block = {
  render: () => `<ui-button block style="width:min(22rem,90vw)">Ancho completo</ui-button>`,
};

export const CustomColors = {
  render: () => `
    <div style="display:flex;gap:1rem;align-items:center">
      <ui-button style="--ui-accent:#10b981;--ui-accent-2:#06b6d4">Éxito</ui-button>
      <ui-button style="--ui-accent:#ef4444;--ui-accent-2:#f97316">Peligro</ui-button>
    </div>`,
};

export const AsyncLoading = {
  render: () => {
    const el = document.createElement('ui-button');
    el.textContent = 'Guardar';
    el.addEventListener('click', () => {
      el.loading = true;
      setTimeout(() => (el.loading = false), 1800);
    });
    return el;
  },
};

export const InForm = {
  render: () => {
    const el = document.createElement('div');
    el.innerHTML = `
      <form style="display:grid;gap:1rem;justify-items:center">
        <div style="display:flex;gap:.75rem">
          <ui-button type="reset" variant="ghost">Limpiar</ui-button>
          <ui-button type="submit">Enviar</ui-button>
        </div>
        <pre class="out" style="margin:0;font-size:.85rem;opacity:.7">Pulsa Enviar</pre>
      </form>`;
    const form = el.querySelector('form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      el.querySelector('.out').textContent = 'submit ✓ ' + new Date().toLocaleTimeString();
    });
    return el;
  },
};
