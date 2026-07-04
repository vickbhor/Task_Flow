<template>
  <Teleport to="body">
    <Transition name="overlay-fade">
      <div v-if="visible" class="fixed inset-0 z-[9999] bg-void/90 backdrop-blur-sm flex items-center justify-center overflow-hidden pointer-events-none">
        <!-- streaking stars for a sense of speed -->
        <span v-for="i in 24" :key="i" ref="streakRefs" class="streak absolute w-px bg-gradient-to-t from-transparent via-gold/70 to-transparent"></span>

        <div ref="rig" class="relative">
          <svg width="72" height="120" viewBox="0 0 72 120" fill="none">
            <path d="M36 4 C50 22 56 48 52 78 L20 78 C16 48 22 22 36 4 Z" fill="#f5f3ee"/>
            <circle cx="36" cy="34" r="7" fill="#ECD06F"/>
            <path d="M20 78 L4 100 L20 92 Z" fill="#ecd06f"/>
            <path d="M52 78 L68 100 L52 92 Z" fill="#ecd06f"/>
          </svg>
          <div ref="flame" class="flame absolute left-1/2 -translate-x-1/2 -bottom-6 w-6 h-16 rounded-full bg-gradient-to-b from-gold via-orange-500 to-transparent opacity-0"></div>
        </div>

        <p ref="label" class="absolute bottom-[18%] left-1/2 -translate-x-1/2 text-[11px] tracking-[0.5em] text-gold uppercase opacity-0">
          Directive Initialized
        </p>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
// Full-screen rocket launch, played once when a new task is successfully
// created. Mount this once near the app root (or the dashboard shell) and
// call the exposed `launch()` method from wherever task creation succeeds.
import { ref, nextTick } from 'vue';
import gsap from 'gsap';

const visible = ref(false);
const rig = ref(null);
const flame = ref(null);
const label = ref(null);
const streakRefs = ref([]);

const launch = async () => {
  visible.value = true;
  await nextTick();

  // scatter the speed-streaks around the rocket's path
  streakRefs.value.forEach((el) => {
    const x = 20 + Math.random() * 60; // vw-ish spread via left %
    const h = 40 + Math.random() * 120;
    gsap.set(el, {
      left: `${x}%`,
      top: `${30 + Math.random() * 50}%`,
      height: h,
      opacity: 0,
    });
  });

  gsap.set(rig.value, { y: 260, opacity: 1, scale: 0.9 });
  gsap.set(flame.value, { opacity: 0, scaleY: 0.6 });
  gsap.set(label.value, { opacity: 0, y: 10 });

  const tl = gsap.timeline({
    onComplete: () => {
      visible.value = false;
    },
  });

  tl.to(flame.value, { opacity: 1, duration: 0.15 }, 0)
    .to(flame.value, { scaleY: 1.4, duration: 0.12, repeat: 5, yoyo: true }, 0)
    .to(label.value, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0.1)
    .to(rig.value, {
      y: -520,
      duration: 1.4,
      ease: 'power2.in',
    }, 0.25)
    .to(streakRefs.value, {
      opacity: 1,
      duration: 0.3,
      stagger: 0.02,
    }, 0.4)
    .to(streakRefs.value, {
      y: -200,
      opacity: 0,
      duration: 0.9,
      stagger: 0.02,
      ease: 'power1.in',
    }, 0.45)
    .to(rig.value, { opacity: 0, duration: 0.2 }, 1.5)
    .to(label.value, { opacity: 0, duration: 0.3 }, 1.4);
};

defineExpose({ launch });
</script>

<style scoped>
.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.25s ease;
}
.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}
.streak {
  width: 1px;
}
</style>