import { createRouter, createWebHistory } from "vue-router";
import DashboardView from "../views/DashboardView.vue";
import SupportView from "../views/SupportView.vue";
import DocumentationView from "../views/DocumentationView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "dashboard",
      component: DashboardView,
    },
    {
      path: "/documentation",
      name: "documentation",
      component: DocumentationView,
    },
    {
      path: "/support",
      name: "support",
      component: SupportView,
    },
  ],
});

export default router;
