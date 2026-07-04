<template>
  <canvas ref="canvas" class="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const canvas = ref(null);
let ctx, raf, stars = [], shooters = [], width = 0, height = 0;
let resizeObserver;

const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const buildStars = () => {
  const count = Math.floor((width * height) / 9000);
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 1.2 + 0.3,
    speed: Math.random() * 0.02 + 0.008,
    phase: Math.random() * Math.PI * 2,
  }));
};

const maybeSpawnShooter = () => {
  if (Math.random() < 0.006 && shooters.length < 2) {
    const startX = Math.random() * width * 0.6;
    shooters.push({
      x: startX,
      y: Math.random() * height * 0.3,
      vx: 6 + Math.random() * 4,
      vy: 3 + Math.random() * 2,
      life: 1,
    });
  }
};

const draw = (t) => {
  ctx.clearRect(0, 0, width, height);

  // twinkling stars
  stars.forEach((s) => {
    const alpha = 0.35 + Math.sin(t * s.speed + s.phase) * 0.35 + 0.3;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(245, 243, 238, ${Math.max(0, Math.min(1, alpha))})`;
    ctx.fill();
  });

  // shooting stars
  maybeSpawnShooter();
  shooters.forEach((sh) => {
    ctx.beginPath();
    const grad = ctx.createLinearGradient(sh.x, sh.y, sh.x - sh.vx * 8, sh.y - sh.vy * 8);
    grad.addColorStop(0, `rgba(236, 208, 111, ${sh.life})`);
    grad.addColorStop(1, 'rgba(236, 208, 111, 0)');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.5;
    ctx.moveTo(sh.x, sh.y);
    ctx.lineTo(sh.x - sh.vx * 8, sh.y - sh.vy * 8);
    ctx.stroke();

    sh.x += sh.vx;
    sh.y += sh.vy;
    sh.life -= 0.012;
  });
  shooters = shooters.filter((sh) => sh.life > 0 && sh.x < width + 50 && sh.y < height + 50);

  if (!reducedMotion) raf = requestAnimationFrame(draw);
};

const resize = () => {
  const parent = canvas.value.parentElement;
  width = parent.clientWidth;
  height = parent.clientHeight;
  const dpr = window.devicePixelRatio || 1;
  canvas.value.width = width * dpr;
  canvas.value.height = height * dpr;
  canvas.value.style.width = `${width}px`;
  canvas.value.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  buildStars();
};

onMounted(() => {
  ctx = canvas.value.getContext('2d');
  resize();

  resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas.value.parentElement);

  raf = requestAnimationFrame(draw);
});

onUnmounted(() => {
  cancelAnimationFrame(raf);
  resizeObserver?.disconnect();
});
</script>