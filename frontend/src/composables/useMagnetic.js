import { onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';

/**
 * Gives an element a subtle "magnetic pull" toward the cursor on hover.
 * Usage: const btn = ref(null); useMagnetic(btn);
 */
export function useMagnetic(targetRef, strength = 0.35) {
  let quickX, quickY;

  const onMove = (e) => {
    const el = targetRef.value;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    quickX(relX * strength);
    quickY(relY * strength);
  };

  const onLeave = () => {
    quickX(0);
    quickY(0);
  };

  onMounted(() => {
    const el = targetRef.value;
    if (!el) return;
    quickX = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    quickY = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
  });

  onUnmounted(() => {
    const el = targetRef.value;
    if (!el) return;
    el.removeEventListener('mousemove', onMove);
    el.removeEventListener('mouseleave', onLeave);
  });
}
