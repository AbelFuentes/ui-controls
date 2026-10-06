export const styles = `
:host{display:block;font-size:var(--ui-input-size,16px);-webkit-tap-highlight-color:transparent}
:host([hidden]){display:none!important}
:host([size=sm]){font-size:13px}
:host([size=lg]){font-size:19px}
*{box-sizing:border-box}

.field{position:relative;display:flex;align-items:center;gap:.6em;padding:0 1em;min-height:3.4em;border-radius:.9em;
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

.box{position:relative;flex:1;min-width:0;height:3.4em}
.input{all:unset;display:block;box-sizing:border-box;width:100%;height:100%;padding-top:1em;
  font:inherit;color:inherit;text-overflow:ellipsis;white-space:nowrap;overflow:hidden}
.nolabel .input{padding-top:0}
.input::placeholder{color:currentColor;opacity:0;transition:opacity .2s}
.input:focus::placeholder,.nolabel .input::placeholder{opacity:.4}

.label{position:absolute;left:0;top:50%;transform:translateY(-50%);transform-origin:left;
  pointer-events:none;white-space:nowrap;opacity:.6;
  transition:transform .25s cubic-bezier(.4,0,.2,1),opacity .2s,color .2s}
.input:focus ~ .label,.input:not(:placeholder-shown) ~ .label{
  transform:translateY(calc(-50% - .85em)) scale(.75);opacity:.85}
.field:focus-within .label{color:var(--ui-accent,#6366f1);opacity:1}
.invalid .label{color:var(--ui-danger,#ef4444)}

.eye{all:unset;display:grid;place-items:center;flex:none;width:1.9em;height:1.9em;border-radius:.6em;
  cursor:pointer;opacity:.6;transition:opacity .2s,background-color .2s}
.eye[hidden]{display:none}
.eye:hover{opacity:1;background:color-mix(in srgb,currentColor 10%,transparent)}
.eye:focus-visible{outline:.15em solid var(--ui-accent,#6366f1);outline-offset:.05em}
.eye svg{width:1.2em;height:1.2em;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}

::slotted(svg){width:1.2em;height:1.2em;flex:none;opacity:.6}

.msg{padding:.45em .25em 0;font-size:.82em;line-height:1.3;opacity:.65}
.msg:empty{display:none}
.msg.err{color:var(--ui-danger,#ef4444);opacity:1}

@media (prefers-reduced-motion:reduce){*{transition-duration:.01ms!important}}
`;
