<template>
  <header
    ref="navEl"
    class="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-6 md:px-12 py-5 transition-colors duration-500"
    :class="scrolled ? 'bg-void/70 backdrop-blur-xl border-b border-white/5' : 'bg-transparent border-b border-transparent'"
  >
    <button ref="logoEl" class="font-display font-black uppercase tracking-[0.15em] text-bone text-lg opacity-0" @click="go('hero')">
      Task<span class="text-gold">_</span>Flow
    </button>

    <!-- desktop links -->
    <nav class="hidden md:flex items-center gap-10">
      <button
        v-for="link in links"
        :key="link.id"
        ref="linkRefs"
        class="relative text-[11px] tracking-[0.25em] uppercase text-white/60 hover:text-bone transition-colors duration-300 opacity-0"
        @click="go(link.id)"
      >
        {{ link.label }}
        <span v-if="link.id === active" class="absolute left-0 -bottom-2 h-px w-full bg-gold"></span>
      </button>

      <button ref="ctaBtn" class="opacity-0 px-6 py-2.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase text-black bg-gold transition-shadow duration-300 hover:shadow-[0_0_25px_rgba(236,208,111,0.4)]" @click="go('signup')">
        Get Started
      </button>
    </nav>

    <!-- mobile hamburger -->
    <button ref="burgerBtn" class="md:hidden opacity-0 w-9 h-9 flex flex-col items-center justify-center gap-1.5 group" @click="menuOpen = !menuOpen" aria-label="Toggle menu">
      <span class="block w-5 h-px bg-bone transition-transform duration-300" :class="menuOpen ? 'translate-y-[3px] rotate-45' : ''"></span>
      <span class="block w-5 h-px bg-bone transition-transform duration-300" :class="menuOpen ? '-translate-y-[3px] -rotate-45' : ''"></span>
    </button>

    <!-- mobile overlay menu -->
    <Transition name="menu-fade">
      <div v-if="menuOpen" class="md:hidden fixed inset-0 top-[72px] bg-void/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-8 z-30">
        <button
          v-for="link in links"
          :key="link.id"
          class="text-sm tracking-[0.3em] uppercase text-bone/80 hover:text-gold transition-colors"
          @click="go(link.id)"
        >
          {{ link.label }}
        </button>
        <button class="mt-4 px-8 py-3 rounded-full text-xs font-bold tracking-[0.2em] uppercase text-black bg-gold" @click="go('signup')">
          Get Started
        </button>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import gsap from 'gsap';
import { useMagnetic } from '../composables/useMagnetic';

const props = defineProps({
  active: { type: String, default: '' },
});

// emits: 'hero' | 'features' | 'login' | 'signup'
const emit = defineEmits(['navigate']);

const links = [
  { id: 'features', label: 'Features' },
  { id: 'login', label: 'Login' },
];

const navEl = ref(null);
const logoEl = ref(null);
const linkRefs = ref([]);
const ctaBtn = ref(null);
const burgerBtn = ref(null);
const scrolled = ref(false);
const menuOpen = ref(false);

useMagnetic(ctaBtn, 0.25);

const go = (id) => {
  menuOpen.value = false;
  emit('navigate', id);
};

const onScroll = () => {
  scrolled.value = window.scrollY > 40;
};

onMounted(async () => {
  await nextTick();
  window.addEventListener('scroll', onScroll, { passive: true });

  const tl = gsap.timeline({ delay: 0.15 });
  tl.to(logoEl.value, { opacity: 1, duration: 0.6, ease: 'power3.out' });
  tl.to([...linkRefs.value, ctaBtn.value, burgerBtn.value], { opacity: 1, duration: 0.5, stagger: 0.06, ease: 'power3.out' }, '-=0.35');
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
});
</script>

<style scoped>
.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: opacity 0.3s ease;
}
.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
}
</style>