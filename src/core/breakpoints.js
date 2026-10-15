export const BP = { sm: 640, md: 768, lg: 1024, xl: 1280 };
export const below = (k) => `(max-width:${BP[k] - 0.02}px)`;
export const above = (k) => `(min-width:${BP[k]}px)`;

/**
 * CSS que se aplica por debajo del breakpoint elegido con el atributo `collapse`.
 * rules: [[sufijo de selector, declaraciones], ...]
 * optIn: sin atributo `collapse` no hace nada (si no, `md` es el valor por defecto)
 */
export function collapseCss(rules, { extra = '', optIn = false } = {}) {
  return Object.keys(BP)
    .map((k) => {
      const hosts = k === 'md' && !optIn
        ? [`:host(:not([collapse])${extra})`, `:host([collapse=md]${extra})`]
        : [`:host([collapse=${k}]${extra})`];
      const body = rules.map(([suffix, decl]) => `${hosts.map((h) => h + suffix).join(',')}{${decl}}`).join('');
      return `@media ${below(k)}{${body}}`;
    })
    .join('\n');
}
