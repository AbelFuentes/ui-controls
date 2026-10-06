export default {
  title: 'Controls/Alert',
  tags: ['autodocs'],
  argTypes: {
    tone: { control: 'inline-radio', options: ['info', 'success', 'warning', 'danger'] },
    dismissible: { control: 'boolean' },
  },
  args: { tone: 'info', dismissible: false },
  render: ({ tone, dismissible }) => `
    <ui-alert tone="${tone}" ${dismissible ? 'dismissible' : ''} style="width:min(30rem,92vw)">
      <span slot="title">Actualización disponible</span>
      Hay una nueva versión lista para instalar.
    </ui-alert>`,
};

export const Default = {};
export const Success = { args: { tone: 'success' } };
export const Warning = { args: { tone: 'warning' } };
export const Danger = { args: { tone: 'danger' } };
export const Dismissible = { args: { dismissible: true } };

export const AllTones = {
  render: () => `
    <ui-stack style="width:min(30rem,92vw)" gap="sm">
      <ui-alert>Mensaje informativo.</ui-alert>
      <ui-alert tone="success">Cambios guardados.</ui-alert>
      <ui-alert tone="warning">Tu sesión expira pronto.</ui-alert>
      <ui-alert tone="danger" dismissible>No se pudo completar la acción.</ui-alert>
    </ui-stack>`,
};
