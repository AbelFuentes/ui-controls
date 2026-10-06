export default {
  title: 'Overlays/Drawer',
  tags: ['autodocs'],
  argTypes: {
    side: { control: 'inline-radio', options: ['right', 'left', 'bottom'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  args: { side: 'right', size: 'md' },
  render: ({ side, size }) => {
    const el = document.createElement('div');
    el.innerHTML = `
      <ui-button>Abrir panel</ui-button>
      <ui-drawer side="${side}" size="${size}">
        <span slot="header">Filtros</span>
        <ui-stack gap="lg">
          <ui-segmented value="all"><option value="all">Todos</option><option value="open">Abiertos</option><option value="done">Cerrados</option></ui-segmented>
          <ui-slider label="Precio máximo" value="60"></ui-slider>
          <ui-checkbox checked>Solo con stock</ui-checkbox>
        </ui-stack>
        <ui-button slot="footer" variant="ghost" data-a="x">Limpiar</ui-button>
        <ui-button slot="footer" data-a="x">Aplicar</ui-button>
      </ui-drawer>`;
    const d = el.querySelector('ui-drawer');
    el.querySelector('ui-button').onclick = () => d.show();
    el.querySelectorAll('[data-a]').forEach((b) => (b.onclick = () => d.close()));
    return el;
  },
};

export const Right = {};
export const Left = { args: { side: 'left' } };
export const Bottom = { args: { side: 'bottom' } };
