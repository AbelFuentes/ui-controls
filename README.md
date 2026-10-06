# ui-controls

Controles UI atómicos como Web Components. Sin dependencias, funcionan en cualquier framework.

## Instalar

```bash
pnpm add @abelfuentes/ui-controls
```

## Usar

```js
import '@abelfuentes/ui-controls';
```

```html
<ui-theme-switch></ui-theme-switch>
```

Solo un control (sin cargar los demás):

```js
import '@abelfuentes/ui-controls/theme-switch';
```

## Controles

### `<ui-theme-switch>`

| Atributo | Valores | Default |
|----------|---------|---------|
| `size`   | `sm` `md` `lg` | `md` |
| `label`  | texto accesible | `Modo oscuro` |

CSS: `--ui-switch-size`, `--ui-accent`, `::part(track)`, `::part(thumb)`.

El tema se aplica en `<html>` como `data-theme`, clase `.dark` y `color-scheme`.

Anti-flash (pon esto en el `<head>` antes de pintar):

```html
<script>try{var t=localStorage.getItem('ui-theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t}catch(e){}</script>
```
