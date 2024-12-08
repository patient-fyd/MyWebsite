import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { authRoutes } from "./modules/auth";
import { postRoutes } from "./modules/posts";
import { studyRoutes } from "./modules/study";
import { readingNotesRoutes } from "./modules/readingNotes";
import { categoryRoutes } from "./modules/category";
import { RoutePath } from "./constants";
import { useUserStore } from "@/stores/userStore";

const routes: RouteRecordRaw[] = [
  {
    path: RoutePath.HOME,
    name: "Home",
    component: () => import("@/views/article/List.vue"),
    meta: {
      requiresAuth: false,
      title: '首页'
    }
  },
  ...authRoutes,
  ...postRoutes,
  ...studyRoutes,
  readingNotesRoutes,
  ...categoryRoutes,
  {
    path: RoutePath.SEARCH,
    name: "SearchResults",
    component: () => import("@/views/SearchResults.vue"),
    meta: {
      requiresAuth: false,
      title: '搜索结果'
    }
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/NotFound.vue"),
    meta: {
      requiresAuth: false,
      title: '404'
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, _from, next) => {
  const userStore = useUserStore()
  
  console.log('Route access:', {
    path: to.path,
    requiresAuth: to.meta.requiresAuth,
    isAuthenticated: userStore.isAuthenticated,
    isAdmin: userStore.isAdmin
  });

  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    next('/login')
    return
  }
  
  if (to.meta.requiresAdmin && !userStore.isAdmin) {
    next('/')
    return
  }
  
  next()
})

export default router;
