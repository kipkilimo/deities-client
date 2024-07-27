import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

// Import AuthLayout
import AuthLayout from '@/layouts/AuthLayout.vue'; 

const authRoutes: RouteRecordRaw[] = [
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        path: 'login', // Remove 'auth/' prefix
        name: 'Login',
        component: () => import('@/pages/auth/login.vue'),
      },
      {
        path: 'register', // Remove 'auth/' prefix
        name: 'Register',
        component: () => import('@/pages/auth/register.vue'),
      },
    ],
  },
];

export default authRoutes;

