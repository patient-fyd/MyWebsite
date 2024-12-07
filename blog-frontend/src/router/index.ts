import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { authRoutes } from "./modules/auth";
import { postRoutes } from "./modules/posts";
import { studyRoutes } from "./modules/study";
import { readingNotesRoutes } from "./modules/readingNotes";
import { categoryRoutes } from "./modules/category";
import { RoutePath } from "./constants";

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

router.beforeEach((to, _from, next) => {
  document.title = `${to.meta.title} - 我的网站`;
  
  if (to.meta.requiresAuth) {
    // 检查登录状态的逻辑
  }
  next();
});

export default router;
