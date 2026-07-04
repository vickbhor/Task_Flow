<script setup>
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

// Shifted one octave up for a "twinkling stars" sweet music-box feel
const PHRASE = [
  { note: 1046.50, dur: 0.8 }, // C6
  { note: 1318.51, dur: 0.8 }, // E6
  { note: 1567.98, dur: 1.2 }, // G6 (held longer for floating effect)
  { note: 1318.51, dur: 0.8 }, // E6
  { note: 1760.00, dur: 1.2 }, // A6
  { note: 1567.98, dur: 0.8 }, // G6
  { note: 1318.51, dur: 0.8 }, // E6
  { note: 1046.50, dur: 2.0 }, // C6 (long resolution)
];

// Warm ethereal pad chords (kept low to contrast with the high twinkling melody)
const CHORDS = [
  [261.63, 329.63, 392.00, 493.88], // Cmaj7
  [220.00, 261.63, 329.63, 392.00], // Am7
  [174.61, 220.00, 261.63, 349.23], // Fmaj7
  [196.00, 246.94, 293.66, 392.00], // G
];
const CHORD_DURATION = PHRASE.reduce((s, n) => s + n.dur, 0); 

const LOOKAHEAD = 0.15;
const SCHEDULER_TICK_MS = 100;

const playMelodyNote = (freq, time, dur) => {
  // Using pure sine waves for the sweetest, softest sound
  [-2, 2].forEach((cents) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine'; 
    osc.frequency.value = freq;
    osc.detune.value = cents;

    // Slower, deeper vibrato for a "drifting in space" feel
    const vibrato = ctx.createOscillator();
    vibrato.frequency.value = 3;
    const vibratoGain = ctx.createGain();
    vibratoGain.gain.value = 5;
    vibrato.connect(vibratoGain);
    vibratoGain.connect(osc.detune);
    vibrato.start(time);
    vibrato.stop(time + dur + 0.5);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, time);
    // Slower attack so notes fade in like glowing stars
    gain.gain.linearRampToValueAtTime(0.12, time + 0.15); 
    gain.gain.exponentialRampToValueAtTime(0.0001, time + dur + 0.5);

    osc.connect(gain);
    gain.connect(masterGain);
    gain.connect(delayNode);

    osc.start(time);
    osc.stop(time + dur + 1.0);
  });
};

const swapChord = (time) => {
  const dying = padNodes;
  padNodes = [];

  dying.forEach(({ gain, osc }) => {
    gain.gain.cancelScheduledValues(time);
    gain.gain.setValueAtTime(gain.gain.value, time);
    gain.gain.linearRampToValueAtTime(0, time + 2.0); // very slow fade out
    osc.stop(time + 2.5);
  });

  const chord = CHORDS[chordStep % CHORDS.length];
  chordStep++;

  chord.forEach((freq) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800; // Muffled filter for distant space hum

    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.gain.linearRampToValueAtTime(0.035, time + 2.0); // very slow fade in

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
    const jitter = (Math.random() - 0.5) * 0.05; // Slightly more human variation
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

    // INCREASED DELAY for massive space echo
    delayNode = ctx.createDelay(2.5);
    delayNode.delayTime.value = 0.75; // Slower echoes
    feedbackGain = ctx.createGain();
    feedbackGain.gain.value = 0.45; // Longer echo trails
    
    delayNode.connect(feedbackGain);
    feedbackGain.connect(delayNode);
    delayNode.connect(masterGain);

    nextNoteTime = ctx.currentTime + 0.1;
    lastChordChangeTime = nextNoteTime - CHORD_DURATION; 
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
  masterGain.gain.linearRampToValueAtTime(0, dyingCtx.currentTime + 1.5);
  dyingPad.forEach(({ gain }) => gain.gain.linearRampToValueAtTime(0, dyingCtx.currentTime + 1.5));

  if (stopTimeout) clearTimeout(stopTimeout);
  stopTimeout = setTimeout(() => {
    dyingPad.forEach(({ osc }) => { try { osc.stop(); } catch (e) {} });
    try { dyingCtx.close(); } catch (e) {}
    stopTimeout = null;
    busy.value = false;
  }, 1600);

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