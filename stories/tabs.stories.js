const panels = `
  <section data-tab="general" data-label="General"><p>Ajustes generales de tu cuenta.</p></section>
  <section data-tab="seguridad" data-label="Seguridad"><p>Contraseña y verificación en dos pasos.</p></section>
  <section data-tab="facturacion" data-label="Facturación"><p>Métodos de pago e historial.</p></section>
  <section data-tab="equipo" data-label="Equipo" data-disabled><p>No disponible en tu plan.</p></section>`;

export default {
  title: 'Controls/Tabs',
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'inline-radio', options: ['line', 'pill'] },
    value: { control: 'inline-radio', options: ['general', 'seguridad', 'facturacion'] },
  },
  args: { size: 'md', variant: 'line', value: 'general' },
  render: ({ size, variant, value }) => `
    <ui-tabs label="Ajustes" size="${size}" variant="${variant}" value="${value}"
      style="width:min(32rem,90vw)">${panels}</ui-tabs>`,
};

export const Default = {};
export const Pill = { args: { variant: 'pill' } };
export const Small = { args: { size: 'sm' } };
export const Large = { args: { size: 'lg' } };

export const CustomColors = {
  render: () => `
    <ui-tabs value="general" style="--ui-accent:#10b981;--ui-accent-2:#06b6d4;width:min(32rem,90vw)">${panels}</ui-tabs>`,
};
