(() => {
  const stage = document.getElementById('paper-stage');
  if (!stage) return;
  const sheet = stage.querySelector('.paper-sheet');
  const creases = stage.querySelector('.paper-creases');
  const ball = stage.querySelector('.ball-surface');
  const reveal = stage.querySelector('.paper-reveal');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = value => Math.max(0, Math.min(1, value));
  function ease(value) {
    const t = clamp(value);
    return t * t * (3 - 2 * t);
  }

  let top = 0;
  let distance = 1;
  let previous = -1;
  let frame = 0;

  function render() {
    frame = 0;
    const progress = reduced.matches ? 0 : clamp((window.scrollY - top) / distance);
    if (progress === previous) return;
    previous = progress;
    const fold = ease((progress - .09) / .55);
    const scale = 1 - .91 * ease((progress - .20) / .58);
    const roll = ease((progress - .45) / .29);
    const exit = ease((progress - .80) / .19);

    sheet.style.transform = fold ? `perspective(950px) rotateX(${24 * fold}deg) rotateY(${-12 * fold}deg) rotateZ(${-22 * fold}deg) scale(${scale})` : 'none';
    sheet.style.opacity = 1 - roll;
    creases.style.opacity = fold * .92;
    ball.style.opacity = roll * (1 - exit);
    ball.style.transform = `rotate(${-40 * roll + 180 * exit}deg) translate(${45 * exit}vw, ${18 * exit}vh) scale(${.58 + .42 * roll - .38 * exit})`;
    reveal.style.opacity = ease((progress - .81) / .15);
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(render);
  }

  function measure() {
    const bounds = stage.getBoundingClientRect();
    top = bounds.top + window.scrollY;
    distance = Math.max(1, bounds.height - sheet.offsetHeight);
    schedule();
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', measure, { passive: true });
  window.addEventListener('pageshow', measure);
  reduced.addEventListener('change', measure);
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(stage);
  measure();
})();
