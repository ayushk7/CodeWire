import { createRouter, createWebHistory } from "vue-router";
import DashboardView from "../views/DashboardView.vue";
import SupportView from "../views/SupportView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "dashboard",
      component: DashboardView,
    },
    {
      path: '/editor',
      name: 'editor',
      component: () => import('../views/EditorView.vue')
    },
    {
        path: "/support",
      name: "support",
      component: SupportView,
    },
  ],
});

export default router;
