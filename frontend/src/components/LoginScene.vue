<template>
  <section id="login" ref="formSection" class="relative min-h-screen w-full overflow-hidden">
    <img :src="surfaceImg" alt="" class="absolute inset-0 h-full w-full object-cover" />
    <div class="absolute inset-0 bg-gradient-to-b from-void via-transparent to-void/80"></div>
    <StarfieldBackground />

    <div class="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center gap-4 px-6 py-12 md:flex-row md:gap-16 md:py-24">
      <!-- alien -->
      <div ref="alienCol" class="relative flex-1 opacity-0">
        <div class="float-y relative mx-auto w-[190px] sm:w-[240px] md:w-[420px]">
          <!-- both frames stacked; we crossfade + blink between them instead
               of hard-swapping the src, so it reads as the alien actually
               closing its eyes rather than a jump-cut -->
          <img
            :src="alienOpen"
            alt="Friendly alien greeter"
            class="w-full drop-shadow-[0_20px_50px_rgba(124,58,237,0.5)] transition-all duration-300 ease-out"
            :class="eyesClosed ? 'opacity-0 scale-[0.985]' : 'opacity-100 scale-100'"
          />
          <img
            :src="alienClosed"
            alt=""
            aria-hidden="true"
            class="absolute inset-0 w-full drop-shadow-[0_20px_50px_rgba(124,58,237,0.5)] transition-all duration-300 ease-out"
            :class="eyesClosed ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.985]'"
          />
          <div class="absolute -bottom-6 left-1/2 h-6 w-40 -translate-x-1/2 rounded-full bg-nebula/40 blur-2xl pulse-glow"></div>
        </div>
        <p class="mt-4 md:mt-8 text-center font-mono text-xs tracking-[0.25em] text-fog uppercase">
          {{ statusLine }}
        </p>
      </div>

      <!-- form -->
      <div ref="panelCol" class="w-full max-w-lg flex-1 opacity-0">
        <div class="relative rounded-3xl glass-panel p-6 md:p-12">
          <span class="absolute -top-3 left-8 rounded-full bg-gold px-3 py-1 font-mono text-[10px] tracking-[0.2em] text-black">
            System / {{ isLogin ? '01' : '02' }}
          </span>
          <h2 ref="heading" class="mb-6 md:mb-8 mt-2 text-3xl md:text-6xl font-display font-bold uppercase text-bone">
            {{ isLogin ? 'Access' : 'Initiate' }}
          </h2>

          <form @submit.prevent="handleSubmit" class="space-y-4 md:space-y-6" ref="formEl">
            <div v-if="!isLogin" class="field">
              <label class="mb-2 block font-mono text-[10px] tracking-[0.2em] text-fog uppercase">Username</label>
              <input
                v-model="form.username"
                type="text"
                required
                placeholder="operator_01"
                class="w-full border-0 border-b border-white/20 bg-transparent px-0 py-3 font-mono text-sm text-bone outline-none transition focus:border-gold"
              />
            </div>

            <div class="field">
              <label class="mb-2 block font-mono text-[10px] tracking-[0.2em] text-fog uppercase">Email</label>
              <input
                v-model="form.email"
                type="email"
                required
                placeholder="operator@taskflow.io"
                class="w-full border-0 border-b border-white/20 bg-transparent px-0 py-3 font-mono text-sm text-bone outline-none transition focus:border-gold"
                @focus="focus = 'email'"
                @blur="focus = null"
              />
            </div>

            <div class="field">
              <label class="mb-2 block font-mono text-[10px] tracking-[0.2em] text-fog uppercase">Password</label>
              <input
                v-model="form.password"
                type="password"
                required
                placeholder="••••••••"
                class="w-full border-0 border-b border-white/20 bg-transparent px-0 py-3 font-mono text-sm text-bone outline-none transition focus:border-gold"
                @focus="focus = 'password'"
                @blur="focus = null"
              />
            </div>

            <button
              ref="submitBtn"
              type="submit"
              class="field w-full rounded-full bg-gold py-4 font-mono text-xs tracking-[0.2em] uppercase text-black transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(236,208,111,0.4)]"
            >
              {{ isLogin ? 'Enter System' : 'Create Identity' }}
            </button>

            <p
              class="field cursor-pointer text-center font-mono text-[10px] tracking-[0.2em] text-fog transition-colors hover:text-bone"
              @click="isLogin = !isLogin"
            >
              {{ isLogin ? 'NEW HERE? CREATE ACCOUNT' : 'ALREADY REGISTERED? LOGIN' }}
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import api from '../api';
import { useMagnetic } from '../composables/useMagnetic';
import { splitReveal } from '../composables/useSplitReveal';
import StarfieldBackground from './StarfieldBackground.vue';
import surfaceImg from '../assets/planet-surface.jpg';
import alienOpen from '../assets/alien-open.png';
import alienClosed from '../assets/alien-closed.png';

gsap.registerPlugin(ScrollTrigger);

const router = useRouter();
const isLogin = ref(true);
const form = ref({ username: '', email: '', password: '' });
const focus = ref(null);

// eyes close the moment the operator is typing a password (or has one in)
const eyesClosed = computed(() => focus.value === 'password' || form.value.password.length > 0);

const statusLine = computed(() => {
  if (focus.value === 'password') return 'Eyes closed. Promise.';
  if (focus.value === 'email') return 'Welcome, operator.';
  if (form.value.email) return 'Ready when you are.';
  return 'Greetings from orbit.';
});

const formSection = ref(null);
const alienCol = ref(null);
const panelCol = ref(null);
const heading = ref(null);
const formEl = ref(null);
const submitBtn = ref(null);

useMagnetic(submitBtn);

defineExpose({ formSection, setMode: (login) => { isLogin.value = login; } });

onMounted(async () => {
  await nextTick();
  const fields = formEl.value.querySelectorAll('.field');
  gsap.set(fields, { opacity: 0, y: 16 });

  const panelRestScale = window.innerWidth < 768 ? 1 : 1.04;

  gsap.timeline({
    scrollTrigger: { trigger: formSection.value, start: 'top 70%', toggleActions: 'play none none reverse' },
  })
    .to(alienCol.value, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
    .to(panelCol.value, { opacity: 1, y: 0, scale: panelRestScale, duration: 0.9, ease: 'power3.out' }, '-=0.6')
    .add(() => splitReveal(heading.value, { stagger: 0.03 }), '-=0.5')
    .to(fields, { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: 'power3.out' }, '-=0.5');

  gsap.set(alienCol.value, { y: 40 });
  gsap.set(panelCol.value, { y: 40, scale: 0.9 });

  gsap.to('.float-y', { y: -14, duration: 2.6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
});

watch(isLogin, async () => {
  await nextTick();
  const fields = formEl.value.querySelectorAll('.field');
  gsap.fromTo(fields, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out' });
  splitReveal(heading.value, { stagger: 0.03 });
});

const handleSubmit = async () => {
  try {
    const endpoint = isLogin.value ? '/auth/login' : '/auth/signup';
    const { data } = await api.post(endpoint, form.value);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    router.push('/dashboard');
  } catch (error) {
    alert(error.response?.data?.error || 'Authentication Failed');
  }
};
</script>

<style scoped>
.pulse-glow {
  animation: pulseGlow 3s ease-in-out infinite;
}
@keyframes pulseGlow {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.8; }
}
</style>