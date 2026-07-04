<template>
  <header class="flex justify-between items-center p-8 md:px-12 border-b border-white/5 bg-void/60 backdrop-blur-xl sticky top-0 z-20">
    <h2 ref="titleEl" class="text-lg md:text-2xl font-display font-extrabold tracking-[0.15em] text-bone uppercase">
      {{ title }}
    </h2>
    <button ref="ctaBtn" @click="$emit('create-new')"
      class="group bg-gold text-black px-6 py-3 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase transition-shadow duration-300 shadow-[0_0_15px_rgba(236,208,111,0.15)] hover:shadow-[0_0_30px_rgba(236,208,111,0.45)]">
      + Initialize New
    </button>
  </header>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue';
import gsap from 'gsap';
import { useMagnetic } from '../composables/useMagnetic';
import { splitReveal } from '../composables/useSplitReveal';

const props = defineProps(['title']);
defineEmits(['create-new']);

const titleEl = ref(null);
const ctaBtn = ref(null);

useMagnetic(ctaBtn, 0.3);

const reveal = () => splitReveal(titleEl.value, { stagger: 0.015 });

onMounted(async () => {
  await nextTick();
  reveal();
});

watch(() => props.title, async () => {
  await nextTick();
  reveal();
});
</script>
