import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './views/HomeView.vue';
import DashboardView from './views/DashboardView.vue';

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/login', component: HomeView },
  {
    path: '/dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token');

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.path === '/login' && isAuthenticated) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;