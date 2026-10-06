export default {
  title: 'Controls/Skeleton',
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: ['text', 'rect', 'circle'] },
    lines: { control: { type: 'number', min: 1, max: 6 } },
  },
  args: { variant: 'text', lines: 3 },
  render: ({ variant, lines }) =>
    `<ui-skeleton variant="${variant}" lines="${lines}" style="width:min(22rem,90vw)"></ui-skeleton>`,
};

export const Default = {};
export const Rect = { args: { variant: 'rect' } };
export const Circle = { args: { variant: 'circle' } };

export const CardPlaceholder = {
  render: () => `
    <ui-card style="width:min(22rem,90vw)">
      <ui-skeleton slot="media" variant="rect" height="160"></ui-skeleton>
      <ui-stack>
        <div style="display:flex;gap:.75rem;align-items:center">
          <ui-skeleton variant="circle" width="44"></ui-skeleton>
          <ui-skeleton variant="text" lines="2"></ui-skeleton>
        </div>
        <ui-skeleton variant="text" lines="3"></ui-skeleton>
      </ui-stack>
    </ui-card>`,
};
