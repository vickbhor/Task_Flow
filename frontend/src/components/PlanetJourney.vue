<template>
  <section id="features" ref="sectionEl" class="relative bg-void" style="height: 550vh">
    <div ref="pinEl" class="sticky top-0 h-screen w-full overflow-hidden bg-void" style="perspective: 1400px">
      <!-- parallax deep-space bg -->
      <div ref="bgEl" class="absolute inset-0">
        <img :src="spaceBg" alt="" class="h-full w-full object-cover opacity-70" />
      </div>
      <div class="absolute inset-0 bg-gradient-to-b from-void/50 via-transparent to-void"></div>

      <!-- HUD chrome -->
      <div class="pointer-events-none absolute inset-0 z-10">
        <span
          v-for="(c, i) in corners"
          :key="i"
          class="absolute h-6 w-6 border-gold/30"
          :class="c"
        ></span>
        <div class="absolute left-1/2 top-1/2 h-px w-24 -translate-x-1/2 -translate-y-1/2 bg-bone/10"></div>
        <div class="absolute left-1/2 top-1/2 h-24 w-px -translate-x-1/2 -translate-y-1/2 bg-bone/10"></div>
        <div
          class="absolute inset-0 opacity-[0.06]"
          style="background-image: linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px); background-size: 80px 80px"
        ></div>
      </div>

      <!-- section marker -->
      <div class="absolute left-8 top-24 z-20 font-mono text-[10px] tracking-[0.3em] text-bone/50 uppercase">
        <div>Feature Sector</div>
        <div class="mt-2">
          <span class="status-pill"><span class="status-pill__dot"></span>Live Transmission</span>
        </div>
      </div>

      <!-- planet + orbit rings -->
      <div ref="planetWrap" class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div class="relative h-[min(68vh,78vw)] w-[min(68vh,78vw)] max-h-[720px] max-w-[720px]">
          <div ref="glowEl" class="absolute inset-[-25%] rounded-full blur-3xl" style="background: radial-gradient(circle, rgba(236,208,111,0.35) 0%, transparent 60%)"></div>

          <svg ref="ringBack" viewBox="0 0 400 400" class="absolute inset-[-18%] h-[136%] w-[136%]">
            <g transform="rotate(-18 200 200)">
              <ellipse cx="200" cy="200" rx="195" ry="52" fill="none" stroke="var(--color-gold)" stroke-width="0.6" stroke-dasharray="2 4" opacity="0.55" />
              <ellipse cx="200" cy="200" rx="178" ry="46" fill="none" stroke="var(--color-gold)" stroke-width="1" opacity="0.35" />
              <circle cx="395" cy="200" r="2.5" fill="var(--color-gold)" />
              <circle cx="5" cy="200" r="1.8" fill="var(--color-nebula-soft)" />
            </g>
          </svg>

          <img ref="planetImg" :src="planet3d" alt="Planet" class="relative h-full w-full drop-shadow-[0_0_80px_rgba(140,90,220,0.55)]" />

          <svg ref="ringFront" viewBox="0 0 400 400" class="pointer-events-none absolute inset-[-18%] h-[136%] w-[136%]">
            <g transform="rotate(-18 200 200)">
              <ellipse cx="200" cy="200" rx="210" ry="58" fill="none" stroke="var(--color-gold)" stroke-width="0.8" opacity="0.7" />
              <ellipse cx="200" cy="200" rx="230" ry="64" fill="none" stroke="var(--color-bone)" stroke-width="0.4" stroke-dasharray="1 6" opacity="0.4" />
              <circle cx="10" cy="200" r="3" fill="var(--color-gold)" />
              <circle cx="390" cy="200" r="2" fill="var(--color-bone)" />
            </g>
          </svg>

          <svg ref="ringOuter" viewBox="0 0 400 400" class="pointer-events-none absolute inset-[-32%] h-[164%] w-[164%]">
            <circle cx="200" cy="200" r="198" fill="none" stroke="rgba(245,243,238,0.15)" stroke-width="0.5" stroke-dasharray="4 8" />
            <circle cx="398" cy="200" r="4" fill="var(--color-gold)" opacity="0.9" />
            <circle cx="2" cy="200" r="2" fill="var(--color-nebula-soft)" opacity="0.8" />
          </svg>
        </div>
      </div>

      <!-- feature cards -->
      <div
        v-for="(f, i) in features"
        :key="f.tag"
        :ref="el => (cardRefs[i] = el)"
        class="feature-card absolute top-1/2 left-6 md:left-16 z-30 w-[88vw] max-w-md -translate-y-1/2 opacity-0"
      >
        <div class="relative">
          <span class="absolute -left-2 -top-2 h-3 w-3 border-l border-t border-gold"></span>
          <span class="absolute -right-2 -top-2 h-3 w-3 border-r border-t border-gold"></span>
          <span class="absolute -bottom-2 -left-2 h-3 w-3 border-b border-l border-gold"></span>
          <span class="absolute -bottom-2 -right-2 h-3 w-3 border-b border-r border-gold"></span>

          <div class="relative overflow-hidden rounded-2xl glass-panel p-6 md:p-8 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.9)]">
            <div class="scanline pointer-events-none absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-gold/10 to-transparent"></div>

            <div class="mb-6 flex items-start justify-between gap-4">
              <div class="flex items-center gap-3">
                <div class="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-gold/40 bg-gold/10 text-gold" v-html="f.icon"></div>
                <div>
                  <p class="font-mono text-[10px] tracking-[0.25em] text-gold">{{ f.tag }}</p>
                  <p class="mt-0.5 font-mono text-[9px] tracking-[0.25em] text-bone/40">ID · {{ f.code }}</p>
                </div>
              </div>
              <span class="status-pill"><span class="status-pill__dot"></span>Active</span>
            </div>

            <h3 class="mb-3 text-2xl font-display font-bold uppercase leading-tight text-bone md:text-3xl">{{ f.title }}</h3>
            <p class="text-sm leading-relaxed text-fog md:text-[15px]">{{ f.body }}</p>

            <div class="mt-6 flex items-center justify-between border-t border-white/10 pt-4 font-mono text-[9px] tracking-[0.2em] text-bone/40">
              <span class="telemetry-stat__label">SYS · TASKFLOW</span>
              <span class="flex gap-1">
                <span v-for="n in 12" :key="n" class="h-2 w-0.5" :class="n <= (i + 1) * 3 ? 'bg-gold' : 'bg-bone/20'"></span>
              </span>
              <span>{{ String(i + 1).padStart(2, '0') }}/04</span>
            </div>
          </div>
        </div>
      </div>

      <!-- progress -->
      <div class="absolute bottom-6 left-1/2 z-20 h-px w-64 -translate-x-1/2 bg-bone/10">
        <div ref="progressBar" class="h-full origin-left bg-gold" style="transform: scaleX(0)"></div>
      </div>
      <div class="absolute bottom-8 left-8 z-20 font-mono text-[10px] tracking-[0.25em] text-bone/50 uppercase">Transmission Log</div>
      <div class="absolute bottom-8 right-8 z-20 font-mono text-[10px] tracking-[0.25em] text-bone/50 uppercase">04 Directives</div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import spaceBg from '../assets/space-bg.jpg';
import planet3d from '../assets/planet-3d.png';

gsap.registerPlugin(ScrollTrigger);

const corners = [
  'top-6 left-6 border-t border-l',
  'top-6 right-6 border-t border-r',
  'bottom-6 left-6 border-b border-l',
  'bottom-6 right-6 border-b border-r',
];

const icon = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">${d}</svg>`;

const features = [
  { tag: 'DIRECTIVE 01 · PRIORITIZE', code: 'PRT-001', title: 'Sort the signal from the noise', body: 'Every directive weighted by urgency and impact. Your critical path, illuminated in real-time telemetry.', icon: icon('<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="0.5" fill="currentColor"/>') },
  { tag: 'DIRECTIVE 02 · TRACK STATUS', code: 'TRK-002', title: 'Live telemetry on every task', body: 'Watch progress crystallize as it happens. Nothing falls through orbital gaps or gets lost in the void.', icon: icon('<path d="M4 15a8 8 0 1 1 16 0"/><path d="M12 15l4-5"/><circle cx="12" cy="15" r="1.2" fill="currentColor"/>') },
  { tag: 'DIRECTIVE 03 · SEARCH LIVE', code: 'SRC-003', title: 'Recall anything, instantly', body: 'Fuzzy search across every directive, note, and deadline. Total recall across your entire galaxy of work.', icon: icon('<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>') },
  { tag: 'DIRECTIVE 04 · HIT DEADLINES', code: 'DDL-004', title: 'Never miss a launch window', body: 'Adaptive reminders that respect your rhythm — not just your calendar. Ship on time, every time.', icon: icon('<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>') },
];

// [appearStart, appearEnd, exitStart, exitEnd] per card, across the 0..1 pin progress
const ranges = [
  [0.05, 0.14, 0.22, 0.30],
  [0.30, 0.38, 0.46, 0.54],
  [0.54, 0.62, 0.70, 0.78],
  [0.78, 0.85, 0.92, 0.98],
];

const sectionEl = ref(null);
const pinEl = ref(null);
const bgEl = ref(null);
const glowEl = ref(null);
const planetWrap = ref(null);
const planetImg = ref(null);
const ringBack = ref(null);
const ringFront = ref(null);
const ringOuter = ref(null);
const progressBar = ref(null);
const cardRefs = ref([]);

let scrollTriggerInstance, outerRingTween;
let isMobile = window.innerWidth < 768;
const onResize = () => { isMobile = window.innerWidth < 768; };
window.addEventListener('resize', onResize);

const clamp01 = (t) => Math.min(1, Math.max(0, t));
const mapT = (v, a, b) => clamp01((v - a) / (b - a));
const lerp = (a, b, t) => a + (b - a) * t;

const applyProgress = (p) => {
  // planet body + rings
  gsap.set(planetImg.value, { rotate: lerp(0, 360, p) });
  gsap.set(ringBack.value, { rotate: lerp(0, -540, p) });
  gsap.set(ringFront.value, { rotate: lerp(0, 720, p) });

  const tiltX = p < 0.5 ? lerp(8, -4, p / 0.5) : lerp(-4, -14, (p - 0.5) / 0.5);
  // planet lives on the right two-thirds of the screen the whole time now that
  // every card is anchored left. On phones the viewport is too narrow for the
  // same drift distance (it would push the planet off-screen entirely), so we
  // use a much smaller, viewport-safe range there instead.
  const txRange = isMobile ? [10, 16, 20, 24] : [28, 38, 46, 52, 56];
  const scaleRange = isMobile ? [0.62, 0.78, 0.9, 0.8] : [1.0, 1.25, 1.5, 1.2];
  const tx = p < 0.25 ? lerp(txRange[0], txRange[1], p / 0.25) : p < 0.5 ? lerp(txRange[1], txRange[2], (p - 0.25) / 0.25) : p < 0.75 ? lerp(txRange[2], txRange[3], (p - 0.5) / 0.25) : lerp(txRange[3], txRange[3] + (isMobile ? 2 : 4), (p - 0.75) / 0.25);
  const ty = p < 0.5 ? lerp(0, -4, p / 0.5) : lerp(-4, -10, (p - 0.5) / 0.5);
  const scale = p < 0.35 ? lerp(scaleRange[0], scaleRange[1], p / 0.35) : p < 0.7 ? lerp(scaleRange[1], scaleRange[2], (p - 0.35) / 0.35) : lerp(scaleRange[2], scaleRange[3], (p - 0.7) / 0.3);
  const glow = p < 0.5 ? lerp(0.3, 0.7, p / 0.5) : lerp(0.7, 0.5, (p - 0.5) / 0.5);

  gsap.set(planetWrap.value, { x: `${tx}%`, y: `${ty}%`, scale, rotateX: tiltX, transformPerspective: 1200 });
  gsap.set(glowEl.value, { opacity: glow });
  gsap.set(bgEl.value, { scale: lerp(1, 1.3, p), y: `${lerp(0, -8, p)}%` });

  // feature cards
  ranges.forEach((r, i) => {
    const el = cardRefs.value[i];
    if (!el) return;
    const [a0, a1, e0, e1] = r;
    let opacity, y, x, rotate;
    if (p < a0) { opacity = 0; y = 60; x = -40; rotate = -3; }
    else if (p < a1) { const t = mapT(p, a0, a1); opacity = t; y = lerp(60, 0, t); x = lerp(-40, 0, t); rotate = lerp(-3, 0, t); }
    else if (p < e0) { opacity = 1; y = 0; x = 0; rotate = 0; }
    else if (p < e1) { const t = mapT(p, e0, e1); opacity = 1 - t; y = lerp(0, -60, t); x = lerp(0, -20, t); rotate = lerp(0, -1, t); }
    else { opacity = 0; y = -60; x = -20; rotate = -1; }
    gsap.set(el, { opacity, y, x, rotate });
  });

  gsap.set(progressBar.value, { scaleX: p });
};

onMounted(() => {
  gsap.set(cardRefs.value, { opacity: 0 });

  outerRingTween = gsap.to(ringOuter.value, { rotate: 360, duration: 40, repeat: -1, ease: 'linear', transformOrigin: '50% 50%' });

  scrollTriggerInstance = ScrollTrigger.create({
    trigger: sectionEl.value,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.6,
    onUpdate: (self) => applyProgress(self.progress),
  });
  applyProgress(0);
});

onUnmounted(() => {
  scrollTriggerInstance?.kill();
  outerRingTween?.kill();
  window.removeEventListener('resize', onResize);
});
</script>

<style scoped>
.scanline {
  animation: sweep 2.2s linear infinite;
}
@keyframes sweep {
  from { transform: translateY(-100%); }
  to { transform: translateY(700%); }
}
.feature-card { will-change: opacity, transform; }
</style>