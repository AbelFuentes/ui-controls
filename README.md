# ui-controls

Componentes UI atómicos como Web Components. Sin dependencias, funcionan en cualquier framework (o sin ninguno).

## Instalar

    pnpm add @abelfuentes/ui-controls

## Usar

    import '@abelfuentes/ui-controls/tokens.css';   // tema claro/oscuro (opcional, recomendado)
    import '@abelfuentes/ui-controls';              // registra todos los componentes
    import '@abelfuentes/ui-controls/button';       // o solo uno

    <ui-button>Continuar</ui-button>
    <ui-input label="Correo" type="email" required></ui-input>

## Componentes

**Formularios:** `ui-button` `ui-checkbox` `ui-input` `ui-radio-group` + `ui-radio` `ui-segmented` `ui-select` `ui-slider` `ui-textarea` `ui-toggle`
Son *form-associated*: funcionan con `<form>` nativo, `FormData`, `required` y `reset`.

**Navegación:** `ui-breadcrumb` `ui-pagination` `ui-stepper` `ui-tabs` `ui-app-shell`

**Contenido:** `ui-accordion` `ui-avatar` `ui-badge` `ui-card` `ui-carousel` `ui-table`

**Feedback:** `ui-alert` `ui-progress` `ui-skeleton` `ui-spinner` `ui-toast` (`toast()`)

**Overlays:** `ui-dialog` `ui-drawer` `ui-dropdown` `ui-tooltip`

**Layout:** `ui-stack` `ui-grid` `ui-app-shell`

**Tema:** `ui-theme-switch` + `setTheme()`, `toggleTheme()`, `initTheme()`

## Tema

Variables CSS (todas opcionales):

    --ui-accent  --ui-accent-2  --ui-success  --ui-warning  --ui-danger
    --ui-bg  --ui-surface  --ui-text  --ui-muted  --ui-border

El tema se aplica en `<html>` como `data-theme`, clase `.dark` y `color-scheme`. Anti-flash (en el `<head>`):

    <script>try{var t=localStorage.getItem('ui-theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t}catch(e){}</script>

## Toasts

    import { toast } from '@abelfuentes/ui-controls/toast';
    toast.success('Cambios guardados', { title: 'Listo' });
