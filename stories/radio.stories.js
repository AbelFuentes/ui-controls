export default {
  title: 'Controls/Radio',
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    text: { control: 'text' },
  },
  args: { size: 'md', checked: false, disabled: false, text: 'Opción' },
  render: ({ size, checked, disabled, text }) =>
    `<ui-radio size="${size}" value="a" ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''}>${text}</ui-radio>`,
};

export const Default = {};
export const Checked = { args: { checked: true } };
export const Disabled = { args: { disabled: true, checked: true } };

export const CustomColors = {
  render: () => `
    <ui-radio checked style="--ui-accent:#10b981;--ui-accent-2:#06b6d4">Verde</ui-radio>`,
};
