export default {
  title: 'Layout/Grid',
  tags: ['autodocs'],
  argTypes: {
    cols: { control: { type: 'number', min: 1, max: 6 } },
    min: { control: 'text' },
    gap: { control: 'inline-radio', options: ['none', 'sm', 'md', 'lg', 'xl'] },
  },
  args: { cols: '', min: '10rem', gap: 'md' },
  render: ({ cols, min, gap }) => `
    <ui-grid ${cols ? `cols="${cols}"` : `min="${min}"`} gap="${gap}" style="width:min(44rem,92vw)">
      ${Array.from({ length: 8 }, (_, i) => `<ui-card variant="outlined" padding="sm">Item ${i + 1}</ui-card>`).join('')}
    </ui-grid>`,
};

export const Auto = {};
export const FixedColumns = { args: { cols: 3 } };
