export function place(el, anchor, placement = 'bottom-start', gap = 8) {
  const [side, align = 'center'] = placement.split('-');
  const a = anchor.getBoundingClientRect();
  const w = el.offsetWidth;
  const h = el.offsetHeight;
  const fits = {
    top: a.top - h - gap >= 8,
    bottom: a.bottom + h + gap <= innerHeight - 8,
    left: a.left - w - gap >= 8,
    right: a.right + w + gap <= innerWidth - 8,
  };
  const opposite = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };
  const s = !fits[side] && fits[opposite[side]] ? opposite[side] : side;
  let top;
  let left;
  if (s === 'top' || s === 'bottom') {
    top = s === 'top' ? a.top - h - gap : a.bottom + gap;
    left = align === 'start' ? a.left : align === 'end' ? a.right - w : a.left + (a.width - w) / 2;
  } else {
    left = s === 'left' ? a.left - w - gap : a.right + gap;
    top = align === 'start' ? a.top : align === 'end' ? a.bottom - h : a.top + (a.height - h) / 2;
  }
  el.style.left = `${Math.max(8, Math.min(left, innerWidth - w - 8))}px`;
  el.style.top = `${Math.max(8, Math.min(top, innerHeight - h - 8))}px`;
  return s;
}
