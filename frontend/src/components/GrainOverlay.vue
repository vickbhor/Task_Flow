<template>
  <svg class="grain-overlay" xmlns="http://www.w3.org/2000/svg">
    <filter id="grainFilter">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
      <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.9 0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#grainFilter)" />
  </svg>
</template>

<script setup>
// Static SVG noise — cheap on the GPU, no animation needed for the effect to read as "film grain".
</script>
