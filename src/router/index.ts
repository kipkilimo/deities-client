import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import playerRoutes from "./player"; // Assuming player.ts is in the same directory
import authRoutes from "./auth"; // Assuming auth.ts is in the same directory
import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/welcome",
  },
  ...authRoutes,
  ...playerRoutes,
  // Add any additional routes that are not part of auth or todoApp (optional)
];

// Create the router instance
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes, // Ensure routes are correctly provided here
});

// Define the paths that don't require authentication
const publicPaths = ["/", "/auth", "/welcome"];

router.beforeEach((to, from, next) => {
  const token = Cookies.get("authToken");

  // Check if the route is public (doesn't require login)
  if (publicPaths.includes(to.path) || to.path.startsWith("/auth")) {
    return next(); // Allow access to public routes
  }

  // For all other routes, check if token is valid
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
    // Redirect to login if no valid token and trying to access protected routes
    next({ name: "Login" });
  }
});

export default router;
