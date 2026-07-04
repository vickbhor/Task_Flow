<template>
  <!-- Ambient bioluminescent-orb backdrop behind the auth panel — evokes the
       "alien planet surface" mood from the design reference using soft glow
       orbs + drifting motion instead of illustrated characters, so it stays
       consistent with the rest of the app's abstract/glass visual language. -->
  <div ref="root" class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    <div ref="orb1" class="absolute w-72 h-72 md:w-96 md:h-96 rounded-full blur-3xl opacity-0"
      style="left: 6%; top: 18%; background: radial-gradient(circle, var(--color-nebula) 0%, transparent 70%);"></div>

    <div ref="orb2" class="absolute w-56 h-56 md:w-72 md:h-72 rounded-full blur-3xl opacity-0"
      style="right: 8%; top: 55%; background: radial-gradient(circle, var(--color-void-blue) 0%, transparent 70%);"></div>

    <div ref="orb3" class="absolute w-40 h-40 md:w-56 md:h-56 rounded-full blur-2xl opacity-0"
      style="left: 18%; bottom: 10%; background: radial-gradient(circle, var(--color-gold) 0%, transparent 70%);"></div>

    <!-- fine "spore" points drifting near the panel -->
    <span v-for="i in 14" :key="i" ref="motes" class="mote absolute rounded-full opacity-0"
      :style="moteStyle(i)"></span>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import gsap from 'gsap';

const root = ref(null);
const orb1 = ref(null);
const orb2 = ref(null);
const orb3 = ref(null);
const motes = ref([]);

const moteStyle = (i) => {
  const size = 2 + (i % 3);
  const colors = ['var(--color-nebula-soft)', 'var(--color-gold)', 'var(--color-void-blue)'];
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${(i * 37) % 100}%`,
    top: `${(i * 53) % 100}%`,
    background: colors[i % colors.length],
  };
};

onMounted(() => {
  gsap.set([orb1.value, orb2.value, orb3.value], { opacity: 0.16, scale: 0.8 });
  gsap.to(orb1.value, { opacity: 0.22, scale: 1, duration: 1.2, ease: 'power2.out' });
  gsap.to(orb2.value, { opacity: 0.18, scale: 1, duration: 1.2, delay: 0.15, ease: 'power2.out' });
  gsap.to(orb3.value, { opacity: 0.15, scale: 1, duration: 1.2, delay: 0.3, ease: 'power2.out' });

  // slow independent drift, like something breathing beneath the surface
  gsap.to(orb1.value, { x: 30, y: -20, duration: 9, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  gsap.to(orb2.value, { x: -24, y: 18, duration: 11, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  gsap.to(orb3.value, { x: 18, y: 24, duration: 8, repeat: -1, yoyo: true, ease: 'sine.inOut' });

  gsap.to(motes.value, {
    opacity: () => 0.25 + Math.random() * 0.35,
    duration: 2.2,
    stagger: { each: 0.12, repeat: -1, yoyo: true },
    ease: 'sine.inOut',
  });
  gsap.to(motes.value, {
    y: '+=14',
    duration: () => 4 + Math.random() * 3,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
});
</script>