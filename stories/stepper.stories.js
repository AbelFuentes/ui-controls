const steps = `
  <li data-description="Datos básicos">Cuenta</li>
  <li data-description="Elige tu plan">Plan</li>
  <li data-description="Tarjeta o transferencia">Pago</li>
  <li data-description="Todo listo">Confirmación</li>`;

export default {
  title: 'Controls/Stepper',
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    value: { control: { type: 'number', min: 1, max: 5 } },
    clickable: { control: 'boolean' },
  },
  args: { size: 'md', orientation: 'horizontal', value: 2, clickable: false },
  render: ({ size, orientation, value, clickable }) => `
    <ui-stepper label="Progreso" size="${size}" orientation="${orientation}" value="${value}" ${clickable ? 'clickable' : ''}
      style="width:min(34rem,90vw)">${steps}</ui-stepper>`,
};

export const Default = {};
export const Vertical = { args: { orientation: 'vertical' }, render: (a) => `
  <ui-stepper orientation="vertical" value="${a.value}" style="width:16rem">${steps}</ui-stepper>` };
export const Clickable = { args: { clickable: true, value: 3 } };
export const Completed = { args: { value: 5 } };

export const WithButtons = {
  render: () => {
    const el = document.createElement('div');
    el.style.cssText = 'display:grid;gap:2rem;justify-items:center;width:min(34rem,90vw)';
    el.innerHTML = `
      <ui-stepper value="1" style="width:100%">${steps}</ui-stepper>
      <div style="display:flex;gap:.75rem">
        <button data-a="prev">Atrás</button><button data-a="next">Siguiente</button>
      </div>`;
    const s = el.querySelector('ui-stepper');
    el.querySelector('[data-a=prev]').onclick = () => s.prev();
    el.querySelector('[data-a=next]').onclick = () => s.next();
    return el;
  },
};

export const CustomColors = {
  render: () => `
    <ui-stepper value="2" style="--ui-accent:#10b981;--ui-accent-2:#06b6d4;width:min(34rem,90vw)">${steps}</ui-stepper>`,
};
