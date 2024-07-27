import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

import authRoutes from './auth'; // Assuming auth.ts is in the same directory todoAppRoutes
import todoAppRoutes from './todo';

const routes: RouteRecordRaw[] = [
  ...authRoutes,
  ...todoAppRoutes,
  // Add any additional routes that are not part of auth or todoApp (optional)
];
// Create the router instance
const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,  // Ensure routes is correctly provided here
  });
  
  export default router;

