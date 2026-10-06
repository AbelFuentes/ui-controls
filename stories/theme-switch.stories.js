export default {
  title: 'Controls/ThemeSwitch',
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    label: { control: 'text' },
  },
  args: { size: 'md', label: 'Modo oscuro' },
  render: ({ size, label }) =>
    `<ui-theme-switch size="${size}" label="${label}"></ui-theme-switch>`,
};

export const Default = {};
export const Small = { args: { size: 'sm' } };
export const Large = { args: { size: 'lg' } };

export const AllSizes = {
  render: () => `
    <div style="display:flex;gap:2rem;align-items:center">
      <ui-theme-switch size="sm"></ui-theme-switch>
      <ui-theme-switch></ui-theme-switch>
      <ui-theme-switch size="lg"></ui-theme-switch>
    </div>`,
};
