import '../src/tokens.css';
import '../src/index.js';
import { setTheme } from '../src/core/theme.js';

// Cada story arranca en claro, sin leer localStorage ni el sistema.
const baseline = (storyFn) => {
  const root = document.documentElement;
  root.style.removeProperty('--ui-accent');
  root.style.removeProperty('--ui-accent-2');
  setTheme('light', { persist: false, animate: false });
  return storyFn();
};

export default {
  decorators: [baseline],
  parameters: {
    layout: 'centered',
    backgrounds: { disable: true, disabled: true },
  },
};
