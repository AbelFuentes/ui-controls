export const define = (tag, cls) => {
  if (typeof customElements === 'undefined') return;
  if (!customElements.get(tag)) customElements.define(tag, cls);
};
