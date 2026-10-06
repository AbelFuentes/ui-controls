export default {
  title: 'Overlays/Tooltip',
  tags: ['autodocs'],
  argTypes: {
    placement: { control: 'inline-radio', options: ['top', 'bottom', 'left', 'right'] },
    text: { control: 'text' },
    delay: { control: 'number' },
  },
  args: { placement: 'top', text: 'Guardar cambios', delay: 250 },
  render: ({ placement, text, delay }) =>
    `<ui-tooltip text="${text}" placement="${placement}" delay="${delay}"><ui-button>Pasa el mouse</ui-button></ui-tooltip>`,
};

export const Default = {};

export const AllPlacements = {
  render: () => `
    <div style="display:flex;gap:1.5rem;padding:3rem">
      ${['top', 'right', 'bottom', 'left']
        .map((p) => `<ui-tooltip text="Tooltip ${p}" placement="${p}"><ui-button variant="soft">${p}</ui-button></ui-tooltip>`)
        .join('')}
    </div>`,
};

export const RichContent = {
  render: () => `
    <ui-tooltip>
      <ui-badge tone="success" dot>En línea</ui-badge>
      <span slot="content"><strong>Servidor activo</strong><br>Última revisión hace 2 min</span>
    </ui-tooltip>`,
};
