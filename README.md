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

## TypeScript y React

Los tipos van incluidos: no necesitas declarar nada en tu proyecto.

    import '@abelfuentes/ui-controls';

    <ui-input type="email" label="Correo" required value={email} onInput={(e) => setEmail(e.currentTarget.value)} />
    <ui-button type="submit" block>Entrar</ui-button>

Eventos en React 19: usa `onInput` para escribir y el nombre en minúsculas para los eventos propios
(`onchange`, `onclose`, `onselect`...), con `event.detail` tipado. `onChange` en camelCase no se dispara con
custom elements (limitación de React). Si no usas `skipLibCheck`, solo necesitas `@types/react` instalado.
