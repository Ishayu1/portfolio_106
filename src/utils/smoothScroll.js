function easeInOutQuint(t) {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
}

export function smoothScrollToElement(element, options = {}) {
  const duration = options.duration ?? 1250;
  if (!element || duration <= 0) {
    return;
  }

  const startY = window.scrollY;
  const targetY = element.getBoundingClientRect().top + startY;
  const delta = targetY - startY;
  const startTime = performance.now();

  function step(now) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + delta * easeInOutQuint(t));
    if (t < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

export function smoothScrollToTop(options = {}) {
  const duration = options.duration ?? 1250;
  const startY = window.scrollY;
  if (startY <= 0 || duration <= 0) {
    return;
  }

  const startTime = performance.now();

  function step(now) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY * (1 - easeInOutQuint(t)));
    if (t < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}
