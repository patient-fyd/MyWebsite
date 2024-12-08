import type { RouteRecordRaw } from "vue-router";
import { RoutePath } from "../constants";

export const categoryRoutes: RouteRecordRaw[] = [
  {
    path: RoutePath.CATEGORY.LIST,
    name: "CategoryList",
    component: () => import("@/views/CategoryPosts.vue"),
    props: true,
    meta: {
      requiresAuth: false,
      title: '分类文章'
    }
  }
]; 