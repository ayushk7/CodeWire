import { createRouter, createWebHistory } from "vue-router";
import DashboardView from "../views/DashboardView.vue";
import SupportView from "../views/SupportView.vue";
import DocumentationView from "../views/DocumentationView.vue";
import AddProjectView from "../views/AddProjectView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "dashboard",
      component: DashboardView,
    },
    {
      path: "/add-project",
      name: "add-project",
      component: AddProjectView,
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
