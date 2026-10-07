// jsdom no implementa ElementInternals completo: stub mínimo
HTMLElement.prototype.attachInternals = function () {
  return {
    setFormValue() {},
    setValidity() {},
    checkValidity: () => true,
    reportValidity: () => true,
    form: null,
    validity: {},
  };
};
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
globalThis.ResizeObserver ??= class { observe() {} unobserve() {} disconnect() {} };
