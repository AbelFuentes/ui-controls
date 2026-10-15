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

/* ───────── divisores, colapso y orden inverso ───────── */
export const WithDividers = {
  render: () => `
    <ui-stack divider gap="lg" style="width:min(24rem,92vw)">
      <div><strong>Uno</strong><div style="opacity:.7">Primer elemento</div></div>
      <div><strong>Dos</strong><div style="opacity:.7">Segundo elemento</div></div>
      <div><strong>Tres</strong><div style="opacity:.7">Tercer elemento</div></div>
    </ui-stack>`,
};

export const CollapseOnMobile = {
  render: () => `
    <ui-stack direction="row" collapse="md" divider gap="lg" style="width:min(40rem,94vw)">
      <div><strong>Ingresos</strong><div style="opacity:.7">$48,200</div></div>
      <div><strong>Pedidos</strong><div style="opacity:.7">1,284</div></div>
      <div><strong>Clientes</strong><div style="opacity:.7">892</div></div>
    </ui-stack>
    <p style="font-size:.85rem;opacity:.7">Bajo 768px la fila pasa a columna y la línea vertical a horizontal.</p>`,
};

export const Reverse = {
  render: () => `<ui-stack reverse gap="sm" style="width:12rem"><ui-button>Primero (abajo)</ui-button><ui-button variant="outline">Segundo (arriba)</ui-button></ui-stack>`,
};
