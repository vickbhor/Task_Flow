import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Ties an element's 3D rotation to scroll progress through a trigger section.
 * As the user scrolls through `triggerEl`, `flipEl` rotates on X, scales down
 * slightly and dims — the "background image flips away in 3D" effect.
 *
 * Usage:
 *   useScrollFlip(triggerRef.value, imageRef.value);
 */
export function useScrollFlip(triggerEl, flipEl, opts = {}) {
  if (!triggerEl || !flipEl) return null;

  const { maxRotate = -55, endScale = 0.82, endBrightness = 0.35 } = opts;

  gsap.set(flipEl, { transformPerspective: 1200, transformOrigin: '50% 100%' });

  return gsap.timeline({
    scrollTrigger: {
      trigger: triggerEl,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.6,
    },
  }).to(flipEl, {
    rotateX: maxRotate,
    scale: endScale,
    filter: `brightness(${endBrightness})`,
    ease: 'none',
  });
}

/**
 * Simple "appear at the end" reveal: fades/rises an element in once its
 * trigger enters the viewport. Not scrubbed — plays once, like arriving.
 */
export function useArrival(el, { y = 40, delay = 0 } = {}) {
  if (!el) return null;

  gsap.set(el, { opacity: 0, y });

  return gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 1,
    delay,
    ease: 'power4.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
      toggleActions: 'play none none reverse',
    },
  });
}
