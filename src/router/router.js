import { createRouter, createWebHistory } from 'vue-router';
import useAuthStore from '../store/auth';
import adminRouter from '../views/Admin/router';
import loginRouter from '../views/Login/router';
import userRoutes from '../views/User/router';
import videoRoutes from '../views/Video/router';
import { useSocketStore } from '../store/socket';

const routes = [
  ...adminRouter,
  ...loginRouter,
  ...userRoutes,
  ...videoRoutes,
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFound.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const socketStore = useSocketStore();
  if (!authStore.user && !authStore.isLoading) {
    await authStore.fetchCurrentUser();
  }

  if (authStore.user?.id && !socketStore.socket?.connected) {
    socketStore.connect();
  }

  if (to.meta?.auth) {
    if (!authStore.isLoggedIn) {
      return next({ name: 'login' });
    }

    if (to.meta.role) {
      if (authStore.user?.role === 'admin') {
        if (to.meta.role.includes('admin')) {
          return next();
        } else {
          return next({ name: 'admin' });
        }
      } else {
        if (to.meta.role.includes('user')) {
          return next();
        } else {
          return next({ name: 'user' });
        }
      }
    }
  }

  return next();
});

export default router;
