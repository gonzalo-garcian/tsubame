import { createRouter, createWebHistory } from "vue-router";
import MainView from "@/views/main/MainView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "main",
      component: MainView,
      children: [
        {
          path: "",
          name: "home",

          component: () => import("@/views/main/children/HomeView.vue"),
        },
        {
          path: "/docs",
          name: "docs",

          component: () => import("@/views/main/children/DocsView.vue"),
        },
        {
          path: "/blog",
          name: "blog",

          component: () => import("@/views/main/children/BlogView.vue"),
        },
        {
          path: "/login",
          name: "login",

          component: () => import("@/views/LoginView.vue"),
        },
        {
          path: "/signup",
          name: "signup",

          component: () => import("@/views/SignupView.vue"),
        },
      ],
    },
    {
      path: "/dashboard",
      name: "dashboard",
      redirect: "/dashboard/projects",
      component: () => import("@/views/dashboard/DashboardView.vue"),
      children: [
        {
          path: "/dashboard/projects",
          name: "projects",

          component: () =>
            import("@/views/dashboard/children/ProjectsView.vue"),
        },
      ],
    },
    {
      path: "/sandbox",
      name: "sandbox",

      component: () => import("@/views/SandboxView.vue"),
    },
  ],
});

export default router;
