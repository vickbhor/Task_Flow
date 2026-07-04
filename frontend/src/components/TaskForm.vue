<template>
  <div ref="wrap" class="w-full max-w-3xl mx-auto p-1 bg-gradient-to-b from-gold/20 to-transparent rounded-3xl opacity-0">
    <div class="relative bg-surface border border-white/5 p-8 md:p-12 rounded-[22px] shadow-2xl backdrop-blur-3xl overflow-hidden">

      <div class="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
        <div>
          <h2 ref="heading" class="text-3xl font-display font-extrabold tracking-tight uppercase text-bone">Initialize_</h2>
          <p class="text-xs text-white/40 tracking-[0.3em] mt-2 uppercase">Create a new directive</p>
        </div>
        <button ref="closeBtn" @click="$emit('cancel')" class="text-white/30 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">

        <div class="field opacity-0 md:col-span-2 group">
          <label class="text-[10px] text-white/40 tracking-widest uppercase mb-2 block group-focus-within:text-gold transition-colors">Directive Title</label>
          <input
            v-model="localTask.title"
            type="text"
            placeholder="ENTER TASK DESIGNATION..."
            class="w-full bg-transparent border-b border-white/20 pb-3 text-lg font-light tracking-wider text-bone focus:outline-none focus:border-gold transition-all placeholder:text-white/20"
          />
        </div>

        <div class="field opacity-0 group">
          <label class="text-[10px] text-white/40 tracking-widest uppercase mb-2 block group-focus-within:text-gold transition-colors">Priority Level</label>
          <select
            v-model="localTask.priority"
            class="w-full bg-transparent border-b border-white/20 pb-3 text-sm tracking-widest text-bone focus:outline-none focus:border-gold transition-all appearance-none cursor-pointer"
          >
            <option value="low" class="bg-surface-2 text-green-400">LOW / OPTIONAL</option>
            <option value="medium" class="bg-surface-2 text-yellow-400">MEDIUM / STANDARD</option>
            <option value="high" class="bg-surface-2 text-red-400">HIGH / CRITICAL</option>
          </select>
        </div>

        <div class="field opacity-0 group">
          <label class="text-[10px] text-white/40 tracking-widest uppercase mb-2 block group-focus-within:text-gold transition-colors">Target Date</label>
          <input
            v-model="localTask.dueDate"
            type="date"
            class="w-full bg-transparent border-b border-white/20 pb-3 text-sm tracking-widest text-bone focus:outline-none focus:border-gold transition-all cursor-pointer [color-scheme:dark]"
          />
        </div>
      </div>

      <div class="field opacity-0 mt-12 flex items-center justify-end gap-6">
        <button
          @click="$emit('cancel')"
          class="text-xs tracking-[0.2em] text-white/50 hover:text-white transition-colors uppercase"
        >
          Abort
        </button>
        <button
          ref="submitBtn"
          @click="submitTask"
          class="relative px-8 py-4 bg-gold text-black text-xs font-bold tracking-[0.2em] uppercase rounded-full overflow-visible transition-shadow hover:shadow-[0_0_30px_rgba(236,208,111,0.4)]"
        >
          <span ref="submitLabel" class="relative z-10">Execute Sequence</span>

          <!-- rocket launch rig, hidden until fired -->
          <span ref="rocket" class="rocket pointer-events-none absolute left-1/2 top-1/2 opacity-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style="transform: rotate(45deg);">
              <path d="M12 2 C15 6 16 11 15 16 L9 16 C8 11 9 6 12 2 Z" fill="#050505"/>
              <circle cx="12" cy="9" r="1.6" fill="#ECD06F"/>
              <path d="M9 16 L6 20 L9 18.5 Z" fill="#050505"/>
              <path d="M15 16 L18 20 L15 18.5 Z" fill="#050505"/>
            </svg>
            <span class="flame block w-1.5 h-4 mx-auto rounded-full bg-gold"></span>
          </span>
          <span v-for="i in 8" :key="i" ref="particleRefs" class="particle pointer-events-none absolute left-1/2 top-1/2 w-1 h-1 rounded-full bg-gold opacity-0"></span>
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import gsap from 'gsap';
import { useMagnetic } from '../composables/useMagnetic';
import { splitReveal } from '../composables/useSplitReveal';

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({ title: '', priority: 'medium', dueDate: '' })
  }
});

const emit = defineEmits(['submit', 'cancel']);

const localTask = ref({ ...props.initialData });

const wrap = ref(null);
const heading = ref(null);
const submitBtn = ref(null);
const submitLabel = ref(null);
const rocket = ref(null);
const particleRefs = ref([]);

useMagnetic(submitBtn, 0.25);

onMounted(() => {
  const fields = wrap.value.querySelectorAll('.field');
  gsap.set(wrap.value, { opacity: 1, y: 20 });
  gsap.set(fields, { y: 14 });

  const tl = gsap.timeline();
  tl.to(wrap.value, { y: 0, duration: 0.7, ease: 'power4.out' });
  splitReveal(heading.value, { stagger: 0.025 });
  tl.to(fields, {
    opacity: 1,
    y: 0,
    duration: 0.55,
    stagger: 0.08,
    ease: 'power3.out',
  }, 0.2);
});

const launchRocket = () => {
  const tl = gsap.timeline();

  tl.to(submitLabel.value, { opacity: 0, duration: 0.2 }, 0)
    .set(rocket.value, { opacity: 1, x: -11, y: -11, scale: 0.6 }, 0)
    .to(rocket.value, {
      y: -120,
      x: -11 + gsap.utils.random(-14, 14),
      rotate: gsap.utils.random(-8, 8),
      scale: 1,
      duration: 0.7,
      ease: 'power2.in',
    }, 0.1)
    .to(rocket.value, { opacity: 0, duration: 0.15 }, 0.65)
    .to('.flame', { scaleY: 1.6, duration: 0.15, repeat: 4, yoyo: true }, 0.1);

  particleRefs.value.forEach((p, i) => {
    tl.set(p, { opacity: 1, x: 0, y: 0 }, 0.15)
      .to(p, {
        x: gsap.utils.random(-40, 40),
        y: gsap.utils.random(10, 50),
        opacity: 0,
        duration: gsap.utils.random(0.5, 0.9),
        ease: 'power2.out',
      }, 0.15 + i * 0.02);
  });

  tl.to(submitBtn.value, { scale: 0.94, duration: 0.1, yoyo: true, repeat: 1 }, 0)
    .to(submitLabel.value, { opacity: 1, duration: 0.3 }, 0.8);
};

const submitTask = () => {
  if (!localTask.value.title.trim()) {
    alert("Title is strictly required to execute sequence.");
    return;
  }
  launchRocket();
  emit('submit', localTask.value);
};
</script>