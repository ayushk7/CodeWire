import { createRouter, createWebHistory } from "vue-router";
import DashboardView from "../views/DashboardView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "dashboard",
      component: DashboardView,
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
<<<<<<< HEAD
      component: () => import('../views/AboutView.vue')
    } ,
    {
      path: '/editor',
      name: 'editor',
      component: () => import('../views/EditorView.vue')
    }
  ]
})
=======
      component: () => import("../views/AboutView.vue"),
    },
  ],
});
>>>>>>> e2e0626a9502b7358b5faba90bf22fe7ed0f3880

export default router;
