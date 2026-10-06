export default {
  title: 'Controls/Checkbox',
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    checked: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    disabled: { control: 'boolean' },
    text: { control: 'text' },
  },
  args: { size: 'md', checked: false, indeterminate: false, disabled: false, text: 'Acepto los términos' },
  render: ({ size, checked, indeterminate, disabled, text }) =>
    `<ui-checkbox size="${size}" ${checked ? 'checked' : ''} ${indeterminate ? 'indeterminate' : ''} ${disabled ? 'disabled' : ''}>${text}</ui-checkbox>`,
};

export const Default = {};
export const Checked = { args: { checked: true } };
export const Indeterminate = { args: { indeterminate: true } };
export const Disabled = { args: { disabled: true, checked: true } };

export const AllSizes = {
  render: () => `
    <div style="display:flex;gap:2rem;align-items:center">
      <ui-checkbox size="sm" checked>Pequeño</ui-checkbox>
      <ui-checkbox checked>Mediano</ui-checkbox>
      <ui-checkbox size="lg" checked>Grande</ui-checkbox>
    </div>`,
};

export const CustomColors = {
  render: () => `
    <ui-checkbox checked style="--ui-accent:#10b981;--ui-accent-2:#06b6d4">Verde</ui-checkbox>`,
};
