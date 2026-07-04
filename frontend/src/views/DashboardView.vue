<template>
  <div class="flex w-full h-screen relative z-10">
    <Sidebar
      :currentUser="currentUser"
      :activeTab="activeTab"
      @update:activeTab="changeTab"
      @logout="handleLogout"
    />

    <div class="flex-1 flex flex-col relative bg-void border-l border-white/5 overflow-hidden">
      <!-- Live starfield w/ shooting stars — this was missing here before,
           which is why the logged-in background rendered as flat black.
           (Dashboard.vue had it; the router actually loads this file.) -->
      <StarfieldBackground />
      <div class="absolute inset-0 bg-gradient-to-br from-surface/70 to-void/90 pointer-events-none"></div>

      <div class="relative z-10 flex-1 flex flex-col overflow-hidden">
        <Header :title="headerTitle" @create-new="showTasks = false" />

        <div class="flex-1 overflow-y-auto p-6 md:p-12">
          <Transition name="slide-fade" mode="out-in">
            <TaskForm v-if="!showTasks" @submit="handleCreateTask" @cancel="showTasks = true" />
            <TaskList v-else :tasks="tasks" :searchQuery="searchQuery" :pagination="pagination" @update:search="updateSearch" @toggle-status="toggleTaskStatus" @delete-task="handleDeleteTask" @page-change="changePage" />
          </Transition>
        </div>
      </div>
    </div>

    <RocketLaunchOverlay ref="rocketOverlay" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

import Sidebar from '../components/Sidebar.vue';
import Header from '../components/Header.vue';
import TaskForm from '../components/TaskForm.vue';
import TaskList from '../components/TaskList.vue';
import StarfieldBackground from '../components/StarfieldBackground.vue';
import RocketLaunchOverlay from '../components/RocketLaunchOverlay.vue';

const router = useRouter();
const API_URL = 'http://localhost:5000/api';
const token = ref(localStorage.getItem('token') || '');
const currentUser = ref({ username: '', email: '' });

const rocketOverlay = ref(null);

// Data States
const activeTab = ref('all');
const showTasks = ref(true);
const searchQuery = ref('');
const currentPage = ref(1);
const tasks = ref([]);
const pagination = ref({ total: 0, page: 1, limit: 10, pages: 1 });

const headerTitle = computed(() => {
  if (!showTasks.value) return 'Initialize Directive';
  if (activeTab.value === 'pending') return 'Pending Sequences';
  if (activeTab.value === 'completed') return 'Completed Sequences';
  return 'All Directives';
});

onMounted(() => {
  const savedUser = localStorage.getItem('user');
  if (savedUser) currentUser.value = JSON.parse(savedUser);
  fetchTasks();
});

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/login');
};

const fetchTasks = async () => {
  try {
    const statusFilter = activeTab.value === 'all' ? '' : activeTab.value;
    const response = await axios.get(`${API_URL}/tasks`, {
      params: { page: currentPage.value, limit: 9, search: searchQuery.value, status: statusFilter },
      headers: { Authorization: `Bearer ${token.value}` }
    });
    tasks.value = response.data.tasks;
    pagination.value = response.data.pagination;
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) handleLogout();
  }
};

const changeTab = (tab) => { activeTab.value = tab; showTasks.value = true; currentPage.value = 1; fetchTasks(); };
const updateSearch = (query) => { searchQuery.value = query; currentPage.value = 1; fetchTasks(); };
const changePage = (page) => { currentPage.value = page; fetchTasks(); };

const handleCreateTask = async (taskData) => {
  try {
    await axios.post(`${API_URL}/tasks`, taskData, { headers: { Authorization: `Bearer ${token.value}` } });
    // Big full-screen rocket launch celebration on success, then swap back to the list.
    rocketOverlay.value?.launch();
    showTasks.value = true; currentPage.value = 1; fetchTasks();
  } catch (error) { alert("ERROR: " + (error.response?.data?.error || error.message)); }
};

const toggleTaskStatus = async (task) => {
  try {
    await axios.put(`${API_URL}/tasks/${task._id}`, { status: task.status === 'pending' ? 'completed' : 'pending' }, { headers: { Authorization: `Bearer ${token.value}` } });
    fetchTasks();
  } catch (error) { alert("Update Failed"); }
};

const handleDeleteTask = async (taskId) => {
  try {
    await axios.delete(`${API_URL}/tasks/${taskId}`, { headers: { Authorization: `Bearer ${token.value}` } });
    fetchTasks();
  } catch (error) { alert("Deletion Failed"); }
};
</script>

<style scoped>
.slide-fade-enter-active, .slide-fade-leave-active { transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-fade-enter-from { opacity: 0; transform: translateY(20px); }
.slide-fade-leave-to { opacity: 0; transform: translateY(-20px); }
</style>