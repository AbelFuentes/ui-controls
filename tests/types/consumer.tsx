import '@abelfuentes/ui-controls';
import '@abelfuentes/ui-controls/button';
import { useEffect, useRef, useState } from 'react';
import { toast, setTheme } from '@abelfuentes/ui-controls';
import type { TableColumn, UIDrawer, UIInput, UITable } from '@abelfuentes/ui-controls';

const columns: TableColumn[] = [
  { key: 'name', label: 'Nombre', sortable: true },
  { key: 'role', label: 'Rol', sortable: true },
  { key: 'score', label: 'Puntaje', align: 'right', sortValue: (r) => Number(r.score) },
];
const rows = [{ id: 1, name: 'Ana', role: 'Diseño', score: 92 }];

export function App() {
  const ref = useRef<UIInput>(null);
  const table = useRef<UITable>(null);
  const drawer = useRef<UIDrawer>(null);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const t = table.current;
    if (!t) return;
    // eventos tipados sin React
    t.addEventListener('rowclick', (e) => console.log(e.detail.row.id, e.detail.index));
    t.addEventListener('select', (e) => console.log(e.detail.keys, e.detail.rows.length));
    t.addEventListener('sort', (e) => console.log(e.detail.key, e.detail.dir));
    t.selection = [];
    t.clearSelection();
    console.log(t.selectedKeys.length);
    drawer.current?.show();
    drawer.current?.close();
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        toast.success('Hola', { title: 'Listo' });
        setTheme('dark');
      }}
    >
      <ui-stack gap="md" align="stretch">
        <ui-input
          ref={ref}
          type="email"
          label="Correo"
          placeholder="correo@ejemplo.com"
          required
          value={email}
          onInput={(e) => setEmail(e.currentTarget.value)}
        />
        <ui-slider min={0} max={100} step={5} value={40} oninput={(e) => console.log(e.detail.value)} />
        <ui-select label="País" value="mx" onchange={(e) => console.log(e.detail.value)}>
          <option value="mx">México</option>
        </ui-select>
        <ui-card variant="outlined" interactive>
          <span slot="header">Título</span>
          Contenido
        </ui-card>

        <ui-breadcrumb label="Ruta">
          <a href="/">Inicio</a>
          <span>Tabla</span>
        </ui-breadcrumb>

        <ui-table
          ref={table}
          clickable
          selectable="single"
          striped
          compact
          loading={false}
          row-key="id"
          sort-key="name"
          sort-dir="asc"
          max-height="24rem"
          label="Personas"
          columns={columns}
          rows={rows}
          onrowclick={(e) => console.log(e.detail.row.id, e.detail.index)}
          onselect={(e) => console.log(e.detail.keys)}
          onsort={(e) => console.log(e.detail.key, e.detail.dir)}
        />
        <ui-pagination page={1} pages={10} onchange={(e) => console.log(e.detail.page)} />

        <ui-drawer ref={drawer} side="right" size="md" onclose={() => console.log('cerrado')}>
          <span slot="header">Detalle</span>
          Contenido
        </ui-drawer>

        <ui-button type="submit" block>
          Entrar
        </ui-button>

        {/* @ts-expect-error variante inválida */}
        <ui-button variant="nope">x</ui-button>
        {/* @ts-expect-error onChange camelCase no existe en custom elements de React */}
        <ui-input onChange={() => {}} />
        {/* @ts-expect-error valor inválido de selectable */}
        <ui-table selectable="triple" />
        {/* @ts-expect-error dirección de orden inválida */}
        <ui-table sort-dir="up" />
      </ui-stack>
    </form>
  );
}

export function LayoutDemo() {
  return (
    <ui-app-shell rail sidebar-width="15rem" aside-width={20} header-height={4} ontoggle={(e) => console.log(e.detail.collapsed)}>
      <ui-navbar slot="header" sticky collapse="lg" links-align="center" ontoggle={(e) => console.log(e.detail.open)}>
        <a slot="brand" href="/">Acme</a>
        <a href="/docs" aria-current="page">Docs</a>
      </ui-navbar>
      <ui-nav slot="sidebar" label="Principal" value="home" onchange={(e) => console.log(e.detail.value)}>
        <ui-nav-group label="General" collapsible>
          <ui-nav-item value="home" active>Inicio</ui-nav-item>
          <ui-nav-item href="/x" target="_blank" disabled>Externo</ui-nav-item>
        </ui-nav-group>
      </ui-nav>
      <ui-container size="lg" padding="lg" center>
        <ui-page-header heading="Facturas" description="Emite y cobra" level={2} divider size="lg" />
        <ui-split side="left" aside-width="18rem" gap="lg" sticky collapse="md">
          <ui-stack direction="row" gap="sm" divider collapse="md" align="center" justify="between" wrap reverse inline>
            <ui-spacer size={2} />
            <ui-divider orientation="vertical" spacing="sm" tone="strong" />
          </ui-stack>
          <ui-grid slot="aside" cols={1} cols-md={2} cols-xl="4" min={12} rows={2} gap="xs" align="center" justify="end" dense />
        </ui-split>
        <ui-section tone="accent" padding="xl" size="full" center>
          <ui-aspect-ratio ratio="16/9" fit="contain" rounded />
          <ui-scroll-area direction="both" max-height="12rem" max-width={20} fade hide-scrollbar label="Lista" />
          <ui-toolbar variant="floating" size="sm" sticky wrap />
        </ui-section>
        {/* @ts-expect-error tono inválido */}
        <ui-section tone="rojo" />
        {/* @ts-expect-error breakpoint inválido */}
        <ui-stack collapse="xxl" />
        {/* @ts-expect-error nivel inválido */}
        <ui-page-header level={7} />
        {/* @ts-expect-error direction no existe en split */}
        <ui-split direction="row" />
      </ui-container>
    </ui-app-shell>
  );
}
