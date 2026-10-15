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

/* ───────── columnas responsive, filas y huecos ───────── */
const cell = (t, extra = '') => `<div style="padding:1rem;border-radius:.8rem;text-align:center;font-size:.85rem;background:color-mix(in srgb,var(--ui-accent) 12%,transparent);border:1px dashed color-mix(in srgb,var(--ui-accent) 50%,transparent);${extra}">${t}</div>`;

export const ResponsiveColumns = {
  render: () => `
    <ui-grid cols="1" cols-sm="2" cols-lg="4" gap="lg" style="width:min(60rem,94vw)">
      ${Array.from({ length: 8 }, (_, i) => cell(`Celda ${i + 1}`)).join('')}
    </ui-grid>
    <p style="font-size:.85rem;opacity:.7">cols="1" cols-sm="2" cols-lg="4": cambia el ancho de la ventana.</p>`,
};

export const DenseWithSpans = {
  render: () => `
    <ui-grid cols="4" dense gap="sm" style="width:min(44rem,94vw)">
      ${cell('Ancho 2', 'grid-column:span 2')}${cell('1')}${cell('2')}${cell('Ancho 2', 'grid-column:span 2')}${cell('3')}${cell('4')}${cell('5')}
    </ui-grid>`,
};

export const RowsAndAlign = {
  render: () => `
    <ui-grid cols="3" rows="2" align="center" justify="center" gap="sm" style="width:min(36rem,94vw);height:14rem;border:1px dashed var(--ui-border)">
      ${Array.from({ length: 6 }, (_, i) => cell(`${i + 1}`, 'width:70%')).join('')}
    </ui-grid>`,
};
