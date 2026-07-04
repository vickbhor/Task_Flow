<template>
  <section ref="heroSection" class="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center">
    <div ref="heroImage" class="absolute inset-0 -inset-y-16">
      <img :src="spaceBg" alt="" class="w-full h-full object-cover opacity-70" />
      <div class="absolute inset-0 bg-gradient-to-b from-void/30 via-transparent to-void"></div>
    </div>

    <StarfieldBackground class="z-[1]" />

    <div class="relative z-10 text-center px-6">
      <p ref="heroEyebrow" class="text-[11px] tracking-[0.5em] text-gold uppercase mb-6 opacity-0 font-mono">
        Command your directives
      </p>
      <h1 ref="heroTitle" class="font-display font-black uppercase whitespace-nowrap text-[clamp(2.25rem,13vw,7rem)] leading-[0.9] text-bone">
        Task<span class="text-gold">_</span>Flow
      </h1>
      <p ref="heroTag" class="mt-6 text-sm md:text-base text-fog tracking-wide max-w-md mx-auto opacity-0">
        A command deck for the things you actually need to get done — prioritized, tracked, and never lost in a list.
      </p>

      <div ref="chipRow" class="mt-10 flex flex-wrap items-center justify-center gap-3">
        <span
          v-for="chip in chips"
          :key="chip"
          ref="chipRefs"
          class="chip opacity-0 px-4 py-2 rounded-full border border-white/15 text-[10px] tracking-[0.2em] uppercase text-bone/80 bg-white/[0.03] backdrop-blur-sm font-mono"
        >
          {{ chip }}
        </span>
      </div>
    </div>

    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 z-10">
      <span class="text-[10px] tracking-[0.35em] uppercase font-mono">Scroll</span>
      <span class="scroll-cue block w-px h-8 bg-white/40"></span>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitReveal } from '../composables/useSplitReveal';
import StarfieldBackground from './StarfieldBackground.vue';
import spaceBg from '../assets/space-bg.jpg';

gsap.registerPlugin(ScrollTrigger);

const chips = ['Prioritize', 'Track Status', 'Search Live', 'Hit Deadlines'];

const heroSection = ref(null);
const heroImage = ref(null);
const heroEyebrow = ref(null);
const heroTitle = ref(null);
const heroTag = ref(null);
const chipRefs = ref([]);

defineExpose({ heroSection });

onMounted(async () => {
  await nextTick();

  gsap.set(chipRefs.value, { y: 10 });

  const tl = gsap.timeline({ delay: 0.1 });
  tl.to(heroEyebrow.value, { opacity: 1, duration: 0.6, ease: 'power3.out' });
  tl.add(() => splitReveal(heroTitle.value, { stagger: 0.02 }), '<');
  tl.to(heroTag.value, { opacity: 1, duration: 0.7, ease: 'power3.out' }, '-=0.3');
  tl.to(chipRefs.value, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' }, '-=0.3');

  gsap.to('.scroll-cue', { scaleY: 0.3, transformOrigin: 'top', repeat: -1, yoyo: true, duration: 1.1, ease: 'power1.inOut' });

  gsap.to(heroImage.value, {
    yPercent: 18,
    opacity: 0.5,
    ease: 'none',
    scrollTrigger: { trigger: heroSection.value, start: 'top top', end: 'bottom top', scrub: 0.6 },
  });
});
</script>