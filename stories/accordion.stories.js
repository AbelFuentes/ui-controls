const items = `
  <section data-title="¿Qué incluye el plan Pro?" open>Proyectos ilimitados, soporte prioritario y exportación de datos.</section>
  <section data-title="¿Puedo cancelar cuando quiera?">Sí, sin penalizaciones. Conservas el acceso hasta el fin del periodo.</section>
  <section data-title="¿Ofrecen descuentos para equipos?">Desde 5 asientos aplicamos descuentos por volumen.</section>
  <section data-title="Facturación empresarial" data-disabled>Disponible próximamente.</section>`;

export default {
  title: 'Content/Accordion',
  tags: ['autodocs'],
  argTypes: { multiple: { control: 'boolean' } },
  args: { multiple: false },
  render: ({ multiple }) => `<ui-accordion ${multiple ? 'multiple' : ''} style="width:min(34rem,92vw)">${items}</ui-accordion>`,
};

export const Default = {};
export const Multiple = { args: { multiple: true } };
