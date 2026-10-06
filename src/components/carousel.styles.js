export const styles = `
:host{display:block;font-size:var(--ui-carousel-size,16px);--gap:var(--ui-carousel-gap,1em)}
:host([hidden]){display:none!important}
*{box-sizing:border-box}

.root{position:relative;--pv:var(--ui-carousel-per-view,1)}

.track{position:relative;display:flex;gap:var(--gap);overflow-x:auto;overscroll-behavior-x:contain;
  scroll-snap-type:x mandatory;scroll-behavior:smooth;scrollbar-width:none;cursor:grab;outline:none;border-radius:1.1em}
.track::-webkit-scrollbar{display:none}
.track.drag{scroll-snap-type:none;scroll-behavior:auto;cursor:grabbing;user-select:none}
.track:focus-visible{outline:.15em solid var(--ui-accent,#6366f1);outline-offset:.2em}

::slotted(*){flex:0 0 calc((100% - (var(--pv) - 1) * var(--gap)) / var(--pv));min-width:0;
  scroll-snap-align:start;border-radius:1.1em;overflow:hidden}
::slotted(img){display:block;width:100%;aspect-ratio:var(--ui-carousel-aspect,16/9);object-fit:cover;user-select:none}

.nav{all:unset;position:absolute;top:50%;z-index:2;width:2.6em;height:2.6em;margin-top:-1.3em;border-radius:50%;
  display:grid;place-items:center;cursor:pointer;color:#fff;
  background:rgb(0 0 0/.4);backdrop-filter:blur(10px);
  box-shadow:inset 0 0 0 1px rgb(255 255 255/.25),0 .3em 1em rgb(0 0 0/.3);
  opacity:0;transform:scale(.85);
  transition:opacity .25s,transform .3s cubic-bezier(.34,1.5,.5,1),background-color .2s}
.prev{left:.8em}
.next{right:.8em}
.root:hover .nav,.root:focus-within .nav{opacity:1;transform:none}
.nav:hover{background:rgb(0 0 0/.6)}
.nav:active{transform:scale(.92)}
.root:hover .nav[disabled],.root:focus-within .nav[disabled]{opacity:.3;cursor:default}
.nav:focus-visible{outline:.15em solid #fff;outline-offset:.1em}
.nav svg{width:1.3em;height:1.3em;fill:none;stroke:currentColor;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}
:host([no-arrows]) .nav{display:none}
@media (hover:none){.nav{display:none}}

.dots{position:absolute;left:50%;bottom:.9em;z-index:2;transform:translateX(-50%);display:flex;align-items:center;
  gap:.5em;padding:.55em .75em;border-radius:2em;background:rgb(0 0 0/.35);backdrop-filter:blur(8px)}
.dots[hidden]{display:none}
:host([no-dots]) .dots{visibility:hidden;pointer-events:none}

.dot{all:unset;position:relative;overflow:hidden;flex:none;width:.55em;height:.55em;border-radius:1em;cursor:pointer;
  background:rgb(255 255 255/.45);
  transition:width .4s cubic-bezier(.34,1.4,.5,1),background-color .3s}
.dot:hover{background:rgb(255 255 255/.8)}
.dot[aria-current=true]{width:1.9em;background:rgb(255 255 255/.4)}
.dot::after{content:"";position:absolute;inset:0;border-radius:inherit;background:#fff;
  transform:scaleX(0);transform-origin:left}
.dot[aria-current=true]::after{transform:none}
.playing .dot[aria-current=true]::after{transform:scaleX(0);animation:fill var(--dur,5s) linear forwards}
.paused .dot[aria-current=true]::after{animation-play-state:paused}
.dot:focus-visible{outline:.15em solid #fff;outline-offset:.15em}
@keyframes fill{to{transform:scaleX(1)}}

@media (prefers-reduced-motion:reduce){
  .track{scroll-behavior:auto}
  *{transition-duration:.01ms!important}
}
`;
