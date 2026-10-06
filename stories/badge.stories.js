const attrs = (o) =>
  Object.entries(o)
    .filter(([, v]) => v !== false && v !== '' && v != null)
    .map(([k, v]) => (v === true ? k : `${k}="${v}"`))
    .join(' ');

export default {
  title: 'Controls/Badge',
  tags: ['autodocs'],
  argTypes: {
    tone: { control: 'inline-radio', options: ['accent', 'success', 'warning', 'danger', 'neutral'] },
    variant: { control: 'inline-radio', options: ['soft', 'solid', 'outline'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    dot: { control: 'boolean' },
    pulse: { control: 'boolean' },
    text: { control: 'text' },
  },
  args: { tone: 'accent', variant: 'soft', size: 'md', dot: false, pulse: false, text: 'Nuevo' },
  render: ({ text, ...a }) => `<ui-badge ${attrs(a)}>${text}</ui-badge>`,
};

export const Default = {};
export const Solid = { args: { variant: 'solid' } };
export const Outline = { args: { variant: 'outline' } };
export const Live = { args: { tone: 'success', dot: true, pulse: true, text: 'En vivo' } };

export const AllTones = {
  render: () => `
    <ui-stack direction="row" wrap gap="sm" style="width:min(32rem,92vw)">
      ${['accent', 'success', 'warning', 'danger', 'neutral']
        .map((t) => `<ui-badge tone="${t}">${t}</ui-badge><ui-badge tone="${t}" variant="solid">${t}</ui-badge>`)
        .join('')}
    </ui-stack>`,
};
