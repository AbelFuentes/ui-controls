export default {
  title: 'Controls/Toggle',
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
  },
  args: { size: 'md', checked: false, disabled: false, label: 'Notificaciones' },
  render: ({ size, checked, disabled, label }) =>
    `<ui-toggle size="${size}" label="${label}" ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''}></ui-toggle>`,
};

export const Default = {};
export const Checked = { args: { checked: true } };
export const Disabled = { args: { disabled: true, checked: true } };

export const AllSizes = {
  render: () => `
    <div style="display:flex;gap:2rem;align-items:center">
      <ui-toggle size="sm" checked></ui-toggle>
      <ui-toggle checked></ui-toggle>
      <ui-toggle size="lg" checked></ui-toggle>
    </div>`,
};

export const CustomColors = {
  render: () => `
    <ui-toggle checked style="--ui-accent:#10b981;--ui-accent-2:#06b6d4"></ui-toggle>`,
};
