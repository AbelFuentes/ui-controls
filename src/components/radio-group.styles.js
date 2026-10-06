export const styles = `
:host{display:flex;flex-direction:column;gap:.75em}
:host([orientation=horizontal]){flex-direction:row;flex-wrap:wrap;gap:1.25em}
:host([disabled]){opacity:.5;pointer-events:none}
`;
