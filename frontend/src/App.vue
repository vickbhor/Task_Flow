<template>
  <main class="w-full min-h-screen bg-void text-bone font-body selection:bg-gold selection:text-black relative">

    <GrainOverlay />
    <SoundToggle />

    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

  </main>
</template>

<script setup>
import SoundToggle from './components/SoundToggle.vue';
import GrainOverlay from './components/GrainOverlay.vue';
import { useSmoothScroll } from './composables/useSmoothScroll';

// Lenis + GSAP ticker, runs for the lifetime of the app shell
useSmoothScroll();
</script>

<style>
/* Main Route Fade Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
