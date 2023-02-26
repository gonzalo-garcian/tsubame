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
          path: "/about",
          name: "about",

          component: () => import("@/views/main/children/AboutView.vue"),
        },
      ],
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
    {
      path: "/dashboard",
      name: "dashboard",
      redirect: "/projects",
      component: () => import("@/views/dashboard/DashboardView.vue"),
      children: [
        {
          path: "/projects",
          name: "projects",

          component: () =>
            import("@/views/dashboard/children/ProjectsView.vue"),
        },
      ],
    },
  ],
});

export default router;
