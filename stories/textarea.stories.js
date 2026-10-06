const attrs = (o) =>
  Object.entries(o)
    .filter(([, v]) => v !== false && v !== '' && v != null)
    .map(([k, v]) => (v === true ? k : `${k}="${v}"`))
    .join(' ');

export default {
  title: 'Controls/Textarea',
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    rows: { control: 'number' },
    maxrows: { control: 'number' },
    maxlength: { control: 'number' },
    autosize: { control: 'boolean' },
    counter: { control: 'boolean' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    size: 'md', label: 'Mensaje', placeholder: '', hint: '', error: '', rows: 3, maxrows: '', maxlength: '',
    autosize: false, counter: false, required: false, disabled: false,
  },
  render: (a) => `<ui-textarea style="width:min(26rem,90vw)" ${attrs(a)}></ui-textarea>`,
};

export const Default = {};
export const WithHint = { args: { hint: 'Sé lo más específico posible' } };
export const WithError = { args: { error: 'Escribe al menos 10 caracteres' } };
export const WithCounter = { args: { maxlength: 120, hint: 'Cuéntanos más' } };
export const Disabled = { args: { disabled: true, label: 'Deshabilitado' } };

export const Autosize = {
  args: { autosize: true, rows: 2, maxrows: 6, label: 'Escribe varias líneas', hint: 'Crece hasta 6 filas' },
};

export const Placeholder = { args: { label: 'Biografía', placeholder: 'Cuéntanos sobre ti…' } };

export const AllSizes = {
  render: () => `
    <div style="display:grid;gap:1rem;width:min(26rem,90vw)">
      <ui-textarea size="sm" label="Pequeño" rows="2"></ui-textarea>
      <ui-textarea label="Mediano" rows="2"></ui-textarea>
      <ui-textarea size="lg" label="Grande" rows="2"></ui-textarea>
    </div>`,
};

export const CustomColors = {
  render: () => `<ui-textarea label="Verde" style="--ui-accent:#10b981;width:min(26rem,90vw)"></ui-textarea>`,
};

export const InForm = {
  render: () => {
    const el = document.createElement('div');
    el.innerHTML = `
      <form style="display:grid;gap:1rem;width:min(26rem,90vw)" novalidate>
        <ui-input name="subject" label="Asunto" required></ui-input>
        <ui-textarea name="message" label="Mensaje" required minlength="10" maxlength="200"
          autosize rows="3" maxrows="6" hint="Mínimo 10 caracteres"></ui-textarea>
        <ui-button type="submit" block>Enviar</ui-button>
        <pre class="out" style="margin:0;font-size:.85rem;opacity:.75;white-space:pre-wrap">Envía el formulario.</pre>
      </form>`;
    const form = el.querySelector('form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const bad = [...form.querySelectorAll('ui-input, ui-textarea')].find((f) => !f.checkValidity());
      if (bad) { bad.reportValidity(); return; }
      el.querySelector('.out').textContent = JSON.stringify(Object.fromEntries(new FormData(form)), null, 2);
    });
    return el;
  },
};
