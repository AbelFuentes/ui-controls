export const define = (tag, cls) => {
  if (!customElements.get(tag)) customElements.define(tag, cls);
};
