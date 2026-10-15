# @abelfuentes/ui-controls · referencia para IA

Biblioteca de Web Components `ui-*` sin dependencias. Este archivo lista **todos los componentes, sus atributos válidos y cómo usarlos**. Si un componente, atributo o valor no aparece aquí, no existe.

## Cómo usarlos

```bash
pnpm add @abelfuentes/ui-controls
```

```js
import '@abelfuentes/ui-controls/tokens.css'; // tema claro/oscuro
import '@abelfuentes/ui-controls';            // registra todos los elementos
// o solo uno: import '@abelfuentes/ui-controls/button';
```

Sin build (CDN): `<script type="module" src="https://cdn.jsdelivr.net/npm/@abelfuentes/ui-controls/dist/ui-controls.min.js"></script>`

## Reglas (léelas primero)

1. **Son custom elements**, no componentes de React o Vue. Se usan como etiquetas: `<ui-button variant="soft">Guardar</ui-button>`. En React 19 + TypeScript ya están tipados al importar el paquete.
2. **Atributos booleanos: la presencia basta.** `<ui-button loading>` está cargando, y `loading="false"` TAMBIÉN. Para apagarlo, quita el atributo. En React 19 pasa `loading={false}` (React quita el atributo).
3. **Valores enumerados** (`variant`, `size`, `tone`...): solo los que se listan. Un valor desconocido se ignora y se usa el default (en TypeScript es un error de compilación).
4. **`size`**: `sm` | `md` (default) | `lg`, salvo que el componente indique otros valores.
5. **Eventos**: son `CustomEvent` con `detail`, nombre en minúsculas (`change`, `rowclick`, `toggle`...), con `bubbles` y `composed`. En React 19 escríbelos en minúsculas: `onchange`, `onrowclick`, `ontoggle`. `onInput`, `onClick` y `onKeyDown` funcionan normal. `onChange` en camelCase **no** se dispara con custom elements: usa `onchange`.
6. **Hijos con significado**: `<option>` en `ui-select`, `ui-segmented` y `ui-dropdown`; `<section data-tab>` en `ui-tabs`; `<section data-title>` en `ui-accordion`; `<li>` en `ui-stepper`. Los slots se eligen con `slot="nombre"`.
7. **Formularios**: `ui-input`, `ui-textarea`, `ui-select`, `ui-checkbox`, `ui-toggle`, `ui-radio-group`, `ui-segmented` y `ui-slider` participan en el `<form>` (`name`, `required`, `reset`, `FormData`). `<ui-button type="submit">` envía el formulario padre.
8. **Medidas**: los atributos de longitud (`aside-width`, `max-height`, `sidebar-width`...) aceptan un CSS length (`"18rem"`, `"240px"`) o un número, que se interpreta como `rem` (en `ui-avatar` y `ui-skeleton` el número son `px`).
9. **Breakpoints**: `sm` 640px · `md` 768px · `lg` 1024px · `xl` 1280px. Los atributos `collapse` y `cols-*` usan estos nombres.
10. **Datos complejos por propiedad JS**, no por atributo: `ui-table` recibe `columns` y `rows` como propiedades.

## Tema

- El tema vive en `<html>`: `data-theme="light|dark"`, clase `dark` y `color-scheme`. **No depende de ningún componente**: `ui-theme-switch` es solo una interfaz.
- `tokens.css` sigue al sistema (`prefers-color-scheme`) sin JS; `data-theme` lo fuerza.
- API: `import { setTheme, getTheme, toggleTheme, initTheme } from '@abelfuentes/ui-controls'`. `setTheme('dark', { persist, animate, origin })`.

Variables CSS (todas opcionales): `--ui-accent`, `--ui-accent-2`, `--ui-success`, `--ui-warning`, `--ui-danger`, `--ui-bg`, `--ui-surface`, `--ui-text`, `--ui-muted`, `--ui-border`, `--ui-font`.
Tamaño base por componente: `--ui-button-size`, `--ui-input-size`, `--ui-card-size`, etc. (`--ui-<tag sin "ui-">-size`).
Layout: `--ui-container-width`, `--ui-container-padding`, `--ui-section-padding`, `--ui-split-gap`, `--ui-split-offset`, `--ui-grid-gap`, `--ui-stack-gap`, `--ui-divider-spacing`, `--ui-toolbar-offset`, `--ui-navbar-height`, `--ui-navbar-padding`, `--ui-shell-sidebar-width`, `--ui-shell-aside-width`, `--ui-shell-header-height`, `--ui-shell-rail-width`, `--ui-shell-padding`.

## Índice

| Categoría | Componentes |
|---|---|
| Layout | `ui-app-shell` `ui-aspect-ratio` `ui-container` `ui-divider` `ui-grid` `ui-page-header` `ui-scroll-area` `ui-section` `ui-spacer` `ui-split` `ui-stack` `ui-toolbar` |
| Navegación | `ui-breadcrumb` `ui-nav` `ui-nav-group` `ui-nav-item` `ui-navbar` `ui-pagination` `ui-stepper` `ui-tabs` |
| Formularios | `ui-button` `ui-checkbox` `ui-input` `ui-radio` `ui-radio-group` `ui-segmented` `ui-select` `ui-slider` `ui-textarea` `ui-toggle` |
| Datos | `ui-accordion` `ui-avatar` `ui-badge` `ui-card` `ui-carousel` `ui-table` |
| Feedback | `ui-alert` `ui-progress` `ui-skeleton` `ui-spinner` `ui-toaster` (`toast()`) `ui-tooltip` |
| Overlays | `ui-dialog` `ui-drawer` `ui-dropdown` |
| Tema | `ui-theme-switch` |

---

## `ui-accordion`
Paneles que se expanden. Solo uno abierto a la vez, salvo `multiple`.
- Hijos: `<section data-title="Título" [open] [data-disabled]>contenido</section>`
- Atributos: `multiple`
- Eventos: `change` `{ index, open }`
- Ejemplo: `<ui-accordion><section data-title="¿Cómo pago?" open>Con tarjeta.</section><section data-title="¿Facturas?">En Ajustes.</section></ui-accordion>`

## `ui-alert`
Aviso en línea.
- Atributos: `tone` info (default) | success | warning | danger · `dismissible`
- Slots: default (mensaje) · `title`
- Eventos: `close` · JS: `dismiss()`, `show()`
- Ejemplo: `<ui-alert tone="warning" dismissible><span slot="title">Atención</span>Tu sesión expira pronto.</ui-alert>`

## `ui-app-shell`
Estructura de aplicación: header sticky, sidebar, contenido, panel derecho y footer. Bajo 768px el sidebar es un drawer; el panel derecho se oculta bajo 1024px.
- Slots: `header` · `sidebar` · default (contenido principal) · `aside` (panel derecho) · `footer`. Las zonas vacías no ocupan espacio.
- Atributos: `collapsed` (sidebar oculto; con `rail` queda como rail de iconos) · `open` (drawer móvil) · `rail` · `no-burger` · `sidebar-width` (16rem) · `aside-width` (18rem) · `header-height` (4rem) · `rail-width` (4.5rem)
- Eventos: `toggle` `{ open, collapsed }` · JS: `toggle()`, `close()`, `mobile`
- Con `rail` + `collapsed`, los `ui-nav` del sidebar reciben `rail` solos (solo iconos).
- Ejemplo: `<ui-app-shell rail><strong slot="header">Acme</strong><ui-nav slot="sidebar">…</ui-nav><ui-container>…</ui-container></ui-app-shell>`

## `ui-aspect-ratio`
Contenedor que mantiene una proporción; su único hijo (img, video, iframe, div) lo llena.
- Atributos: `ratio` "16/9" (default), "4/3", "4:3" o un número ("1.5") · `fit` cover (default) | contain · `rounded`
- Ejemplo: `<ui-aspect-ratio ratio="4/3" rounded><img src="a.jpg" alt=""></ui-aspect-ratio>`

## `ui-avatar`
Foto o iniciales con color generado por el nombre.
- Atributos: `src` · `name` · `alt` · `size` xs | sm | md (default) | lg | xl | número (px) | CSS length · `status` online | busy | away | offline · `square`
- Ejemplo: `<ui-avatar name="Ana López" size="lg" status="online"></ui-avatar>`

## `ui-badge`
Etiqueta pequeña.
- Atributos: `tone` accent (default) | success | warning | danger | neutral · `variant` soft (default) | solid | outline · `size` · `dot` · `pulse` (con `dot`)
- Ejemplo: `<ui-badge tone="success" dot pulse>En vivo</ui-badge>`

## `ui-breadcrumb`
Ruta de navegación. El último hijo se marca como página actual.
- Hijos: `<a href>` y un `<span>` final
- Atributos: `label` (nombre accesible)
- Ejemplo: `<ui-breadcrumb><a href="/">Inicio</a><a href="/p">Proyectos</a><span>Acme</span></ui-breadcrumb>`

## `ui-button`
Botón. Con `type="submit"` o `"reset"` actúa sobre el `<form>` padre.
- Atributos: `variant` solid (default) | soft | outline | ghost · `size` · `type` button (default) | submit | reset · `pill` · `icon` (solo icono, cuadrado) · `block` (ancho completo) · `loading` · `disabled` · `label` (aria-label, obligatorio si es `icon`)
- Slots: default (texto) · `start` / `end` (iconos svg)
- Eventos: `click` · JS: `type`, `disabled`, `loading`, `focus()`
- Color de peligro: `style="--ui-accent:#ef4444;--ui-accent-2:#f97316"`
- Ejemplo: `<ui-button variant="soft" size="sm"><svg slot="start">…</svg>Guardar</ui-button>`

## `ui-card`
Tarjeta con secciones opcionales (las vacías se ocultan).
- Atributos: `variant` elevated (default) | outlined | soft · `padding` none | sm | md (default) | lg · `interactive` (hover, foco y Enter/Espacio emiten `click`)
- Slots: `media` (arriba, sin relleno) · `header` · default (cuerpo) · `footer`
- Ejemplo: `<ui-card variant="outlined" interactive><img slot="media" src="a.jpg" alt=""><span slot="header">Título</span>Texto<ui-button slot="footer" size="sm">Ver</ui-button></ui-card>`

## `ui-carousel`
Carrusel con swipe, arrastre con mouse, flechas, puntos y teclado. Cada hijo directo es una diapositiva.
- Atributos: `per-view` (diapositivas visibles, 1) · `autoplay` (ms; vacío = 5000; ausente = apagado) · `loop` · `no-arrows` · `no-dots` · `label`
- Eventos: `change` `{ index }` · JS: `index`, `next()`, `prev()`, `goTo(i)`
- CSS: `--ui-carousel-aspect` (16/9), `--ui-carousel-gap`
- Ejemplo: `<ui-carousel autoplay loop per-view="3" label="Destacados"><ui-card>…</ui-card><ui-card>…</ui-card></ui-carousel>`

## `ui-checkbox`
Casilla con texto.
- Atributos: `checked` · `indeterminate` · `disabled` · `size` · `label` (aria-label) · `name` · `value` (valor del form, "on" por defecto)
- Slots: default (texto)
- Eventos: `change` `{ checked }`
- Ejemplo: `<ui-checkbox name="terms" required>Acepto los términos</ui-checkbox>`

## `ui-container`
Centra el contenido con ancho máximo y relleno lateral.
- Atributos: `size` sm (40rem) | md (56rem) | lg (72rem, default) | xl (88rem) | full · `padding` none | sm | md (default) | lg · `center` (texto centrado)
- CSS: `--ui-container-width`, `--ui-container-padding`
- Ejemplo: `<ui-container size="md"><h1>Hola</h1></ui-container>`

## `ui-dialog`
Diálogo modal (usa `<dialog>`): foco atrapado, Esc y clic fuera cierran.
- Atributos: `open` · `size` sm | md (default) | lg | xl · `persistent` (no cierra con Esc ni clic fuera) · `no-close` (sin botón ×)
- Slots: `header` · default · `footer`
- Eventos: `open`, `close` · JS: `open`, `show()`, `close()`
- Ejemplo: `<ui-dialog id="d"><span slot="header">¿Eliminar?</span>No se puede deshacer.<ui-button slot="footer">Eliminar</ui-button></ui-dialog>` y `d.show()`

## `ui-divider`
Línea separadora, con etiqueta opcional.
- Atributos: `orientation` horizontal (default) | vertical · `align` start | center (default) | end (posición de la etiqueta) · `spacing` none | sm | md (default) | lg · `tone` default | strong
- Slots: default (etiqueta, p. ej. "o continúa con")
- Ejemplo: `<ui-divider>o continúa con</ui-divider>`

## `ui-drawer`
Panel lateral modal; mismo API que `ui-dialog`.
- Atributos: `open` · `side` right (default) | left | bottom · `size` sm | md (default) | lg · `persistent` · `no-close`
- Slots: `header` · default · `footer`
- Eventos: `open`, `close` · JS: `show()`, `close()`
- Ejemplo: `<ui-drawer side="left" size="sm"><span slot="header">Filtros</span>…</ui-drawer>`

## `ui-dropdown`
Menú desplegable anclado a un disparador. Usa la capa superior del navegador (no lo recorta ningún `overflow`).
- Slots: `trigger` (un solo elemento, p. ej. `ui-button`)
- Hijos: `<option value="x" [data-shortcut="⌘E"] [data-danger] [disabled]>Texto</option>` · `<option data-separator></option>`
- Atributos: `placement` bottom-start (default) | bottom-end | bottom | top-start | top-end | top · `disabled`
- Eventos: `select` `{ value }` · JS: `open()`, `close()`, `toggle()`
- Ejemplo: `<ui-dropdown placement="bottom-end"><ui-button slot="trigger" variant="ghost">Acciones</ui-button><option value="edit">Editar</option><option value="del" data-danger>Eliminar</option></ui-dropdown>`

## `ui-grid`
Rejilla CSS. Sin `cols` usa columnas automáticas de ancho mínimo `min`.
- Atributos: `cols` (columnas fijas) · `cols-sm` / `cols-md` / `cols-lg` / `cols-xl` (columnas desde ese breakpoint, mobile-first) · `min` (ancho mínimo de columna automática, 14rem) · `rows` (número = filas iguales, o un valor CSS) · `gap` none | xs | sm | md (default) | lg | xl · `align` start | center | end | stretch · `justify` start | center | end · `dense`
- Ejemplo: `<ui-grid cols="1" cols-md="2" cols-xl="4" gap="lg"><ui-card>…</ui-card>…</ui-grid>`

## `ui-input`
Campo de texto con label flotante y validación nativa.
- Atributos: `type` text (default) | email | password | number | url | tel | search · `label` · `placeholder` · `hint` (ayuda) · `error` (mensaje de error forzado) · `name` · `value` · `required` · `disabled` · `readonly` · `maxlength` · `minlength` · `min` · `max` · `step` · `pattern` · `autocomplete` · `inputmode` · `size`
- Slots: `start` / `end` (iconos)
- Eventos: `input`, `change` · JS: `value`, `type`, `validity`, `checkValidity()`, `reportValidity()`, `focus()`, `select()`
- `type="password"` muestra el botón de ojo solo.
- Ejemplo: `<ui-input type="email" label="Correo" name="email" required hint="Te escribimos solo a ti"></ui-input>`

## `ui-nav`
Menú de navegación de enlaces o botones (sidebar o barra).
- Hijos: `ui-nav-item` y `ui-nav-group`
- Atributos: `label` (aria-label) · `orientation` vertical (default) | horizontal · `rail` (solo iconos) · `value` (valor del item activo)
- Eventos: `change` `{ value }` (al elegir un `ui-nav-item` que tenga `value`)
- Ejemplo: `<ui-nav value="home" label="Principal"><ui-nav-item value="home">Inicio</ui-nav-item><ui-nav-item value="docs">Docs</ui-nav-item></ui-nav>`

## `ui-nav-group`
Grupo de items con título; puede colapsarse.
- Atributos: `label` (título) · `collapsible` · `collapsed` · en rail el título se oculta
- Eventos: `toggle` `{ collapsed }`
- Ejemplo: `<ui-nav-group label="Equipo" collapsible><ui-nav-item>Miembros</ui-nav-item></ui-nav-group>`

## `ui-nav-item`
Elemento de menú. Con `href` es un enlace; sin `href`, un botón.
- Atributos: `href` · `target` · `value` (para el `value` de `ui-nav`) · `active` · `disabled` · `label` (nombre accesible en rail)
- Slots: default (texto) · `icon` (svg) · `end` (insignia o atajo)
- Ejemplo: `<ui-nav-item href="/ajustes" active><svg slot="icon">…</svg>Ajustes<ui-badge slot="end" size="sm">3</ui-badge></ui-nav-item>`

## `ui-navbar`
Barra superior. Bajo el breakpoint `collapse` los enlaces pasan a un menú con botón hamburguesa.
- Slots: `brand` · default (enlaces `<a>`; `aria-current="page"` marca el actual) · `actions` (siempre visibles)
- Atributos: `sticky` · `variant` surface (default) | transparent · `collapse` sm | md (default) | lg | xl | none · `links-align` start (default) | center | end · `open` (menú móvil) · `label`
- Eventos: `toggle` `{ open }` · JS: `open`, `toggle()`, `close()`
- Ejemplo: `<ui-navbar sticky><a slot="brand" href="/">Acme</a><a href="/docs">Docs</a><ui-button slot="actions" size="sm">Entrar</ui-button></ui-navbar>`

## `ui-page-header`
Encabezado de página: título, descripción, acciones, breadcrumb y tabs.
- Atributos: `heading` (título) · `description` · `level` 1–6 (aria-level, 1) · `size` md (default) | lg · `divider`
- Slots: `breadcrumb` · `title` · `description` · `actions` · `tabs` (los vacíos se ocultan)
- Ejemplo: `<ui-page-header heading="Facturas" description="Emite y cobra" divider><ui-button slot="actions">Nueva</ui-button></ui-page-header>`

## `ui-pagination`
Paginador con elipsis.
- Atributos: `page` (1) · `pages` (1) · `siblings` (páginas junto a la actual, 1) · `size`
- Eventos: `change` `{ page }`
- Ejemplo: `<ui-pagination page="3" pages="20"></ui-pagination>`

## `ui-progress`
Barra o anillo de progreso.
- Atributos: `value` (0–`max`) · `max` (100) · `indeterminate` · `circular` · `label` · `show-value` · `size`
- Ejemplo: `<ui-progress value="60" label="Subiendo" show-value></ui-progress>`

## `ui-radio`
Opción de radio. Úsala dentro de `ui-radio-group`.
- Atributos: `value` · `checked` · `disabled` · `size` · `label` (aria-label)
- Slots: default (texto)
- Eventos: `change` `{ value }`
- Ejemplo: `<ui-radio value="a">Opción A</ui-radio>`

## `ui-radio-group`
Grupo de selección única con teclado (flechas, Home, End).
- Hijos: `ui-radio`
- Atributos: `value` · `name` · `label` (aria-label) · `orientation` vertical (default) | horizontal · `disabled`
- Eventos: `change` `{ value }`
- Ejemplo: `<ui-radio-group name="plan" value="pro" orientation="horizontal"><ui-radio value="free">Free</ui-radio><ui-radio value="pro">Pro</ui-radio></ui-radio-group>`

## `ui-scroll-area`
Zona con scroll estilizado y desvanecido en los bordes.
- Atributos: `direction` vertical (default) | horizontal | both · `max-height` · `max-width` · `fade` · `hide-scrollbar` · `label` (aria-label cuando hay desborde)
- Ejemplo: `<ui-scroll-area max-height="20" fade>…contenido largo…</ui-scroll-area>`

## `ui-section`
Banda de página a todo el ancho con contenido centrado.
- Atributos: `tone` none (default) | soft | surface | accent | dark · `padding` none | sm | md (default) | lg | xl · `size` sm | md | lg (default) | xl | full (ancho del contenido interno) · `center`
- CSS: `--ui-section-padding`
- Ejemplo: `<ui-section tone="accent" padding="xl" center><h2>Empieza hoy</h2></ui-section>`

## `ui-segmented`
Selector de una opción con indicador deslizante.
- Hijos: `<option value="x" [disabled]>Texto</option>`
- Atributos: `value` · `size` · `disabled` · `label` (aria-label) · `name`
- Eventos: `change` `{ value }`
- Ejemplo: `<ui-segmented value="month"><option value="month">Mensual</option><option value="year">Anual</option></ui-segmented>`

## `ui-select`
Lista desplegable con teclado y búsqueda por letras.
- Hijos: `<option value="x" [disabled]>Texto</option>`
- Atributos: `value` · `label` · `placeholder` · `hint` · `error` · `name` · `required` · `disabled` · `size`
- Slots: `start` (icono)
- Eventos: `change` `{ value }`
- Ejemplo: `<ui-select label="País" name="pais" required><option value="mx">México</option><option value="co">Colombia</option></ui-select>`

## `ui-skeleton`
Marcador de carga.
- Atributos: `variant` text (default) | rect | circle · `lines` (con `text`) · `width` · `height` (número = px)
- Ejemplo: `<ui-skeleton variant="text" lines="3"></ui-skeleton>`

## `ui-slider`
Control deslizante con tooltip y teclado.
- Atributos: `value` · `min` (0) · `max` (100) · `step` (1) · `size` · `disabled` · `label` (aria-label) · `name`
- Eventos: `input` `{ value }` (al arrastrar), `change` `{ value }` (al soltar)
- Ejemplo: `<ui-slider min="0" max="50" step="5" value="10" label="Volumen"></ui-slider>`

## `ui-spacer`
Espacio flexible: empuja hermanos en un contenedor flex. Con `size` ocupa un tamaño fijo.
- Atributos: `size` (longitud fija; sin él, crece)
- Ejemplo: `<ui-stack direction="row"><strong>Logo</strong><ui-spacer></ui-spacer><ui-button>Entrar</ui-button></ui-stack>`

## `ui-spinner`
Indicador de carga circular.
- Atributos: `size` sm | md (default) | lg | xl · `label` (aria-label, "Cargando")
- Ejemplo: `<ui-spinner size="lg"></ui-spinner>`

## `ui-split`
Contenido principal más panel lateral. Bajo el breakpoint `collapse` se apila.
- Slots: default (principal) · `aside`
- Atributos: `side` right (default) | left (posición del panel) · `aside-width` (20rem) · `gap` none | sm | md (default) | lg | xl · `sticky` (el panel se queda fijo al hacer scroll) · `collapse` sm | md (default) | lg | xl | none
- CSS: `--ui-split-gap`, `--ui-split-offset`
- Ejemplo: `<ui-split side="left" aside-width="16rem" sticky><ui-nav slot="aside">…</ui-nav><article>…</article></ui-split>`

## `ui-stack`
Apila hijos con espacio uniforme (flexbox).
- Atributos: `direction` column (default) | row · `gap` none | xs | sm | md (default) | lg | xl · `align` start | center | end | stretch · `justify` start | center | end | between · `wrap` · `divider` (línea entre hijos) · `inline` · `reverse` · `collapse` sm | md | lg | xl (una fila pasa a columna bajo ese breakpoint; sin el atributo no colapsa)
- Ejemplo: `<ui-stack direction="row" gap="sm" collapse="md" align="center"><ui-button>A</ui-button><ui-button>B</ui-button></ui-stack>`

## `ui-stepper`
Pasos de un flujo.
- Hijos: `<li data-description="texto opcional">Título</li>`
- Atributos: `value` (paso actual desde 1; n+1 = todo completado) · `orientation` horizontal (default) | vertical · `clickable` (permite volver a pasos previos) · `size` · `label`
- Eventos: `change` `{ value }` · JS: `value`, `next()`, `prev()`
- Ejemplo: `<ui-stepper value="2"><li>Cuenta</li><li>Plan</li><li>Pago</li></ui-stepper>`

## `ui-table`
Tabla con orden, selección, filas clickables y estado vacío. Se configura por propiedades JS.
- Propiedades: `columns` (`{ key, label, sortable, hidden, align: 'left'|'center'|'right', width, render(row), sortValue(row) }[]`) · `rows` (objetos) · `selection` · `selectedKeys` · `clearSelection()`
- Atributos: `selectable` (varias, o `"single"` para una) · `clickable` (filas enfocables; emiten `rowclick`) · `striped` · `compact` · `loading` · `manual-sort` (el orden lo hace el servidor) · `empty` (texto vacío) · `label` · `max-height` (scroll con encabezado fijo) · `row-key` (clave de fila; conserva la selección entre páginas) · `sort-key` · `sort-dir` asc | desc
- Slots: `empty` (contenido vacío propio)
- Eventos: `sort` `{ key, dir }` · `select` `{ rows, keys }` · `rowclick` `{ row, index }` (no se emite al hacer clic en botones, enlaces o inputs de la celda)
- Ejemplo: `<ui-table clickable striped></ui-table>` y luego `t.columns = [{ key: 'name', label: 'Nombre', sortable: true }]; t.rows = [{ name: 'Ana' }];`

## `ui-tabs`
Pestañas con indicador deslizante.
- Hijos: `<section data-tab="id" data-label="Texto" [data-disabled]>contenido</section>`
- Atributos: `value` (id de la pestaña activa) · `variant` line (default) | pill · `size` · `label`
- Eventos: `change` `{ value }`
- Ejemplo: `<ui-tabs value="a"><section data-tab="a" data-label="General">…</section><section data-tab="b" data-label="Equipo">…</section></ui-tabs>`

## `ui-textarea`
Área de texto con label flotante, autoajuste y contador.
- Atributos: `label` · `placeholder` · `hint` · `error` · `name` · `value` · `required` · `disabled` · `readonly` · `rows` (3) · `maxrows` · `maxlength` · `minlength` · `autosize` · `counter` · `size`
- Eventos: `input`, `change` · JS: `value`, `validity`, `checkValidity()`, `reportValidity()`, `focus()`, `select()`
- Ejemplo: `<ui-textarea label="Mensaje" autosize rows="2" maxrows="8" maxlength="500"></ui-textarea>`

## `ui-theme-switch`
Interruptor claro/oscuro (sol y luna). Llama a `setTheme()`; emite el evento global `ui-theme-change` `{ theme }` en `window`.
- Atributos: `size` · `label`
- Ejemplo: `<ui-theme-switch size="sm"></ui-theme-switch>`

## `ui-toaster`
Notificaciones emergentes. Se crea solo al llamar a `toast()`; no necesitas escribir la etiqueta.
- Atributos: `placement` bottom-right (default) | bottom-left | bottom-center | top-right | top-left | top-center
- API: `import { toast } from '@abelfuentes/ui-controls'` · `toast(mensaje, { title, tone: 'info'|'success'|'warning'|'danger', duration })` · atajos `toast.success()`, `toast.info()`, `toast.warning()`, `toast.danger()` · `duration: 0` = no se cierra solo · devuelve una función que lo cierra
- Ejemplo: `toast.success('Guardado', { title: 'Listo' })`

## `ui-toggle`
Interruptor on/off.
- Atributos: `checked` · `disabled` · `size` · `label` (aria-label) · `name` · `value`
- Eventos: `change` `{ checked }`
- Ejemplo: `<ui-toggle name="push" checked label="Notificaciones"></ui-toggle>`

## `ui-toolbar`
Barra horizontal con zonas inicio, centro y fin.
- Slots: `start` · default (centro) · `end`
- Atributos: `variant` plain (default) | surface | soft | floating · `size` · `sticky` · `wrap`
- CSS: `--ui-toolbar-offset`
- Ejemplo: `<ui-toolbar variant="surface"><strong slot="start">Proyectos</strong><ui-button slot="end" size="sm">Nuevo</ui-button></ui-toolbar>`

## `ui-tooltip`
Tooltip al pasar el mouse o enfocar. Envuelve un elemento.
- Atributos: `text` · `placement` top (default) | bottom | left | right · `delay` (ms, 250)
- Slots: default (el elemento que dispara) · `content` (contenido rico en lugar de `text`)
- Ejemplo: `<ui-tooltip text="Guardar" placement="bottom"><ui-button icon label="Guardar">…</ui-button></ui-tooltip>`

---

## Recetas

**Página con barra, contenido y panel lateral**
```html
<ui-navbar sticky><a slot="brand" href="/">Acme</a><a href="/docs">Docs</a><ui-theme-switch slot="actions" size="sm"></ui-theme-switch></ui-navbar>
<ui-container>
  <ui-page-header heading="Documentación" description="Guías y referencia" divider></ui-page-header>
  <ui-split side="left" aside-width="14rem" sticky>
    <ui-nav slot="aside" label="Secciones"><ui-nav-item href="#a" active>Inicio</ui-nav-item></ui-nav>
    <article>…</article>
  </ui-split>
</ui-container>
```

**Formulario**
```html
<form>
  <ui-stack gap="lg">
    <ui-input name="email" type="email" label="Correo" required></ui-input>
    <ui-select name="rol" label="Rol"><option value="admin">Admin</option><option value="lector">Lector</option></ui-select>
    <ui-checkbox name="terms" required>Acepto los términos</ui-checkbox>
    <ui-button type="submit" block>Enviar</ui-button>
  </ui-stack>
</form>
```

**Panel de control**
```html
<ui-app-shell rail>
  <strong slot="header">Acme</strong><ui-spacer slot="header"></ui-spacer><ui-theme-switch slot="header" size="sm"></ui-theme-switch>
  <ui-nav slot="sidebar" value="home"><ui-nav-item value="home"><svg slot="icon">…</svg>Inicio</ui-nav-item></ui-nav>
  <ui-grid cols="1" cols-md="2" cols-xl="4"><ui-card variant="outlined">…</ui-card></ui-grid>
</ui-app-shell>
```
