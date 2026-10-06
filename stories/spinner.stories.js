export default {
  title: 'Controls/Spinner',
  tags: ['autodocs'],
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'xl'] } },
  args: { size: 'md' },
  render: ({ size }) => `<ui-spinner size="${size}" label="Cargando"></ui-spinner>`,
};

export const Default = {};

export const Sizes = {
  render: () => `
    <div style="display:flex;gap:1.5rem;align-items:center">
      ${['sm', 'md', 'lg', 'xl'].map((s) => `<ui-spinner size="${s}"></ui-spinner>`).join('')}
    </div>`,
};

export const CustomColors = {
  render: () => `<ui-spinner size="lg" style="--ui-accent:#10b981;--ui-accent-2:#06b6d4"></ui-spinner>`,
};
