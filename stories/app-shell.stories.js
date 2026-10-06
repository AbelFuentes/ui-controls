export default {
  title: 'Layout/AppShell',
  parameters: { layout: 'fullscreen' },
};

const nav = ['Inicio', 'Proyectos', 'Equipo', 'Ajustes']
  .map((t, i) => `<ui-button variant="${i === 0 ? 'soft' : 'ghost'}" block>${t}</ui-button>`)
  .join('');

export const Dashboard = {
  render: () => `
    <ui-app-shell>
      <strong slot="header">Acme</strong>
      <span slot="header" style="flex:1"></span>
      <ui-theme-switch slot="header" size="sm"></ui-theme-switch>
      <ui-avatar slot="header" name="Abel Fuentes" size="sm" status="online"></ui-avatar>

      <ui-stack slot="sidebar" gap="xs">${nav}</ui-stack>

      <ui-stack gap="lg">
        <ui-alert tone="success" dismissible>Bienvenido de vuelta.</ui-alert>
        <ui-grid min="14rem">
          ${['Ventas', 'Usuarios', 'Ingresos']
            .map(
              (t) => `
            <ui-card variant="outlined">
              <span slot="header">${t}</span>
              <ui-progress value="${40 + t.length * 8}" show-value label="Meta"></ui-progress>
            </ui-card>`
            )
            .join('')}
        </ui-grid>
      </ui-stack>

      <span slot="footer" style="opacity:.6;font-size:.85rem">© Acme</span>
    </ui-app-shell>`,
};

export const WithoutSidebar = {
  render: () => `
    <ui-app-shell>
      <strong slot="header">Acme</strong>
      <ui-card>Contenido sin barra lateral.</ui-card>
    </ui-app-shell>`,
};
