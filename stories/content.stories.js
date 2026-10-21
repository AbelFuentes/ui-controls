import { svg } from './_shared.js';

export default { title: 'Content/TextEmptyStat', parameters: { layout: 'padded' } };

const box = (inner) => `<div style="max-width:44rem;display:grid;gap:.5rem">${inner}</div>`;

export const TextVariants = {
  render: () => box(['display', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'lead', 'body', 'small', 'caption', 'overline']
    .map((v) => `<div style="display:flex;gap:1rem;align-items:baseline"><ui-text variant="caption" style="width:5rem;flex:none">${v}</ui-text><ui-text variant="${v}" truncate>Interfaces hermosas en minutos</ui-text></div>`).join('')
    + '<div><ui-text variant="code">pnpm add @abelfuentes/ui-controls</ui-text></div>'),
};

export const TextTonesAndWeights = {
  render: () => box(`
    <ui-stack direction="row" gap="lg" wrap>
      ${['default', 'muted', 'accent', 'success', 'warning', 'danger'].map((t) => `<ui-text tone="${t}" weight="semibold">${t}</ui-text>`).join('')}
    </ui-stack>
    <ui-stack direction="row" gap="lg" wrap>
      ${['normal', 'medium', 'semibold', 'bold'].map((w) => `<ui-text weight="${w}" size="xl">${w}</ui-text>`).join('')}
    </ui-stack>`),
};

export const TextClampAndBalance = {
  render: () => box(`
    <ui-text lines="2" tone="muted">Un sistema de componentes es un acuerdo entre diseño e ingeniería sobre cómo se ve y se comporta todo lo que construimos. Cuando ese acuerdo existe, las pantallas nuevas se arman en horas y no en semanas, y cada equipo habla el mismo idioma visual.</ui-text>
    <ui-text variant="h3" balance align="center">Un título largo que se reparte de forma equilibrada entre líneas</ui-text>`),
};

export const EmptyState = {
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] }, bordered: { control: 'boolean' } },
  args: { size: 'md', bordered: true },
  render: ({ size, bordered }) => `
    <ui-empty-state heading="Aún no tienes facturas" description="Cuando emitas la primera, aparecerá aquí con su estado de cobro." size="${size}" ${bordered ? 'bordered' : ''} style="width:min(34rem,92vw)">
      ${svg('file', 28, 'icon')}
      <ui-button slot="actions">${svg('plus', 16, 'start')}Nueva factura</ui-button>
      <ui-button slot="actions" variant="ghost">Importar</ui-button>
    </ui-empty-state>`,
};

export const Stats = {
  argTypes: { loading: { control: 'boolean' } },
  args: { loading: false },
  render: ({ loading }) => `
    <ui-grid cols="1" cols-sm="2" cols-lg="4" gap="lg" style="width:min(64rem,94vw)">
      <ui-card variant="outlined" padding="sm"><ui-stat label="Ingresos" value="$48,200" delta="+12%" hint="vs. mes anterior" ${loading ? 'loading' : ''}>${svg('dollar', 20, 'icon')}</ui-stat></ui-card>
      <ui-card variant="outlined" padding="sm"><ui-stat label="Pedidos" value="1,284" delta="+4%" hint="últimos 30 días" ${loading ? 'loading' : ''}>${svg('cart', 20, 'icon')}</ui-stat></ui-card>
      <ui-card variant="outlined" padding="sm"><ui-stat label="Costos" value="$12,900" delta="+9%" invert hint="subir es malo" ${loading ? 'loading' : ''}>${svg('chart', 20, 'icon')}</ui-stat></ui-card>
      <ui-card variant="outlined" padding="sm"><ui-stat label="Devoluciones" value="23" delta="-8%" invert hint="bajar es bueno" ${loading ? 'loading' : ''}>${svg('truck', 20, 'icon')}</ui-stat></ui-card>
    </ui-grid>`,
};
