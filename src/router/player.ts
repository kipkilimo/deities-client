import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

// Import DasboardLayout
import DasboardLayout from "@/layouts/DashboardLayout.vue";

const playerRoutes: RouteRecordRaw[] = [
  {
    path: "dashboard/player",
    component: DasboardLayout,
    children: [
      {
        path: "player", // Remove 'auth/' prefix
        name: "Player",
        component: () => import("../pages/dashboard/player/player.vue"),
      },
    ],
  },
];

export default playerRoutes;
