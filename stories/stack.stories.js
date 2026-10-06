export default {
  title: 'Layout/Stack',
  tags: ['autodocs'],
  argTypes: {
    direction: { control: 'inline-radio', options: ['column', 'row'] },
    gap: { control: 'inline-radio', options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'] },
    align: { control: 'inline-radio', options: ['stretch', 'start', 'center', 'end'] },
    justify: { control: 'inline-radio', options: ['start', 'center', 'between', 'end'] },
    wrap: { control: 'boolean' },
  },
  args: { direction: 'column', gap: 'md', align: 'stretch', justify: 'start', wrap: false },
  render: ({ direction, gap, align, justify, wrap }) => `
    <ui-stack direction="${direction}" gap="${gap}" align="${align}" justify="${justify}" ${wrap ? 'wrap' : ''}
      style="width:min(30rem,92vw)">
      <ui-button>Uno</ui-button><ui-button variant="soft">Dos</ui-button><ui-button variant="outline">Tres</ui-button>
    </ui-stack>`,
};

export const Default = {};
export const Row = { args: { direction: 'row', align: 'center' } };
export const SpaceBetween = { args: { direction: 'row', justify: 'between' } };
