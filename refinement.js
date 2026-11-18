(()=>{
  const stage=document.getElementById('paper-stage');
  if(!stage)return;
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
  const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
  const ease=x=>{const t=clamp(x);return t*t*(3-2*t)};
  let ticking=false;
  function render(){
    ticking=false;
    if(reduce.matches){stage.style.setProperty('--fold','0');stage.style.setProperty('--scale','1');stage.style.setProperty('--ball','0');stage.style.setProperty('--ball-exit','0');return}
    const rect=stage.getBoundingClientRect();
    const available=Math.max(1,rect.height-window.innerHeight);
    const p=clamp(-rect.top/available);
    const fold=ease((p-.09)/.55);
    const squeeze=ease((p-.20)/.58);
    const ball=ease((p-.45)/.29);
    const exit=ease((p-.80)/.19);
    stage.style.setProperty('--fold',fold.toFixed(4));
    stage.style.setProperty('--scale',(1-.91*squeeze).toFixed(4));
    stage.style.setProperty('--ball',ball.toFixed(4));
    stage.style.setProperty('--ball-exit',exit.toFixed(4));
    stage.style.setProperty('--ball-visibility',(ball*(1-exit)).toFixed(4));
    stage.style.setProperty('--reveal-opacity',ease((p-.81)/.15).toFixed(4));
  }
  function update(){if(!ticking){ticking=true;requestAnimationFrame(render)}}
  window.addEventListener('scroll',update,{passive:true});
  window.addEventListener('resize',update,{passive:true});
  reduce.addEventListener?.('change',update);
  update();
})();
