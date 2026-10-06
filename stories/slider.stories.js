export default {
  title: 'Controls/Slider',
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    value: { control: 'number' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    disabled: { control: 'boolean' },
  },
  args: { size: 'md', value: 40, min: 0, max: 100, step: 1, disabled: false },
  render: ({ size, value, min, max, step, disabled }) =>
    `<ui-slider label="Volumen" size="${size}" value="${value}" min="${min}" max="${max}" step="${step}" ${disabled ? 'disabled' : ''}></ui-slider>`,
};

export const Default = {};
export const Disabled = { args: { disabled: true } };
export const Steps = { args: { step: 10, value: 50 } };
export const Decimals = { args: { min: 0, max: 1, step: 0.1, value: 0.5 } };

export const AllSizes = {
  render: () => `
    <div style="display:flex;flex-direction:column;gap:1.5rem;align-items:center">
      <ui-slider size="sm" value="30"></ui-slider>
      <ui-slider value="50"></ui-slider>
      <ui-slider size="lg" value="70"></ui-slider>
    </div>`,
};

export const CustomColors = {
  render: () => `
    <ui-slider value="60" style="--ui-accent:#10b981;--ui-accent-2:#06b6d4"></ui-slider>`,
};
