<template>
  <div>
    <NavBar :active="activeSection" @navigate="handleNav" />
    <Hero ref="heroRef" />
    <PlanetJourney />
    <LoginScene ref="loginRef" />
    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import NavBar from '../components/NavBar.vue';
import Hero from '../components/Hero.vue';
import PlanetJourney from '../components/PlanetJourney.vue';
import LoginScene from '../components/LoginScene.vue';
import Footer from '../components/Footer.vue';
import { scrollToEl } from '../composables/useSmoothScroll';

const activeSection = ref('');
const heroRef = ref(null);
const loginRef = ref(null);

const handleNav = (id) => {
  if (id === 'hero') {
    scrollToEl(heroRef.value?.heroSection);
  } else if (id === 'features') {
    scrollToEl(document.getElementById('features'));
  } else if (id === 'login') {
    loginRef.value?.setMode(true);
    scrollToEl(loginRef.value?.formSection);
  } else if (id === 'signup') {
    loginRef.value?.setMode(false);
    scrollToEl(loginRef.value?.formSection);
  }
};
</script>