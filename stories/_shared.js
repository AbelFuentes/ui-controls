export const art = (a, b, label = '', w = 640, h = 360) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#g)"/><circle cx="${w * 0.78}" cy="${h * 0.28}" r="${h * 0.34}" fill="#fff" opacity=".16"/><circle cx="${w * 0.2}" cy="${h * 0.95}" r="${h * 0.45}" fill="#fff" opacity=".1"/>${label ? `<text x="${w * 0.06}" y="${h * 0.9}" font-family="system-ui,sans-serif" font-size="${h * 0.13}" font-weight="800" fill="#fff" opacity=".92">${label}</text>` : ''}</svg>`
  )}`;

export const money = (n) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n);

export const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export const icons = {
  check: 'M5 12.5l4.5 4.5L19 7',
  mail: 'M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2zM3 7l9 6 9-6',
  lock: 'M6 11h12v9H6zM8 11V8a4 4 0 018 0v3',
  search: 'M11 4a7 7 0 100 14 7 7 0 000-14zM20 20l-4-4',
  bell: 'M6 16V11a6 6 0 1112 0v5l2 2H4zM10 20a2 2 0 004 0',
  star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z',
  truck: 'M3 6h11v10H3zM14 9h4l3 3v4h-7zM7 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM17 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z',
  cart: 'M3 4h2l2.5 11h10l2-8H6.5M9 20a1 1 0 100-2 1 1 0 000 2zM17 20a1 1 0 100-2 1 1 0 000 2z',
  user: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 20a8 8 0 0116 0',
  users: 'M9 11a3 3 0 100-6 3 3 0 000 6zM3 19a6 6 0 0112 0M16 5a3 3 0 010 6M18 19a6 6 0 00-3-5',
  heart: 'M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z',
  trash: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13',
  reply: 'M10 8l-5 4 5 4M5 12h9a5 5 0 015 5v1',
  plus: 'M12 5v14M5 12h14',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  help: 'M12 3a9 9 0 100 18 9 9 0 000-18zM9.5 9.5a2.5 2.5 0 014.2 1.8c0 1.7-2.2 1.7-2.2 3.2M12 17.5h.01',
  map: 'M12 21s-7-6-7-11a7 7 0 1114 0c0 5-7 11-7 11zM12 12a2 2 0 100-4 2 2 0 000 4z',
  share: 'M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1',
  calendar: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  more: 'M5 12h.01M12 12h.01M19 12h.01',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
  book: 'M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2zM4 19a2 2 0 012-2h13',
  card: 'M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2zM3 10h18',
  sliders: 'M4 7h10M18 7h2M4 17h2M10 17h10M14 4v6M6 14v6',
  zap: 'M13 2L4 14h7l-1 8 9-12h-7z',
  chart: 'M4 20V4M4 20h16M8 16v-4M12 16V8M16 16v-6',
  wifioff: 'M3 3l18 18M8.5 8.5A10 10 0 004 12M12 6a10 10 0 018 4M8 16a6 6 0 018 0M12 20h.01',
};

export const svg = (name, size = 18, slot = '') =>
  `<svg${slot ? ` slot="${slot}"` : ''} viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${icons[name]}"/></svg>`;

export const h = (html) => {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
};
