export default {
  title: 'Controls/Segmented',
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    value: { control: 'inline-radio', options: ['day', 'week', 'month', 'year'] },
    disabled: { control: 'boolean' },
  },
  args: { size: 'md', value: 'week', disabled: false },
  render: ({ size, value, disabled }) => `
    <ui-segmented label="Periodo" size="${size}" value="${value}" ${disabled ? 'disabled' : ''}>
      <option value="day">Día</option>
      <option value="week">Semana</option>
      <option value="month">Mes</option>
      <option value="year">Año</option>
    </ui-segmented>`,
};

export const Default = {};
export const Disabled = { args: { disabled: true } };

export const WithDisabledOption = {
  render: () => `
    <ui-segmented value="a">
      <option value="a">Gratis</option>
      <option value="b">Pro</option>
      <option value="c" disabled>Enterprise</option>
    </ui-segmented>`,
};

export const AllSizes = {
  render: () => `
    <div style="display:flex;flex-direction:column;gap:1.5rem;align-items:center">
      <ui-segmented size="sm" value="a"><option value="a">Uno</option><option value="b">Dos</option><option value="c">Tres</option></ui-segmented>
      <ui-segmented value="a"><option value="a">Uno</option><option value="b">Dos</option><option value="c">Tres</option></ui-segmented>
      <ui-segmented size="lg" value="a"><option value="a">Uno</option><option value="b">Dos</option><option value="c">Tres</option></ui-segmented>
    </div>`,
};

export const CustomColors = {
  render: () => `
    <ui-segmented value="b" style="--ui-accent:#10b981;--ui-accent-2:#06b6d4">
      <option value="a">Uno</option><option value="b">Dos</option><option value="c">Tres</option>
    </ui-segmented>`,
};
