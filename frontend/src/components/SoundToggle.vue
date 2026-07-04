<template>
  <button
    @click="toggle"
    class="fixed bottom-6 right-6 z-[9997] group w-14 h-14 rounded-full border border-white/15 bg-void/70 backdrop-blur-xl flex items-center justify-center transition-colors hover:border-gold/60"
    :aria-label="playing ? 'Mute background sound' : 'Play background sound'"
  >
    <span class="flex items-end gap-[3px] h-4">
      <span v-for="i in 3" :key="i" class="w-[2px] bg-gold rounded-full sound-bar" :class="{ 'sound-bar--active': playing }" :style="{ animationDelay: `${i * 0.12}s` }"></span>
    </span>
  </button>
</template>

<script setup>
// A genuinely melodic, repeating phrase — not generative wandering.
// The previous version picked notes with 70% "step forward" / 30% "random
// jump," which never repeats, so it never resolves into anything your ear
// recognizes as a tune. This version plays a fixed 8-note phrase (with tiny
// humanized timing so it doesn't feel robotic) over a slow-moving warm chord
// pad, which is what actually reads as "melodic and sweet."
import { ref, onUnmounted } from 'vue';

const playing = ref(false);
const busy = ref(false);

let ctx, masterGain, delayNode, feedbackGain, padNodes = [];
let schedulerTimer = null;
let stopTimeout = null;
let nextNoteTime = 0;
let phraseStep = 0;
let chordStep = 0;
let lastChordChangeTime = 0;

// A fixed, gentle 8-note phrase in C major pentatonic + passing tone —
// deliberately singable, like a music-box lullaby. Repeats every ~6.4s.
const PHRASE = [
  { note: 523.25, dur: 0.8 },  // C5
  { note: 659.25, dur: 0.8 },  // E5
  { note: 783.99, dur: 0.8 },  // G5
  { note: 659.25, dur: 0.8 },  // E5
  { note: 880.00, dur: 0.8 },  // A5
  { note: 783.99, dur: 0.8 },  // G5
  { note: 659.25, dur: 0.8 },  // E5
  { note: 523.25, dur: 1.6 },  // C5, held — phrase resolves home
];

// warm four-chord progression underneath, one chord per full phrase pass:
// Cmaj7 - Am7 - Fmaj7 - G  (a classic gentle, "sweet" cadence)
const CHORDS = [
  [261.63, 329.63, 392.00, 493.88], // Cmaj7
  [220.00, 261.63, 329.63, 392.00], // Am7
  [174.61, 220.00, 261.63, 349.23], // Fmaj7
  [196.00, 246.94, 293.66, 392.00], // G
];
const CHORD_DURATION = PHRASE.reduce((s, n) => s + n.dur, 0); // one chord per phrase loop

const LOOKAHEAD = 0.15;
const SCHEDULER_TICK_MS = 100;

const playMelodyNote = (freq, time, dur) => {
  // two slightly detuned triangle oscillators = soft chorus/"sweet" quality
  [-3, 3].forEach((cents) => {
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    osc.detune.value = cents;

    // gentle vibrato
    const vibrato = ctx.createOscillator();
    vibrato.frequency.value = 5;
    const vibratoGain = ctx.createGain();
    vibratoGain.gain.value = 3;
    vibrato.connect(vibratoGain);
    vibratoGain.connect(osc.detune);
    vibrato.start(time);
    vibrato.stop(time + dur + 0.3);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.16, time + 0.08); // soft attack
    gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

    osc.connect(gain);
    gain.connect(masterGain);
    gain.connect(delayNode);

    osc.start(time);
    osc.stop(time + dur + 0.1);
  });
};

const swapChord = (time) => {
  const dying = padNodes;
  padNodes = [];

  dying.forEach(({ gain, osc }) => {
    gain.gain.cancelScheduledValues(time);
    gain.gain.setValueAtTime(gain.gain.value, time);
    gain.gain.linearRampToValueAtTime(0, time + 1.2);
    osc.stop(time + 1.4);
  });

  const chord = CHORDS[chordStep % CHORDS.length];
  chordStep++;

  chord.forEach((freq) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1200;

    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.gain.linearRampToValueAtTime(0.045, time + 1.5);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);

    osc.start(time);
    padNodes.push({ osc, gain });
  });
};

const scheduler = () => {
  while (nextNoteTime < ctx.currentTime + LOOKAHEAD) {
    if (nextNoteTime >= lastChordChangeTime + CHORD_DURATION) {
      swapChord(nextNoteTime);
      lastChordChangeTime = nextNoteTime;
    }

    const step = PHRASE[phraseStep % PHRASE.length];
    // tiny humanization so it doesn't feel quantized/robotic
    const jitter = (Math.random() - 0.5) * 0.02;
    playMelodyNote(step.note, nextNoteTime + jitter, step.dur);
    nextNoteTime += step.dur;
    phraseStep++;
  }
};

const start = async () => {
  try {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') await ctx.resume();

    masterGain = ctx.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(ctx.destination);
    masterGain.gain.linearRampToValueAtTime(0.55, ctx.currentTime + 1.5);

    delayNode = ctx.createDelay(1.5);
    delayNode.delayTime.value = 0.38;
    feedbackGain = ctx.createGain();
    feedbackGain.gain.value = 0.22;
    delayNode.connect(feedbackGain);
    feedbackGain.connect(delayNode);
    delayNode.connect(masterGain);

    nextNoteTime = ctx.currentTime + 0.1;
    lastChordChangeTime = nextNoteTime - CHORD_DURATION; // force an immediate chord on first tick
    phraseStep = 0;
    chordStep = 0;
    scheduler();
    schedulerTimer = setInterval(scheduler, SCHEDULER_TICK_MS);
  } catch (err) {
    console.error('SoundToggle: failed to start audio', err);
    playing.value = false;
  } finally {
    busy.value = false;
  }
};

const stop = () => {
  if (!ctx) {
    busy.value = false;
    return;
  }
  if (schedulerTimer) {
    clearInterval(schedulerTimer);
    schedulerTimer = null;
  }

  const dyingCtx = ctx;
  const dyingPad = padNodes;
  masterGain.gain.linearRampToValueAtTime(0, dyingCtx.currentTime + 0.8);
  dyingPad.forEach(({ gain }) => gain.gain.linearRampToValueAtTime(0, dyingCtx.currentTime + 0.8));

  if (stopTimeout) clearTimeout(stopTimeout);
  stopTimeout = setTimeout(() => {
    dyingPad.forEach(({ osc }) => { try { osc.stop(); } catch (e) {} });
    try { dyingCtx.close(); } catch (e) {}
    stopTimeout = null;
    busy.value = false;
  }, 900);

  ctx = null;
  padNodes = [];
};

const toggle = () => {
  if (busy.value) return;
  busy.value = true;

  if (playing.value) stop();
  else start();
  playing.value = !playing.value;
};

onUnmounted(() => {
  if (schedulerTimer) clearInterval(schedulerTimer);
  if (stopTimeout) clearTimeout(stopTimeout);
  if (ctx) {
    padNodes.forEach(({ osc }) => { try { osc.stop(); } catch (e) {} });
    try { ctx.close(); } catch (e) {}
  }
});
</script>

<style scoped>
.sound-bar { height: 4px; animation: none; transition: height 0.2s ease; }
.sound-bar--active { animation: soundWave 0.9s ease-in-out infinite alternate; }
@keyframes soundWave { from { height: 4px; } to { height: 16px; } }
</style>