import type { RouteRecordRaw } from "vue-router";
import { RoutePath } from "../constants";

export const readingRoutes: RouteRecordRaw = {
  path: RoutePath.READING.ROOT,
  name: "ReadingNotes",
  component: () => import("@/views/ReadingNotes.vue"),
  meta: {
    requiresAuth: true,
    title: '读书笔记'
  },
  children: [
    {
      path: "",
      name: "ReadingNotesDefault",
      component: () => import("@/views/reading/Home.vue")
    },
    // ... 其他子路由
  ]
}; 