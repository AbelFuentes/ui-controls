import '../src/tokens.css';
import '../src/index.js';
import { setTheme } from '../src/core/theme.js';

// El tema lo manda la barra de Storybook, no un componente ni localStorage.
// En Docs siempre claro: el lienzo de los docs de Storybook es blanco.
const withTheme = (storyFn, context) => {
  const theme = context.viewMode === 'docs' ? 'light' : context.globals.theme ?? 'light';
  const root = document.documentElement;
  root.style.removeProperty('--ui-accent');
  root.style.removeProperty('--ui-accent-2');
  setTheme(theme, { persist: false, animate: false });
  return storyFn();
};

export default {
  decorators: [withTheme],
  initialGlobals: { theme: 'light' },
  globalTypes: {
    theme: {
      description: 'Tema',
      toolbar: {
        title: 'Tema',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Claro', icon: 'sun' },
          { value: 'dark', title: 'Oscuro', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    layout: 'centered',
    backgrounds: { disable: true, disabled: true },
  },
};
