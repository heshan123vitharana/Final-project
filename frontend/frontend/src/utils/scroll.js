// Smooth scrolling utilities with easing and header offset support

export function getHeaderHeight(defaultHeight = 80) {
  const headerEl = typeof document !== 'undefined' ? document.querySelector('header') : null;
  return headerEl ? headerEl.offsetHeight : defaultHeight;
}

export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Easing function: easeInOutCubic
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Clamp helper
function clamp(val, min, max) {
  return Math.min(max, Math.max(min, val));
}

// Scroll speed preference (fast | normal | slow)
const SPEED_KEY = 'scrollSpeedPreference';
export function setScrollSpeed(speed) {
  try { localStorage.setItem(SPEED_KEY, speed); } catch { /* ignore */ }
}
export function getScrollSpeed() {
  try { return localStorage.getItem(SPEED_KEY) || 'normal'; } catch { return 'normal'; }
}

function getBaseDurationBySpeed() {
  const speed = getScrollSpeed();
  switch (speed) {
    case 'fast': return 450;
    case 'slow': return 900;
    default: return 700;
  }
}

// Smoothly scroll the window to a specific Y position
export function smoothScrollTo(targetY, options = {}) {
  const { duration = getBaseDurationBySpeed(), easing = easeInOutCubic } = options;
  if (typeof window === 'undefined') return;

  const startY = window.scrollY || window.pageYOffset;
  const distance = targetY - startY;

  if (prefersReducedMotion()) {
    window.scrollTo(0, targetY);
    return;
  }

  const startTime = performance.now();
  const totalDuration = clamp(Math.abs(duration * (Math.abs(distance) / 1200)), 300, 1100);

  function step(now) {
    const elapsed = now - startTime;
    const t = clamp(elapsed / totalDuration, 0, 1);
    const eased = easing(t);
    window.scrollTo(0, startY + distance * eased);
    if (elapsed < totalDuration) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

// Scroll an element into view accounting for a fixed header offset
export function scrollIntoViewWithOffset(el, offset = 0, options = {}) {
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const targetY = rect.top + (window.scrollY || window.pageYOffset) - offset;
  smoothScrollTo(targetY, options);
}
