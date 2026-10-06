export const styles = `
:host{display:block;font-size:var(--ui-textarea-size,16px);-webkit-tap-highlight-color:transparent}
:host([hidden]){display:none!important}
:host([size=sm]){font-size:13px}
:host([size=lg]){font-size:19px}
*{box-sizing:border-box}

.field{position:relative;padding:0 1em;border-radius:.9em;cursor:text;
  background:var(--ui-input-bg,color-mix(in srgb,currentColor 6%,transparent));
  box-shadow:inset 0 0 0 .08em var(--ui-input-border,color-mix(in srgb,currentColor 18%,transparent));
  transition:box-shadow .25s,background-color .25s}
.field:hover{box-shadow:inset 0 0 0 .08em color-mix(in srgb,currentColor 32%,transparent)}
.field:focus-within{box-shadow:inset 0 0 0 .13em var(--ui-accent,#6366f1),
  0 0 0 .3em color-mix(in srgb,var(--ui-accent,#6366f1) 22%,transparent)}
.field.invalid,.field.invalid:hover{box-shadow:inset 0 0 0 .13em var(--ui-danger,#ef4444)}
.field.invalid:focus-within{box-shadow:inset 0 0 0 .13em var(--ui-danger,#ef4444),
  0 0 0 .3em color-mix(in srgb,var(--ui-danger,#ef4444) 22%,transparent)}
:host([disabled]) .field{opacity:.5;pointer-events:none}

.box{position:relative}
.ta{display:block;width:100%;margin:0;border:0;outline:0;background:transparent;color:inherit;font:inherit;
  line-height:1.5;padding:1.75em 0 .8em;resize:vertical;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere}
.nolabel .ta{padding-top:.9em}
:host([autosize]) .ta{resize:none}
.ta::placeholder{color:currentColor;opacity:0;transition:opacity .2s}
.ta:focus::placeholder,.nolabel .ta::placeholder{opacity:.4}

.label{position:absolute;left:0;top:1.75em;line-height:1.5;transform-origin:left top;pointer-events:none;
  white-space:nowrap;opacity:.6;
  transition:transform .25s cubic-bezier(.4,0,.2,1),opacity .2s,color .2s}
.ta:focus ~ .label,.ta:not(:placeholder-shown) ~ .label{transform:translateY(-1.3em) scale(.75);opacity:.85}
.field:focus-within .label{color:var(--ui-accent,#6366f1);opacity:1}
.invalid .label{color:var(--ui-danger,#ef4444)}

.foot{display:flex;justify-content:space-between;gap:1em;padding:.45em .25em 0;font-size:.82em;line-height:1.3}
.foot.empty{display:none}
.msg{opacity:.65}
.msg.err{color:var(--ui-danger,#ef4444);opacity:1}
.count{margin-left:auto;opacity:.55;font-variant-numeric:tabular-nums}
.count.max{color:var(--ui-danger,#ef4444);opacity:1}

@media (prefers-reduced-motion:reduce){*{transition-duration:.01ms!important}}
`;
