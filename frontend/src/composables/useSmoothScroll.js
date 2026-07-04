import { onMounted, onUnmounted } from 'vue';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenis;

export function useSmoothScroll() {
  onMounted(() => {
    lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  });

  onUnmounted(() => {
    lenis?.destroy();
  });

  return { lenis: () => lenis };
}

/**
 * Access the app-wide Lenis singleton from anywhere (e.g. a nav component
 * that needs to smooth-scroll to an anchor) without re-initializing it.
 * Falls back to native scrollIntoView if Lenis hasn't mounted yet.
 */
export function scrollToEl(target, opts = {}) {
  if (!target) return;
  if (lenis) {
    lenis.scrollTo(target, { offset: 0, duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 3), ...opts });
  } else {
    target.scrollIntoView({ behavior: 'smooth' });
  }
}