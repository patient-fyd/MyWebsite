import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { authRoutes } from "./modules/auth";
import { readingRoutes } from "./modules/reading";
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
  readingRoutes,
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

// 全局导航守卫
router.beforeEach((to, _from, next) => {
  // 设置页面标题
  document.title = `${to.meta.title} - 我的网站`;
  
  // 处理需要登录的页面
  if (to.meta.requiresAuth) {
    // 检查登录状态的逻辑
  }
  next();
});

export default router;
