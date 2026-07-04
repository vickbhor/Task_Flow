<template>
  <div ref="wrap" class="w-full">

    <div class="mb-12 opacity-0 field">
      <input
        type="text"
        :value="searchQuery"
        @input="$emit('update:search', $event.target.value)"
        placeholder="SEARCH DIRECTIVES..."
        class="w-full max-w-lg bg-transparent border-b border-white/20 pb-4 text-sm tracking-[0.2em] text-bone focus:outline-none focus:border-gold transition-all placeholder:text-white/20"
      />
    </div>

    <div v-if="tasks.length === 0" class="flex flex-col items-center justify-center py-32 border border-white/5 rounded-3xl bg-white/[0.03] backdrop-blur-sm">
      <p class="text-white/30 tracking-[0.3em] uppercase text-xs">No Directives Found</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
      <div
        v-for="task in tasks"
        :key="task._id"
        class="task-card field opacity-0 group relative p-8 border border-white/10 bg-surface hover:bg-surface-2 rounded-2xl transition-colors duration-500 flex flex-col justify-between"
        @mousemove="onCardMove"
        @mouseleave="onCardLeave"
      >
        <div class="flex justify-between items-start mb-8">
          <div :class="['w-2 h-2 rounded-full shadow-[0_0_10px_currentColor]', task.priority === 'high' ? 'text-red-500 bg-red-500' : task.priority === 'medium' ? 'text-mid bg-mid' : 'text-low bg-low']"></div>
          <span class="text-[9px] tracking-[0.2em] uppercase" :class="task.status === 'completed' ? 'text-white/20 line-through' : 'text-white/50'">{{ task.status }}</span>
        </div>

        <div>
          <h3 class="text-xl font-light tracking-wider mb-2 transition-colors" :class="task.status === 'completed' ? 'text-white/30 line-through' : 'text-bone'">{{ task.title }}</h3>
          <p v-if="task.dueDate" class="text-[10px] text-white/40 tracking-[0.2em] uppercase mb-4">
            TGT: {{ new Date(task.dueDate).toLocaleDateString() }}
          </p>
        </div>

        <div class="mt-8 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button @click="$emit('toggle-status', task)" class="text-[9px] uppercase tracking-[0.2em] border border-white/30 px-5 py-2.5 rounded-full hover:bg-gold hover:text-black hover:border-gold transition-colors">
            {{ task.status === 'pending' ? 'Complete' : 'Revert' }}
          </button>
          <button @click="$emit('delete-task', task._id)" class="text-[9px] uppercase tracking-[0.2em] border border-red-500/30 text-red-400 px-5 py-2.5 rounded-full hover:bg-red-500 hover:text-white transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>

    <div class="flex justify-center items-center gap-8 mt-16 pt-8 border-t border-white/10" v-if="pagination.pages > 1">
      <button :disabled="pagination.page === 1" @click="$emit('page-change', pagination.page - 1)" class="text-[10px] tracking-[0.2em] disabled:opacity-20 uppercase hover:text-gold transition-colors">Prev</button>
      <span class="text-[10px] tracking-[0.2em] text-white/40">PAGE {{ pagination.page }} OF {{ pagination.pages }}</span>
      <button :disabled="pagination.page === pagination.pages" @click="$emit('page-change', pagination.page + 1)" class="text-[10px] tracking-[0.2em] disabled:opacity-20 uppercase hover:text-gold transition-colors">Next</button>
    </div>

    <p v-if="tasks.length" ref="endMarker" class="text-center text-[10px] tracking-[0.4em] text-white/20 uppercase mt-16">
      — End of Directives —
    </p>

  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue';
import gsap from 'gsap';
import { useArrival } from '../composables/useScrollFlip';

const props = defineProps(['tasks', 'searchQuery', 'pagination']);
defineEmits(['update:search', 'toggle-status', 'delete-task', 'page-change']);

const wrap = ref(null);
const endMarker = ref(null);

const playReveal = () => {
  const fields = wrap.value.querySelectorAll('.field');
  gsap.fromTo(
    fields,
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: 'power3.out' }
  );
  if (endMarker.value) useArrival(endMarker.value, { y: 10 });
};

onMounted(async () => {
  await nextTick();
  playReveal();
});

// Re-play the stagger reveal whenever the task list changes (pagination, filters, search)
watch(() => props.tasks, async () => {
  await nextTick();
  playReveal();
});

// Subtle 3D tilt toward the cursor — signature Dogstudio-style tactility, kept restrained
const onCardMove = (e) => {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const px = (e.clientX - rect.left) / rect.width - 0.5;
  const py = (e.clientY - rect.top) / rect.height - 0.5;
  gsap.to(card, {
    rotateX: py * -6,
    rotateY: px * 6,
    y: -6,
    transformPerspective: 800,
    duration: 0.4,
    ease: 'power2.out',
  });
};

const onCardLeave = (e) => {
  gsap.to(e.currentTarget, { rotateX: 0, rotateY: 0, y: 0, duration: 0.6, ease: 'power3.out' });
};
</script>
