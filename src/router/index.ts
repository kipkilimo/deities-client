import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

import authRoutes from "./auth"; // Assuming auth.ts is in the same directory todoAppRoutes 
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/home",
  },
  ...authRoutes, 
  // Add any additional routes that are not part of auth or todoApp (optional)
];
// Create the router instance
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes, // Ensure routes is correctly provided here
});
router.beforeEach((to, from, next) => {
  const token = Cookies.get("authToken");

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      // @ts-ignore
      if (decodedToken.exp > currentTime) {
        // Token is valid, allow access
        next();
      } else {
        // Token is expired, redirect to login
        Cookies.remove("authToken");
        next({ name: "Login" });
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      Cookies.remove("authToken");
      next({ name: "Login" });
    }
  } else {
    if (to.name === "Login") {
      next(); // Allow access to the login page
    } else {
      next({ name: "Login" }); // Redirect to login if token is missing
    }
  }
});
export default router;
