<template>
  <!-- Yahan main width aur hidden classes theek kar di hain -->
  <aside class="w-full md:w-72 md:shrink-0 bg-void border-b md:border-b-0 md:border-r border-white/5 flex flex-col justify-between p-6 md:p-8 relative z-20 overflow-hidden">

    <!-- faint vertical wordmark, dogstudio-style oversized brand mark -->
    <span class="pointer-events-none select-none absolute -right-6 top-0 h-full font-display font-black text-[11vh] leading-none text-white/[0.025] tracking-tighter" style="writing-mode: vertical-rl;">
      FLOW
    </span>

    <div class="relative">
      <h1 ref="brand" class="text-xl font-display font-extrabold tracking-[0.3em] uppercase mb-8 md:mb-16 text-bone border-b border-white/10 pb-6 opacity-0">Task_Flow</h1>

      <!-- Mobile pe tabs ko thoda side-by-side ya compact dikhane ke liye flex-wrap lagaya hai -->
      <nav class="flex flex-wrap md:flex-col gap-2 md:gap-0 md:space-y-1">
        <button v-for="tab in tabs" :key="tab.id" :ref="setNavRef(tab.id)" @click="$emit('update:activeTab', tab.id)"
          class="relative block w-auto md:w-full text-left text-[11px] tracking-[0.2em] uppercase py-2 md:py-3 px-4 md:px-0 transition-colors duration-300 rounded-full md:rounded-none border md:border-none border-white/10"
          :class="activeTab === tab.id ? 'text-bone bg-white/5 md:bg-transparent' : 'text-white/40 hover:text-white/70'">
          <span class="relative z-10">{{ tab.label }}</span>
          <span
            class="absolute left-0 bottom-0 h-px bg-gold transition-all duration-500 ease-out hidden md:block"
            :style="{ width: activeTab === tab.id ? '100%' : '0%' }"
          ></span>
        </button>
      </nav>
    </div>

    <div class="relative border-t border-white/10 pt-6 mt-6 md:mt-0 flex flex-row md:flex-col justify-between md:justify-start items-center md:items-start">
      <div>
        <p class="text-[10px] text-white/30 tracking-widest uppercase mb-1 md:mb-4">Active Operator</p>
        <p class="text-xs tracking-widest text-bone mb-0 md:mb-6 truncate">{{ currentUser?.username || 'GUEST_USER' }}</p>
      </div>

      <button ref="logoutBtn" @click="$emit('logout')"
        class="text-[10px] text-red-500/60 hover:text-red-500 tracking-[0.2em] uppercase transition-colors border border-red-500/20 hover:border-red-500/50 px-4 py-2 rounded-full w-auto md:w-full">
        Disconnect
      </button>
    </div>
  </aside>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import gsap from 'gsap';
import { useMagnetic } from '../composables/useMagnetic';

defineProps(['currentUser', 'activeTab']);
defineEmits(['update:activeTab', 'logout']);

const tabs = [
  { id: 'all', label: 'All Directives' },
  { id: 'pending', label: 'Pending' },
  { id: 'completed', label: 'Completed' }
];

const brand = ref(null);
const logoutBtn = ref(null);
const navRefs = {};
const setNavRef = (id) => (el) => { if (el) navRefs[id] = el; };

useMagnetic(logoutBtn, 0.25);

onMounted(() => {
  const tl = gsap.timeline({ delay: 0.1 });
  tl.to(brand.value, { opacity: 1, duration: 0.7, ease: 'power3.out' });
  tl.fromTo(
    Object.values(navRefs),
    { opacity: 0, x: -14 },
    { opacity: 1, x: 0, duration: 0.55, stagger: 0.08, ease: 'power3.out' },
    '-=0.3'
  );
});
</script>