export default {
  title: 'Controls/RadioGroup',
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text' },
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
    disabled: { control: 'boolean' },
  },
  args: { value: 'pro', orientation: 'vertical', disabled: false },
  render: ({ value, orientation, disabled }) => `
    <ui-radio-group label="Plan" value="${value}" orientation="${orientation}" ${disabled ? 'disabled' : ''}>
      <ui-radio value="free">Free</ui-radio>
      <ui-radio value="pro">Pro</ui-radio>
      <ui-radio value="team">Team</ui-radio>
      <ui-radio value="legacy" disabled>Legacy</ui-radio>
    </ui-radio-group>`,
};

export const Default = {};
export const Horizontal = { args: { orientation: 'horizontal' } };
export const Disabled = { args: { disabled: true } };
