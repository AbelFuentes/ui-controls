# ui-controls

Controles UI atómicos como Web Components. Sin dependencias, funcionan en cualquier framework.

## Instalar

```bash
pnpm add @TU-USUARIO/ui-controls
```

## Usar

```js
import '@TU-USUARIO/ui-controls';            // registra todos
import '@TU-USUARIO/ui-controls/button';     // o solo uno
```

```html
<ui-button>Continuar</ui-button>
<ui-input label="Correo" type="email" required></ui-input>
```

## Controles

| Etiqueta | Atributos principales | Evento |
|----------|-----------------------|--------|
| `ui-button` | `variant` `size` `pill` `icon` `block` `loading` `disabled` `type` | `click` |
| `ui-checkbox` | `checked` `indeterminate` `disabled` `size` | `change` |
| `ui-input` | `type` `label` `hint` `error` `required` `disabled` `size` | `input` `change` |
| `ui-radio-group` + `ui-radio` | `value` `orientation` `disabled` | `change` |
| `ui-segmented` + `<option>` | `value` `size` `disabled` | `change` |
| `ui-select` + `<option>` | `value` `label` `hint` `error` `required` `size` | `change` |
| `ui-slider` | `value` `min` `max` `step` `size` | `input` `change` |
| `ui-stepper` + `<li>` | `value` `orientation` `clickable` | `change` |
| `ui-tabs` + `<section data-tab>` | `value` `variant` `size` | `change` |
| `ui-textarea` | `rows` `autosize` `maxrows` `maxlength` `counter` | `input` `change` |
| `ui-theme-switch` | `size` `label` | `ui-theme-change` (window) |
| `ui-toggle` | `checked` `disabled` `size` | `change` |

Los controles de formulario son *form-associated*: funcionan con `<form>` nativo y `FormData` (`name`, `required`, `reset`).

## Tema

Variables CSS (todas opcionales):

`--ui-accent` `--ui-accent-2` `--ui-danger` `--ui-input-bg` `--ui-input-border` `--ui-surface` `--ui-text`  
Tamaño por control: `--ui-button-size`, `--ui-input-size`, etc.

El tema claro/oscuro se aplica en `<html>` como `data-theme`, clase `.dark` y `color-scheme`.

Anti-flash (en el `<head>`, antes de pintar):

```html
<script>try{var t=localStorage.getItem('ui-theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t}catch(e){}</script>
```
