import gsap from 'gsap';

/**
 * Splits an element's text into individually-animatable characters and
 * plays a staggered rise-and-clip reveal. No external SplitText plugin needed.
 *
 * Usage:
 *   const heading = ref(null);
 *   onMounted(() => splitReveal(heading.value));
 */
export function splitReveal(el, { delay = 0, stagger = 0.02 } = {}) {
  if (!el) return null;

  const text = el.textContent;
  el.textContent = '';
  el.style.display = 'inline-block';

  const chars = [...text].map((char) => {
    const wrap = document.createElement('span');
    wrap.style.display = 'inline-block';
    wrap.style.overflow = 'hidden';
    wrap.style.verticalAlign = 'top';

    const inner = document.createElement('span');
    inner.style.display = 'inline-block';
    inner.textContent = char === ' ' ? '\u00A0' : char;

    wrap.appendChild(inner);
    el.appendChild(wrap);
    return inner;
  });

  return gsap.fromTo(
    chars,
    { yPercent: 120, opacity: 0 },
    {
      yPercent: 0,
      opacity: 1,
      duration: 0.9,
      ease: 'power4.out',
      stagger,
      delay,
    }
  );
}
