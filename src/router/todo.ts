// todo.ts
import type { RouteRecordRaw } from 'vue-router';
import HomeLayout from '@/layouts/HomeLayout.vue';

const todoAppRoutes: RouteRecordRaw[] = [
  {
    path: '/todo-app',
    component: HomeLayout,
    children: [
      {
        path: 'todos',
        name: 'TodoApp', 
        component: () => import('@/pages/todo-app/todos.vue'),

      },
    ],
  },
];

export default todoAppRoutes;

