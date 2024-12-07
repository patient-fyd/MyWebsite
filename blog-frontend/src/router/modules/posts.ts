import type { RouteRecordRaw } from "vue-router";
import { RoutePath } from "../constants";

export const postRoutes: RouteRecordRaw[] = [
  {
    path: RoutePath.POSTS.DETAIL,
    name: "PostDetail",
    component: () => import("@/views/article/Detail.vue"),
    props: true,
    meta: {
      requiresAuth: false,
      title: '文章详情'
    }
  },
  {
    path: RoutePath.POSTS.EDIT,
    name: "EditArticle",
    component: () => import("@/views/article/Edit.vue"),
    props: true,
    meta: {
      requiresAuth: true,
      title: '编辑文章'
    }
  },
  {
    path: RoutePath.POSTS.CREATE,
    name: "CreateArticle",
    component: () => import("@/views/article/Create.vue"),
    meta: {
      requiresAuth: true,
      title: '创建文章'
    }
  }
]; 