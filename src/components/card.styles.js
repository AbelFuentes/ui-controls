export const styles = `
:host{display:block;font-size:var(--ui-card-size,16px);--pad:1.5em;
  --bg:var(--ui-surface,color-mix(in srgb,currentColor 6%,transparent))}
:host([hidden]){display:none!important}
:host([padding=none]){--pad:0}
:host([padding=sm]){--pad:1em}
:host([padding=lg]){--pad:2.25em}
:host(:focus-visible){outline:.15em solid var(--ui-accent,#6366f1);outline-offset:.2em;border-radius:1.25em}
*{box-sizing:border-box}

.card{position:relative;overflow:hidden;height:100%;border-radius:1.25em;background:var(--bg);
  box-shadow:0 .05em .15em rgb(0 0 0/.12),0 .8em 2em -.6em rgb(0 0 0/.3),
    inset 0 0 0 1px color-mix(in srgb,currentColor 10%,transparent);
  transition:transform .3s cubic-bezier(.34,1.4,.5,1),box-shadow .3s}
:host([variant=outlined]) .card{background:transparent;
  box-shadow:inset 0 0 0 1px color-mix(in srgb,currentColor 18%,transparent)}
:host([variant=soft]) .card{box-shadow:none;background:color-mix(in srgb,var(--ui-accent,#6366f1) 9%,transparent)}

:host([interactive]) .card{cursor:pointer}
:host([interactive]) .card:hover{transform:translateY(-.3em);
  box-shadow:0 .05em .15em rgb(0 0 0/.12),0 1.4em 2.6em -.6em rgb(0 0 0/.38),
    inset 0 0 0 1px color-mix(in srgb,var(--ui-accent,#6366f1) 55%,transparent)}
:host([interactive]) .card:active{transform:scale(.985)}

.media{overflow:hidden}
::slotted([slot=media]){display:block;width:100%;height:auto;object-fit:cover;transition:transform .6s cubic-bezier(.2,.8,.2,1)}
:host([interactive]) .card:hover ::slotted([slot=media]){transform:scale(1.05)}

.header{padding:var(--pad) var(--pad) 0;font-weight:600;font-size:1.1em;line-height:1.3}
.body{padding:var(--pad);line-height:1.55;opacity:.9}
.has-header .body{padding-top:.75em}
.footer{display:flex;align-items:center;gap:.75em;padding:.9em var(--pad);
  border-top:1px solid color-mix(in srgb,currentColor 10%,transparent)}
:host([padding=none]) .footer{padding:.9em 1em}
[hidden]{display:none!important}

@media (prefers-reduced-motion:reduce){*{transition-duration:.01ms!important}}
`;
